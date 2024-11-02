import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";

export default function Authenticated({
    user,
    header,
    usuariosRoles,
    children,
}) {
    return (
        <div className="min-h-screen min-w-max bg-green-100 flex flex-col">
            <Navbar user={user} />
            <div className="flex flex-1 pt-16">
                <div className="hidden md:block w-64 fixed h-full top-16 bg-white shadow-lg z-20">
                    <Sidebar usuariosRoles={usuariosRoles} />
                </div>
                {/* Contenido principal de layout*/}
                <div className="flex-1 md:ml-64 p-4 w-full">
                    {header && (
                        <header className="bg-white shadow mb-4">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    <main className="bg-white shadow-sm rounded-lg p-6 overflow-x-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
