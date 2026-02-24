import './Modal.css';

/**
 * Modal overlay component — used for GDPR consent, confirmations
 */
export default function Modal({ children, isOpen, onClose, title }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                {title && (
                    <div className="modal-header">
                        <h2>{title}</h2>
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}
