import { useState } from 'react';

const CommentForm = ({
    initialData = null,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [text, setText] = useState(initialData?.text || '');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim()) {
            setError('Comment cannot be empty.');
            return;
        }

        setError('');

        onSubmit({
            text: text.trim(),
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
            <label className="mb-3 block text-sm font-medium text-slate-300">
                {initialData ? 'Edit Comment' : 'Add a Comment'}
            </label>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your comment here..."
                rows={4}
                maxLength={2000}
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />

            <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                    {text.length}/2000 characters
                </span>
            </div>

            {error && (
                <p className="mt-3 text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="mt-5 flex justify-end gap-3">
                {initialData && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? 'Saving...'
                        : initialData
                            ? 'Update Comment'
                            : 'Post Comment'}
                </button>
            </div>
        </form>
    );
};

export default CommentForm;