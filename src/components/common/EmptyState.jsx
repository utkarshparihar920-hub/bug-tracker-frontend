const EmptyState = ({
    title = 'Nothing here yet',
    message = 'There is no data to display.',
    actionLabel,
    onAction,
    icon = '📂',
}) => {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-12 text-center">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-3xl">
                {icon}
            </div>

            <h2 className="text-xl font-semibold text-white">
                {title}
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                {message}
            </p>

            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    {actionLabel}
                </button>
            )}

        </div>
    );
};

export default EmptyState;