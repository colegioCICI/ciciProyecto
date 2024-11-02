import React, { useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import DashboardIcon from "../Icons/dashboard";
import UserIcon from "../Icons/users";
import FolderIcon from "../Icons/folder";
import DocumentIcon from "../Icons/document";
import NotificationIcon from "../Icons/notification";
import ReviewIcon from "../Icons/review";
import ObservationIcon from "../Icons/observation";
import Bill from "../Icons/bill";
import Audit from "../Icons/audit";

const Sidebar = () => {
    const { usuariosRoles } = usePage().props;

    const timeoutRef = useRef(null);

    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            window.location.reload();
        }, 1800000); // 30 minutos
    };

    useEffect(() => {
        // Agregar eventos para reiniciar el timeout
        window.addEventListener("mousemove", resetTimeout);
        window.addEventListener("keydown", resetTimeout);

        // Inicializar el timeout al cargar el componente
        resetTimeout();

        // Limpiar eventos y timeout al desmontar el componente
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            window.removeEventListener("mousemove", resetTimeout);
            window.removeEventListener("keydown", resetTimeout);
        };
    }, []);

    const hasPermission = (permission) => {
        return usuariosRoles.roles.some((role) =>
            role.permissions.some((p) => p.permission_name === permission),
        );
    };

    const navigation = [
        {
            href: route("dashboard"),
            name: "Dashboard",
            icon: <DashboardIcon />,
            permission: "view.home",
        },
        {
            href: route("users.index"),
            name: "Usuarios",
            icon: <UserIcon />,
            permission: "view.users",
        },
        {
            href: route("folders.index"),
            name: "Carpetas",
            icon: <FolderIcon />,
            permission: "view.folders",
        },
        {
            href: route("documents.index"),
            name: "Documentos",
            icon: <DocumentIcon />,
            permission: "view.document",
        },
        {
            href: route("reviews.index"),
            name: "Revisiones",
            icon: <ReviewIcon />,
            permission: "view.reviews",
        },
        {
            href: route("observations.index"),
            name: "Observaciones",
            icon: <ObservationIcon />,
            permission: "view.observation",
        },
        {
            href: route("notifications.index"),
            name: "Correos",
            icon: <NotificationIcon />,
            permission: "view.notification",
        },
        {
            href: route("facturas.index"),
            name: "Facturas",
            icon: <Bill />,
            permission: "view.facturas",
        },
        {
            href: route("audits.index"),
            name: "Auditoria",
            icon: <Audit />,
            permission: "manage.audit",
        },
    ];

    return (
        <div className="fixed top-0 left-0 h-full bg-green-700 w-60 p-6 pt-20 border-r overflow-y-auto hidden md:block">
            <div className="flex flex-col items-start mb-6">
                <p className="text-sm text-white">Panel de Administracion</p>
            </div>
            <nav className="mb-6">
                <ul>
                    {navigation.map(
                        (item, index) =>
                            hasPermission(item.permission) && (
                                <li key={index} className="mb-2">
                                    <Link
                                        href={item.href}
                                        className="flex items-center p-2 text-sm font-medium text-white hover:text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        {item.icon}
                                        <span className="ml-3">
                                            {item.name}
                                        </span>
                                    </Link>
                                </li>
                            ),
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
