import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0B1425] text-white">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

                {/* BRAND */}
                <Link
                    to="/dashboard"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                        <span className="text-xl font-bold">B</span>
                    </div>

                    <span className="text-xl font-bold tracking-tight text-white">
                        Bug<span className="text-blue-400">Tracker</span>
                    </span>
                </Link>

                {/* USER PROFILE AND LOGOUT */}
                <div className="flex items-center gap-3 sm:gap-5">

                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-semibold text-white">
                            {user?.name || 'User'}
                        </p>

                        <p className="text-xs text-slate-400">
                            {user?.email || ''}
                        </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/15 text-sm font-bold text-blue-400">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:border-red-500/40 hover:bg-red-500/20 sm:px-4"
                    >
                        Logout
                    </button>

                </div>
            </div>
        </header>
    );
};

export default Navbar;