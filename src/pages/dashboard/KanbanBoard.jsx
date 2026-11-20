import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DndContext } from '@dnd-kit/core';

import API from '../../services/api';
import KanbanColumn from '../../components/tickets/KanbanColumn';
import KanbanTicketCard from '../../components/tickets/KanbanTicketCard';

const columns = [
    {
        id: 'to_do',
        title: 'To Do',
    },
    {
        id: 'in_progress',
        title: 'In Progress',
    },
    {
        id: 'done',
        title: 'Done',
    },
];

const KanbanBoard = () => {
    const { projectId } = useParams();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingTicketId, setUpdatingTicketId] = useState(null);

    const fetchTickets = useCallback(async () => {
        try {
            setError('');

            const response = await API.get(
                `/tickets/${projectId}`
            );

            setTickets(response.data.tickets || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to load tickets.'
            );
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        let cancelled = false;

        Promise.resolve().then(() => {
            if (!cancelled) {
                fetchTickets();
            }
        });

        return () => {
            cancelled = true;
        };
    }, [fetchTickets]);

    const handleDragEnd = async ({ active, over }) => {
        if (!over) return;

        const ticket = active.data.current?.ticket;
        const newStatus = String(over.id);

        if (!ticket || ticket.status === newStatus) return;

        const validStatus = columns.some(
            (column) => column.id === newStatus
        );

        if (!validStatus) return;

        try {
            setError('');
            setUpdatingTicketId(ticket.id);

            await API.patch(
                `/tickets/${projectId}/${ticket.id}/status`,
                {
                    status: newStatus,
                }
            );

            await fetchTickets();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to update ticket status.'
            );
        } finally {
            setUpdatingTicketId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <Link
                    to={`/projects/${projectId}/tickets`}
                    className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
                >
                    ← Back to Tickets
                </Link>

                <h1 className="mt-5 text-3xl font-bold text-white">
                    Kanban Board
                </h1>

                <p className="mt-2 text-slate-400">
                    Drag tickets between columns to update their status.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="py-16 text-center text-slate-400">
                    Loading tickets...
                </div>
            ) : (
                <DndContext onDragEnd={handleDragEnd}>
                    <div className="grid gap-5 lg:grid-cols-3">
                        {columns.map((column) => {
                            const columnTickets = tickets.filter(
                                (ticket) => ticket.status === column.id
                            );

                            return (
                                <KanbanColumn
                                    key={column.id}
                                    id={column.id}
                                    title={column.title}
                                    tickets={columnTickets}
                                >
                                    {columnTickets.length > 0 ? (
                                        columnTickets.map((ticket) => (
                                            <KanbanTicketCard
                                                key={ticket.id}
                                                ticket={ticket}
                                                projectId={projectId}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-slate-700 p-5 text-center text-sm text-slate-500">
                                            No tickets in this column.
                                        </div>
                                    )}
                                </KanbanColumn>
                            );
                        })}
                    </div>
                </DndContext>
            )}

            {updatingTicketId && (
                <p className="text-sm text-blue-400">
                    Updating ticket status...
                </p>
            )}
        </div>
    );
};

export default KanbanBoard;