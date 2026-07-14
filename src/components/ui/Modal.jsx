import { useId } from 'react';
import './Modal.css';

/**
 * Modal overlay component — used for GDPR consent, confirmations
 */
export default function Modal({ children, isOpen, onClose, title }) {
    const titleId = useId();

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                onClick={e => e.stopPropagation()}
            >
                {title && (
                    <div className="modal-header">
                        <h2 id={titleId}>{title}</h2>
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}
