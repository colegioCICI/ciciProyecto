import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Table from './Components/Table';

export default function userIndex({ auth, users  }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Bienvenido {auth.user.name} </h2>}
        >
            <Head title="Usuarios" />
            <Table users={users} ></Table>
        </AuthenticatedLayout>
    );
}
