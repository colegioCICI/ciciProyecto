import { useState, useEffect } from "react";
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


export default function Navbar({ user }) {
    const { usuariosRoles } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);

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

    // Función para cerrar el menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".nav-menu")) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-16">
            <div className="flex items-center justify-between px-4 h-full">
                <div className="flex items-center">
                    <img
                        src="/CICI.webp"
                        alt="CICI Logo"
                        className="h-12 w-12 rounded-full mr-2"
                    />
                    <div>
                        <h1 className="text-lg font-semibold">CICI</h1>
                        <p className="text-xs text-gray-600">
                            Construyendo Seguro
                        </p>
                    </div>
                </div>

                {/* Botón de hamburguesa para pantallas pequeñas */}
                <div className="relative md:hidden">
                    <button
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                        className="nav-menu flex items-center justify-center w-10 h-10 rounded-full focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg py-1">
                            {navigation.map(
                                (item, index) =>
                                    hasPermission(item.permission) && (
                                        <Link
                                            href={item.href}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {item.icon}
                                            <span className="ml-3">
                                                {item.name}
                                            </span>
                                        </Link>
                                    ),
                            )}
                            <Link
                                href={route("profile.edit")}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Perfil
                            </Link>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Cerrar Sesión
                            </Link>
                        </div>
                    )}
                </div>

                {/* Menú de usuario para pantallas grandes */}
                <div className="hidden md:flex items-center">
                    <button
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                        className="nav-menu flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {user.name}
                        <svg
                            className="ml-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-36 w-48 bg-white border border-gray-200 shadow-lg py-1">
                            <Link
                                href={route("profile.edit")}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Perfil
                            </Link>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Cerrar Sesión
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
