/**
 * Calculate distance between two geographic coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get comprehensive fallback police stations across all of India
 * @returns {Array} Array of police station objects with lat/lon
 */
function getFallbackStations() {
  return [
    // ─── Delhi NCR & Capital Region ───────────────────────────
    { osm_id: 1, name: 'New Delhi Police Station', address: 'Connaught Place, New Delhi', phone: '+91 11 2345 6789', lat: 28.6139, lon: 77.2090 },
    { osm_id: 11, name: 'Karol Bagh Police Station', address: 'Karol Bagh, New Delhi', phone: '+91 11 2345 6790', lat: 28.6515, lon: 77.1887 },
    { osm_id: 12, name: 'Rajender Nagar Police Station', address: 'Rajender Nagar, New Delhi', phone: '+91 11 2345 6791', lat: 28.6444, lon: 77.1627 },
    { osm_id: 1001, name: 'Tughlak Road Police Station', address: 'Tughlak Road, New Delhi', phone: '+91 11 2301 2345', lat: 28.6075, lon: 77.2300 },
    { osm_id: 1002, name: 'Lodhi Colony Police Station', address: 'Lodhi Road, New Delhi', phone: '+91 11 2436 7890', lat: 28.5860, lon: 77.2220 },
    { osm_id: 1003, name: 'Saket Police Station', address: 'Saket, New Delhi', phone: '+91 11 2651 2345', lat: 28.5140, lon: 77.2050 },
    { osm_id: 1026, name: 'Hauz Khas Police Station', address: 'Hauz Khas, New Delhi', phone: '+91 11 2656 7890', lat: 28.5494, lon: 77.2001 },
    { osm_id: 1027, name: 'Vasant Kunj Police Station', address: 'Sector D, Vasant Kunj, New Delhi', phone: '+91 11 2689 1234', lat: 28.5200, lon: 77.1500 },
    { osm_id: 1028, name: 'Rohini Police Station', address: 'Sector 3, Rohini, Delhi', phone: '+91 11 2751 2345', lat: 28.7041, lon: 77.1025 },
    { osm_id: 1029, name: 'Dwarka Sector 23 Police Station', address: 'Dwarka, New Delhi', phone: '+91 11 2805 1234', lat: 28.5580, lon: 77.0500 },
    { osm_id: 1030, name: 'Lajpat Nagar Police Station', address: 'Lajpat Nagar, New Delhi', phone: '+91 11 2981 2345', lat: 28.5700, lon: 77.2400 },
    { osm_id: 1031, name: 'Chandni Chowk Police Station', address: 'Kotwali, Chandni Chowk, Delhi', phone: '+91 11 2327 1234', lat: 28.6560, lon: 77.2300 },

    // ─── Haryana & NCR Hubs (Neemrana, Rewari, Gurugram, Faridabad) ───────────
    { osm_id: 13, name: 'Gurugram Central Police Station', address: 'Sector 14, Gurugram', phone: '+91 124 2345 6792', lat: 28.4595, lon: 77.0266 },
    { osm_id: 18, name: 'Sohna Road Police Station', address: 'Sohna Road, Gurugram', phone: '+91 124 2345 6797', lat: 28.4530, lon: 77.0567 },
    { osm_id: 1032, name: 'Cyber Crime Police Station Gurugram', address: 'DLF Phase 4, Gurugram', phone: '+91 124 222 1234', lat: 28.4720, lon: 77.0850 },
    { osm_id: 1033, name: 'Manesar Police Station', address: 'IMT Manesar, Gurugram', phone: '+91 124 229 0100', lat: 28.3580, lon: 76.9380 },
    { osm_id: 1034, name: 'Rewari City Police Station', address: 'Model Town, Rewari, Haryana', phone: '+91 1274 225 100', lat: 28.1920, lon: 76.6180 },
    { osm_id: 1035, name: 'Dharuhera Police Station', address: 'NH-48, Dharuhera, Haryana', phone: '+91 1274 242 100', lat: 28.2050, lon: 76.7850 },
    { osm_id: 1036, name: 'Bawal Police Station', address: 'Bawal Industrial Area, Rewari', phone: '+91 1274 260 100', lat: 28.0830, lon: 76.5830 },
    { osm_id: 1037, name: 'Neemrana Police Station', address: 'RIICO Industrial Area, Neemrana, Rajasthan', phone: '+91 1494 246 100', lat: 27.9890, lon: 76.3860 },
    { osm_id: 1038, name: 'Behror Police Station', address: 'Main Market, Behror, Rajasthan', phone: '+91 1494 220 100', lat: 27.8890, lon: 76.2820 },
    { osm_id: 1039, name: 'Shahjahanpur Police Station', address: 'Border Post, Shahjahanpur, Rajasthan', phone: '+91 1494 235 100', lat: 28.0120, lon: 76.4350 },
    { osm_id: 16, name: 'Faridabad Central Police Station', address: 'Sector 15, Faridabad', phone: '+91 129 2345 6795', lat: 28.4111, lon: 77.3178 },
    { osm_id: 19, name: 'Old Faridabad Police Station', address: 'Old Faridabad', phone: '+91 129 2345 6798', lat: 28.4078, lon: 77.3090 },
    { osm_id: 1040, name: 'Ballabgarh Police Station', address: 'Ballabgarh, Faridabad', phone: '+91 129 224 1000', lat: 28.3400, lon: 77.3250 },
    { osm_id: 1041, name: 'Karnal Police Station', address: 'Sector 12, Karnal, Haryana', phone: '+91 184 225 1234', lat: 29.6857, lon: 76.9905 },
    { osm_id: 1042, name: 'Panipat City Police Station', address: 'GT Road, Panipat, Haryana', phone: '+91 180 264 1234', lat: 29.3909, lon: 76.9635 },
    { osm_id: 1043, name: 'Ambala Cantt Police Station', address: 'Ambala Cantt, Haryana', phone: '+91 171 264 1234', lat: 30.3400, lon: 76.8400 },

    // ─── Uttar Pradesh (Noida, Ghaziabad, Lucknow, Kanpur, Agra, Varanasi) ────
    { osm_id: 14, name: 'Noida Sector 20 Police Station', address: 'Sector 20, Noida', phone: '+91 120 2345 6793', lat: 28.5850, lon: 77.3300 },
    { osm_id: 17, name: 'Greater Noida Police Station', address: 'Alpha 2, Greater Noida', phone: '+91 120 2345 6796', lat: 28.4744, lon: 77.5033 },
    { osm_id: 15, name: 'Ghaziabad Police Station', address: 'Raj Nagar, Ghaziabad', phone: '+91 120 2345 6794', lat: 28.6692, lon: 77.4538 },
    { osm_id: 1044, name: 'Indirapuram Police Station', address: 'Indirapuram, Ghaziabad', phone: '+91 120 260 1234', lat: 28.6400, lon: 77.3700 },
    { osm_id: 10, name: 'Lucknow Central Police Station', address: 'Hazratganj, Lucknow', phone: '+91 52 2345 6789', lat: 26.8467, lon: 80.9462 },
    { osm_id: 1020, name: 'Hazratganj Police Station', address: 'Hazratganj, Lucknow', phone: '+91 522 223 4567', lat: 26.8490, lon: 80.9430 },
    { osm_id: 1021, name: 'Gomti Nagar Police Station', address: 'Gomti Nagar, Lucknow', phone: '+91 522 272 3456', lat: 26.8760, lon: 81.0230 },
    { osm_id: 1022, name: 'Indira Nagar Police Station', address: 'Indira Nagar, Lucknow', phone: '+91 522 232 5678', lat: 26.8700, lon: 80.9830 },
    { osm_id: 1023, name: 'Kanpur Cantt Police Station', address: 'Kanpur Cantt, Kanpur', phone: '+91 512 263 7890', lat: 26.4490, lon: 80.3340 },
    { osm_id: 1024, name: 'Govind Nagar Police Station', address: 'Govind Nagar, Kanpur', phone: '+91 512 262 9012', lat: 26.4230, lon: 80.3230 },
    { osm_id: 1045, name: 'Agra Fort Police Station', address: 'Rakabganj, Agra', phone: '+91 562 246 1234', lat: 27.1750, lon: 78.0150 },
    { osm_id: 1046, name: 'Tajganj Police Station', address: 'Tajganj, Agra', phone: '+91 562 233 1234', lat: 27.1650, lon: 78.0450 },
    { osm_id: 1047, name: 'Varanasi Cantt Police Station', address: 'Varanasi Cantt, Varanasi', phone: '+91 542 250 1234', lat: 25.3350, lon: 82.9850 },
    { osm_id: 1048, name: 'Dashashwamedh Police Station', address: 'Ghat Road, Varanasi', phone: '+91 542 245 1234', lat: 25.3080, lon: 83.0090 },
    { osm_id: 1049, name: 'Prayagraj Civil Lines Police Station', address: 'Civil Lines, Prayagraj', phone: '+91 532 240 1234', lat: 25.4520, lon: 81.8350 },
    { osm_id: 1050, name: 'Meerut Cantt Police Station', address: 'Cantt, Meerut', phone: '+91 121 264 1234', lat: 28.9845, lon: 77.7064 },
    { osm_id: 1051, name: 'Mathura Kotwali Police Station', address: 'City Centre, Mathura', phone: '+91 565 240 1234', lat: 27.4924, lon: 77.6737 },

    // ─── Rajasthan (Jaipur, Alwar, Jodhpur, Udaipur, Kota) ────────────────────
    { osm_id: 9, name: 'Jaipur Police Headquarters', address: 'Bapu Bazaar, Jaipur', phone: '+91 141 2345 6789', lat: 26.9124, lon: 75.7873 },
    { osm_id: 1018, name: 'Wall City Police Station', address: 'Pink City, Jaipur', phone: '+91 141 261 2345', lat: 26.9190, lon: 75.8270 },
    { osm_id: 1019, name: 'Vaishali Nagar Police Station', address: 'Vaishali Nagar, Jaipur', phone: '+91 141 235 6789', lat: 26.9670, lon: 75.7970 },
    { osm_id: 1052, name: 'Malviya Nagar Police Station', address: 'Malviya Nagar, Jaipur', phone: '+91 141 252 1234', lat: 26.8550, lon: 75.8150 },
    { osm_id: 1053, name: 'Alwar City Kotwali Police Station', address: 'Hope Circus, Alwar', phone: '+91 144 233 1234', lat: 27.5530, lon: 76.6080 },
    { osm_id: 1054, name: 'Bhiwadi Police Station', address: 'Bhiwadi Industrial Area, Rajasthan', phone: '+91 1493 220 123', lat: 28.2100, lon: 76.8500 },
    { osm_id: 1055, name: 'Jodhpur Sadar Police Station', address: 'Sadar Bazaar, Jodhpur', phone: '+91 291 254 1234', lat: 26.2918, lon: 73.0169 },
    { osm_id: 1056, name: 'Udaipur City Police Station', address: 'Surajpole, Udaipur', phone: '+91 294 241 1234', lat: 24.5854, lon: 73.7125 },
    { osm_id: 1057, name: 'Kota Gumanpura Police Station', address: 'Gumanpura, Kota', phone: '+91 744 239 1234', lat: 25.1760, lon: 75.8450 },
    { osm_id: 1058, name: 'Ajmer Clock Tower Police Station', address: 'Dargah Road, Ajmer', phone: '+91 145 242 1234', lat: 26.4499, lon: 74.6399 },

    // ─── Maharashtra (Mumbai, Pune, Nagpur, Nashik, Thane) ────────────────────
    { osm_id: 2, name: 'Mumbai Police HQ', address: 'Fort, Mumbai', phone: '+91 22 2345 6789', lat: 18.9388, lon: 72.8355 },
    { osm_id: 1004, name: 'Dadar Police Station', address: 'Dadar West, Mumbai', phone: '+91 22 2430 1234', lat: 19.0194, lon: 72.8406 },
    { osm_id: 1005, name: 'Bandra Police Station', address: 'Bandra West, Mumbai', phone: '+91 22 2650 5678', lat: 19.0660, lon: 72.8280 },
    { osm_id: 1059, name: 'Andheri Police Station', address: 'Andheri East, Mumbai', phone: '+91 22 2832 1234', lat: 19.1197, lon: 72.8464 },
    { osm_id: 1060, name: 'Colaba Police Station', address: 'Colaba Causeway, Mumbai', phone: '+91 22 2285 1234', lat: 18.9150, lon: 72.8250 },
    { osm_id: 1061, name: 'Thane Central Police Station', address: 'Station Road, Thane', phone: '+91 22 2534 1234', lat: 19.1970, lon: 72.9780 },
    { osm_id: 1062, name: 'Navi Mumbai Vashi Police Station', address: 'Sector 17, Vashi', phone: '+91 22 2789 1234', lat: 19.0770, lon: 72.9980 },
    { osm_id: 8, name: 'Pune Police Commissionerate', address: 'Shivaji Nagar, Pune', phone: '+91 20 2345 6789', lat: 18.5204, lon: 73.8567 },
    { osm_id: 1016, name: 'Shivajinagar Police Station', address: 'Shivajinagar, Pune', phone: '+91 20 2553 4567', lat: 18.5390, lon: 73.8450 },
    { osm_id: 1017, name: 'Kothrud Police Station', address: 'Kothrud, Pune', phone: '+91 20 2538 9012', lat: 18.5050, lon: 73.8060 },
    { osm_id: 1063, name: 'Hinjawadi Police Station', address: 'IT Park Phase 1, Hinjawadi, Pune', phone: '+91 20 2293 1234', lat: 18.5910, lon: 73.7380 },
    { osm_id: 1064, name: 'Nagpur Sitabuldi Police Station', address: 'Sitabuldi, Nagpur', phone: '+91 712 256 1234', lat: 21.1458, lon: 79.0882 },
    { osm_id: 1065, name: 'Nashik Panchavati Police Station', address: 'Panchavati, Nashik', phone: '+91 253 251 1234', lat: 19.9975, lon: 73.7898 },
    { osm_id: 1066, name: 'Aurangabad City Police Station', address: 'Kranti Chowk, Aurangabad', phone: '+91 240 233 1234', lat: 19.8762, lon: 75.3433 },

    // ─── Karnataka (Bengaluru, Mysuru, Mangaluru, Hubballi) ───────────────────
    { osm_id: 3, name: 'Bengaluru Police Commissionerate', address: 'Infantry Road, Bengaluru', phone: '+91 80 2345 6789', lat: 12.9716, lon: 77.5946 },
    { osm_id: 1006, name: 'MG Road Police Station', address: 'MG Road, Bengaluru', phone: '+91 80 2554 3210', lat: 12.9750, lon: 77.6040 },
    { osm_id: 1007, name: 'Jayanagar Police Station', address: 'Jayanagar 4th Block, Bengaluru', phone: '+91 80 2654 5678', lat: 12.9240, lon: 77.5840 },
    { osm_id: 1067, name: 'Koramangala Police Station', address: 'Koramangala 6th Block, Bengaluru', phone: '+91 80 2553 1234', lat: 12.9350, lon: 77.6240 },
    { osm_id: 1068, name: 'Indiranagar Police Station', address: '100ft Road, Indiranagar, Bengaluru', phone: '+91 80 2528 1234', lat: 12.9780, lon: 77.6400 },
    { osm_id: 1069, name: 'Whitefield Police Station', address: 'ITPL Main Road, Whitefield, Bengaluru', phone: '+91 80 2845 1234', lat: 12.9698, lon: 77.7500 },
    { osm_id: 1070, name: 'Electronic City Police Station', address: 'Phase 1, Electronic City, Bengaluru', phone: '+91 80 2852 1234', lat: 12.8450, lon: 77.6600 },
    { osm_id: 1071, name: 'Mysuru Devaraja Police Station', address: 'Sayyaji Rao Road, Mysuru', phone: '+91 821 242 1234', lat: 12.3051, lon: 76.6553 },
    { osm_id: 1072, name: 'Mangaluru Bunder Police Station', address: 'Bunder, Mangaluru', phone: '+91 824 242 1234', lat: 12.8698, lon: 74.8430 },
    { osm_id: 1073, name: 'Hubballi Suburban Police Station', address: 'Station Road, Hubballi', phone: '+91 836 225 1234', lat: 15.3647, lon: 75.1240 },

    // ─── Tamil Nadu (Chennai, Coimbatore, Madurai, Trichy, Salem) ─────────────
    { osm_id: 5, name: 'Chennai Police Headquarters', address: 'Vepery, Chennai', phone: '+91 44 2345 6789', lat: 13.0827, lon: 80.2707 },
    { osm_id: 1010, name: 'Egmore Police Station', address: 'Egmore High Road, Chennai', phone: '+91 44 2819 1234', lat: 13.0790, lon: 80.2590 },
    { osm_id: 1011, name: 'Triplicane Police Station', address: 'Triplicane High Road, Chennai', phone: '+91 44 2854 5678', lat: 13.0620, lon: 80.2750 },
    { osm_id: 1074, name: 'Mylapore Police Station', address: 'Kutchery Road, Mylapore, Chennai', phone: '+91 44 2498 1234', lat: 13.0360, lon: 80.2670 },
    { osm_id: 1075, name: 'T Nagar Police Station', address: 'Usman Road, T Nagar, Chennai', phone: '+91 44 2434 1234', lat: 13.0418, lon: 80.2341 },
    { osm_id: 1076, name: 'Adyar Police Station', address: 'Lattice Bridge Road, Adyar, Chennai', phone: '+91 44 2491 1234', lat: 13.0060, lon: 80.2570 },
    { osm_id: 1077, name: 'Coimbatore RS Puram Police Station', address: 'RS Puram, Coimbatore', phone: '+91 422 254 1234', lat: 11.0080, lon: 76.9530 },
    { osm_id: 1078, name: 'Madurai Vilakkuthoon Police Station', address: 'South Masi Street, Madurai', phone: '+91 452 234 1234', lat: 9.9195, lon: 78.1194 },
    { osm_id: 1079, name: 'Tiruchirappalli Cantonment Police Station', address: 'Cantonment, Trichy', phone: '+91 431 241 1234', lat: 10.7905, lon: 78.7047 },
    { osm_id: 1080, name: 'Salem Town Police Station', address: 'Town Railway Station Road, Salem', phone: '+91 427 221 1234', lat: 11.6643, lon: 78.1460 },

    // ─── West Bengal (Kolkata, Howrah, Siliguri, Durgapur) ────────────────────
    { osm_id: 4, name: 'Kolkata Police Lalbazar HQ', address: 'Lalbazar, Kolkata', phone: '+91 33 2345 6789', lat: 22.5726, lon: 88.3639 },
    { osm_id: 1008, name: 'Esplanade Police Station', address: 'Esplanade, Kolkata', phone: '+91 33 2214 3210', lat: 22.5650, lon: 88.3520 },
    { osm_id: 1009, name: 'Park Street Police Station', address: 'Park Street, Kolkata', phone: '+91 33 2226 7890', lat: 22.5480, lon: 88.3520 },
    { osm_id: 1081, name: 'Alipore Police Station', address: 'Alipore Road, Kolkata', phone: '+91 33 2479 1234', lat: 22.5320, lon: 88.3290 },
    { osm_id: 1082, name: 'Salt Lake Sector 5 Police Station', address: 'Sector 5, Salt Lake, Kolkata', phone: '+91 33 2357 1234', lat: 22.5780, lon: 88.4350 },
    { osm_id: 1083, name: 'Howrah Golabari Police Station', address: 'GT Road, Howrah', phone: '+91 33 2666 1234', lat: 22.5958, lon: 88.3426 },
    { osm_id: 1084, name: 'Siliguri Town Police Station', address: 'Hill Cart Road, Siliguri', phone: '+91 353 252 1234', lat: 26.7271, lon: 88.4230 },
    { osm_id: 1085, name: 'Durgapur City Centre Police Station', address: 'City Centre, Durgapur', phone: '+91 343 254 1234', lat: 23.5204, lon: 87.3119 },

    // ─── Telangana & Andhra Pradesh (Hyderabad, Visakhapatnam, Vijayawada) ────
    { osm_id: 6, name: 'Hyderabad Police Commissionerate', address: 'Basheerbagh, Hyderabad', phone: '+91 40 2345 6789', lat: 17.3850, lon: 78.4867 },
    { osm_id: 1012, name: 'Abids Police Station', address: 'Abids, Hyderabad', phone: '+91 40 2323 4567', lat: 17.3850, lon: 78.4740 },
    { osm_id: 1013, name: 'Secunderabad Police Station', address: 'Secunderabad, Hyderabad', phone: '+91 40 2780 1234', lat: 17.4350, lon: 78.4940 },
    { osm_id: 1086, name: 'Cyberabad Gachibowli Police Station', address: 'Gachibowli, Hyderabad', phone: '+91 40 2300 1234', lat: 17.4401, lon: 78.3489 },
    { osm_id: 1087, name: 'Banjara Hills Police Station', address: 'Road No. 12, Banjara Hills, Hyderabad', phone: '+91 40 2339 1234', lat: 17.4150, lon: 78.4450 },
    { osm_id: 1088, name: 'Visakhapatnam Beach Road Police Station', address: 'Beach Road, Visakhapatnam', phone: '+91 891 256 1234', lat: 17.7120, lon: 83.3150 },
    { osm_id: 1089, name: 'Vijayawada Governorpet Police Station', address: 'Governorpet, Vijayawada', phone: '+91 866 257 1234', lat: 16.5062, lon: 80.6480 },
    { osm_id: 1090, name: 'Tirupati East Police Station', address: 'Bhavani Nagar, Tirupati', phone: '+91 877 222 1234', lat: 13.6288, lon: 79.4192 },

    // ─── Gujarat (Ahmedabad, Surat, Vadodara, Rajkot) ─────────────────────────
    { osm_id: 7, name: 'Ahmedabad Police Commissionerate', address: 'Shahibaug, Ahmedabad', phone: '+91 79 2345 6789', lat: 23.0225, lon: 72.5714 },
    { osm_id: 1014, name: 'Maninagar Police Station', address: 'Maninagar, Ahmedabad', phone: '+91 79 2532 3456', lat: 22.9990, lon: 72.6040 },
    { osm_id: 1015, name: 'Navrangpura Police Station', address: 'Navrangpura, Ahmedabad', phone: '+91 79 2640 7890', lat: 23.0400, lon: 72.5460 },
    { osm_id: 1091, name: 'Surat Athwalines Police Station', address: 'Athwalines, Surat', phone: '+91 261 247 1234', lat: 21.1702, lon: 72.8311 },
    { osm_id: 1092, name: 'Vadodara Sayajigunj Police Station', address: 'Sayajigunj, Vadodara', phone: '+91 265 236 1234', lat: 22.3072, lon: 73.1812 },
    { osm_id: 1093, name: 'Rajkot A-Division Police Station', address: 'Dharmendra Road, Rajkot', phone: '+91 281 222 1234', lat: 22.3039, lon: 70.8022 },
    { osm_id: 1094, name: 'Gandhinagar Sector 7 Police Station', address: 'Sector 7, Gandhinagar', phone: '+91 79 2322 1234', lat: 23.2156, lon: 72.6369 },

    // ─── Punjab & Chandigarh (Chandigarh, Amritsar, Ludhiana, Jalandhar) ──────
    { osm_id: 1095, name: 'Chandigarh Sector 17 Police Station', address: 'Sector 17, Chandigarh', phone: '+91 172 277 1234', lat: 30.7333, lon: 76.7794 },
    { osm_id: 1096, name: 'Amritsar Kotwali Police Station', address: 'Near Golden Temple, Amritsar', phone: '+91 183 255 1234', lat: 31.6340, lon: 74.8723 },
    { osm_id: 1097, name: 'Ludhiana Division 1 Police Station', address: 'Clock Tower, Ludhiana', phone: '+91 161 274 1234', lat: 30.9010, lon: 75.8573 },
    { osm_id: 1098, name: 'Jalandhar Cantt Police Station', address: 'Cantt, Jalandhar', phone: '+91 181 226 1234', lat: 31.3260, lon: 75.5762 },

    // ─── Madhya Pradesh & Chhattisgarh (Bhopal, Indore, Jabalpur, Gwalior, Raipur) 
    { osm_id: 1099, name: 'Bhopal MP Nagar Police Station', address: 'MP Nagar Zone 1, Bhopal', phone: '+91 755 255 1234', lat: 23.2330, lon: 77.4350 },
    { osm_id: 1100, name: 'Indore Vijay Nagar Police Station', address: 'Vijay Nagar, Indore', phone: '+91 731 254 1234', lat: 22.7533, lon: 75.8937 },
    { osm_id: 1101, name: 'Jabalpur Civil Lines Police Station', address: 'Civil Lines, Jabalpur', phone: '+91 761 262 1234', lat: 23.1815, lon: 79.9864 },
    { osm_id: 1102, name: 'Gwalior Padav Police Station', address: 'Padav, Gwalior', phone: '+91 751 242 1234', lat: 26.2183, lon: 78.1828 },
    { osm_id: 1103, name: 'Raipur Kotwali Police Station', address: 'Malviya Road, Raipur', phone: '+91 771 222 1234', lat: 21.2514, lon: 81.6296 },

    // ─── Bihar & Jharkhand (Patna, Gaya, Ranchi, Jamshedpur) ──────────────────
    { osm_id: 1025, name: 'Patna City Police Station', address: 'Patna City, Patna', phone: '+91 612 222 3456', lat: 25.6180, lon: 85.1350 },
    { osm_id: 1104, name: 'Patna Gandhi Maidan Police Station', address: 'Gandhi Maidan, Patna', phone: '+91 612 220 1234', lat: 25.6130, lon: 85.1450 },
    { osm_id: 1105, name: 'Gaya Kotwali Police Station', address: 'Tower Chowk, Gaya', phone: '+91 631 222 1234', lat: 24.7914, lon: 85.0002 },
    { osm_id: 1106, name: 'Ranchi Kotwali Police Station', address: 'Main Road, Ranchi', phone: '+91 651 220 1234', lat: 23.3441, lon: 85.3096 },
    { osm_id: 1107, name: 'Jamshedpur Bistupur Police Station', address: 'Bistupur, Jamshedpur', phone: '+91 657 242 1234', lat: 22.8046, lon: 86.1821 },

    // ─── Kerala (Thiruvananthapuram, Kochi, Kozhikode) ────────────────────────
    { osm_id: 1108, name: 'Trivandrum Cantonment Police Station', address: 'Palayam, Thiruvananthapuram', phone: '+91 471 233 1234', lat: 8.5044, lon: 76.9531 },
    { osm_id: 1109, name: 'Kochi Marine Drive Police Station', address: 'Marine Drive, Ernakulam, Kochi', phone: '+91 484 235 1234', lat: 9.9816, lon: 76.2764 },
    { osm_id: 1110, name: 'Kozhikode Town Police Station', address: 'Mananchira, Kozhikode', phone: '+91 495 272 1234', lat: 11.2588, lon: 75.7804 },

    // ─── Odisha, Assam, Northeast, Goa, J&K, Uttarakhand ──────────────────────
    { osm_id: 1111, name: 'Bhubaneswar Capital Police Station', address: 'Unit 2, Ashok Nagar, Bhubaneswar', phone: '+91 674 253 1234', lat: 20.2961, lon: 85.8245 },
    { osm_id: 1112, name: 'Guwahati Panbazar Police Station', address: 'Panbazar, Guwahati, Assam', phone: '+91 361 254 1234', lat: 26.1850, lon: 91.7470 },
    { osm_id: 1113, name: 'Panaji Police Station', address: 'Altinho, Panaji, Goa', phone: '+91 832 242 1234', lat: 15.4909, lon: 73.8278 },
    { osm_id: 1114, name: 'Srinagar Kothi Bagh Police Station', address: 'Residency Road, Srinagar, J&K', phone: '+91 194 245 1234', lat: 34.0837, lon: 74.7973 },
    { osm_id: 1115, name: 'Jammu City Police Station', address: 'Old City, Jammu, J&K', phone: '+91 191 254 1234', lat: 32.7266, lon: 74.8570 },
    { osm_id: 1116, name: 'Dehradun Kotwali Police Station', address: 'Paltan Bazaar, Dehradun', phone: '+91 135 265 1234', lat: 30.3165, lon: 78.0322 },
    { osm_id: 1117, name: 'Shimla Sadar Police Station', address: 'The Mall, Shimla, Himachal', phone: '+91 177 265 1234', lat: 31.1048, lon: 77.1734 }
  ];
}

