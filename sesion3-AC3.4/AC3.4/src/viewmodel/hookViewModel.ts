// Recibe una instancia del ViewModel
// Se encarga de suscribirse a los cambios para actualizar el estado interno de los componentes React

import { useEffect, useState } from "react";
import TodoViewModel from "./TodoViewModel";


export const useTodoViewModel=(viewModel:TodoViewModel) => {
    const[items,setItems] = useState<string[]>(viewModel.getItems());

    useEffect(()=>{
        // Nos suscribimos a los cambios del ViewModel
        const unsubscribe = viewModel.subscribe(()=>{
            setItems(viewModel.getItems());
        });

        // Al desmontar el componente, nos desuscribimos
        return() => unsubscribe();
    }, [viewModel]);

    return{
        items,
        addItem:(newItem:string)=> viewModel.addItem(newItem),
        removeItem:(index:number)=> viewModel.removeItem(index)
    };
};