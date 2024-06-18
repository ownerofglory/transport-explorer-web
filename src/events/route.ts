export interface RouteSearchEvent {
    stationFrom?: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
    stationTo?: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>
    dateTime?: Date
}