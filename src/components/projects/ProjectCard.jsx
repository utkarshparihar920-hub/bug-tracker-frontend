import { Link } from 'react-router-dom';

const ProjectCard = ({
    project,
    onEdit,
    onDelete,
    deleting = false,
}) => {
    const projectId = project.id;

    const navigationItems = [
        {
            name: 'Overview',
            path: `/projects/${projectId}`,
            icon: '◈',
            color: 'text-blue-400',
            hover: 'hover:bg-blue-500/10 hover:border-blue-500/40',
        },
        {
            name: 'Tickets',
            path: `/projects/${projectId}/tickets`,
            icon: '▤',
            color: 'text-cyan-400',
            hover: 'hover:bg-cyan-500/10 hover:border-cyan-500/40',
        },
        {
            name: 'Kanban Board',
            path: `/projects/${projectId}/kanban`,
            icon: '▥',
            color: 'text-purple-400',
            hover: 'hover:bg-purple-500/10 hover:border-purple-500/40',
        },
        {
            name: 'Members',
            path: `/projects/${projectId}/members`,
            icon: '♧',
            color: 'text-emerald-400',
            hover: 'hover:bg-emerald-500/10 hover:border-emerald-500/40',
        },
    ];

    return (
        <div className="group rounded-2xl border border-slate-700/70 bg-slate-800/80 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-blue-950/30">

            {/* Project Header */}
            <div className="mb-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-xl font-bold text-blue-400">
                        {(project.name || project.title || 'P')
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                        {project.role || 'Member'}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                    {project.name || project.title}
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-6 text-slate-400">
                    {project.description || 'No description provided.'}
                </p>
            </div>

            {/* Project Navigation */}
            <div className="border-t border-slate-700/70 pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Project Workspace
                </p>

                <div className="grid grid-cols-2 gap-2">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-3 text-sm font-medium text-slate-300 transition-all ${item.hover}`}
                        >
                            <span className={`text-lg ${item.color}`}>
                                {item.icon}
                            </span>

                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Project Actions */}
            <div className="mt-5 flex gap-3 border-t border-slate-700/70 pt-4">
                <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className="flex-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
                >
                    Edit Project
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(project)}
                    disabled={deleting}
                    className="flex-1 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {deleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;