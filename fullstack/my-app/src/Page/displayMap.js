import { useMemo, useState } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
const center = [51.505, -0.09]
const zoom = 13
// function SearchControlMap({provider}) {
//     const maps = useMap()
//     useEffect(() => {
//       const control = new GeoSearchControl({
//         provider 
//       })
//       maps.addControl(control)
//       return () => {
//         maps.removeControl(control)
//       }
//     }, [provider])
//     return null
//   }
  

export default function Maps() {
    const [map, setMap] = useState(null)
  
    const displayMap = useMemo(
      () => (
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={false}
          ref={setMap}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      ),
      [],
    )
  
    return (
      <div>
        {displayMap}
      </div>
    )
  }