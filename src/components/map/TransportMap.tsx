import {MapContainer, TileLayer} from "react-leaflet";
import MapController from "./MapController.tsx";

function TransportMap() {
    return (
        <MapContainer center={[48.7418062,9.2020801]} zoom={13} scrollWheelZoom={true} style={{
            height: '100vh',
            width: '100vw'
        }}>
            <TileLayer
                attribution='Contact <a href="https://github.com/ownerofglory">@ownerofglory</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController></MapController>
        </MapContainer>
    )
}

export default TransportMap