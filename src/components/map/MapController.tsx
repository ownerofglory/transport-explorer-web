import {LayersControl, useMap} from "react-leaflet";
import lines from "../../../data/lines.json";
import stations from "../../../data/stations.json";
import ubahnIcon from "../../assets/u-bahn-icon.jpg";
import sbahnIcon from "../../assets/s-bahn-icon.png";
import {useState} from "react";
import StationMarker from "./markers/StationMarker.tsx";
import StationPopup from "./popups/StationPopup.tsx";
import TransportLine from "./lines/TransportLine.tsx";
import ErrorBoundary from "../error/ErrorBoundary.tsx";

function MapController() {
    console.log('render', 'MapController')
    const [zoomLvl, setZoomLvl] = useState(12)
    const map = useMap()
    const [chosenStation, setChosenStation] = useState<GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>>()

    const handleStationChosen = (station: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => {
        console.log('chosen', station)
        setChosenStation(station)
    }

    map.addEventListener('zoomend', () => {
        console.log(map.getZoom())
        setZoomLvl(map.getZoom())
    })

    // const ubahnLines = (lines as GeoJSON.FeatureCollection)
    //     .features
    //     .filter(f => f.properties?.text.indexOf('U') == 0)
    //
    // const sbahnLines = (lines as GeoJSON.FeatureCollection)
    //     .features
    //     .filter(f => f.properties?.text.indexOf('S') == 0)

    const ubahnStations = (stations as GeoJSON.FeatureCollection)
        .features
        .filter(f => f.properties?.transportModes.includes('Stadtbahn'))
        .map(f => {
            const [lat, lon] = (f.geometry as GeoJSON.Point).coordinates;

            (f.geometry as GeoJSON.Point).coordinates = [lon, lat]

            return f
        })

    const sbahnStations = (stations as GeoJSON.FeatureCollection)
        .features
        .filter(f => f.properties?.transportModes.includes('S-Bahn'))
        .map(f => {
            const [lat, lon] = (f.geometry as GeoJSON.Point).coordinates;

            (f.geometry as GeoJSON.Point).coordinates = [lon, lat]

            return f
        })

    // geoJSON(ubahnLines).addTo(map)
    // sbahnLines.forEach(s => {
    //     const geom = (s as GeoJSON.Feature).geometry
    //     const coords = (geom as GeoJSON.MultiLineString).coordinates
    //     const latLngCoords: LatLngExpression[][] = coords.map(line =>
    //         line.map(position => [position[1], position[0]] as LatLngExpression)
    //     );
    //
    //     const sline = polyline(latLngCoords, {
    //         color: '#27B611'
    //     })
    //     sline.addTo(map)
    // })

    return (
        <ErrorBoundary>
            <LayersControl>
                {
                    (zoomLvl >= 12) ?
                        (
                            <div key={'stations'}>
                                {
                                    ubahnStations.map((f:  GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => {
                                        return (
                                            <StationMarker key={f.properties?.globalId} onClick={handleStationChosen} station={f} iconUrl={ubahnIcon}>
                                            </StationMarker>
                                        )
                                    })
                                }

                                {
                                    sbahnStations.map((f:  GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => {
                                        return (
                                            <StationMarker onClick={handleStationChosen} station={f} iconUrl={sbahnIcon}>
                                            </StationMarker>
                                        )
                                    })
                                }
                            </div>
                        ) :
                        (<></>)
                }
                {
                    chosenStation ? (
                        <StationPopup station={chosenStation}></StationPopup>
                    ):(<></>)
                }

                <div>
                    {
                        (lines as GeoJSON.FeatureCollection)
                            .features
                            .map(line => {

                                return <TransportLine line={line}></TransportLine>
                            })
                    }
                </div>
            </LayersControl>
        </ErrorBoundary>
    )
}

export default MapController