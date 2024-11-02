import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}
            <form
                onSubmit={submit}
                className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 max-w-md mx-auto"
            >
                <div className="mb-6">
                    <InputLabel
                        htmlFor="email"
                        value="Correo Electronico"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 transition duration-150 ease-in-out"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError
                        message={errors.email}
                        className="mt-2 text-red-500 text-xs italic"
                    />
                </div>
                <div className="mb-6">
                    <InputLabel
                        htmlFor="password"
                        value="Contraseña"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 transition duration-150 ease-in-out"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <InputError
                        message={errors.password}
                        className="mt-2 text-red-500 text-xs italic"
                    />
                </div>
                <div className="mb-6">
                    <label className="flex items-center">
                        {/* <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Remember me
                        </span> */}
                    </label>
                </div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out focus:outline-none focus:underline"
                            >
                                {/* Olvidaste tu contraseña? */}
                            </Link>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">

                    <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('register')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Aun no tienes una cuenta?
                    </Link>

                    <PrimaryButton
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 ml-5 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                        >
                            Iniciar Sesión
                        </PrimaryButton>
                </div>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
