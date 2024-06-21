import {useMapEvent} from "react-leaflet";
import {useEffect, useRef, useState} from "react";
import {Popup as LeafletPopup} from "leaflet";
import Modal from "../../common/modal/Modal.tsx";
import "./StationPopup.css";
import StationArrivals from "../../../models/arrivals.ts";
import {RouteSearchEvent} from "../../../events/route.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket, faRightToBracket} from "@fortawesome/free-solid-svg-icons";

const backendUrl = "http://localhost:8080/api/v1/arrivals"

interface StationPopupProps {
    station: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>,
    onLineClick: (line: string) => void,
    onPopupClose: () => void,
    onRouteSearch: (event: RouteSearchEvent) => void,
}
function StationPopup({ station, onLineClick, onPopupClose, onRouteSearch }: StationPopupProps) {
    const popupRef = useRef<LeafletPopup>(null);
    const [arrivals, setArrivals] = useState<StationArrivals | null>(null);

    useEffect(() => {
        console.log('Fetching departures for station:', station.properties?.globalId);

        getArrivals(station.properties?.globalId).then(arrs => {
            setArrivals(arrs);
        }).catch(error => {
            console.error('Error fetching arrivals:', error);
        });
    }, [station]);

    useEffect(() => {
        console.log('Updated departures:', arrivals);
    }, [arrivals]);


    useMapEvent('popupclose', () => {
        console.log('popup closed')
        if (popupRef.current) {
            onPopupClose()
        }
    });

    const formattedLines = station.properties?.linesEFA.map((line: string) => {
        const style = getLineStyle(line);
        return (<span key={line} className="clickable-line" onClick={() => onLineClick(line)} style={style}>{line}</span>);
    });

    const buildRouteFrom = () => {
        const event: RouteSearchEvent = {
            stationFrom: station
        }
        onRouteSearch(event)
    }

    const buildRouteTo = () => {
        const event: RouteSearchEvent = {
            stationTo: station
        }
        onRouteSearch(event)
    }

    return (
        <Modal show={true} onClose={onPopupClose}>
            <div style={{maxWidth: '480px'}}>
                <h3><strong>{station.properties?.name}</strong></h3>
                <p><strong>Lines:</strong></p>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {formattedLines}
                </div>
                <div className={'button-row'}>
                    <button onClick={buildRouteTo}>Route to here <FontAwesomeIcon icon={faRightToBracket} /></button>
                    <button onClick={buildRouteFrom}>Route from here <FontAwesomeIcon icon={faRightFromBracket} /></button>
                </div>
                <div className="departures-board">
                    {arrivals && arrivals?.arrivals && arrivals?.arrivals?.map((arr) => (
                        <div key={`${arr.servingline}-${arr.datetime}`} className="departure-item">
                            <span className="line">{arr.servingline}</span>
                            <span className="direction">{arr.dirTo}</span>
                            <span className="countdown">{arr.countdown} Min</span>
                        </div>
                    ))}
                </div>
                <p><strong>Services:</strong> {station.properties?.transportModes.join(', ')}</p>
            </div>
        </Modal>
    )
}


function getArrivals(station: string): Promise<StationArrivals> {
    const url = `${backendUrl}?stationId=${station}&limit=8`
    return fetch(url).then(res => res.json())
}

function getLineStyle(line: any) {
    const style = {
        backgroundColor: 'blue',
        color: 'white',
        padding: '0 4px 0 4px',
        borderRadius: '2px',
        marginRight: '2px',
        marginTop: '2px',
        cursor: 'pointer'
    }
    if (line.startsWith('U')) {
        style.backgroundColor = 'blue'
    } else if (line.startsWith('S')) {
        style.backgroundColor = 'green'
    } else if (line === '10' || line === '20') {
        style.backgroundColor = 'yellow'
        style.color = 'black'
    } else if (!isNaN(Number(line)) || line.startsWith('N') || line.startsWith('SEV') || line.startsWith('X')) {
        style.backgroundColor = 'red'
    } else if (line.startsWith('R') || line.startsWith('IR') || line.startsWith('IC') || line.startsWith('MEX')) {
        style.backgroundColor = 'gray'
    }
    return  style
}

export default StationPopup