import { addItemToAPI, fetchItemsFromAPI, removeItemFromAPI } from "../model/home";


export class TodoViewModel {
    [x: string]: any;
    private items: string[]=[];
    private subscribers: Array<() => void> = [];

    constructor(){
        //Carga inicial de los items
        this.loadItems();
    }

    private async loadItems(){
        this.items = await fetchItemsFromAPI();
        this.notifyChange();
    }

    public getItems():string[]{
        return this.items;
    }

    public async addItem(newItem: string):Promise<void>{
        if(newItem.trim()){
            this.items = await addItemToAPI(newItem);
            this.notifyChange();
        }
    }

    public async removeItem(index:number): Promise<void> {
        this.items = await removeItemFromAPI(index);
        this.notifyChange();
    }

    //Suscripción a cambios
    public subsribe(callback:() => void): () => void{
        this.subscribers.push(callback);
        return()=>{
            this.subscribers=this.subscribers.filter(sub=>sub!==callback);
        };
    }

    private notifyChange(){
        this.subscribers.forEach(cb=>cb());
    }
}

export default TodoViewModel;