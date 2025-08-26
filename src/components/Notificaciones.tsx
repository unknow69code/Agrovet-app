// components/NotificationTray.jsx
"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import useSWR from 'swr';
import { enqueueSnackbar } from 'notistack';

// Fetcher function for SWR
const fetcher = (url: string | URL | Request) => fetch(url).then(res => res.json());

export default function NotificationTray() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications, error, mutate } = useSWR('/api/notificaciones', fetcher, { refreshInterval: 5000 });

  if (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
  if (!notifications) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id_notificacion: any) => {
    try {
      await fetch(`/api/notificaciones/${id_notificacion}`, {
        method: 'PUT'
      });
      // Update the local state to remove the notification
      mutate(notifications.filter((notif: { id_notificacion: any; }) => notif.id_notificacion !== id_notificacion), false);
      enqueueSnackbar("Notificación marcada como leída.", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Error al marcar la notificación como leída.", { variant: "error" });
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative z-50">
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <span role="img" aria-label="notifications" className="text-2xl">
          🔔
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
          <h3 className="px-4 py-2 text-lg font-bold text-gray-800 border-b">Notificaciones</h3>
          {notifications.length === 0 ? (
            <p className="px-4 py-2 text-sm text-gray-500">No hay notificaciones nuevas.</p>
          ) : (
            notifications.map((notif: { id_notificacion: Key | null | undefined; message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; created_at: string | number | Date; }) => (
              <div
                key={notif.id_notificacion}
                className="px-4 py-3 border-b hover:bg-gray-50 transition duration-150 ease-in-out flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleMarkAsRead(notif.id_notificacion)}
                  className="ml-2 px-2 py-1 text-xs text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Leído
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
