type Props = {
    items: string[];
    onSelectItem: (index: number) => void;
};
const ItemList: React.FC<Props> = ({ items, onSelectItem }) => {
    return (
        <ul>
            {items.map((item, index) => (
                <li key={index} onClick={() => onSelectItem(index)}>
                    {item}
                </li>
            ))}
        </ul>
    );
};

export default ItemList;