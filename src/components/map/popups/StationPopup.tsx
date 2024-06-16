import {Popup, useMapEvent} from "react-leaflet";
import {useEffect, useRef} from "react";
import {Popup as LeafletPopup} from "leaflet";

interface StationPopupProps {
    station: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
    onLineClick: (line: string) => void
    onPopupClose: () => void
}
function StationPopup({station, onLineClick, onPopupClose}: StationPopupProps) {
    const [lng, lat] = (station.geometry as GeoJSON.Point).coordinates
    useEffect(() => {

    }, [station]);
    const popupRef = useRef<LeafletPopup>(null);
    useMapEvent('popupclose', () => {
        if (popupRef.current) {
            onPopupClose()
        }
    });

    const formattedLines = station.properties?.linesEFA.map((line: string) => {
        const style = getLineStyle(line);
        return (<span key={line} className="clickable-line" onClick={() => onLineClick(line)} style={style}>{line}</span>);
    });

    return (
        <Popup interactive ref={popupRef} position={[lng, lat]}>
            <div style={{maxWidth: '250px'}}>
                <h3><strong>{station.properties?.name}</strong></h3>
                <p><strong>Lines:</strong></p>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {formattedLines}
                </div>
                <p><strong>Services:</strong> {station.properties?.transportModes.join(', ')}</p>
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