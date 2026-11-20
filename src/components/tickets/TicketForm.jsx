import { useState } from 'react';

const TicketForm = ({
    initialData = null,
    members = [],
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(
        initialData?.description || ''
    );
    const [type, setType] = useState(initialData?.type || 'bug');
    const [priority, setPriority] = useState(
        initialData?.priority || 'medium'
    );
    const [assigneeId, setAssigneeId] = useState(
        initialData?.assignee_id || ''
    );
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Ticket title is required.');
            return;
        }

        setError('');

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            type,
            priority,
            assignee_id: assigneeId || null,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Ticket Title
                </label>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter ticket title"
                    maxLength={200}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Description
                </label>

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue or task"
                    rows={4}
                    className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Ticket Type
                    </label>

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                    >
                        <option value="bug">Bug</option>
                        <option value="feature_request">Feature Request</option>
                        <option value="task">Task</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Priority
                    </label>

                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Assign To
                </label>

                <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                    <option value="">Unassigned</option>

                    {members.map((member) => (
                        <option
                            key={member.user_id || member.id}
                            value={member.user_id || member.id}
                        >
                            {member.name || member.email || 'Project Member'}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <p className="text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? 'Saving...'
                        : initialData
                            ? 'Update Ticket'
                            : 'Create Ticket'}
                </button>
            </div>

        </form>
    );
};

export default TicketForm;