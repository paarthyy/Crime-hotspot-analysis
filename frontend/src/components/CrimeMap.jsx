import { useEffect, useRef, useCallback, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, CircleMarker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CITY_COORDINATES = {
  'delhi': [28.6139, 77.2090],
  'mumbai': [19.0760, 72.8777],
  'bangalore': [12.9716, 77.5946],
  'bengaluru': [12.9716, 77.5946],
  'hyderabad': [17.3850, 78.4867],
  'kolkata': [22.5726, 88.3639],
  'chennai': [13.0827, 80.2707],
  'pune': [18.5204, 73.8567],
  'ahmedabad': [23.0225, 72.5714],
  'jaipur': [26.9124, 75.7873],
  'lucknow': [26.8467, 80.9462],
  'kanpur': [26.4499, 80.3319],
  'surat': [21.1702, 72.8311],
  'nagpur': [21.1458, 79.0882],
  'patna': [25.6180, 85.1350],
  'bhopal': [23.2599, 77.4126],
  'indore': [22.7196, 75.8577],
  'visakhapatnam': [17.6868, 83.2185],
  'ghaziabad': [28.6692, 77.4538],
  'ludhiana': [30.9010, 75.8573],
  'agra': [27.1767, 78.0081],
  'thane': [19.2183, 72.9781],
  'meerut': [28.9845, 77.7064],
  'srinagar': [34.0837, 74.7973],
  'nashik': [19.9975, 73.7898],
  'faridabad': [28.4089, 77.3178],
  'rajkot': [22.3039, 70.8022],
  'varanasi': [25.3176, 82.9739],
  'kalyan': [19.2403, 73.1305],
  'vasai': [19.3919, 72.8397]
};

// ─── User Location Marker ──────────────────────────────────────────────────────
function UserLocationMarker({ position, onPositionChange }) {
  const map = useMap();

  useEffect(() => {
    if (position && map) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  if (!position) return null;

  const icon = L.divIcon({
    className: 'user-location-icon',
    html: `<div style="width:18px;height:18px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 16px rgba(59,130,246,0.8);animation:pulse 2s infinite;"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div style={{ fontWeight: 700, color: '#1e293b' }}>📍 Your Current Location</div>
        <div style={{ fontSize: '12px', marginTop: 4, color: '#64748b' }}>
          Latitude: {position[0].toFixed(5)}<br/>
          Longitude: {position[1].toFixed(5)}
        </div>
      </Popup>
    </Marker>
  );
}

// ─── SOS Markers ───────────────────────────────────────────────────────────────
function SosMarkers({ sosAlerts = [] }) {
  if (!sosAlerts || sosAlerts.length === 0) return null;

  return (
    <>
      {sosAlerts.map((alert) => {
        const id = alert._id || alert.id;
        if (!alert.latitude || !alert.longitude) return null;

        const statusColor = alert.status === 'pending' ? '#ef4444' :
                           alert.status === 'acknowledged' ? '#eab308' : '#10b981';

        return (
          <CircleMarker
            key={id}
            center={[alert.latitude, alert.longitude]}
            radius={12}
            pathOptions={{ color: statusColor, fillColor: statusColor, fillOpacity: 0.85, weight: 3 }}
          >
            <Popup>
              <div style={{ color: '#0f172a', minWidth: '200px' }}>
                <div style={{ fontWeight: 800, color: '#ef4444', marginBottom: 4 }}>🆘 EMERGENCY SOS</div>
                <div style={{ fontSize: '13px', marginBottom: 4 }}><b>Victim:</b> {alert.username}</div>
                <div style={{ fontSize: '13px', marginBottom: 4 }}><b>Message:</b> {alert.message}</div>
                {alert.assignedPoliceStationName && (
                  <div style={{ fontSize: '12px', color: '#0284c7', marginBottom: 4 }}>
                    <b>Assigned Unit:</b> {alert.assignedPoliceStationName}
                  </div>
                )}
                <div style={{ fontSize: '13px', borderTop: '1px solid #eee', paddingTop: 4, marginTop: 4 }}>
                  <b>Status:</b> <span style={{ color: statusColor, fontWeight: 700 }}>{alert.status?.toUpperCase()}</span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

// ─── Draggable Victim Marker (Admin Simulator) ───────────────────────────────────
function SimulatedSosMarker({ position, onMove }) {
  if (!position) return null;

  const icon = L.divIcon({
    className: 'victim-simulator-icon',
    html: `<div style="width:32px;height:32px;border-radius:50%;background:#fb923c;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;border:3px solid white;box-shadow:0 0 20px rgba(251,146,60,0.8);font-size:14px;">V</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  return (
    <Marker
      position={position}
      icon={icon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          onMove([latlng.lat, latlng.lng]);
        }
      }}
    >
      <Popup>
        <div style={{ fontWeight: 700, color: '#0f172a' }}>🛠️ Simulation Victim Unit</div>
        <div style={{ fontSize: '12px', marginTop: 4, color: '#64748b' }}>Drag me to set dynamic victim location</div>
      </Popup>
    </Marker>
  );
}

// ─── Police Stations Layer ──────────────────────────────────────────────────
function PoliceStationsLayer({ enabled, sosAlerts = [] }) {
  const map = useMap();
  const layerGroupRef = useRef(null);

  const assignedStationIds = sosAlerts
    .filter(alert => alert.type === 'sos' && alert.status !== 'resolved' && alert.assignedPoliceStationId)
    .map(alert => alert.assignedPoliceStationId?.toString());

  const getPoliceIcon = (stationId) => {
    const isAssigned = assignedStationIds.includes(stationId);
    const blinkClass = isAssigned ? 'blinking-police-pin' : '';

    return L.divIcon({
      className: `police-pin ${blinkClass}`,
      html: `
        <div style="
          width: 28px;
          height: 28px;
          background: ${isAssigned ? '#ef4444' : '#0284c7'};
          border: 2px solid #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          box-shadow: 0 0 12px ${isAssigned ? 'rgba(239,68,68,0.9)' : 'rgba(2,132,199,0.7)'};
          ${isAssigned ? 'animation: pulse 1s infinite;' : ''}
        ">
          👮
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  };

  useEffect(() => {
    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }
    return () => {
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
        map.removeLayer(layerGroupRef.current);
        layerGroupRef.current = null;
      }
    };
  }, [map]);

  const fetchStations = useCallback(async () => {
    if (!layerGroupRef.current) return;
    layerGroupRef.current.clearLayers();

    if (!enabled) {
      return;
    }

    const b = map.getBounds();
    try {
      const bboxParam = `${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()}`;
      const res = await fetch(`${API_URL}/api/stations?bbox=${bboxParam}&limit=200`);
      const data = await res.json();
      const stations = Array.isArray(data.stations) ? data.stations : [];
      
      stations.forEach(s => {
        const stationId = s.osm_id ? s.osm_id.toString() : s.id?.toString();
        const icon = getPoliceIcon(stationId);
        const m = L.marker([s.lat, s.lon], { icon }).bindPopup(`
          <div style="color: #0f172a; min-width: 180px;">
            <div style="font-weight: 700; color: #0284c7; font-size: 14px; margin-bottom: 4px;">👮 ${s.name || 'Police Station'}</div>
            ${s.address ? `<div style="font-size: 12px; color: #475569; margin-bottom: 4px;"><b>Address:</b> ${s.address}</div>` : ''}
            ${s.phone ? `<div style="font-size: 12px; color: #16a34a; margin-bottom: 4px;"><b>Helpline:</b> ${s.phone}</div>` : ''}
            <div style="font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 4px; margin-top: 4px;">
              Coordinates: ${s.lat.toFixed(4)}, ${s.lon.toFixed(4)}
            </div>
          </div>
        `);
        if (layerGroupRef.current) {
          m.addTo(layerGroupRef.current);
        }
      });
    } catch (err) {
      console.warn('Failed to load stations:', err);
    }
  }, [enabled, map, assignedStationIds]);

  useEffect(() => {
    if (!enabled) {
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
      }
      return;
    }
    fetchStations();
  }, [enabled, fetchStations]);

  useMapEvents({
    moveend: () => {
      if (enabled) {
        fetchStations();
      }
    }
  });

  return null;
}

// ─── Heatmap Layer ───────────────────────────────────────────────────────────
function HeatmapLayer({ enabled }) {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      return;
    }

    const fetchCrimeData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/crimes`);
        const data = await response.json();
        const crimes = data.crimes || [];

        // Scale point intensity and radius dynamically
        const points = crimes.map(c => [c.latitude, c.longitude, 0.6]);

        if (heatLayerRef.current) {
          map.removeLayer(heatLayerRef.current);
        }

        heatLayerRef.current = L.heatLayer(points, {
          radius: 28,
          blur: 18,
          maxZoom: 16,
          max: 0.8,
          gradient: {
            0.2: 'rgba(56, 189, 248, 0.5)', // Blue
            0.4: 'rgba(16, 185, 129, 0.7)', // Green
            0.6: 'rgba(234, 179, 8, 0.85)', // Yellow
            0.8: 'rgba(249, 115, 22, 0.95)', // Orange
            1.0: 'rgba(239, 68, 68, 1)'     // Red
          }
        }).addTo(map);
      } catch (error) {
        console.error('Failed to fetch crime data for heatmap:', error);
      }
    };

    fetchCrimeData();

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [enabled, map]);

  return null;
}

// ─── Map View Controller & Focus FlyTo ───────────────────────────────────────────
function MapController({ userPos, isAdminMode, victimPos, focusedArea }) {
  const map = useMap();
  const hasCenteredOnUser = useRef(false);

  useEffect(() => {
    if (focusedArea) {
      const cityKey = focusedArea.name?.toLowerCase().trim();
      const coords = CITY_COORDINATES[cityKey];
      if (coords) {
        map.flyTo(coords, 11, { duration: 1.5 });
      }
    }
  }, [focusedArea, map]);

  useEffect(() => {
    if (!focusedArea && userPos && !hasCenteredOnUser.current) {
      map.setView(userPos, 6);
      hasCenteredOnUser.current = true;
    }
  }, [userPos, focusedArea, map]);

  useEffect(() => {
    if (isAdminMode && victimPos) {
      map.setView(victimPos, 11);
    }
  }, [isAdminMode, victimPos, map]);

  return null;
}

// ─── Map Click Handler (Admin Only) ───────────────────────────────────────────
function MapClickHandler({ isAdminMode, onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      if (isAdminMode) {
        onLocationSelect([e.latlng.lat, e.latlng.lng]);
      }
    }
  });
  return null;
}

