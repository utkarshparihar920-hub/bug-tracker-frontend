const ProjectMembers = ({ members = [], loading = false }) => {
    if (loading) {
        return (
            <div className="flex min-h-56 flex-col items-center justify-center text-slate-400">
                <div className="mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
                <p className="text-sm">Loading team members...</p>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#0B1425] px-6 py-12 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-2xl text-slate-400">
                    ♙
                </div>

                <h3 className="text-lg font-semibold text-white">
                    No members found
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                    No members are currently assigned to this project.
                    Project members will appear here when they are added.
                </p>
            </div>
        );
    }

    const getInitials = (name) => {
        if (!name) return 'U';

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase();
    };

    const getRoleStyle = (role) => {
        const normalizedRole = role?.toLowerCase();

        switch (normalizedRole) {
            case 'admin':
                return 'border-purple-500/20 bg-purple-500/10 text-purple-400';

            case 'manager':
                return 'border-blue-500/20 bg-blue-500/10 text-blue-400';

            case 'developer':
                return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';

            case 'viewer':
                return 'border-amber-500/20 bg-amber-500/10 text-amber-400';

            default:
                return 'border-slate-700 bg-slate-800 text-slate-300';
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0B1425]">
            <div className="flex flex-col justify-between gap-2 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                <div>
                    <h2 className="font-semibold text-white">
                        Team Members
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        People assigned to this project
                    </p>
                </div>

                <span className="w-fit rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                    {members.length} {members.length === 1 ? 'Member' : 'Members'}
                </span>
            </div>

            <div className="divide-y divide-slate-800">
                {members.map((member) => (
                    <div
                        key={member.user_id}
                        className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-800/20 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    >
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-sm font-bold text-blue-400">
                                {getInitials(member.name)}
                            </div>

                            <div className="min-w-0">
                                <h3 className="truncate font-semibold text-white">
                                    {member.name || 'Unnamed User'}
                                </h3>

                                <p className="mt-1 break-all text-sm text-slate-400">
                                    {member.email || 'No email available'}
                                </p>
                            </div>
                        </div>

                        <span className={`inline-flex w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getRoleStyle(member.role)}`}>
                            {member.role || 'Member'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectMembers;