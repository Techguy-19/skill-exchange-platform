

function Popup({
    isOpen,
    type = 'info',
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    showCancel = false
}) {

    if (!isOpen) {
        return null
    }

    const icons = {
        success: '✓',
        error: '!',
        warning: '⚠',
        info: 'i',
        danger: '🗑️'
    }

    return (
        <div className="popup-overlay">

            <div className={`popup-card popup-${type}`}>

                <div className="popup-icon">
                    {icons[type] || icons.info}
                </div>

                <div className="popup-content">

                    <h3>
                        {title}
                    </h3>

                    <p>
                        {message}
                    </p>

                </div>

                <div className="popup-actions">

                    {showCancel && (
                        <button
                            type="button"
                            className="popup-cancel-btn"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                    )}

                    <button
                        type="button"
                        className="popup-confirm-btn"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>

                </div>

            </div>

        </div>
    )
}

export default Popup