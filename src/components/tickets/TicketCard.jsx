import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

const priorityStyles = {
    low: 'bg-slate-500/10 text-slate-400',
    medium: 'bg-blue-500/10 text-blue-400',
    high: 'bg-orange-500/10 text-orange-400',
    critical: 'bg-red-500/10 text-red-400',
};

const TicketCard = ({
    ticket,
    projectId,
    onEdit,
    onDelete,
    deleting = false,
}) => {
    const priority = (ticket.priority || 'medium').toLowerCase();

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500/50">

            <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {ticket.type?.replace('_', ' ') || 'Ticket'}
                </span>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${priorityStyles[priority] || priorityStyles.medium
                        }`}
                >
                    {priority}
                </span>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
                {ticket.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                {ticket.description || 'No description provided.'}
            </p>

            <div className="mt-4">
                <StatusBadge status={ticket.status} />
            </div>

            <div className="mt-5 border-t border-slate-800 pt-4">
                <p className="text-xs text-slate-500">
                    Assignee
                </p>

                <p className="mt-1 text-sm text-slate-300">
                    {ticket.assignee_name || 'Unassigned'}
                </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <Link
                    to={`/projects/${projectId}/tickets/${ticket.id}`}
                    className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
                >
                    View Details →
                </Link>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(ticket)}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(ticket)}
                        disabled={deleting}
                        className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default TicketCard;