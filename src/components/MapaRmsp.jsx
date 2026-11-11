import { useEffect, useRef } from 'react'

/** Postos / hemocentros da RMSP (coordenadas aproximadas) */
const LOCAIS = [
  {
    nome: 'Fundação Pró-Sangue — Posto Clínicas',
    endereco: 'Av. Dr. Enéas Carvalho de Aguiar, 155 — Cerqueira César, SP',
    lat: -23.5575,
    lng: -46.6689,
  },
  {
    nome: 'Fundação Pró-Sangue — Dante Pazzanese',
    endereco: 'Av. Dr. Dante Pazzanese, 500 — Ibirapuera, SP',
    lat: -23.5856,
    lng: -46.6503,
  },
  {
    nome: 'Hemocentro Regional de Osasco',
    endereco: 'Osasco — Região Oeste da RMSP',
    lat: -23.5325,
    lng: -46.7917,
  },
  {
    nome: 'Hemocentro do ABC',
    endereco: 'Santo André / região do ABC',
    lat: -23.6639,
    lng: -46.5383,
  },
  {
    nome: 'Hemocentro de Guarulhos',
    endereco: 'Guarulhos — Região Norte/Leste',
    lat: -23.4543,
    lng: -46.5337,
  },
  {
    nome: 'Hemocentro de São Bernardo',
    endereco: 'São Bernardo do Campo — ABC',
    lat: -23.6914,
    lng: -46.5646,
  },
  {
    nome: 'Banco de Sangue de Guarulhos',
    endereco: 'Guarulhos — coleta e hemocomponentes',
    lat: -23.4628,
    lng: -46.5245,
  },
  {
    nome: 'Hospital São Paulo (UNIFESP)',
    endereco: 'Rua Napoleão de Barros — Vila Clementino, SP',
    lat: -23.5986,
    lng: -46.6436,
  },
]

function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L)
      return
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const existing = document.getElementById('leaflet-js')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.L))
      existing.addEventListener('error', reject)
      return
    }

    const script = document.createElement('script')
    script.id = 'leaflet-js'
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.async = true
    script.onload = () => resolve(window.L)
    script.onerror = reject
    document.body.appendChild(script)
  })
}

export default function MapaRmsp() {
  const mapRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) return

        if (mapRef.current) {
          mapRef.current.remove()
          mapRef.current = null
        }

        const map = L.map(containerRef.current, {
          center: [-23.55, -46.63],
          zoom: 10,
          scrollWheelZoom: false,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 18,
        }).addTo(map)

        const icon = L.divIcon({
          className: 'hb-map-pin',
          html: '<span class="hb-map-pin-dot"></span>',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        })

        LOCAIS.forEach((local) => {
          const marker = L.marker([local.lat, local.lng], { icon }).addTo(map)
          marker.bindTooltip(
            `<strong>${local.nome}</strong><br/><span style="opacity:.85">${local.endereco}</span>`,
            {
              direction: 'top',
              offset: [0, -8],
              opacity: 1,
              className: 'hb-map-tooltip',
            }
          )
        })

        const bounds = L.latLngBounds(LOCAIS.map((l) => [l.lat, l.lng]))
        map.fitBounds(bounds.pad(0.18))
        mapRef.current = map
      })
      .catch(() => {
        /* CDN bloqueado / sem internet */
      })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div className="mapa-rmsp-wrap">
      <div className="mapa-rmsp-header">
        <h3>
          <span className="i i-pin" /> Mapa da RMSP — locais de coleta
        </h3>
        <p>Passe o mouse sobre os pinos para ver o nome do hospital / hemocentro.</p>
      </div>
      <div
        ref={containerRef}
        className="mapa-rmsp"
        role="img"
        aria-label="Mapa da Região Metropolitana de São Paulo"
      >
        <div className="mapa-rmsp-fallback">Carregando mapa…</div>
      </div>
      <ul className="mapa-rmsp-legend">
        {LOCAIS.map((l) => (
          <li key={l.nome}>
            <span className="legend-dot" />
            {l.nome}
          </li>
        ))}
      </ul>
    </div>
  )
}
