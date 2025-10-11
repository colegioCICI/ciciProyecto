import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-green-50 via-white to-green-50">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10">
                {/* Logo container with animation */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="group">
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            
                            {/* Logo */}
                            <img
                                src="/CICI.webp"
                                alt="CICI Logo"
                                className="relative h-28 w-28 rounded-full ring-4 ring-white shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </Link>
                </div>

                {/* Welcome text */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Bienvenido 
                    </h1>
                    <p className="text-gray-600">
                        Inicia sesión para continuar
                    </p>
                </div>

                {/* Card container */}
                <div className="w-full sm:max-w-md">
                    <div className="bg-white backdrop-blur-sm bg-opacity-95 shadow-2xl rounded-2xl border border-green-100 overflow-hidden">
                        {/* Green accent bar */}
                        <div className="h-2 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500"></div>
                        
                        {/* Content */}
                        <div className="px-8 py-8">
                            {children}
                        </div>
                    </div>

                    {/* Footer text */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        © 2024 CICI. Todos los derechos reservados.
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}