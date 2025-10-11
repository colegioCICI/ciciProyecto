import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import SimpleBarChart from "@/Components/SimpleBarChart";

export default function Dashboard({ 
    auth, 
    usuariosRoles, 
    folders,
    stats,
    tramitesData,
    tramitesRecientes,
    timelineData,
    reviewStatusData
}) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            usuariosRoles={usuariosRoles}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Estadísticas principales simplificadas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Tarjeta de Carpetas */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Total Carpetas</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.total_carpetas}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Documentos */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Total Documentos</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.total_documentos}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Documentos Revisados */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-emerald-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Documentos Revisados</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.documentos_revisados}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Observaciones */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Observaciones Activas</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.observaciones_activas}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Primera fila - Trámites Recientes y Estados de Revisión */}
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
                        {/* Trámites Recientes */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Trámites Recientes</h3>
                                <div className="space-y-3">
                                    {tramitesRecientes.map((tramite, index) => (
                                        <div key={tramite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div 
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: tramite.color }}
                                                ></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {tramite.tramite}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {tramite.propietario}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span 
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                    style={{ 
                                                        backgroundColor: `${tramite.color}20`,
                                                        color: tramite.color
                                                    }}
                                                >
                                                    {tramite.estado}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {tramite.fecha}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>                       
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}