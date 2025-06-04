"use client";

import { FormEvent } from "react";
import { useSnackbar } from "notistack";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function LoginUser() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password"),
        redirect: false,
      });

      if (response?.error) {
        enqueueSnackbar("Error al iniciar sesión. Verifica tus credenciales.", { variant: "error" });
        return;
      }
      enqueueSnackbar("Inicio de sesión exitoso", { variant: "success" });
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      enqueueSnackbar("Ocurrió un error inesperado.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-6 py-12 font-sans overflow-hidden"
      style={{
        backgroundImage: 'url("https://img.freepik.com/fotos-premium/animales-granja-armonia_21085-149867.jpg?ga=GA1.1.1732028864.1747241239&semt=ais_items_boosted&w=740")', // <--- ¡Asegúrate de que esta ruta sea correcta!
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Opcional: efecto parallax ligero al scrollear (si la página es scrollable)
      }}
    >
      {/* Overlay para mejorar la legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-0"></div>


      <div className="z-10 w-full max-w-md space-y-8 rounded-2xl bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-12 shadow-xl border border-gray-100 transform transition-transform duration-500 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-200/50">
        <div className="flex flex-col items-center">
          <img
            className="h-24 w-24 mb-6 filter drop-shadow-md animate-pulse-logo"
            src="/veterinario.png"
            alt="Agrovet Logo"
          />
          <h2 className="mt-4 text-center text-4xl font-extrabold text-gray-900 leading-tight tracking-wide">
            Agrovet
            <span className="block text-sm text-indigo-600 mt-1 font-medium uppercase tracking-widest">
              Sistema de Inventario
            </span>
          </h2>
          <p className="mt-4 text-sm text-gray-600 text-center max-w-xs">
            Accede a tu panel de control para gestionar el stock y las operaciones.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-800 px-5 py-3 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 placeholder-gray-400 text-base"
              placeholder="nombre@dominio.com"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-800 px-5 py-3 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 placeholder-gray-400 text-base"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-white font-bold text-lg shadow-md hover:shadow-lg hover:shadow-blue-400/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.062 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Validando Credenciales...' : 'Acceder al Sistema'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginUser;