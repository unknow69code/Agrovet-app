"use client";
import axios, { AxiosError } from "axios";
import { FormEvent } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  IdentificationIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { CheckCircle } from "lucide-react";

function RegisterUser() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const SignupResponse = await axios.post("api/auth/signup", {
        nombre: formData.get("name"),
        cedula: formData.get("identity"),
        telefono: formData.get("telefono"),
        direccion: formData.get("address"),
        correo: formData.get("email"),
        password: formData.get("password"),
      });
      console.log(SignupResponse.data);
      enqueueSnackbar("Trabajador registrado exitosamente.", {
        variant: "success",
      });
      return router.push("/trabajadores");
    } catch (error) {
      console.log("Error:", error);
      if (error instanceof AxiosError) {
        enqueueSnackbar(
          error.response?.data.message || "Ocurrió un error revisa tus datos",
          { variant: "error" }
        );
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-lg">
        <div className="flex flex-col items-center">
          <img
            src="/veterinario.png"
            alt="Icon Company"
            className="h-12 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
            AGROVET Registro de trabajadores.
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Bienvenido a este sistema, a continuación puede registrar un nuevo
            trabajador.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          action="#"
          method="POST"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="relative">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre Completo
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1 w-full pl-10 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="identity"
                className="block text-sm font-medium text-gray-700"
              >
                Documento de Identidad
              </label>
              <div className="relative">
                <IdentificationIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="identity"
                  name="identity"
                  type="text"
                  autoComplete="off"
                  required
                  className="mt-1 w-full pl-10 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Dirección
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="off"
                  required
                  className="mt-1 w-full pl-10 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-gray-700"
              >
                Teléfono
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="telefono"
                  name="telefono"
                  type="number"
                  autoComplete="off"
                  required
                  className="mt-1 w-full pl-10 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 w-full pl-10 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 w-full pl-10 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterUser;