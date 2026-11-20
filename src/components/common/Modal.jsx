const Modal = ({ isOpen, onClose, title, children, size = 'max-w-lg' }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={onClose}
        >
            <div
                className={`w-full ${size} rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-white">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-lg px-3 py-1 text-2xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                        &times;
                    </button>
                </div>

                <div className="text-white">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;