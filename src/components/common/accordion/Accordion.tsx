import React, { useState } from 'react';
import './Accordion.scss';

interface AccordionProps {
    title: string | React.ReactNode;
    children: React.ReactNode | React.ReactNode[];
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`accordion ${isOpen ? 'open' : ''}`}>
            <div className="accordion-title" onClick={toggleAccordion}>
                {title}
            </div>
            {isOpen && <div className="accordion-content">{children}</div>}
        </div>
    );
};

export default Accordion;
