
import React, { useState } from 'react';
import TodoViewModel from './TodoViewModel';
import { useTodoViewModel } from './hookViewModel';


// Creamos una instancia del ViewModel fuera del componente
// En un caso real, se podría inyectar desde un contexto, provider, etc.
const todoViewModel = new TodoViewModel();
const TodoApp: React.FC = () => {
    const { items, addItem, removeItem } =
        useTodoViewModel(todoViewModel);
    const [newItem, setNewItem] = useState<string>('');
    return (
        <div>
            <ul>
                {items.map((item: string, index: number) => (
                    <li key={index} onClick={() => removeItem(index)}>
                        {item}
                    </li>
                ))}
            </ul>

            <input
                type="text"
                value={newItem}
                onChange={(e:
                    React.ChangeEvent<HTMLInputElement>) =>
                    setNewItem(e.target.value)}
                placeholder="Nuevo elemento"
            />
            <button
                onClick={() => {
                    addItem(newItem);
                    setNewItem('');
                }}
            >
                Agregar
            </button>
        </div>
    );
};

export default TodoViewModel;