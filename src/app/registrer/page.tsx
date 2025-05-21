"use client";
import axios, { AxiosError } from "axios";
import { FormEvent } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

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
            Bienvenido a este sistema a contianuacion puede registrar un nuevo
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
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="input"
              />
            </div>

            <div>
              <label
                htmlFor="identity"
                className="block text-sm font-medium text-gray-700"
              >
                Documento de Identidad
              </label>
              <input
                id="identity"
                name="identity"
                type="text"
                autoComplete="off"
                required
                className="input"
              />
            </div>

            <div>
              <label
                htmlFor="direccion"
                className="block text-sm font-medium text-gray-700"
              >
                direccion
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="off"
                required
                className="input"
              />
            </div>

            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-gray-700"
              >
                telefono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="number"
                autoComplete="off"
                required
                className="input"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="*******"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default RegisterUser;
