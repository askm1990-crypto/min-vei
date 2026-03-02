import { useState, useEffect, useCallback } from 'react';
import './Toast.css';

/**
 * Toast notification system
 */
import { registerToastHandler } from './ToastUtils';

export function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        setToasts(prev => [...prev, toast]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, toast.duration);
    }, []);

    useEffect(() => {
        return registerToastHandler(addToast);
    }, [addToast]);

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast toast--${toast.type}`}>
                    <span className="toast__icon">
                        {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    <span className="toast__message">{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
