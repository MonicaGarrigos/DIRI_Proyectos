
const Home = (): React.JSX.Element =>
    <div className="main-content">
        <h1>Página principal</h1>
    </div>

// Simulamos funciones que interactúan con un API:
export const fetchItemsFromAPI = async (): Promise<string[]> => {
    return ['Tarea 1', 'Tarea 2'];  //LLAMAR AL ARRAY DE ITEMS
};
export const addItemToAPI = async (newItem: string): Promise<string[]> => {
    // Simulamos una llamada POST para agregar un nuevo elemento
    console.log(`Elemento agregado al servidor: ${newItem}`);
    return await fetchItemsFromAPI();
};
export const removeItemFromAPI = async (index: number): Promise<string[]> => {
    // Simulamos una llamada DELETE para eliminar un elemento
    console.log(`Elemento eliminado en la posición: ${index}`);
    return await fetchItemsFromAPI(); 
};


export default Home;