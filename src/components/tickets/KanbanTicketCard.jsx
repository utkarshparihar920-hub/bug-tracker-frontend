import { Link } from 'react-router-dom';
import { useDraggable } from '@dnd-kit/core';

const KanbanTicketCard = ({ ticket, projectId }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: ticket.id,
        data: {
            ticket,
        },
    });

    const priorityStyles = {
        low: 'bg-slate-500/10 text-slate-400',
        medium: 'bg-blue-500/10 text-blue-400',
        high: 'bg-orange-500/10 text-orange-400',
        critical: 'bg-red-500/10 text-red-400',
    };

    const priority = (ticket.priority || 'medium').toLowerCase();

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="rounded-xl border border-slate-700 bg-slate-950 p-4 shadow-sm transition hover:border-blue-500/50"
        >
            <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase text-slate-500">
                    {ticket.type?.replaceAll('_', ' ') || 'Ticket'}
                </span>

                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 active:cursor-grabbing"
                    aria-label="Drag ticket"
                    title="Drag to change ticket status"
                >
                    ⠿ Drag
                </button>
            </div>

            <h4 className="font-semibold text-white">
                {ticket.title}
            </h4>

            <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-400">
                {ticket.description || 'No description provided.'}
            </p>

            <div className="mt-4">
                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${priorityStyles[priority] || priorityStyles.medium
                        }`}
                >
                    {priority}
                </span>
            </div>

            <div className="mt-4 border-t border-slate-800 pt-3">
                <p className="text-xs text-slate-500">Assignee</p>

                <p className="mt-1 text-sm text-slate-300">
                    {ticket.assignee_name || 'Unassigned'}
                </p>
            </div>

            <Link
                to={`/projects/${projectId}/tickets/${ticket.id}`}
                className="mt-4 inline-block text-sm font-medium text-blue-400 hover:text-blue-300"
            >
                View Details →
            </Link>
        </div>
    );
};

export default KanbanTicketCard;