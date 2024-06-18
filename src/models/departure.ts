interface DepartureItem {
    countdown?: string;
    datetime?: Date;
    dirFrom?: string;
    dirTo?: string;
    serviceName?: string;
    servingline?: string;
    operatorName?: string;
    info?: { [key: string]: string };
}

interface StationDepartures {
    datetime?: Date;
    departures?: DepartureItem[];
}

export default StationDepartures;