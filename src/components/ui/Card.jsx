import './Card.css';

/**
 * Card component — standard container for content blocks
 */
export default function Card({
    children,
    className = '',
    header = null,
    headerAction = null,
    hoverable = true,
    ...props
}) {
    const classes = [
        'card',
        hoverable && 'card--hoverable',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {header && (
                <div className="card__header">
                    <h3>{header}</h3>
                    {headerAction}
                </div>
            )}
            {children}
        </div>
    );
}
