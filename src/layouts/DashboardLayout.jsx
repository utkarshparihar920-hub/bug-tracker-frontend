import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-white">

            <Navbar />

            <div className="flex">

                <Sidebar />

                <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-7xl">
                        {children}
                    </div>
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;