import {Marker, Tooltip, useMap} from "react-leaflet";
import {icon, point} from "leaflet";
import {ReactElement, useEffect, useState} from "react";

interface StationProps {
    station:  GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
    iconUrl: string
    children?: ReactElement | ReactElement[]
    onClick?: (station:  GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => void
}

function StationMarker({station, iconUrl, children, onClick}: StationProps) {
    const [lng, lat] = (station.geometry as GeoJSON.Point).coordinates
    const [iconSize, setIconSize] = useState(20)
    const stationIcon = icon({iconUrl: iconUrl, iconSize: point(iconSize, iconSize)})

    const map = useMap()
    useEffect(() => {
        const onZoomEnd = () => {
            const zoom = map.getZoom()
            if (zoom <= 13.5) {
                setIconSize(14)
            } else if (zoom > 13.5 && zoom <= 15) {
                setIconSize(16)
            } else {
                setIconSize(20)
            }
        };
        map.on('zoomend', onZoomEnd);
        return () => {
            map.off('zoomend', onZoomEnd);
        };
    }, [map]);

    return (
        <div>
            <Marker key={station.properties?.globalId} eventHandlers={{
                click: () => {
                    if (onClick) {
                        onClick(station)
                    }
                }
            }} position={[lng, lat]} icon={stationIcon}>
                <Tooltip key={'t' + station.properties?.globalId} position={[lng, lat]}>
                    {station.properties?.name}
                </Tooltip>
                {children}
            </Marker>
        </div>
    )
}

export default StationMarker