// ─── Main CrimeMap Component ──────────────────────────────────────────────────
export default function CrimeMap({
  sosAlerts = [],
  isAdminMode = false,
  onCursorLocationChange = null,
  showHeatmap = false,
  focusedArea = null,
  onClearFocus = null
}) {
  const INDIA_CENTER = [22.9074, 79.1469];

  const [showStations, setShowStations] = useState(true);
  const [internalShowHeatmap, setInternalShowHeatmap] = useState(showHeatmap);
  const [userPos, setUserPos] = useState(null);
  const [victimPos, setVictimPos] = useState(INDIA_CENTER);
  const [sosLoading, setSosLoading] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);

  useEffect(() => {
    setInternalShowHeatmap(showHeatmap);
  }, [showHeatmap]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos = [latitude, longitude];
          setUserPos(newPos);
          if (onCursorLocationChange) {
            onCursorLocationChange(newPos);
          }
        },
        (error) => {
          console.warn("Geolocation fallback to India Center:", error.message);
          if (!userPos) {
            setUserPos(INDIA_CENTER);
            if (onCursorLocationChange) onCursorLocationChange(INDIA_CENTER);
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      if (!userPos) {
        setUserPos(INDIA_CENTER);
        if (onCursorLocationChange) onCursorLocationChange(INDIA_CENTER);
      }
    }
  }, []);

  const triggerSimulatedSos = async () => {
    if (!victimPos || victimPos.length !== 2 || isNaN(victimPos[0]) || isNaN(victimPos[1])) {
      alert('Invalid victim position. Please set a valid location first.');
      return;
    }

    setSosLoading(true);
    setSosSuccess(false);

    try {
      const response = await fetch(`${API_URL}/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'SIM_UNIT_ADMIN',
          message: 'LIVE SIMULATION: Emergency SOS triggered from Admin Console.',
          latitude: victimPos[0],
          longitude: victimPos[1]
        })
      });

      if (response.ok) {
        setSosSuccess(true);
        setTimeout(() => setSosSuccess(false), 4000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to trigger simulation: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('SOS simulation error:', error);
      alert(`Network error: ${error.message || 'Unable to connect to server'}`);
    } finally {
      setSosLoading(false);
    }
  };

  return (
    <div className="crime-map-wrapper" style={{ position: 'relative', height: '100%', width: '100%', background: '#020617' }}>
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ"
          maxZoom={16}
        />

        <MapController userPos={userPos} isAdminMode={isAdminMode} victimPos={victimPos} focusedArea={focusedArea} />
        {userPos && <UserLocationMarker position={userPos} onPositionChange={setUserPos} />}
        <SosMarkers sosAlerts={sosAlerts} />
        <PoliceStationsLayer enabled={showStations} sosAlerts={sosAlerts} />
        <HeatmapLayer enabled={internalShowHeatmap} />
        <MapClickHandler isAdminMode={isAdminMode} onLocationSelect={setVictimPos} />

        {isAdminMode && (
          <SimulatedSosMarker position={victimPos} onMove={setVictimPos} />
        )}
      </MapContainer>

      {/* Floating Area Focus HUD Banner */}
      {focusedArea && (
        <div style={{
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.92)', border: '1px solid #38bdf8', padding: '10px 22px',
          borderRadius: '30px', color: 'white', display: 'flex', alignItems: 'center', gap: '15px',
          boxShadow: '0 10px 30px rgba(56, 189, 248, 0.3)', backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📍</span>
            <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '15px' }}>
              {focusedArea.name} Hotspot
            </span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              ({focusedArea.total.toLocaleString()} Incidents)
            </span>
            <span style={{
              fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '12px',
              background: focusedArea.threat === 'Critical' ? '#ef4444' : focusedArea.threat === 'High' ? '#f97316' : '#eab308',
              color: 'white'
            }}>
              {focusedArea.threat?.toUpperCase()} THREAT
            </span>
          </div>
          {onClearFocus && (
            <button
              onClick={onClearFocus}
              style={{
                background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#e2e8f0',
                padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              ✖ All India
            </button>
          )}
        </div>
      )}

      {/* Simulator Control Panel */}
      {isAdminMode && (
        <div style={{
          position: 'absolute', bottom: 30, left: 30, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.95)', padding: '20px', borderRadius: '16px',
          border: '1px solid rgba(251, 146, 60, 0.4)', color: 'white',
          width: '320px', backdropFilter: 'blur(10px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#fb923c', letterSpacing: '0.5px' }}>🚨 LIVE SIMULATOR</h4>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', opacity: 0.8, lineHeight: 1.5 }}>
            Click the map or drag the orange marker to set the simulation origin. Triggering an SOS will alert all active dispatch units.
          </p>

          <div style={{ fontSize: '12px', marginBottom: '15px', color: '#94a3b8', fontStyle: 'italic' }}>
            Origin: {victimPos?.[0].toFixed(5)}, {victimPos?.[1].toFixed(5)}
          </div>

          <button
            onClick={triggerSimulatedSos}
            disabled={sosLoading}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              background: sosSuccess ? '#10b981' : '#ef4444', color: 'white',
              fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s ease',
              boxShadow: sosSuccess ? '0 0 20px rgba(16,185,129,0.3)' : '0 10px 20px rgba(239,68,68,0.2)'
            }}
          >
            {sosLoading ? 'SYNCING...' : sosSuccess ? '✅ SOS BROADCASTED' : 'TRIGGER EMERGENCY SOS'}
          </button>
        </div>
      )}

      {/* Map Legend & Toggles */}
      <div style={{
        position: 'absolute', top: 20, left: 20, zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.85)', padding: '12px 18px', borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '13px',
        display: 'flex', flexDirection: 'column', gap: '8px', backdropFilter: 'blur(8px)'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
          <input type="checkbox" checked={showStations} onChange={e => setShowStations(e.target.checked)} />
          👮 Police Stations
        </label>
        {showHeatmap && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
            <input type="checkbox" checked={internalShowHeatmap} onChange={e => setInternalShowHeatmap(e.target.checked)} />
            🔥 Crime Heatmap
          </label>
        )}
      </div>
    </div>
  );
}
