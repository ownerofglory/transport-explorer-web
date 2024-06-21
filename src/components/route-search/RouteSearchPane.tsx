import {useState} from "react";
import JourneyList, {JourneyItem, JourneyRouteLeg} from "../../models/journey.ts";
import './RouteSearchPane.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faAngleRight, faPersonWalking} from "@fortawesome/free-solid-svg-icons";

interface RouteSearchProps {
    from?: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
    to?: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
    dateTime?: Date
    onRouteSelect: (route: JourneyItem) => void
}

function RouteSearchPane({from, to, dateTime, onRouteSelect}: RouteSearchProps) {
    const [routes, setRoutes] = useState<JourneyList | null>(null)

    const searchRoute = () => {
        fetch(`http://localhost:8080/api/v1/journeys?from=${from?.properties?.globalId}&to=${to?.properties?.globalId}`)
            .then<JourneyList>(resp => resp.json())
            .then(j => setRoutes(j))
    }

    return (
        <div>
            <div>
                <p><span>{dateTime?.toLocaleDateString()}</span></p>
                <p>From: <span>{from?.properties?.name}</span></p>
                <p>To: <span>{to?.properties?.name}</span></p>
            </div>
            <div>
                <button onClick={() => searchRoute()}>Search</button>
            </div>
            <div>
                {routes?.journeys?.map(j => (
                    <p onClick={() => onRouteSelect(j)} className={'route-item'}>{j.routeLegs?.map(l => (
                        <span>
                            <span style={getLineStyle(l.transportLine ?? 'walk')}>
                                {l.transportLine ?? <FontAwesomeIcon color={'black'} icon={faPersonWalking}/>}
                            </span>

                            <FontAwesomeIcon className={'next-icon'} icon={faAngleRight}/>
                        </span>
                    ))}
                        <span className={'route-duration'}>{formatDuration(j.routeLegs?.reduce((prev: number, cur: JourneyRouteLeg) => {
                            return prev + (cur?.duration ?? 0)
                        }, 0) ?? 0)}</span>
                    </p>
                ))}
            </div>
        </div>
    )
}

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const hoursString = hours > 0 ? `${hours}h` : "";
    const minutesString = minutes > 0 ? `${minutes}m` : "";

    return hoursString + (hours > 0 && minutes > 0 ? " " : "") + minutesString;
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
    } else if (line === 'walk') {
        style.backgroundColor = 'lightgray'
    }
    return  style
}

export default RouteSearchPane