import {useState} from "react";
import JourneyList, {JourneyItem} from "../../models/journey.ts";
import './RouteSearchPane.scss'

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
                        <span style={getLineStyle(l.transportLine ?? '')}>{l.transportLine} </span>
                    ))}</p>
                ))}
            </div>
        </div>
    )
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

export default RouteSearchPane