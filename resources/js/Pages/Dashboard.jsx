import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import SimpleBarChart from "@/Components/SimpleBarChart";

export default function Dashboard({ auth,usuariosRoles, folders }) {

    const data = [
        { name: 'January', weight: 300 },
        { name: 'February', weight: 50 },
        { name: 'March', weight: 7 },
        { name: 'April', weight: 90 },
        { name: 'May', weight: 6 }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            usuariosRoles={usuariosRoles}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Bienvenido</h2>}
        >
            <Head title="Dashboard" />
            <SimpleBarChart data={folders} />
        </AuthenticatedLayout>
    );
}
