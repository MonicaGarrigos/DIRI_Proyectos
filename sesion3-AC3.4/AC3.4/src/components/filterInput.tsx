import React, { useState } from 'react';
type Props = {
    onFilterChange: (value: string) => void;
};
const FilterInput: React.FC<Props> = ({ onFilterChange }) => {
    const [filterValue, setFilterValue] = useState('');
    const handleChange = (e:
        React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(e.target.value);
        onFilterChange(e.target.value);
    };
    return (
        <input
            type="text"
            value={filterValue}
            onChange={handleChange}
            placeholder="Filtrar elementos..."
        />
    );
};
export default FilterInput;