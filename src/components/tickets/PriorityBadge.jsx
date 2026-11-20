const priorityStyles = {
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const PriorityBadge = ({ priority = 'medium' }) => {
    const normalizedPriority = priority.toLowerCase();

    const styles =
        priorityStyles[normalizedPriority] || priorityStyles.medium;

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${styles}`}
        >
            {normalizedPriority}
        </span>
    );
};

export default PriorityBadge;