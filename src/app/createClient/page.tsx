"use client";
import axios, { AxiosError } from "axios";
import { FormEvent } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

function RegisterClient() {

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = new FormData(e.currentTarget);
  
    try {
      const SignupResponse = await axios.post("api/clients", {
        nombre: formData.get("name"),
        cedula: formData.get("identity"),
        direccion: formData.get("address"),
        telefono: formData.get("telefono"),
      });
      console.log(SignupResponse.data);
      enqueueSnackbar('Cliente registrado exitosamente.', { variant: 'success', });
      return router.push('/clientes');
    } catch (error) {
      console.log("Error:", error);
      if (error instanceof AxiosError) {
        enqueueSnackbar(error.response?.data.message || 'Ocurrió un error', { variant: 'error' });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">
        <div className="flex flex-col items-center">
          <img
            src="/veterinario.png"
            alt="AGROVET"
            className="h-20 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
          AGROVET Registro de clientes.
          </h2>
          <p className="mt-2 text-sm text-gray-500">Bienvenido a este sistema, a continuacion puedes registrar un cliente.</p>
        </div>

        <form onSubmit={handleSubmit} action="#" method="POST" className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="identity" className="block text-sm font-medium text-gray-700">
              Documento de identidad
            </label>
            <input
              id="identity"
              name="identity"
              type="text"
              autoComplete="off"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
              direccion
            </label>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="off"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              telefono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="number"
              autoComplete="off"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
export default RegisterClient;
