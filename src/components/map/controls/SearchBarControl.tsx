import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './SearchBarControl.scss';

interface SearchBarControlProps {
    position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
    placeholder?: string;
    onSearch: (query: string) => void;
}

const SearchBarControl: React.FC<SearchBarControlProps> = ({ position = 'topright', placeholder = 'Search...', onSearch }) => {
    const map = useMap();

    useEffect(() => {
        const searchBarControl = L.Control.extend({
            onAdd: () => {
                const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar search-bar-control');

                const input = L.DomUtil.create('input', '', container) as HTMLInputElement;
                input.type = 'text';
                input.placeholder = placeholder;

                input.onkeydown = (e) => {
                    if (e.key === 'Enter') {
                        onSearch(input.value);
                    }
                };

                L.DomEvent.disableClickPropagation(container);
                return container;
            },
        });

        const control = new searchBarControl({ position });
        map.addControl(control);

        return () => {
            map.removeControl(control);
        };
    }, [map, position, placeholder, onSearch]);

    return null;
};

export default SearchBarControl;
