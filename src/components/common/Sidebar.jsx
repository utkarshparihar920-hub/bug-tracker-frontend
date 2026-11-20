import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const projectMatch = location.pathname.match(/^\/projects\/([^/]+)/);
    const projectId = projectMatch ? projectMatch[1] : null;

    const workspaceItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '⌂' },
        { name: 'My Projects', path: '/projects', icon: '▦' },
    ];

    const projectItems = projectId
        ? [
            { name: 'Project Overview', path: `/projects/${projectId}`, icon: '◈', end: true },
            { name: 'Tickets', path: `/projects/${projectId}/tickets`, icon: '▤' },
            { name: 'Kanban Board', path: `/projects/${projectId}/kanban`, icon: '▥' },
            { name: 'Project Members', path: `/projects/${projectId}/members`, icon: '♧' },
        ]
        : [];

    const renderNavigationItem = (item) => (
        <NavLink
            key={item.path}
            to={item.path}
            end={item.end ?? true}
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`
            }
        >
            <span className="w-5 text-center text-lg">{item.icon}</span>
            {item.name}
        </NavLink>
    );

    return (
        <aside className="hidden min-h-[calc(100vh-73px)] w-64 shrink-0 border-r border-slate-800 bg-slate-950 p-5 text-white md:block">
            <div>
                <h2 className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Workspace
                </h2>

                <nav className="space-y-2">
                    {workspaceItems.map(renderNavigationItem)}
                </nav>
            </div>

            {projectId && (
                <div className="mt-9 border-t border-slate-800 pt-6">
                    <h2 className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Current Project
                    </h2>

                    <nav className="space-y-2">
                        {projectItems.map(renderNavigationItem)}
                    </nav>
                </div>
            )}

            <div className="mt-10 border-t border-slate-800 pt-5">
                <p className="text-xs leading-6 text-slate-500">
                    Manage projects, track issues, organize tasks, and collaborate with your team.
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;