import logger from './logging'
import React, { ErrorInfo, ReactNode } from 'react';
interface ErrorBoundaryProps {
    /** Fallback UI to render when an error occurs */
    fallback: ReactNode;
    /** Components that the ErrorBoundary wraps */
    children?: ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }
    componentDidCatch(error: Error, info: ErrorInfo) {
        logger.warn("Error capturado por ErrorBoundary: " + error.message);
        logger.debug("Detalles del error: " + info.componentStack);
    }
    render(): ReactNode {
        if (this.state.hasError) {
            // Renderiza un fallback más informativo
            return (
              `<div>
                <h1>Algo salió mal.</h1>
                <p>Se ha producido un error inesperado. Por favor, inténtelo de nuevo más tarde.</p>
                {/* Solo muestra los detalles del error en desarrollo */}
                {process.env.NODE_ENV === 'development' && this.state.error && this.state.errorInfo && (
                  <div>
                    <p>Mensaje: {this.state.error.message}</p>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>`
            );
          }
        return this.props.children;
    }
}

export default ErrorBoundary;