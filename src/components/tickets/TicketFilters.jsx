const TicketFilters = ({
    filters,
    onFilterChange,
}) => {
    const handleChange = (e) => {
        const { name, value } = e.target;

        onFilterChange({
            ...filters,
            [name]: value,
        });
    };

    const handleReset = () => {
        onFilterChange({
            search: '',
            status: '',
            priority: '',
            type: '',
        });
    };

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="lg:col-span-4">
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Search Tickets
                    </label>

                    <input
                        type="text"
                        name="search"
                        value={filters.search || ''}
                        onChange={handleChange}
                        placeholder="Search by ticket title or description..."
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Status
                    </label>

                    <select
                        name="status"
                        value={filters.status || ''}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="to_do">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Priority
                    </label>

                    <select
                        name="priority"
                        value={filters.priority || ''}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-blue-500"
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Type
                    </label>

                    <select
                        name="type"
                        value={filters.type || ''}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="bug">Bug</option>
                        <option value="feature_request">Feature Request</option>
                        <option value="task">Task</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="w-full rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                    >
                        Reset Filters
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TicketFilters;