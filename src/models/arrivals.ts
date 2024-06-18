interface ArrivalItem {
    countdown?: string;
    datetime?: Date;
    dirFrom?: string;
    dirTo?: string;
    serviceName?: string;
    servingline?: string;
    operatorName?: string;
    info?: { [key: string]: string };
}

interface StationArrivals {
    datetime?: Date;
    arrivals?: ArrivalItem[];
}

export default StationArrivals

