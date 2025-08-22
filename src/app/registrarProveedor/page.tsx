"use client";
import axios, { AxiosError } from "axios";
import { FormEvent } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { CheckCircle, Mail, PhoneIcon, UserIcon } from "lucide-react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

function RegisterProvedores() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const SignupResponse = await axios.post("api/provedores", {
        nombre: formData.get("name"),
        telefono: formData.get("telefono"),
        correo: formData.get("email"),
      });
      console.log(SignupResponse.data);
      enqueueSnackbar("Proveedor registrado exitosamente.", {
        variant: "success",
      });
      return router.push("/provedores");
    } catch (error) {
      console.log("Error:", error);
      if (error instanceof AxiosError) {
        enqueueSnackbar(error.response?.data.message || "Ocurrió un error", {
          variant: "error",
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">
        <div className="flex flex-col items-center">
          <img src="/veterinario.png" alt="AGROVET" className="h-20 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
            AGROVET Registro de Proveedores.
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Bienvenido a este sistema, a continuacion puedes registrar un
            Proveedor.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          action="#"
          method="POST"
          className="space-y-5"
        >
          <div className="relative">
            <label htmlFor="nombre" className="label">
              Nombre
            </label>
            <div className="relative">
              <UserIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="name"
                id="name"
                required
                className="w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-gray-700"
            >
              telefono
            </label>
            <div className="relative">
              <PhoneIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
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
              Correo
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
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

          <button
            type="submit"
             className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
export default RegisterProvedores;
