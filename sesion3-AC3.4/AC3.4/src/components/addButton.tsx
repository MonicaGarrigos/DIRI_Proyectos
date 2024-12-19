import React from "react";

type Props = {
    onAddItem: () => void;
};
const AddButton: React.FC<Props> = ({ onAddItem }) => {
    return (
        <button onClick={onAddItem}>Agregar Nuevo Ítem</button>
    );
};
export default AddButton;