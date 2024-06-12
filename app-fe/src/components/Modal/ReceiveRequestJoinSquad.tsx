
import React from "react";
import ReactDOM from "react-dom";

const ReceiveRequestJoinSquad = ({ onClose, children, title }: ReceiRequestProp) => {
    const handleCloseClick = () => {
        onClose();
    };

    return (
        <div className="modal-overlay">
            {/* Wrap the whole Modal inside the newly created StyledModalWrapper
            and use the ref */}
            <div className="modal-wrapper">
                <div className="modal">
                    <div className="modal-header">
                        <a href="#" onClick={handleCloseClick}>
                            x
                        </a>
                    </div>
                    {title && <h1>{title}</h1>}
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>
    );


}

export interface ReceiRequestProp{
    onClose: () => void;
    children: String;
    title: string;

}

export default ReceiveRequestJoinSquad;