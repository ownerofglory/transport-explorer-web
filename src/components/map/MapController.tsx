import { useState, useEffect, useMemo, useCallback } from "react";
import { LayersControl, useMap } from "react-leaflet";
import lines from "../../../data/lines.json";
import stations from "../../../data/stations.json";
import ubahnIcon from "../../assets/u-bahn-icon.png";
import sbahnIcon from "../../assets/s-bahn-icon.png";
import rbahnIcon from "../../assets/r-bahn-icon.png";
import busIcon from "../../assets/bus-icon.png";
import zackeIcon from "../../assets/zacke-icon.png";
import cableCarIcon from "../../assets/cablecar-icon.png";
import StationMarker from "./markers/StationMarker.tsx";
import StationPopup from "./popups/StationPopup.tsx";
import TransportLine from "./lines/TransportLine.tsx";
import ErrorBoundary from "../error/ErrorBoundary.tsx";
import TransportTypeControl from "./controls/TransportTypeControl.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import LinePopup from "./popups/LinePopup.tsx";
import Sidebar from "../common/sidebar/Sidebar.tsx";
import SearchBarControl from "./controls/SearchBarControl.tsx";
import {RouteSearchEvent} from "../../events/route.ts";
import RouteSearchPane from "../route-search/RouteSearchPane.tsx";

type TransportFilters = {
    "U-Bahn": boolean;
    "S-Bahn": boolean;
    "Bus": boolean;
    "Trains": boolean;
    "Cablecar": boolean;
    "Zacke": boolean;
};

