// app/unauthorized/page.js
import React from 'react';
import Link from 'next/link';

function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Acceso No Autorizado</h1>
        <p className="text-gray-700 mb-4">
          Lo sentimos, no tienes permiso para acceder a esta página.
        </p>
        <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
}

export default UnauthorizedPage;