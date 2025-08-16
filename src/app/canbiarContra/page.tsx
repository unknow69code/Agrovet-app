"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

const ChangePasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter(); // ⚠️ Importante: Aquí es donde obtendrías el email del usuario logueado. // Por ejemplo: // const { data: session } = useSession(); // const email = session?.user?.email;

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault(); // Validación de campos vacíos

    if (!password || !confirmPassword) {
      enqueueSnackbar("Por favor, llena todos los campos.", {
        variant: "error",
      });
      return;
    } // Validación de contraseñas

    if (password !== confirmPassword) {
      enqueueSnackbar("Las contraseñas no coinciden", { variant: "error" });
      return;
    }

    try {
      await axios.put("api/contrase", {
        newPassword: password,
      });
      enqueueSnackbar("Contraseña cambiada exitosamente.", {
        variant: "success",
      });
      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        enqueueSnackbar(
          error.response?.data.message || "Error al cambiar la contraseña",
          {
            variant: "error",
          }
        );
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {" "}
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        {" "}
        <h1 className="mb-6 text-center text-2xl font-bold">
          Cambiar Contraseña
        </h1>{" "}
        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          <div>
            {" "}
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Nueva Contraseña{" "}
            </label>{" "}
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <label
              htmlFor="confirm-password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confirmar Contraseña{" "}
            </label>{" "}
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />{" "}
          </div>{" "}
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 p-2 font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Cambiar Contraseña{" "}
          </button>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};

export default ChangePasswordForm;