function MapController() {
    console.log('render', 'MapController');
    const location = useLocation();
    const navigate = useNavigate();
    const [zoomLvl, setZoomLvl] = useState(12);
    const map = useMap();
    const [chosenStation, setChosenStation] = useState<GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> | null>(null);
    const [filters, setFilters] = useState<TransportFilters>({
        "U-Bahn": false,
        "S-Bahn": false,
        "Bus": false,
        "Trains": false,
        "Cablecar": false,
        "Zacke": false
    });
    const [selectedLine, setSelectedLine] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [routeSearch, setRouteSearch] = useState<RouteSearchEvent | null>(null)
    const handleRouteSearch = (event: RouteSearchEvent) => {
        console.log(event)
        setRouteSearch((prevRouteSearch) => {
            const newRouteSearch: RouteSearchEvent = {
                ...prevRouteSearch,
            };
            if (event.stationTo) {
                newRouteSearch.stationTo = event.stationTo
            }
            if (event.stationFrom) {
                newRouteSearch.stationFrom = event.stationFrom
            }
            if (event.dateTime) {
                newRouteSearch.dateTime = event.dateTime
            }
            return newRouteSearch;
        });
        setSidebarOpen(true)
    }

    const handleSidebarClose = () => {
        setRouteSearch(null)
        setSidebarOpen(false)
    }

    const handleLineClick = useCallback((line: string) => {
        setSelectedLine(line);
        updateQueryParams(filters, line);
    }, [filters]);

    const handleStationPopupClose = () => setChosenStation(null)

    const handleStationChosen = useCallback((station: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => {
        console.log('chosen', station);
        setSelectedLine(null);
        setChosenStation(station);
    }, []);

    const handleToggle = useCallback((type: string, checked: boolean) => {
        setSelectedLine(null);  // Clear the selected line when toggling transport types
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters, [type]: checked };
            updateQueryParams(newFilters, null);  // Clear the line parameter
            return newFilters;
        });
    }, []);

    const updateQueryParams = useCallback((filters: { [key: string]: boolean }, line: string | null) => {
        const activeFilters = Object.keys(filters).filter(key => filters[key]);
        const searchParams = new URLSearchParams(location.search);
        if (activeFilters.length > 0) {
            searchParams.set('transportType', activeFilters.join(','));
        } else {
            searchParams.delete('transportType');
        }
        if (line) {
            searchParams.set('line', line);
            searchParams.delete('transportType');  // Ensure transportType is removed when a line is selected
        } else {
            searchParams.delete('line');
        }
        navigate({ search: searchParams.toString() }, { replace: true });
    }, [location.search, navigate]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const transportType = searchParams.get('transportType');
        const line = searchParams.get('line');
        if (transportType) {
            const initialFilters = transportType.split(',').reduce((acc, type) => {
                acc[type as keyof TransportFilters] = true;
                return acc;
            }, {
                "U-Bahn": false,
                "S-Bahn": false,
                "Bus": false,
                "Trains": false,
                "Cablecar": false,
                "Zacke": false
            });
            setFilters(initialFilters);
        }
        if (line) {
            setSelectedLine(line);
        }
    }, [location.search]);

    useEffect(() => {
        const onZoomEnd = () => {
            console.log(map.getZoom());
            setZoomLvl(map.getZoom());
        };
        map.on('zoomend', onZoomEnd);
        return () => {
            map.off('zoomend', onZoomEnd);
        };
    }, [map]);

    const ubahnStations = useMemo(() => (
        (stations as GeoJSON.FeatureCollection)
            .features
            .filter(f => f.properties?.transportModes.includes('Stadtbahn'))
    ), []);

    const sbahnStations = useMemo(() => (
        (stations as GeoJSON.FeatureCollection)
            .features
            .filter(f => f.properties?.transportModes.includes('S-Bahn'))
    ), []);

    const trainStations = useMemo(() => (
        (stations as GeoJSON.FeatureCollection)
            .features
            .filter(f => f.properties?.transportModes.includes('R-Bahn'))
    ), []);

    const zackeStations = useMemo(() => (
        (stations as GeoJSON.FeatureCollection)
            .features
            .filter(f => f.properties?.transportModes.includes('Zahnradbahn'))
    ), []);

    const cableCarStations = useMemo(() => (
        (stations as GeoJSON.FeatureCollection)
            .features
            .filter(f => f.properties?.transportModes.includes('Seilbahn'))
    ), []);

    const busStops = useMemo(() => (
        (stations as GeoJSON.FeatureCollection)
            .features
            .filter(f => f.properties?.transportModes.includes('Bus') || f.properties?.transportModes.includes('Nachtbus'))
    ), []);

    const transportLines = useMemo(() => (
        (lines as GeoJSON.FeatureCollection).features
    ), []);

    const filteredStations = useMemo(() => {
        if (!selectedLine) return [];
        return (stations as GeoJSON.FeatureCollection)
            .features
            .filter(f => f.properties?.linesEFA.includes(selectedLine))
    }, [selectedLine]);

    console.table(filteredStations)

    const getIconForStation = (station: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => {
        const transportModes = station.properties?.transportModes || [];
        if (transportModes.includes('Stadtbahn')) return ubahnIcon;
        if (transportModes.includes('S-Bahn')) return sbahnIcon;
        if (transportModes.includes('R-Bahn')) return rbahnIcon;
        if (transportModes.includes('Zahnradbahn')) return zackeIcon;
        if (transportModes.includes('Seilbahn')) return cableCarIcon;
        if (transportModes.includes('Bus') || transportModes.includes('Nachtbus')) return busIcon;
        return '';
    };

    return (
        <ErrorBoundary>
            <LayersControl>
                <TransportTypeControl onToggle={handleToggle} filters={filters}/>
                {zoomLvl >= 12 && (
                    <div key={'stations'}>
                        {selectedLine ? (
                            filteredStations.map((f: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => (
                                <StationMarker key={f.properties?.globalId}
                                               onClick={handleStationChosen}
                                               station={f}
                                               iconUrl={getIconForStation(f)}
                                />
                            ))
                        ) : (
                            <>
                                {filters['U-Bahn'] ? ubahnStations.map((f: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => (
                                    <StationMarker key={f.properties?.globalId}
                                                   onClick={handleStationChosen}
                                                   station={f}
                                                   iconUrl={ubahnIcon}
                                    />
                                )) : (<></>)}
                                {filters['S-Bahn'] ? sbahnStations.map((f: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => (
                                    <StationMarker key={f.properties?.globalId}
                                                   onClick={handleStationChosen}
                                                   station={f}
                                                   iconUrl={sbahnIcon} />
                                )) : (<></>)}
                                {filters['Trains'] ? trainStations.map((f: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => (
                                    <StationMarker key={f.properties?.globalId}
                                                   onClick={handleStationChosen}
                                                   station={f}
                                                   iconUrl={rbahnIcon} />
                                )) : (<></>)}
                                {filters['Zacke'] ? zackeStations.map((f: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => (
                                    <StationMarker key={f.properties?.globalId}
                                                   onClick={handleStationChosen}
                                                   station={f}
                                                   iconUrl={zackeIcon} />
                                )) : (<></>)}
                                {filters['Cablecar'] ? cableCarStations.map((f: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => (
                                    <StationMarker key={f.properties?.globalId}
                                                   onClick={handleStationChosen}
                                                   station={f}
                                                   iconUrl={cableCarIcon} />
                                )) : (<></>)}
                                {filters['Bus'] ? busStops.map((f: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => (
                                    <StationMarker key={f.properties?.globalId}
                                                   onClick={handleStationChosen}
                                                   station={f}
                                                   iconUrl={busIcon} />
                                )) : (<></>)}
                            </>
                        )}


                    </div>
                )}
                {chosenStation && (
                    <StationPopup station={chosenStation}
                                  onLineClick={handleLineClick}
                                  onPopupClose={handleStationPopupClose}
                                  onRouteSearch={handleRouteSearch}
                    ></StationPopup>
                )}
                {selectedLine && (
                    <LinePopup coords={filteredStations[0]?.geometry as GeoJSON.Point}
                               line={transportLines.find(line => line.properties?.textEfa === selectedLine)!}
                    />
                )}
                <div>
                    {zoomLvl >= 10 && transportLines.filter(line => {
                        const name: string = line.properties?.textEfa ?? ''

                        if (selectedLine) return name === selectedLine;

                        if (name.startsWith('U') && filters['U-Bahn']) {
                            return true;
                        } else if (name.startsWith('S') && filters['S-Bahn']) {
                            return true;
                        } else if (filters['Bus'] && (!isNaN(Number(name)) || name.startsWith('N') || name.startsWith('SEV') || name.startsWith('X') )) {
                            return true;
                        } else if ((name.startsWith('R') || name.startsWith('IR') || name.startsWith('IC') || name.startsWith('MEX')) && filters['Trains']) {
                            return true;
                        } else if ((name == '10') && filters['Zacke']) {
                            return true;
                        } else if ((name == '20') && filters['Cablecar']) {
                            return true;
                        }
                        return false
                    }).map(line => (
                        <TransportLine key={line.properties?.id} line={line} />
                    ))}
                </div>
            </LayersControl>
            <SearchBarControl position={'topleft'} onSearch={() => {}}/>
            <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose}>
                {routeSearch && (
                    <RouteSearchPane from={routeSearch.stationFrom}
                                     to={routeSearch.stationTo}
                    ></RouteSearchPane>
                )}
            </Sidebar>
        </ErrorBoundary>
    );
}

export default MapController;
