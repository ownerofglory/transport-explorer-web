import { ReactElement, useEffect } from "react"
import "./Modal.scss"

interface ModalProps {
    children?: ReactElement | ReactElement[];
    show: boolean;
    onClose: () => void;
}

function Modal({ children, show, onClose }: ModalProps) {
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [show]);

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
