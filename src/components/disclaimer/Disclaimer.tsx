import Modal from "../common/modal/Modal.tsx";
import {useState} from "react";
import './Disclaimer.scss';

export function Disclaimer() {
    const [show, setShow] = useState(true)
    const disclaimerSeen = localStorage.getItem("disclaimerSeen")
    if (disclaimerSeen) {
        return null
    }

    const handleClose = () => {
        localStorage.setItem("disclaimerSeen", "true")
        setShow(false)
    }

    return (
        <Modal show={show} onClose={() => handleClose()}>
            <div className={'disclaimer'}>
                <h2>⚠️ Disclaimer</h2>
                <p>🇬🇧 This is <b>not</b> an official offer of the VVS (Verkehrs- und Tarifverbund Stuttgart). The VVS is
                    not liable for the content.</p>
                <p>🇩🇪 Es handelt sich um <b>kein</b> offizielles Angebot des VVS (Verkehrs- und Tarifverbund Stuttgart).
                    Der VVS haftet nicht für die Inhalte.</p>
            </div>
        </Modal>
    );
}