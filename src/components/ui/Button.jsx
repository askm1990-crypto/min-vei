import './Button.css';

/**
 * Button component — primary, secondary, icon, danger variants
 */
export default function Button({
    children,
    variant = 'primary',
    size = 'default',
    wide = false,
    danger = false,
    icon = null,
    onClick,
    disabled = false,
    className = '',
    ...props
}) {
    const classes = [
        'btn',
        `btn--${variant}`,
        size !== 'default' && `btn--${size}`,
        wide && 'btn--wide',
        danger && 'btn--danger',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button className={classes} onClick={onClick} disabled={disabled} {...props}>
            {icon && <span className="btn__icon">{icon}</span>}
            {children}
        </button>
    );
}
