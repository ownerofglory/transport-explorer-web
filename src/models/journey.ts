interface JourneyList {
    journeys?: JourneyItem[];
}

export interface JourneyItem {
    routeLegs?: JourneyRouteLeg[];
}

interface JourneyRouteLeg {
    origName?: string;
    origId?: string;
    dstName?: string;
    dstId?: string;
    departureTimePlan?: Date;
    departureTimeEst?: Date;
    arrivalTimePlan?: Date;
    arrivalTimeEst?: Date;
    transportLine?: string;
    transportService?: string;
    transportLineDestination?: string;
    stopSequence?: RouteStop[];
    coords?: Coord[];
}

interface RouteStop {
    globalId?: string;
    name?: string;
    coord?: Coord;
}

interface Coord {
    lat: number;
    lng: number;
}

export default JourneyList