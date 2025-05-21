"use client";
import Link from "next/link";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Extend the session user type to include 'role'
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user?: User;
  }
}

const navigationConfig = [
  {
    name: "Home",
    href: "/",
    roles: ["admin", "user"], // Roles permitidos
  },
  {
    name: "Productos",
    href: "/products",
    roles: ["admin", "user"],
    subItems: [
      { name: "Productos", href: "/products", roles: ["admin", "user"] },
      { name: "Nuevo Producto", href: "/createProduct", roles: ["user", "admin"] }, // Solo admin
      { name: "Carrito", href: "/carritoCompras", roles: ["admin", "user"] },
    ],
  },
  { name: "Stock", href: "/stock", roles: ["admin", "user"] }, // Solo admin
  {
    name: "Clientes",
    href: "/clientes",
    roles: ["admin", "user"],
    subItems: [
      { name: "Clientes", href: "/clientes", roles: ["admin", "user"] },
      { name: "Nuevo Cliente", href: "/createClient", roles: ["admin", "user"] },
    ],
  },
    {
    name: "Adminstradores",
    href: "/admin",
    roles: ["admin"],
    subItems: [
      { name: "admins", href: "/admin", roles: ["admin"] },
      { name: "Nuevo admin", href: "/createAdmin", roles: ["admin"] },
    ],
  },
  {
    name: "Trabajadores",
    href: "/trabajadores",
    roles: ["admin"],
    subItems: [
      { name: "Trabajadores", href: "/trabajadores", roles: ["admin"] },
      { name: "Nuevo Trabajador", href: "/registrer", roles: ["admin"] },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function Navbar() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role as string);
    }
  }, [session]);

  if (status === "loading") return null;
  if (!session) return null;
  if (!userRole) return null; // Esperar a que se cargue el rol

  const filteredNavigation = navigationConfig.filter((item) => {
    if (item.subItems) {
      return item.roles?.includes(userRole) || item.subItems.some(subItem => subItem.roles?.includes(userRole));
    }
    return item.roles?.includes(userRole);
  });

  return (
    <Disclosure as="nav" style={{ backgroundColor: "#0D47A1" }}>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Botón de menú para móviles */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>

          {/* Logo y navegación */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img alt="Logo" src="/veterinario.png" className="h-10 w-10" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {filteredNavigation.map((item) =>
                  item.subItems ? (
                    <Menu
                      as="div"
                      key={item.name}
                      className="relative"
                      // Solo mostrar el menú si el rol del usuario está permitido para el ítem principal
                      style={{ display: item.roles?.includes(userRole) ? "" : "none" }}
                    >
                      <MenuButton className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium flex items-center">
                        {item.name}
                        <ChevronDownIcon
                          className={classNames("ml-1 h-5 w-5 flex-shrink-0")}
                          aria-hidden="true"
                        />
                      </MenuButton>
                      <MenuItems className="absolute top-full left-0 mt-1 w-32 bg-white shadow-md rounded-md z-10">
                        <div className="py-1">
                          {item.subItems
                            .filter((subItem) => subItem.roles?.includes(userRole))
                            .map((subItem) => (
                              <MenuItem key={subItem.name}>
                                {({ active }) => (
                                  <Link
                                    href={subItem.href}
                                    className={classNames(
                                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                      "block px-4 py-2 text-sm whitespace-nowrap"
                                    )}
                                  >
                                    {subItem.name}
                                  </Link>
                                )}
                              </MenuItem>
                            ))}
                        </div>
                      </MenuItems>
                    </Menu>
                  ) : (
                    item.roles?.includes(userRole) && (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          "text-gray-300 hover:bg-blue-700 hover:text-blue",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </Link>
                    )
                  )
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Link
              href="/carritoCompras"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
            >
              <span className="sr-only">Ver carrito</span>
              <ShoppingCartIcon className="size-6 " aria-hidden="true" />
            </Link>

            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="sr-only">Abrir menú de usuario</span>
                  <img
                    alt="Perfil"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden">
                <MenuItem>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Tu perfil
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Configuración
                  </Link>
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-700" : "text-gray-700"
                      }`}
                    >
                      Cerrar sesión
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* Navegación para móviles */}
      
    </Disclosure>
  );
}

export default Navbar;