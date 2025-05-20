"use client";

import { FormEvent } from "react";
import { useSnackbar } from "notistack";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginUser() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

      const response = await signIn("credentials", {
        email: formData.get("email") as string, 
        password: formData.get("password"),   
        redirect: false,
      });
      
      if(response?.error) {
        enqueueSnackbar("Error al iniciar sesión. Verifica tus credenciales.", { variant: "error" });
        return;
      }
      enqueueSnackbar("Inicio de sesión exitoso", { variant: "success" });
      return router.push("/"); }

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-6 py-12">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <img
            className="h-16 w-16"
            src="/veterinario.png"
            alt="Agrovet Logo"
          />
          <h2 className="mt-4 text-center text-2xl font-bold" style={{ color: "#0D47A1" }}>
            Agrovet - Sistema de Inventario
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Inicia sesión para gestionar productos, clientes y stock.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-600 focus:ring-green-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-600 focus:ring-green-600"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-md px-4 py-2 text-white hover:bg-green-800 transition-colors"
              style={{ backgroundColor: "#0D47A1" }}
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default LoginUser;
