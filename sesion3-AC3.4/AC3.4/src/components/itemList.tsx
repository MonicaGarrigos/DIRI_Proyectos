import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import FilterInput from "./filterInput";
import itemsModel from "../model/items";
import Modal from "./modal";


// REQUISITO 2 - Página con un diccionario de items

// REQUISITO 6 - Mostrar item seleccionado: añado un evento de clic a cada fila de la tabla

// REQUISITO 7 - Buscador de items: se añade un campo de búsqueda que permita buscar el item-

const ItemList = () => {
    const { filter } = useParams<{ filter?: string }>();
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [filterValue, setFilterValue] = useState(filter || '');
    const [modalOpen, setModalOpen] = useState(false);
  
    const filteredItems = useMemo(() => {
      return itemsModel.filter((item) =>
        item.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }, [filterValue]);
  
    const handleSelectItem = (index: number) => {
      setSelectedItem(index);
    };
  

    // Buscador
    const handleSearch = (query: string) => {
      const index = itemsModel.findIndex((item) =>
        item.nombre.toLowerCase() === query.toLowerCase()
      );
      if (index !== -1) {
        setSelectedItem(index);
      } else {
        setModalOpen(true); // Mostrar modal si no se encuentra
      }
    };
  
    return (
      <div>
        <h1>Página de Ítems</h1>
        <FilterInput onFilterChange={setFilterValue} />
        <button onClick={() => handleSearch(filterValue)}>Buscar</button> {/* R7a */}
        <ul>
          {filteredItems.map((item, index) => (
            <li key={item.id} onClick={() => handleSelectItem(index)}>
              {item.id}: {item.nombre}
            </li>
          ))}
        </ul>
        {selectedItem !== null && (
          <div>
            <h2>Detalle del Ítem</h2>
            <p>ID: {itemsModel[selectedItem].id}</p>
            <p>Nombre: {itemsModel[selectedItem].nombre}</p>
            <p>Descripción: {itemsModel[selectedItem].descripcion}</p>
            <p>Precio: {itemsModel[selectedItem].precio}</p>
          </div>
        )}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          content={<p>Ítem no encontrado</p>} // R7b
        />
      </div>
    );
  };

export default ItemList;