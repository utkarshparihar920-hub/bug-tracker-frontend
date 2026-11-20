import { useState } from 'react';

const ProjectForm = ({
    initialData = null,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(
        initialData?.description || ''
    );
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Project title is required.');
            return;
        }

        setError('');

        onSubmit({
            title: title.trim(),
            description: description.trim(),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Project Title
                </label>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter project title"
                    maxLength={150}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Description
                </label>

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project"
                    rows={4}
                    className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />
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
                    className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? 'Saving...'
                        : initialData
                            ? 'Update Project'
                            : 'Create Project'}
                </button>
            </div>

        </form>
    );
};

export default ProjectForm;