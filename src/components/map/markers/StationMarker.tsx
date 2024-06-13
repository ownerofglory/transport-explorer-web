import {Marker, Tooltip} from "react-leaflet";
import {icon, point} from "leaflet";
import {ReactElement} from "react";

interface StationProps {
    station:  GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
    iconUrl: string
    children?: ReactElement | ReactElement[]
    onClick?: (station:  GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => void
}

function StationMarker({station, iconUrl, children, onClick}: StationProps) {
    const [lng, lat] = (station.geometry as GeoJSON.Point).coordinates
    const stationIcon = icon({iconUrl: iconUrl, iconSize: point(20, 20)})

    return (
        <Marker key={station.properties?.globalId} eventHandlers={{
            click: () => {
                if (onClick) {
                    onClick(station)
                }
            }
        }} position={[lng, lat]} icon={stationIcon}>
            <Tooltip key={'t' + station.properties?.globalId}  position={[lng, lat]}>
                {station.properties?.name}
            </Tooltip>
            {children}
        </Marker>
    )
}

export default StationMarker