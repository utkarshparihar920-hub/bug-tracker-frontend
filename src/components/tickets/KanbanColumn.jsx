import { useDroppable } from '@dnd-kit/core';

const KanbanColumn = ({
    id,
    title,
    tickets = [],
    children,
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex min-h-[400px] flex-col rounded-xl border p-4 transition ${isOver
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-slate-800 bg-slate-900'
                }`}
        >
            <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold text-white">
                    {title}
                </h3>

                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                    {tickets.length}
                </span>
            </div>

            <div className="flex flex-1 flex-col gap-3">
                {children}
            </div>
        </div>
    );
};

export default KanbanColumn;