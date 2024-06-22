# ![](./docs/logo64x64.png) Stuttgart Öffi Explorer Frontend

Hobby project that aims to explore and visualize the extensive transport services provided by VVS (Verkehrs- und Tarifverbund Stuttgart) in the Stuttgart region. 
By leveraging interactive maps and real-time data, the application offers users a way to navigate the public transportation network. 
Key features include detailed route search between stops, visualization of transport lines and stations, and information on arrivals and departures. 

Currently, being developed

**You can find demo here**: [vvs-fe.vercel.app](https://vvs-fe.vercel.app/)

![](./docs/mobile.png)

## Features

### Line and station Information
The application features an interactive map displaying detailed line and station information for the public transportation system. Key highlights include:

- Map Visualization: The map showcases various transport lines (U-Bahn, S-Bahn, Bus, Trains, Zacke, Cablecar (Seilbahn)) with distinct colors and icons for easy differentiation.
- Interactive Filters: Users can toggle the visibility of different transport modes using checkboxes, allowing for a customized view.
- Station Markers: Each station is marked with a clear icon, and clicking on a station reveals additional information, such as the station name and connected lines.
- Line Details: The lines are plotted on the map, showing the routes they follow and connecting the corresponding stations.

![](./docs/screen-station-info.png)

### Route Search
The application provides a comprehensive route search feature that allows users to find the best routes between two stops. Key features include:

- Journey Options: The application displays multiple journey options, each detailing the departure and arrival times, total travel duration, and the transport lines involved.
- Map Visualization: The selected route is clearly plotted on the map, showing the exact path and connections between the stops.
- Interactive Elements: Users can toggle between different transport modes using the filters to customize the view and see the available routes for the selected transport modes.
- Detailed Information: Each journey option provides detailed information about the lines and stops, helping users choose the most convenient route.

![](./docs/screen-journey-search.png)