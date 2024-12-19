type Props = {
    isOpen: boolean;
    onClose: () => void;
    content: React.ReactNode;
};
const Modal: React.FC<Props> = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;
    return (
        <div className="modal">
            <div className="modal-content">
                {content}
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default Modal;