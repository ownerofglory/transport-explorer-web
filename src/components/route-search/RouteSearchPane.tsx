interface RouteSearchProps {
    from?: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
    to?: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
    dateTime?: Date
}

function RouteSearchPane({from, to, dateTime}: RouteSearchProps) {
    return (
        <div>
            <div>
                <p><span>{dateTime?.toLocaleDateString()}</span></p>
                <p>From: <span>{from?.properties?.name}</span></p>
                <p>To: <span>{to?.properties?.name}</span></p>
            </div>
            <div>
                <button>Search</button>
            </div>
        </div>
    )
}

export default RouteSearchPane