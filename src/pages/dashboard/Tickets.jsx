import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import API from '../../services/api';
import TicketForm from '../../components/tickets/TicketForm';

const Tickets = () => {
    const { projectId } = useParams();

    const [tickets, setTickets] = useState([]);
    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
        type: '',
    });

    const fetchTickets = useCallback(async () => {
        try {
            const params = {};

            Object.entries(filters).forEach(([key, value]) => {
                if (value.trim()) {
                    params[key] = value.trim();
                }
            });

            const response = await API.get(
                `/tickets/${projectId}`,
                { params }
            );

            setTickets(response.data.tickets || []);
            setError('');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to load tickets. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }, [projectId, filters]);

    const fetchMembers = useCallback(async () => {
        try {
            const response = await API.get(
                `/projects/${projectId}/members`
            );

            const result = response.data;

            const memberList = Array.isArray(result)
                ? result
                : Array.isArray(result.members)
                    ? result.members
                    : Array.isArray(result.data)
                        ? result.data
                        : [];

            setMembers(memberList);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to load project members.'
            );
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

    useEffect(() => {
        let cancelled = false;

        Promise.resolve().then(() => {
            if (!cancelled) {
                fetchMembers();
            }
        });

        return () => {
            cancelled = true;
        };
    }, [fetchMembers]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCreate = async (formData) => {
        try {
            setSaving(true);
            setError('');

            await API.post(`/tickets/${projectId}`, {
                ...formData,
                assigneeId: formData.assignee_id || null,
            });

            setShowForm(false);
            await fetchTickets();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to create ticket.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (formData) => {
        try {
            setSaving(true);
            setError('');

            await API.put(
                `/tickets/${projectId}/${editingTicket.id}`,
                {
                    ...formData,
                    assigneeId: formData.assignee_id || null,
                }
            );

            setEditingTicket(null);
            setShowForm(false);
            await fetchTickets();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to update ticket.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (ticketId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this ticket?'
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');

            await API.delete(
                `/tickets/${projectId}/${ticketId}`
            );

            await fetchTickets();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to delete ticket.'
            );
        }
    };

    const handleStatusChange = async (ticketId, status) => {
        try {
            setError('');

            await API.patch(
                `/tickets/${projectId}/${ticketId}/status`,
                { status }
            );

            await fetchTickets();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to update ticket status.'
            );
        }
    };

    const openCreateForm = () => {
        setEditingTicket(null);
        setShowForm(true);
    };

    const openEditForm = (ticket) => {
        setEditingTicket(ticket);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingTicket(null);
    };

    const formatLabel = (value) => {
        if (!value) return 'N/A';

        return value
            .split('_')
            .map((word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(' ');
    };

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center text-slate-400">
                Loading tickets...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Project Tickets
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Manage and track your project tickets.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateForm}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Create Ticket
                </button>
            </div>

            {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                    <h2 className="mb-5 text-lg font-semibold text-white">
                        {editingTicket ? 'Edit Ticket' : 'Create Ticket'}
                    </h2>

                    <TicketForm
                        key={editingTicket?.id || 'new-ticket'}
                        initialData={editingTicket}
                        members={members}
                        loading={saving}
                        onSubmit={
                            editingTicket
                                ? handleUpdate
                                : handleCreate
                        }
                        onCancel={closeForm}
                    />
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search tickets..."
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                />

                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                    <option value="">All Statuses</option>
                    <option value="to_do">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>

                <select
                    name="priority"
                    value={filters.priority}
                    onChange={handleFilterChange}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>

                <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                    <option value="">All Types</option>
                    <option value="bug">Bug</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="task">Task</option>
                </select>
            </div>

            <div className="space-y-4">
                {tickets.length === 0 ? (
                    <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">
                        <h3 className="text-lg font-semibold text-white">
                            No tickets found
                        </h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Create a ticket or change your filters.
                        </p>
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="rounded-xl border border-slate-700 bg-slate-900 p-5"
                        >
                            <div className="flex flex-col justify-between gap-4 sm:flex-row">
                                <div className="min-w-0 flex-1">
                                    <Link
                                        to={`/projects/${projectId}/tickets/${ticket.id}`}
                                        className="text-lg font-semibold text-white hover:text-blue-400"
                                    >
                                        {ticket.title}
                                    </Link>

                                    <p className="mt-2 text-sm text-slate-400">
                                        {ticket.description || 'No description provided.'}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-400">
                                            {formatLabel(ticket.type)}
                                        </span>

                                        <span className="rounded-full bg-purple-500/10 px-3 py-1 text-purple-400">
                                            {formatLabel(ticket.priority)}
                                        </span>

                                        <span className="rounded-full bg-slate-700 px-3 py-1 text-slate-300">
                                            Reporter: {ticket.reporter_name || 'N/A'}
                                        </span>

                                        <span className="rounded-full bg-slate-700 px-3 py-1 text-slate-300">
                                            Assignee: {ticket.assignee_name || 'Unassigned'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 sm:w-44">
                                    <select
                                        value={ticket.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                ticket.id,
                                                e.target.value
                                            )
                                        }
                                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                                    >
                                        <option value="to_do">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>

                                    <button
                                        type="button"
                                        onClick={() => openEditForm(ticket)}
                                        className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                                    >
                                        Edit Ticket
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(ticket.id)}
                                        className="rounded-lg border border-red-500/40 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                    >
                                        Delete Ticket
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Tickets;