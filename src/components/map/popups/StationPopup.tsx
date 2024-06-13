import {Popup} from "react-leaflet";
import {useEffect} from "react";

interface StationPopupProps {
    station: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
}
function StationPopup({station}: StationPopupProps) {
    const [lng, lat] = (station.geometry as GeoJSON.Point).coordinates
    useEffect(() => {

    }, [station]);

    const formattedLines = station.properties?.linesEFA.map((line: string) => {
        const style = getLineStyle(line);
        return (<span key={line} style={style}>{line}</span>);
    });

    return (
        <Popup position={[lng, lat]}>
            <div>
                <p><strong>Name:</strong>{station.properties?.name}</p>
                <p><strong>Lines:</strong>{(formattedLines)}</p>
                <p><strong>Services:</strong>{station.properties?.transportModes.join(', ')}</p>
            </div>
        </Popup>
    )
}

function getLineStyle(line: any) {
    const style = {
        backgroundColor: 'blue',
        color: 'white',
        padding: '0 4px 0 4px',
        borderRadius: '2px',
        marginRight: '2px'
    }
    if (line.startsWith('U')) {
        style.backgroundColor = 'blue'
    } else if (line.startsWith('S')) {
        style.backgroundColor = 'green'
    } else if (!isNaN(line) || line.startsWith('N') || line.startsWith('SEV')) {
        style.backgroundColor = 'red'
    } else if (line.startsWith('R') || line.startsWith('IR') || line.startsWith('IC') || line.startsWith('MEX')) {
        style.backgroundColor = 'gray'
    }
    return  style
}

export default StationPopup