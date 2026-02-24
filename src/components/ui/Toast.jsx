import { useState, useEffect, useCallback } from 'react';
import './Toast.css';

/**
 * Toast notification system
 */
let toastIdCounter = 0;
let addToastGlobal = null;

export function showToast(message, type = 'success', duration = 3000) {
    if (addToastGlobal) {
        addToastGlobal({ id: ++toastIdCounter, message, type, duration });
    }
}

export function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        setToasts(prev => [...prev, toast]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, toast.duration);
    }, []);

    useEffect(() => {
        addToastGlobal = addToast;
        return () => { addToastGlobal = null; };
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
