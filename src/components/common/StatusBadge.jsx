const StatusBadge = ({ status }) => {
    const statusStyles = {
        to_do: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
        in_progress: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        done: 'bg-green-500/15 text-green-400 border-green-500/30',
    };

    const statusLabels = {
        to_do: 'To Do',
        in_progress: 'In Progress',
        done: 'Done',
    };

    const normalizedStatus = status?.toLowerCase();

    const style =
        statusStyles[normalizedStatus] ||
        'bg-slate-500/15 text-slate-300 border-slate-500/30';

    const label =
        statusLabels[normalizedStatus] ||
        status?.replaceAll('_', ' ') ||
        'Unknown';

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${style}`}
        >
            {label}
        </span>
    );
};

export default StatusBadge;