// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-9xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-4xl font-semibold mb-6 text-center">¡Página no encontrada!</h2>
      <p className="text-lg text-center mb-8 max-w-prose">
        Lo sentimos, la página que buscas no existe. Es posible que hayas introducido la dirección incorrectamente o que la página se haya movido.
      </p>
      <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
          Volver a la página de inicio
      </Link>
    </div>
  );
}