import {Polyline} from "react-leaflet";
import {LatLngExpression} from "leaflet";

interface TransportLineProps {
    line: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
}

function TransportLine({line}: TransportLineProps) {
    console.log(line)
    if (!line.geometry || (line.geometry.type !== 'MultiLineString' && line.geometry.type !== 'LineString')) {
        console.error('Invalid geometry type:', line.geometry);
        return null;
    }
    const latLngCoords: LatLngExpression[][] = [];

    if (line.geometry.type === 'MultiLineString') {
        const coords = (line.geometry as GeoJSON.MultiLineString).coordinates;
        if (!Array.isArray(coords) || coords.some(line => !Array.isArray(line))) {
            console.error('Invalid coordinates:', coords);
            return null;
        }
        coords.forEach(ln => {
            const lineCoords = ln.map(position => {
                if (position.length < 2 || typeof position[0] !== 'number' || typeof position[1] !== 'number') {
                    console.error('Invalid position:', position);
                    return [0, 0] as LatLngExpression; // Default invalid coordinates to (0, 0)
                }
                return [position[1], position[0]] as LatLngExpression;
            });
            latLngCoords.push(lineCoords);
        });
    } else if (line.geometry.type === 'LineString') {
        const coords = (line.geometry as GeoJSON.LineString).coordinates;
        if (!Array.isArray(coords)) {
            console.error('Invalid coordinates:', coords);
            return null;
        }
        const lineCoords = coords.map(position => {
            if (position.length < 2 || typeof position[0] !== 'number' || typeof position[1] !== 'number') {
                console.error('Invalid position:', position);
                return [0, 0] as LatLngExpression; // Default invalid coordinates to (0, 0)
            }
            return [position[1], position[0]] as LatLngExpression;
        });
        latLngCoords.push(lineCoords);
    }

    return (
        <Polyline key={line.properties?.id} dashArray={line.properties?.textEfa ? undefined : '2, 2'} positions={latLngCoords} color={getLineColor(line.properties?.textEfa)}>
        </Polyline>
    )
}

function getLineColor(line: any): string {
    if (typeof line !== 'string') {
        return 'white'; // default color if the line is not a string
    }

    if (line.startsWith('U')) {
        return 'blue';
    } else if (line.startsWith('S')) {
        return 'green';
    } else if (line === '10' || line === '20') {
        return 'yellow';
    } else if (line.startsWith('R') || line.startsWith('IR') || line.startsWith('IC') || line.startsWith('MEX')) {
        return 'gray';
    } else if (!isNaN(Number(line)) || line.startsWith('N') || line.startsWith('SEV') || line.startsWith('X')) {
        return 'red';
    } else if (line === '' || !line) {
        return 'lightgray'
    }
    return 'white';
}
export default TransportLine