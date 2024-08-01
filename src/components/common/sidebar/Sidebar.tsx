import React, { useEffect, useRef } from 'react';
import './Sidebar.scss';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode | React.ReactNode[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, children }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            console.log('Content Height:', contentRef.current.scrollHeight);
        }
    }, [children]);

    const stopPropagation = (e: React.SyntheticEvent) => {
        e.stopPropagation();
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div
                ref={contentRef}
                className="sidebar-content"
                onWheel={stopPropagation}
                onTouchStart={stopPropagation}
                onTouchMove={stopPropagation}
                onTouchEnd={stopPropagation}
            >
                <button className="close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Sidebar;
