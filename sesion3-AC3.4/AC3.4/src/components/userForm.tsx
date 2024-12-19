import React, { useState } from 'react';
type Props = {
    onSave: (name: string, email: string) => void;
};
const UserForm: React.FC<Props> = ({ onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(name, email);
    };
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <button type="submit">Guardar</button>
        </form>
    );
};
export default UserForm;