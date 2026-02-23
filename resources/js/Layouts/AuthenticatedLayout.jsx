import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";

export default function Authenticated({
    user,
    header,
    usuariosRoles,
    children,
    SESSION_LIFETIME = 120,
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-green-50 flex flex-col">
            {/* Navbar con sombra mejorada */}
            <div className="fixed top-0 left-0 right-0 z-30">
                <Navbar user={user} />
            </div>

            <div className="flex flex-1 pt-16">
                {/* Sidebar mejorado */}
                <aside className="hidden md:block w-64 fixed h-full top-16 z-20">
                    <div className="h-full bg-white shadow-xl border-r border-green-100">
                        {/* Accent bar superior */}
                        <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500"></div>

                        <div className="overflow-y-auto h-full pb-6">
                            <Sidebar usuariosRoles={usuariosRoles} />
                        </div>
                    </div>
                </aside>

                {/* Contenido principal con diseño mejorado */}
                <div className="flex-1 md:ml-64 p-4 sm:p-6 w-full">
                    {header && (
                        <header className="mb-6">
                            <div className="bg-white shadow-lg rounded-xl border border-green-100 overflow-hidden">
                                {/* Accent bar */}
                                <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500"></div>

                                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                    <div className="flex items-center">
                                        {/* Icono decorativo */}
                                        <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 mr-4 shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>

                                        <div className="flex-1">
                                            {header}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>
                    )}

                    <main className="relative">
                        {/* Contenedor con efectos mejorados */}
                        <div className="bg-white shadow-xl rounded-xl border border-green-100 overflow-hidden">
                            {/* Accent bar */}
                            <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500"></div>

                            {/* Contenido */}
                            <div className="p-6 overflow-x-auto">
                                {children}
                            </div>
                        </div>

                        {/* Decoración de fondo sutil */}
                        <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
                        <div className="absolute -z-10 bottom-0 left-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
                    </main>

                    {/* Footer opcional */}
                    <footer className="mt-8 text-center text-sm text-gray-500 pb-4">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span>Sistema CICI © 2024</span>
                        </div>
                    </footer>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                /* Scroll personalizado para el sidebar */
                aside::-webkit-scrollbar {
                    width: 6px;
                }
                aside::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                aside::-webkit-scrollbar-thumb {
                    background: #22c55e;
                    border-radius: 3px;
                }
                aside::-webkit-scrollbar-thumb:hover {
                    background: #16a34a;
                }
            ` }} />
        </div>
    );
}