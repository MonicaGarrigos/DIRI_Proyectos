interface ContentProps{
    valorAlt: string;
    nombreImagen: string;
    descripcion: string;
}

function Content({valorAlt, nombreImagen, descripcion}: ContentProps): JSX.Element{
    return (
        <div className="content">
            <div className="line"></div>
            <div className="item">
                <div className="avatar">
                    <img alt={valorAlt} src={`/images/${nombreImagen}.jpg`} />
                </div>
                <span className="time">Hace una hora</span>
                <p>{descripcion}</p>
            </div>
        </div>
    )
}

export default Content;

