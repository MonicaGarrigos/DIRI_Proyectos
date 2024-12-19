

export interface items{
    id:number;
    nombre:string;
    descripcion:string;
    precio: number;
}


const itemsModel: items[]= [
    {id:1, nombre:'producto 1', descripcion:' desc p1', precio:123},
    {id:2, nombre:'producto 2', descripcion:' desc p2', precio:3},
    {id:3, nombre:'producto 3', descripcion:' desc p3', precio:12}

]


export default items;