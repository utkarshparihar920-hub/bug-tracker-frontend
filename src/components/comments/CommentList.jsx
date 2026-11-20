const CommentList = ({
    comments = [],
    currentUserId,
    onEdit,
    onDelete,
    loading = false,
}) => {
    if (loading) {
        return (
            <div className="py-6 text-center text-sm text-slate-400">
                Loading comments...
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
                <p className="font-medium text-slate-300">
                    No comments yet
                </p>

                <p className="mt-2 text-sm text-slate-500">
                    Start the conversation by adding a comment.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => {
                const isOwner =
                    currentUserId &&
                    String(comment.user_id) === String(currentUserId);

                return (
                    <div
                        key={comment.id}
                        className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 font-semibold text-blue-400">
                                    {(comment.user_name || 'U')
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <p className="font-medium text-white">
                                        {comment.user_name || 'Unknown User'}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {comment.created_at
                                            ? new Date(comment.created_at).toLocaleString()
                                            : 'Date unavailable'}
                                    </p>
                                </div>
                            </div>

                            {isOwner && (
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(comment)}
                                        className="text-xs font-medium text-blue-400 hover:text-blue-300"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onDelete(comment)}
                                        className="text-xs font-medium text-red-400 hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">
                            {comment.text}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default CommentList;