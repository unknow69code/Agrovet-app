// components/UserProfile.tsx
"use client";

import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { UserCircleIcon } from '@heroicons/react/24/outline'; // Icono de perfil
import { FingerPrintIcon, EnvelopeIcon, TagIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'; // Otros iconos útiles

// Interfaz para los datos de sesión (puedes importarla si la definiste en otro archivo)
interface UserSession {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    expires: string;
}

function UserProfile() {
    const [sessionData, setSessionData] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                // En un entorno real, esto podría ser un hook de tu librería de auth (ej. NextAuth.js)
                // O una llamada a tu API para obtener la sesión actual
                // Para este ejemplo, simulamos la respuesta de la imagen
                const response = await fetch('/api/auth/session'); // La ruta que mostraste en tu imagen

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Error al cargar la sesión');
                }

                const data: UserSession = await response.json();
                setSessionData(data);
                enqueueSnackbar('Datos de sesión cargados!', { variant: 'success' });
            } catch (err: any) {
                console.error('Error al cargar la sesión:', err);
                setError(err.message || 'Hubo un error al cargar los datos de sesión.');
                enqueueSnackbar(err.message || 'Error al cargar sesión.', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-600">Cargando perfil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
                <p>{error}</p>
            </div>
        );
    }

    if (!sessionData || !sessionData.user) {
        return (
            <div className="text-center p-4 bg-yellow-100 text-yellow-700 rounded-md">
                <p>No se encontraron datos de sesión para el perfil.</p>
                <p>Asegúrate de que el usuario esté autenticado.</p>
            </div>
        );
    }

    const { user, expires } = sessionData;

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 my-8">
            <div className="flex flex-col items-center mb-6">
                <UserCircleIcon className="h-24 w-24 text-blue-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600 text-lg">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                    <FingerPrintIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <strong>ID:</strong> <span className="ml-2">{user.id}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <strong>Email:</strong> <span className="ml-2">{user.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <TagIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <strong>Rol:</strong> <span className="ml-2">{user.role}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <strong>Sesión Expira:</strong> <span className="ml-2">{new Date(expires).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;