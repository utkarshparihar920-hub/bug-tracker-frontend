const LoadingSpinner = ({
    message = 'Loading...',
    fullScreen = false,
    size = 'h-8 w-8',
}) => {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? 'min-h-screen bg-slate-950' : 'py-8'
                }`}
        >
            <div
                className={`${size} animate-spin rounded-full border-4 border-slate-700 border-t-blue-500`}
                role="status"
                aria-label="Loading"
            />

            {message && (
                <p className="text-sm font-medium text-slate-400">
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;