import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const Dashboard = () => {
    const { user } = useAuth();

    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalTickets: 0,
        openTickets: 0,
        completedTickets: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ticketStatsError, setTicketStatsError] = useState(false);

    const firstName = user?.name?.split(' ')[0] || 'User';

    useEffect(() => {
        let cancelled = false;

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError('');
                setTicketStatsError(false);

                const projectResponse = await API.get('/projects');

                const projectData = projectResponse.data.projects;

                const projectList = Array.isArray(projectData)
                    ? projectData
                    : [];

                if (cancelled) return;

                setProjects(projectList);

                const ticketResults = await Promise.all(
                    projectList.map(async (project) => {
                        try {
                            const response = await API.get(
                                `/tickets/${project.id}`
                            );

                            const tickets = Array.isArray(response.data.tickets)
                                ? response.data.tickets
                                : [];

                            return {
                                success: true,
                                tickets,
                            };
                        } catch {
                            return {
                                success: false,
                                tickets: [],
                            };
                        }
                    })
                );

                if (cancelled) return;

                const allTickets = ticketResults.flatMap(
                    (result) => result.tickets
                );

                const hasTicketErrors = ticketResults.some(
                    (result) => !result.success
                );

                const completedTickets = allTickets.filter(
                    (ticket) => ticket.status === 'done'
                ).length;

                const openTickets = allTickets.length - completedTickets;

                setStats({
                    totalProjects: projectList.length,
                    totalTickets: allTickets.length,
                    openTickets,
                    completedTickets,
                });

                setTicketStatsError(hasTicketErrors);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        'Unable to load dashboard information.'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchDashboardData();

        return () => {
            cancelled = true;
        };
    }, []);

    const statisticCards = [
        {
            title: 'Total Projects',
            value: stats.totalProjects,
            icon: '◈',
            color: 'text-blue-400',
            background: 'bg-blue-500/10',
            description: 'Your accessible projects',
        },
        {
            title: 'Total Tickets',
            value: stats.totalTickets,
            icon: '▤',
            color: 'text-cyan-400',
            background: 'bg-cyan-500/10',
            description: 'Issues across your projects',
        },
        {
            title: 'Open Tickets',
            value: stats.openTickets,
            icon: '◷',
            color: 'text-amber-400',
            background: 'bg-amber-500/10',
            description: 'Tickets not yet completed',
        },
        {
            title: 'Completed Tickets',
            value: stats.completedTickets,
            icon: '✓',
            color: 'text-emerald-400',
            background: 'bg-emerald-500/10',
            description: 'Successfully completed',
        },
    ];

    return (
        <div className="min-h-screen bg-[#080F1E] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* Welcome Section */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#142544] via-[#101D35] to-[#0C1528] p-7 sm:p-10">
                    <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                            <span className="h-2 w-2 rounded-full bg-blue-400" />
                            WORKSPACE OVERVIEW
                        </span>

                        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Welcome back, {firstName}!
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                            Manage your projects, track issues, organize
                            your team's work and monitor progress from
                            one centralized workspace.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                to="/projects"
                                className="inline-flex items-center gap-3 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500"
                            >
                                Explore Projects →
                            </Link>

                            <Link
                                to="/projects"
                                className="inline-flex items-center rounded-lg border border-slate-600 bg-slate-900/40 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                            >
                                Create Project +
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section>
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-white sm:text-2xl">
                            Workspace Statistics
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            An overview of your projects and tickets.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-800 bg-[#101A2D]">
                            <div className="text-center">
                                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
                                <p className="text-sm text-slate-400">
                                    Loading workspace statistics...
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-300">
                            {error}
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {statisticCards.map((card) => (
                                <div
                                    key={card.title}
                                    className="rounded-2xl border border-slate-800 bg-[#101A2D] p-5 transition hover:border-slate-700"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-400">
                                                {card.title}
                                            </p>

                                            <h3 className="mt-3 text-3xl font-bold text-white">
                                                {card.value}
                                            </h3>
                                        </div>

                                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${card.background} ${card.color}`}>
                                            {card.icon}
                                        </div>
                                    </div>

                                    <p className="mt-4 text-xs text-slate-500">
                                        {card.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {ticketStatsError && !loading && (
                        <p className="mt-3 text-xs text-amber-400">
                            Some project ticket statistics could not be loaded.
                            The displayed ticket totals may be incomplete.
                        </p>
                    )}
                </section>

                {/* Recent Projects */}
                <section>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-white sm:text-2xl">
                                Your Projects
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Quickly access your project workspaces.
                            </p>
                        </div>

                        <Link
                            to="/projects"
                            className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                        >
                            View All Projects →
                        </Link>
                    </div>

                    {!loading && !error && (
                        projects.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-700 bg-[#101A2D] px-6 py-12 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-2xl text-blue-400">
                                    ◈
                                </div>

                                <h3 className="mt-5 text-lg font-semibold text-white">
                                    No Projects Yet
                                </h3>

                                <p className="mt-2 text-sm text-slate-400">
                                    Create your first project to start managing tickets.
                                </p>

                                <Link
                                    to="/projects"
                                    className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                                >
                                    Go to Projects
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {projects.slice(0, 4).map((project) => (
                                    <div
                                        key={project.id}
                                        className="rounded-2xl border border-slate-800 bg-[#101A2D] p-5 transition hover:border-blue-500/40"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
                                                ◈
                                            </div>

                                            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                                                {project.role || 'Member'}
                                            </span>
                                        </div>

                                        <h3 className="mt-5 break-words text-lg font-bold text-white">
                                            {project.name || project.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-slate-400">
                                            {project.description || 'No description provided.'}
                                        </p>

                                        <div className="mt-5 grid grid-cols-2 gap-2">
                                            <Link
                                                to={`/projects/${project.id}/tickets`}
                                                className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2.5 text-center text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/15"
                                            >
                                                Tickets
                                            </Link>

                                            <Link
                                                to={`/projects/${project.id}/kanban`}
                                                className="rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-2.5 text-center text-sm font-semibold text-purple-400 transition hover:bg-purple-500/15"
                                            >
                                                Kanban Board
                                            </Link>

                                            <Link
                                                to={`/projects/${project.id}`}
                                                className="col-span-2 rounded-lg border border-slate-700 px-3 py-2.5 text-center text-sm font-medium text-slate-300 transition hover:border-blue-500/40 hover:text-white"
                                            >
                                                Project Overview →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </section>

                {/* Workspace Information */}
                <section className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-[#101A2D] p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-lg text-purple-400">
                                ◉
                            </div>

                            <h3 className="font-semibold text-white">
                                Stay Organized
                            </h3>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-400">
                            Keep your projects, tasks and team activities
                            organized in one centralized workspace.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#101A2D] p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-lg text-emerald-400">
                                ✓
                            </div>

                            <h3 className="font-semibold text-white">
                                Track Your Progress
                            </h3>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-400">
                            Monitor tickets, update their statuses and
                            collaborate with your project members.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Dashboard;