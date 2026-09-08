// Cesium bootstrap — must be imported before any Resium/Cesium component.
import { Ion } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

// Static assets (Workers/Assets/Widgets/ThirdParty) are copied to /public/cesium
// by scripts/copy-cesium.mjs and served from the site root.
window.CESIUM_BASE_URL = '/cesium/'

// This prototype runs token-free: OpenStreetMap raster imagery + the WGS84
// ellipsoid for terrain. No Cesium Ion account or access token is required.
Ion.defaultAccessToken = ''
