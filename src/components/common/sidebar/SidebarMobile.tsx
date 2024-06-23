import React, { useEffect, useRef } from 'react';
import './SidebarMobile.scss';

interface SidebarMobileProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode | React.ReactNode[];
}

const SidebarMobile: React.FC<SidebarMobileProps> = ({ isOpen, onClose, children }) => {
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sidebarElement = sidebarRef.current;

        const preventTouchMove = (event: TouchEvent) => {
            event.stopPropagation();
        };

        if (sidebarElement) {
            sidebarElement.addEventListener('touchmove', preventTouchMove, { passive: false });
        }

        return () => {
            if (sidebarElement) {
                sidebarElement.removeEventListener('touchmove', preventTouchMove);
            }
        };
    }, []);

    return (
        <div ref={sidebarRef} className={`sidebar-mobile ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-mobile-content">
                <button className="close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default SidebarMobile;
