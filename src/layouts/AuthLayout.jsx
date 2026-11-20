import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">

            <div className="w-full max-w-md">

                <div className="mb-8 text-center">
                    <Link
                        to="/"
                        className="text-3xl font-bold tracking-tight text-blue-400"
                    >
                        Bug Tracker
                    </Link>

                    <p className="mt-3 text-sm text-slate-400">
                        Manage projects. Track issues. Work together.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">

                    {title && (
                        <h1 className="text-2xl font-bold text-white">
                            {title}
                        </h1>
                    )}

                    {subtitle && (
                        <p className="mt-2 text-sm text-slate-400">
                            {subtitle}
                        </p>
                    )}

                    <div className="mt-6">
                        {children}
                    </div>

                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} Bug Tracker. All rights reserved.
                </p>

            </div>
        </div>
    );
};

export default AuthLayout;