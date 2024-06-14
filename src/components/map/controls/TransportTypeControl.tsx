import { Control, ControlPosition, DomUtil } from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface TransportTypeControlProps {
    position?: ControlPosition;
    filters: { [key: string]: boolean };
    onToggle: (type: string, checked: boolean) => void;
}

function TransportTypeControl({ position = 'topright', onToggle, filters }: TransportTypeControlProps) {
    const map = useMap();

    useEffect(() => {
        const transTypeControl = Control.extend({
            onAdd: () => {
                const container = DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                container.style.backgroundColor = 'white';
                container.style.padding = '5px';

                const createCheckbox = (type: string, label: string) => {
                    const checkboxContainer = DomUtil.create('div', 'checkbox-container');
                    const checkbox = DomUtil.create('input', 'checkbox') as HTMLInputElement;
                    checkbox.type = 'checkbox';
                    checkbox.id = type;
                    checkbox.checked = filters[type];  // Set checkbox state based on filters prop
                    checkbox.onchange = (e: Event) => {
                        const target = e.target as HTMLInputElement;
                        onToggle(type, target.checked);
                    };

                    const checkboxLabel = DomUtil.create('label', 'checkbox-label');
                    checkboxLabel.htmlFor = type;
                    checkboxLabel.innerText = label;

                    checkboxContainer.appendChild(checkbox);
                    checkboxContainer.appendChild(checkboxLabel);
                    return checkboxContainer;
                };

                container.appendChild(createCheckbox('U-Bahn', 'U-Bahn'));
                container.appendChild(createCheckbox('S-Bahn', 'S-Bahn'));
                container.appendChild(createCheckbox('Bus', 'Bus'));
                container.appendChild(createCheckbox('Trains', 'Trains'));
                container.appendChild(createCheckbox('Zacke', 'Zacke'));
                container.appendChild(createCheckbox('Cablecar', 'Cablecar'));

                return container;
            }
        });

        const control = new transTypeControl({ position });
        map.addControl(control);

        return () => {
            map.removeControl(control);
        };
    }, [map, position, filters, onToggle]);

    return <div></div>;
}

export default TransportTypeControl;
