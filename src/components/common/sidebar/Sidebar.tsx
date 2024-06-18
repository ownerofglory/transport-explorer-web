import React from 'react';
import './Sidebar.scss';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode | React.ReactNode[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, children }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-content">
                <button className="close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Sidebar;
