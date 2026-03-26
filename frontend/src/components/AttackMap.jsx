import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet'

function FlyTo({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 5, { duration: 1.5 })
  }, [lat, lng, map])
  return null
}

const countryFlag = (code) => {
  if (!code || code.length !== 2) return '🌐'
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
}

export default function AttackMap({ geo, emailHops = [], history = [] }) {
  const hasMain = geo?.lat && geo?.lng
  const center = hasMain ? [geo.lat, geo.lng] : [20, 0]

  return (
    <div className="w-full h-full min-h-[300px] z-0 opacity-80 hover:opacity-100 transition-opacity custom-map-container bg-slate-950">
      <MapContainer center={center} zoom={2} style={{ height: '100%', width: '100%', minHeight: '300px' }}
        zoomControl={true} attributionControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

        {hasMain && <FlyTo lat={geo.lat} lng={geo.lng} />}

        {/* Main IP marker */}
        {hasMain && (
          <CircleMarker center={[geo.lat, geo.lng]} radius={12}
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.3, weight: 2 }}>
            <Popup className="cyber-popup">
              <div className="font-mono text-xs leading-relaxed text-slate-300 p-1">
                <strong className="text-primary tracking-widest uppercase">{countryFlag(geo.countryCode)} {geo.city}, {geo.country}</strong><br />
                <span className="text-slate-500">ASN:</span> {geo.asn}<br />
                <span className="text-slate-500">ORG:</span> {geo.org}
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* Email hop chain */}
        {emailHops.map((hop, i) => hop?.geo?.lat && hop?.geo?.lng && (
          <CircleMarker key={i} center={[hop.geo.lat, hop.geo.lng]} radius={8}
            pathOptions={{
              color: hop.abuseipdb?.abuseScore > 50 ? '#ef4444' : '#fbbf24',
              fillColor: hop.abuseipdb?.abuseScore > 50 ? '#ef4444' : '#fbbf24',
              fillOpacity: 0.4, weight: 2
            }}>
            <Popup className="cyber-popup">
              <div className="font-mono text-xs leading-relaxed text-slate-300 p-1">
                <strong className="text-[#fbbf24] tracking-widest uppercase">Hop #{hop.hopNumber}: {hop.ip}</strong><br />
                {hop.geo?.city}, {hop.geo?.country}<br />
                ABUSE SCORE: <span className={hop.abuseipdb?.abuseScore > 50 ? 'text-error font-bold' : 'text-primary'}>{hop.abuseipdb?.abuseScore ?? 'N/A'}</span>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Hop chain lines */}
        {emailHops.length > 1 && (
          <Polyline
            positions={emailHops.filter(h => h?.geo?.lat).map(h => [h.geo.lat, h.geo.lng])}
            pathOptions={{ color: '#fbbf24', weight: 1.5, opacity: 0.5, dashArray: '6,4' }}
          />
        )}

        {/* History dots */}
        {history.filter(h => h.geo?.lat).map((h, i) => (
          <CircleMarker key={`hist-${i}`} center={[h.geo.lat, h.geo.lng]} radius={4}
            pathOptions={{ color: '#475569', fillColor: '#475569', fillOpacity: 0.4, weight: 1 }} />
        ))}
      </MapContainer>
    </div>
  )
}
