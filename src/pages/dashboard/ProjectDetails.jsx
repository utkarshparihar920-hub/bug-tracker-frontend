import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../../services/api';

const ProjectDetails = () => {
    const { projectId } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await API.get(`/projects/${projectId}`);
                setProject(response.data.project);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load project details.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const navigationItems = [
        {
            title: 'Tickets',
            description: 'Create, assign and manage project tickets.',
            path: `/projects/${projectId}/tickets`,
            icon: '▤',
            color: 'text-cyan-400',
            background: 'bg-cyan-500/10',
            border: 'hover:border-cyan-500/40',
        },
        {
            title: 'Kanban Board',
            description: 'Organize and move tickets using drag and drop.',
            path: `/projects/${projectId}/kanban`,
            icon: '▥',
            color: 'text-purple-400',
            background: 'bg-purple-500/10',
            border: 'hover:border-purple-500/40',
        },
        {
            title: 'Project Members',
            description: 'View your project team and member roles.',
            path: `/projects/${projectId}/members`,
            icon: '♧',
            color: 'text-emerald-400',
            background: 'bg-emerald-500/10',
            border: 'hover:border-emerald-500/40',
        },
    ];

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#080F1E] text-slate-400">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
                    <p className="text-sm">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[70vh] bg-[#080F1E] px-6 py-12 text-white">
                <div className="mx-auto max-w-4xl rounded-2xl border border-red-500/20 bg-[#101A2D] p-8">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-2xl text-red-400">
                        !
                    </div>

                    <h2 className="text-xl font-semibold">
                        Unable to load project
                    </h2>

                    <p className="mt-2 text-sm text-red-300">{error}</p>

                    <Link
                        to="/projects"
                        className="mt-6 inline-flex text-sm font-medium text-blue-400 transition hover:text-blue-300"
                    >
                        ← Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-[70vh] bg-[#080F1E] px-6 py-12 text-white">
                <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-[#101A2D] p-8">
                    <h2 className="text-xl font-semibold">
                        Project not found
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                        This project may have been deleted or is unavailable.
                    </p>

                    <Link
                        to="/projects"
                        className="mt-6 inline-flex text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                        ← Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    const details = [
        {
            label: 'Your Role',
            value: project.role || 'Project Member',
            style: 'text-blue-400 capitalize',
        },
        {
            label: 'Project ID',
            value: project.id,
            style: 'text-slate-300 break-all text-sm',
        },
        {
            label: 'Created At',
            value: project.created_at
                ? new Date(project.created_at).toLocaleDateString()
                : 'Not available',
            style: 'text-slate-200',
        },
        {
            label: 'Last Updated',
            value: project.updated_at
                ? new Date(project.updated_at).toLocaleDateString()
                : 'Not available',
            style: 'text-slate-200',
        },
    ];

    return (
        <div className="min-h-[70vh] bg-[#080F1E] px-4 py-8 text-white sm:px-6 lg:px-8 lg:py-10">
            <div className="mx-auto max-w-5xl">

                <Link
                    to="/projects"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-blue-400"
                >
                    ← Back to Projects
                </Link>

                {/* Page Heading */}
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                        Workspace / Project Overview
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Project Details
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                        Manage your project workspace and access all project tools.
                    </p>
                </div>

                {/* Project Information */}
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#101A2D] shadow-xl shadow-black/10">

                    <div className="border-b border-slate-800 p-6 sm:p-8">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-xl text-blue-400">
                            ◈
                        </div>

                        <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                            Project Overview
                        </span>

                        <h2 className="mt-5 break-words text-2xl font-bold text-white sm:text-3xl">
                            {project.title || project.name}
                        </h2>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-400 sm:text-base">
                            {project.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Project Information */}
                    <div className="p-6 sm:p-8">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white">
                                Project Information
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Important details about this project.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {details.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-xl border border-slate-800 bg-[#0B1425] p-5 transition hover:border-slate-700"
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        {item.label}
                                    </p>

                                    <p className={`mt-3 font-semibold ${item.style}`}>
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Project Navigation */}
                <div className="mt-10">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white">
                            Project Workspace
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Quickly access the tools and team resources for this project.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.title}
                                to={item.path}
                                className={`group rounded-2xl border border-slate-800 bg-[#101A2D] p-5 transition-all duration-300 hover:-translate-y-1 ${item.border}`}
                            >
                                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${item.background} ${item.color}`}>
                                    {item.icon}
                                </div>

                                <h3 className="text-base font-semibold text-white transition group-hover:text-blue-400">
                                    {item.title}
                                </h3>

                                <p className="mt-2 min-h-10 text-sm leading-6 text-slate-400">
                                    {item.description}
                                </p>

                                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-400">
                                    Open Section
                                    <span className="transition-transform group-hover:translate-x-1">
                                        →
                                    </span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-5">
                    <p className="text-xs text-slate-500">
                        BugTracker Project Workspace
                    </p>

                    <Link
                        to="/projects"
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-blue-500 hover:text-white"
                    >
                        Back to Projects
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;