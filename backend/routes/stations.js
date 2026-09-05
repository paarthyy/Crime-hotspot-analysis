const express = require('express');
const { getPool, initStationsSchema } = require('../db/postgres');
const { getFallbackStations } = require('../utils/distanceCalculator');

const router = express.Router();

function parseNumber(value) {
  if (value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const allFallbackStations = getFallbackStations();

function filterByBBox(stations, south, west, north, east) {
  return stations.filter(s => s.lat >= south && s.lat <= north && s.lon >= west && s.lon <= east);
}

function filterByRadius(stations, lat, lon, radius) {
  const R = 6371000;
  return stations
    .map(s => {
      const dLat = (s.lat - lat) * Math.PI / 180;
      const dLon = (s.lon - lon) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * Math.PI / 180) * Math.cos(s.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
      const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return { ...s, distance_m: dist };
    })
    .filter(s => s.distance_m <= radius)
    .sort((a, b) => a.distance_m - b.distance_m);
}

router.get('/stations', async (req, res) => {
  try {
    const pool = getPool();
    const dbConfigured = !!pool;

    if (dbConfigured) {
      try {
        await initStationsSchema();
      } catch (err) {
        console.warn('Stations DB init warning:', err.message);
      }
    }

    const lat = parseNumber(req.query.lat);
    const lng = parseNumber(req.query.lng);
    const radius = parseNumber(req.query.radius) ?? 50000; // meters

    const bbox = typeof req.query.bbox === 'string' ? req.query.bbox : null; // south,west,north,east
    const limitRaw = parseNumber(req.query.limit);
    const limit = Math.max(1, Math.min(limitRaw ?? 1000, 1000));

    if (!dbConfigured) {
      let filtered = [];
      if (bbox) {
        const parts = bbox.split(',').map(s => parseNumber(s.trim()));
        if (parts.length === 4 && parts.every(v => v != null)) {
          const [south, west, north, east] = parts;
          filtered = filterByBBox(allFallbackStations, south, west, north, east);
          // If bbox is too small and has 0 stations, return nearest stations to bbox center
          if (filtered.length === 0) {
            const centerLat = (south + north) / 2;
            const centerLon = (west + east) / 2;
            filtered = filterByRadius(allFallbackStations, centerLat, centerLon, 150000);
          }
        } else {
          filtered = allFallbackStations;
        }
      } else if (lat != null && lng != null) {
        filtered = filterByRadius(allFallbackStations, lat, lng, radius);
      } else {
        filtered = allFallbackStations;
      }

      const result = filtered.slice(0, limit);
      return res.json({ count: result.length, total: allFallbackStations.length, stations: result });
    }

    if (bbox) {
      const parts = bbox.split(',').map(s => parseNumber(s.trim()));
      if (parts.length !== 4 || parts.some(v => v == null)) {
        return res.status(400).json({ message: 'Invalid bbox. Use bbox=south,west,north,east' });
      }
      const [south, west, north, east] = parts;

      const { rows } = await pool.query(
        `
          SELECT
            osm_id,
            name,
            address,
            phone,
            tags,
            ST_Y(geom::geometry) AS lat,
            ST_X(geom::geometry) AS lon
          FROM police_stations
          WHERE ST_Intersects(
            geom::geometry,
            ST_MakeEnvelope($1, $2, $3, $4, 4326)
          )
          LIMIT $5;
        `,
        [west, south, east, north, limit]
      );

      return res.json({ count: rows.length, stations: rows });
    }

    if (lat != null && lng != null) {
      const { rows } = await pool.query(
        `
          SELECT
            osm_id,
            name,
            address,
            phone,
            tags,
            ST_Y(geom::geometry) AS lat,
            ST_X(geom::geometry) AS lon,
            ST_Distance(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) AS distance_m
          FROM police_stations
          WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
          ORDER BY distance_m ASC
          LIMIT $4;
        `,
        [lng, lat, radius, limit]
      );

      return res.json({ count: rows.length, stations: rows });
    }

    const { rows } = await pool.query(
      `
        SELECT
          osm_id,
          name,
          address,
          phone,
          tags,
          ST_Y(geom::geometry) AS lat,
          ST_X(geom::geometry) AS lon
        FROM police_stations
        LIMIT $1;
      `,
      [limit]
    );

    return res.json({ count: rows.length, stations: rows });
  } catch (error) {
    console.error('Stations API error:', error);
    // Graceful fallback if database errors
    return res.json({ count: allFallbackStations.length, stations: allFallbackStations.slice(0, 500) });
  }
});

module.exports = router;
