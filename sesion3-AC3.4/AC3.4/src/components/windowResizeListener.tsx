import React, { useEffect } from 'react';
type Props = {
    onWindowResize: (width: number, height: number) => void;
};
const WindowResizeListener: React.FC<Props> =
    ({ onWindowResize }) => {
        useEffect(() => {
            const handleResize = () => {
                onWindowResize(window.innerWidth, window.innerHeight);
            };
            // Suscribimos al evento 'resize' del navegador
            window.addEventListener('resize', handleResize);
            // Inicializamos al inicio el estado con el tamaño actual
            handleResize();
            // Limpieza al desmontar el componente
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }, [onWindowResize]);
        // Este componente no renderiza nada visible
        return null;
    };
export default WindowResizeListener;