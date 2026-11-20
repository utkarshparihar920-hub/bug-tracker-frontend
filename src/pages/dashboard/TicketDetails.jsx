import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CommentList from '../../components/comments/CommentList';
import CommentForm from '../../components/comments/CommentForm';

const TicketDetails = () => {
    const { projectId, ticketId } = useParams();
    const { user } = useAuth();

    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    const [error, setError] = useState('');
    const [commentError, setCommentError] = useState('');

    const [editingComment, setEditingComment] = useState(null);

    const fetchComments = useCallback(async () => {
        try {
            setCommentsLoading(true);
            setCommentError('');

            const response = await API.get(
                `/comments/${projectId}/${ticketId}`
            );

            setComments(response.data.comments || []);
        } catch (err) {
            setCommentError(
                err.response?.data?.message ||
                'Failed to load comments.'
            );
        } finally {
            setCommentsLoading(false);
        }
    }, [projectId, ticketId]);

    useEffect(() => {
        let cancelled = false;

        Promise.resolve()
            .then(() => API.get(
                `/tickets/${projectId}/${ticketId}`
            ))
            .then((response) => {
                if (!cancelled) {
                    setTicket(response.data.ticket);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        'Failed to load ticket details.'
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [projectId, ticketId]);

    useEffect(() => {
        let cancelled = false;

        Promise.resolve().then(() => {
            if (!cancelled) {
                fetchComments();
            }
        });

        return () => {
            cancelled = true;
        };
    }, [fetchComments]);

    const handleCommentSubmit = async (formData) => {
        try {
            setCommentSubmitting(true);
            setCommentError('');

            if (editingComment) {
                await API.put(
                    `/comments/${projectId}/${ticketId}/${editingComment.id}`,
                    formData
                );

                setEditingComment(null);
            } else {
                await API.post(
                    `/comments/${projectId}/${ticketId}`,
                    formData
                );
            }

            await fetchComments();
        } catch (err) {
            setCommentError(
                err.response?.data?.message ||
                'Failed to save comment.'
            );
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleDeleteComment = async (comment) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this comment?'
        );

        if (!confirmed) return;

        try {
            setCommentError('');

            await API.delete(
                `/comments/${projectId}/${ticketId}/${comment.id}`
            );

            await fetchComments();

            if (editingComment?.id === comment.id) {
                setEditingComment(null);
            }
        } catch (err) {
            setCommentError(
                err.response?.data?.message ||
                'Failed to delete comment.'
            );
        }
    };

    const formatLabel = (value) => {
        if (!value) return 'N/A';

        return value
            .split('_')
            .map((word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(' ');
    };

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center text-slate-400">
                Loading ticket details...
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="space-y-4">
                <p className="text-red-400">
                    {error || 'Ticket not found.'}
                </p>

                <Link
                    to={`/projects/${projectId}/tickets`}
                    className="text-blue-400 hover:text-blue-300"
                >
                    Back to Tickets
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <Link
                    to={`/projects/${projectId}/tickets`}
                    className="text-sm text-blue-400 hover:text-blue-300"
                >
                    ← Back to Tickets
                </Link>

                <h1 className="mt-4 text-2xl font-bold text-white">
                    {ticket.title}
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                    Ticket ID: {ticket.id}
                </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
                <h2 className="mb-3 text-lg font-semibold text-white">
                    Description
                </h2>

                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                    {ticket.description || 'No description provided.'}
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                    <p className="text-sm text-slate-400">Status</p>
                    <p className="mt-2 font-semibold text-white">
                        {formatLabel(ticket.status)}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                    <p className="text-sm text-slate-400">Priority</p>
                    <p className="mt-2 font-semibold text-white">
                        {formatLabel(ticket.priority)}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                    <p className="text-sm text-slate-400">Type</p>
                    <p className="mt-2 font-semibold text-white">
                        {formatLabel(ticket.type)}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                    <p className="text-sm text-slate-400">Reporter</p>
                    <p className="mt-2 font-semibold text-white">
                        {ticket.reporter_name || 'N/A'}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                    <p className="text-sm text-slate-400">Assignee</p>
                    <p className="mt-2 font-semibold text-white">
                        {ticket.assignee_name || 'Unassigned'}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                    <p className="text-sm text-slate-400">Created At</p>
                    <p className="mt-2 font-semibold text-white">
                        {ticket.created_at
                            ? new Date(ticket.created_at).toLocaleString()
                            : 'N/A'}
                    </p>
                </div>
            </div>

            <div className="space-y-5">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Comments ({comments.length})
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Discuss updates and share information about this ticket.
                    </p>
                </div>

                {commentError && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                        {commentError}
                    </div>
                )}

                <CommentForm
                    key={editingComment?.id || 'new-comment'}
                    initialData={editingComment}
                    onSubmit={handleCommentSubmit}
                    onCancel={() => setEditingComment(null)}
                    loading={commentSubmitting}
                />

                <CommentList
                    comments={comments}
                    currentUserId={user?.id}
                    onEdit={setEditingComment}
                    onDelete={handleDeleteComment}
                    loading={commentsLoading}
                />
            </div>
        </div>
    );
};

export default TicketDetails;