import { Popup } from "react-leaflet";
import lines from '../../../../data/line_names.json'

interface LinePopupProps {
    line: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;
    coords: GeoJSON.Point
}

type LineInfo = {     type: string;     features: {         type: string;         properties: {             lineName: string;             headline: string;             operatingBranch: string;             divaName: string;         };     }[]; }

function LinePopup({ line, coords }: LinePopupProps) {
    const [lng, lat] = coords.coordinates;

    const lineInfo = (lines as LineInfo).features
        .filter(f => f.properties.lineName == line.properties?.textEfa)[0]

    console.log(lineInfo)

    const lineName = line.properties?.textEfa || '';
    const terminalStations = lineInfo.properties?.headline;

    return (
        <Popup position={{lng, lat}}>
            <div>
                <h3><span style={getLineStyle(lineName)}>{lineName}</span></h3>
                <p><strong>Heading:</strong> {terminalStations}</p>
                <div>
                </div>
            </div>
        </Popup>
    );
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


export default LinePopup;
