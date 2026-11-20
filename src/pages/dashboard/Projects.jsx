import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState('');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [editingProjectId, setEditingProjectId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [updating, setUpdating] = useState(false);
    const [editError, setEditError] = useState('');

    const [deletingProjectId, setDeletingProjectId] = useState(null);

    const fetchProjects = async () => {
        try {
            setError('');
            const response = await API.get('/projects');
            setProjects(response.data.projects || []);
        } catch (err) {
            setError(
                err.response?.data?.message || 'Unable to load projects.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadProjects = async () => {
            try {
                const response = await API.get('/projects');

                if (isMounted) {
                    setProjects(response.data.projects || []);
                    setError('');
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err.response?.data?.message ||
                        'Unable to load projects.'
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadProjects();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!title.trim()) {
            setFormError('Project title is required.');
            return;
        }

        try {
            setCreating(true);

            await API.post('/projects', {
                title: title.trim(),
                description: description.trim(),
            });

            setTitle('');
            setDescription('');
            setShowForm(false);

            await fetchProjects();
        } catch (err) {
            setFormError(
                err.response?.data?.message || 'Unable to create project.'
            );
        } finally {
            setCreating(false);
        }
    };

    const handleEditClick = (project) => {
        setEditingProjectId(project.id);
        setEditTitle(project.title);
        setEditDescription(project.description || '');
        setEditError('');
        setShowForm(false);
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        setEditError('');

        if (!editTitle.trim()) {
            setEditError('Project title is required.');
            return;
        }

        try {
            setUpdating(true);

            await API.put(`/projects/${editingProjectId}`, {
                title: editTitle.trim(),
                description: editDescription.trim(),
            });

            setEditingProjectId(null);
            setEditTitle('');
            setEditDescription('');

            await fetchProjects();
        } catch (err) {
            setEditError(
                err.response?.data?.message || 'Unable to update project.'
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteProject = async (project) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${project.title}"? This will also delete its tickets, comments, and project members.`
        );

        if (!confirmed) return;

        try {
            setDeletingProjectId(project.id);
            setError('');

            await API.delete(`/projects/${project.id}`);

            if (editingProjectId === project.id) {
                setEditingProjectId(null);
            }

            await fetchProjects();
        } catch (err) {
            setError(
                err.response?.data?.message || 'Unable to delete project.'
            );
        } finally {
            setDeletingProjectId(null);
        }
    };

    const inputStyle =
        'w-full rounded-xl border border-slate-700/80 bg-[#0B1425] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10';

    const buttonStyle =
        'rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50';

    return (
        <div className="min-h-screen bg-[#080F1E] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* PAGE HEADER */}
                <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                            <span className="h-2 w-2 rounded-full bg-blue-400" />
                            Workspace
                        </div>

                        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            My Projects
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Organize your work, manage your teams and track progress.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(!showForm);
                            setFormError('');
                            setEditingProjectId(null);
                        }}
                        className={`${buttonStyle} flex items-center justify-center gap-2 bg-blue-600 text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500`}
                    >
                        <span className="text-xl leading-none">
                            {showForm ? '×' : '+'}
                        </span>
                        {showForm ? 'Close Form' : 'Create Project'}
                    </button>
                </section>

                {/* PROJECT SUMMARY */}
                <section className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-[#101A2D] p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">
                                    Total Projects
                                </p>
                                <p className="mt-3 text-3xl font-bold">
                                    {projects.length}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl text-blue-400">
                                ◈
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#101A2D] p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">
                                    Workspace Status
                                </p>
                                <p className="mt-3 text-lg font-semibold text-emerald-400">
                                    Active
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-400">
                                ✓
                            </div>
                        </div>
                    </div>
                </section>

                {/* CREATE PROJECT FORM */}
                {showForm && (
                    <section className="rounded-2xl border border-blue-500/20 bg-[#101A2D] p-6 shadow-xl shadow-black/10 sm:p-8">
                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                                New Workspace Project
                            </p>
                            <h2 className="mt-2 text-xl font-bold">
                                Create a Project
                            </h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Enter the details to get your project started.
                            </p>
                        </div>

                        <form onSubmit={handleCreateProject} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Project Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Website Redesign"
                                    required
                                    className={inputStyle}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the purpose of this project..."
                                    rows="4"
                                    className={`${inputStyle} resize-none`}
                                />
                            </div>

                            {formError && (
                                <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                                    {formError}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className={`${buttonStyle} bg-blue-600 text-white hover:bg-blue-500`}
                                >
                                    {creating ? 'Creating...' : 'Create Project'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormError('');
                                    }}
                                    disabled={creating}
                                    className={`${buttonStyle} border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* PROJECT SECTION */}
                <section>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold">
                                All Projects
                            </h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Manage your projects and team members.
                            </p>
                        </div>

                        {!loading && (
                            <span className="rounded-lg border border-slate-800 bg-[#101A2D] px-3 py-2 text-xs font-medium text-slate-400">
                                {projects.length} project(s)
                            </span>
                        )}
                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div className="rounded-2xl border border-slate-800 bg-[#101A2D] p-12 text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
                            <p className="mt-4 text-sm text-slate-400">
                                Loading your projects...
                            </p>
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {!loading && !error && projects.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-700 bg-[#101A2D] px-6 py-14 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-blue-400">
                                ◈
                            </div>

                            <h3 className="mt-5 text-xl font-bold">
                                No projects yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                                Create your first project and start organizing your team's work.
                            </p>

                            <button
                                type="button"
                                onClick={() => setShowForm(true)}
                                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                            >
                                + Create Your First Project
                            </button>
                        </div>
                    )}

                    {/* PROJECT CARDS */}
                    {!loading && !error && projects.length > 0 && (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {projects.map((project) => (
                                <article
                                    key={project.id}
                                    className="group flex flex-col rounded-2xl border border-slate-800 bg-[#101A2D] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-950/10"
                                >
                                    {editingProjectId === project.id ? (
                                        <form
                                            onSubmit={handleUpdateProject}
                                            className="flex flex-1 flex-col"
                                        >
                                            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                                                Edit Project
                                            </p>

                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                placeholder="Project title"
                                                required
                                                className={`${inputStyle} mt-5`}
                                            />

                                            <textarea
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                placeholder="Project description"
                                                rows="4"
                                                className={`${inputStyle} mt-4 resize-none`}
                                            />

                                            {editError && (
                                                <p className="mt-3 text-sm text-red-400">
                                                    {editError}
                                                </p>
                                            )}

                                            <div className="mt-auto flex flex-wrap gap-3 pt-5">
                                                <button
                                                    type="submit"
                                                    disabled={updating}
                                                    className={`${buttonStyle} flex-1 bg-blue-600 text-white hover:bg-blue-500`}
                                                >
                                                    {updating ? 'Saving...' : 'Save Changes'}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingProjectId(null);
                                                        setEditError('');
                                                    }}
                                                    disabled={updating}
                                                    className={`${buttonStyle} border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700`}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-2xl text-blue-400">
                                                    ◈
                                                </div>

                                                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium capitalize text-blue-400">
                                                    {project.role || 'Member'}
                                                </span>
                                            </div>

                                            <h3 className="mt-6 break-words text-lg font-bold text-white transition group-hover:text-blue-400">
                                                {project.title}
                                            </h3>

                                            <p className="mt-3 min-h-12 flex-1 text-sm leading-6 text-slate-400">
                                                {project.description || 'No description provided.'}
                                            </p>

                                            <div className="mt-6 space-y-3 border-t border-slate-800 pt-5">
                                                <Link
                                                    to={`/projects/${project.id}`}
                                                    className="flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/10"
                                                >
                                                    View Project Details
                                                    <span>→</span>
                                                </Link>

                                                <Link
                                                    to={`/projects/${project.id}/members`}
                                                    className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3 text-sm font-semibold text-purple-400 transition hover:bg-purple-500/10"
                                                >
                                                    Project Members
                                                    <span>→</span>
                                                </Link>
                                            </div>

                                            <div className="mt-5 flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditClick(project)}
                                                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-blue-500/40 hover:text-blue-400"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteProject(project)}
                                                    disabled={deletingProjectId === project.id}
                                                    className="flex-1 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {deletingProjectId === project.id
                                                        ? 'Deleting...'
                                                        : 'Delete'}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Projects;