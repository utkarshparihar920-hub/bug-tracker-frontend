import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import API from '../../services/api';
import ProjectMembers from '../../components/projects/ProjectMembers';

const ProjectMembersPage = () => {
    const { projectId } = useParams();

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMembers = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const response = await API.get(
                `/projects/${projectId}/members`
            );

            const result = response.data;

            const memberList = Array.isArray(result)
                ? result
                : Array.isArray(result.members)
                    ? result.members
                    : Array.isArray(result.data)
                        ? result.data
                        : [];

            setMembers(memberList);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to load project members.'
            );
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        let cancelled = false;

        Promise.resolve().then(() => {
            if (!cancelled) {
                fetchMembers();
            }
        });

        return () => {
            cancelled = true;
        };
    }, [fetchMembers]);

    return (
        <div className="min-h-[70vh] space-y-8 bg-[#080F1E] px-1 py-4 text-white sm:px-2">

            <div>
                <Link
                    to={`/projects/${projectId}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-blue-400"
                >
                    <span>←</span>
                    Back to Project
                </Link>

                <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                            Workspace / Team
                        </p>

                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Project Members
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                            View the people working on this project and their assigned roles.
                        </p>
                    </div>

                    <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-800 bg-[#101A2D] px-5 py-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-lg text-blue-400">
                            ♙
                        </div>

                        <div>
                            <p className="text-2xl font-bold text-white">
                                {loading ? '—' : members.length}
                            </p>
                            <p className="text-xs text-slate-500">
                                Team Members
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#101A2D] p-5 shadow-xl shadow-black/10 sm:p-7">
                <div className="mb-6 border-b border-slate-800 pb-5">
                    <h2 className="text-lg font-semibold text-white">
                        Team Directory
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        People and roles assigned to this project.
                    </p>
                </div>

                {error && (
                    <div className="mb-5 flex flex-col justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 sm:flex-row sm:items-center">
                        <p className="text-sm text-red-300">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={fetchMembers}
                            className="w-fit rounded-lg border border-red-400/30 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                <ProjectMembers
                    members={members}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default ProjectMembersPage;