/**
 * Find the nearest police station to the given coordinates
 * @param {number} sosLat - SOS latitude
 * @param {number} sosLng - SOS longitude
 * @param {Array} stations - Array of police station objects (optional, uses fallback if not provided)
 * @returns {Object} Nearest station with distance, or null if no stations available
 */
function findNearestPoliceStation(sosLat, sosLng, stations = null) {
  if (sosLat == null || sosLng == null) {
    return null;
  }

  const stationsToUse = stations || getFallbackStations();
  
  if (!Array.isArray(stationsToUse) || stationsToUse.length === 0) {
    return null;
  }

  let nearestStation = null;
  let minDistance = Infinity;

  stationsToUse.forEach(station => {
    if (station.lat == null || station.lon == null) {
      return;
    }

    const distance = haversineDistance(sosLat, sosLng, station.lat, station.lon);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = {
        stationId: station.osm_id ? station.osm_id.toString() : station.id?.toString(),
        name: station.name || 'Unknown Station',
        address: station.address || '',
        phone: station.phone || '',
        lat: station.lat,
        lon: station.lon,
        distance: parseFloat(distance.toFixed(2)) // Distance in km
      };
    }
  });

  return nearestStation;
}

module.exports = {
  haversineDistance,
  findNearestPoliceStation,
  getFallbackStations
};
