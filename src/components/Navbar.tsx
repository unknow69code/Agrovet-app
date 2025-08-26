// src/app/components/Navbar.tsx
// Este es un componente de navegación que se integra con Next.js y NextAuth.
// Usa Headless UI para la accesibilidad y Tailwind CSS para el estilizado.

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
  HomeIcon,
  CubeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ListBulletIcon,
  RectangleGroupIcon,
  UserPlusIcon,
  PencilSquareIcon,
  QueueListIcon,
  RectangleStackIcon,
  CreditCardIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState, ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
import { TbChartHistogram } from "react-icons/tb";
import NotificationTray from './Notificaciones';

// Extendemos el tipo de usuario de la sesión para incluir el 'role'
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user?: User;
  }
}

// Tipo de definición para los íconos del Navbar
import { IconType } from "react-icons";
import { CircleUserRound, KeyRound, LogOut, Plus } from "lucide-react";

type NavbarIcon =
  | ForwardRefExoticComponent<
      Omit<SVGProps<SVGSVGElement>, "ref"> & {
        title?: string | undefined;
        titleId?: string | undefined;
      } & RefAttributes<SVGSVGElement>
    >
  | IconType;

// Interfaces para la navegación
interface NavigationItem {
  name: string;
  href: string;
  roles?: string[];
  icon?: NavbarIcon;
  subItems?: SubNavigationItem[];
}

interface SubNavigationItem {
  name: string;
  href: string;
  roles?: string[];
  icon?: NavbarIcon;
}

// Configuración de la navegación (ajustada al orden de la imagen)
const navigationConfig: NavigationItem[] = [
  {
    name: "Hogar",
    href: "/",
    roles: ["admin", "user"],
    icon: HomeIcon,
  },
  {
    name: "Productos",
    href: "/products",
    roles: ["admin", "user"],
    icon: CubeIcon,
    subItems: [
      {
        name: "Nuevo",
        href: "/createProduct",
        roles: ["user", "admin"],
        icon: RectangleGroupIcon,
      },
      {
        name: "Editar",
        href: "/products_edit",
        roles: ["admin", "user"],
        icon: PencilSquareIcon,
      },
      {
        name: "Proveedor",
        href: "/registrarProveedor",
        roles: ["admin", "user"],
        icon: UserPlusIcon,
      },
      {
        name: "Proveedores",
        href: "/provedores",
        roles: ["admin", "user"],
        icon: UsersIcon,
      },
    ],
  },
  {
    name: "Ventas",
    href: "/ventas",
    roles: ["admin", "user"],
    icon: ShoppingCartIcon,
    subItems: [
      {
        name: "Nueva venta",
        href: "/products",
        roles: ["admin", "user"],
        icon: ListBulletIcon,
      },
      {
        name: "Carrito",
        href: "/carritoCompras",
        roles: ["admin", "user"],
        icon: ShoppingCartIcon,
      },
      {
        name: "Historial",
        href: "/historialventa",
        roles: ["admin", "user"],
        icon: TbChartHistogram,
      },
      {
        name: "Estadisticas",
        href: "/graficosVentas",
        roles: ["admin", "user"],
        icon: TbChartHistogram,
      },
    ],
  },
  {
    name: "Deudas",
    href: "/deudas",
    roles: ["admin", "user"],
    icon: CreditCardIcon,
    subItems: [
      {
        name: "Lista",
        href: "/deudas",
        roles: ["admin", "user"],
        icon: QueueListIcon,
      },
      {
        name: "Pagos",
        href: "/registropagos",
        roles: ["admin", "user"],
        icon: RectangleStackIcon,
      },
    ],
  },
  {
    name: "Clientes",
    href: "/clientes",
    roles: ["admin", "user"],
    icon: UserGroupIcon,
    subItems: [
      {
        name: "Lista",
        href: "/clientes",
        roles: ["admin", "user"],
        icon: UsersIcon,
      },
      {
        name: "Nuevo",
        href: "/createClient",
        roles: ["admin", "user"],
        icon: UserPlusIcon,
      },
    ],
  },
  {
    name: "Administradores",
    href: "/admin",
    roles: ["admin"],
    icon: BuildingOfficeIcon,
    subItems: [
      { name: "admins", href: "/admin", roles: ["admin"], icon: UserGroupIcon },
      {
        name: "Nuevo",
        href: "/createAdmin",
        roles: ["admin"],
        icon: UserPlusIcon,
      },
    ],
  },
  {
    name: "Trabajadores",
    href: "/trabajadores",
    roles: ["admin"],
    icon: UserGroupIcon,
    subItems: [
      {
        name: "Trabajadores",
        href: "/trabajadores",
        roles: ["admin"],
        icon: ListBulletIcon,
      },
      {
        name: "Nuevo",
        href: "/registrer",
        roles: ["admin"],
        icon: UserPlusIcon,
      },
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
  if (!userRole) return null;

  const filteredNavigation = navigationConfig.filter((item) => {
    if (item.subItems) {
      return (
        item.roles?.includes(userRole) ||
        item.subItems.some((subItem) => subItem.roles?.includes(userRole))
      );
    }
    return item.roles?.includes(userRole);
  });

  return (
    <Disclosure as="nav" className="bg-blue-600">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Botón de menú para móviles */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-blue-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="sr-only">Abrir menu</span>
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
              <img alt="Logo" src="/veterinario.png" className="h-10 w-10 rounded-full" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {filteredNavigation.map((item) =>
                  item.subItems ? (
                    <Menu
                      as="div"
                      key={item.name}
                      className="relative"
                    >
                      <MenuButton className="text-gray-200 hover:bg-blue-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium flex items-center transition-colors duration-200">
                        {item.icon && (
                          <item.icon
                            className="h-5 w-5 mr-2"
                            aria-hidden="true"
                          />
                        )}
                        {item.name}
                        <ChevronDownIcon
                          className={classNames("ml-1 h-5 w-5 flex-shrink-0")}
                          aria-hidden="true"
                        />
                      </MenuButton>
                      <MenuItems className="absolute top-full left-0 mt-1 w-40 bg-white shadow-lg rounded-md z-10 origin-top-left ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {item.subItems
                            .filter((subItem) =>
                              subItem.roles?.includes(userRole)
                            )
                            .map((subItem) => (
                              <MenuItem key={subItem.name}>
                                {({ active }) => (
                                  <Link
                                    href={subItem.href}
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm whitespace-nowrap flex items-center transition-colors duration-200"
                                    )}
                                  >
                                    {subItem.icon && (
                                      <subItem.icon
                                        className="h-4 w-4 mr-2"
                                        aria-hidden="true"
                                      />
                                    )}
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
                          "text-gray-200 hover:bg-blue-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium flex items-center transition-colors duration-200"
                        )}
                      >
                        {item.icon && (
                          <item.icon
                            className="h-5 w-5 mr-2"
                            aria-hidden="true"
                          />
                        )}
                        {item.name}
                      </Link>
                    )
                  )
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
            {/* Botones de carrito, notificaciones y perfil */}
            <Link
              href="/carritoCompras"
              className="relative rounded-full p-1 text-gray-200 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 focus:outline-hidden mr-2 transition-colors duration-200"
            >
              <span className="sr-only">Ver carrito</span>
              <ShoppingCartIcon className="size-6" aria-hidden="true" />
            </Link>
            
            <NotificationTray />

            {/* Menú de perfil de usuario */}
            <Menu as="div" className="relative ml-2">
              <div>
                <MenuButton className="relative flex rounded-full bg-blue-700 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 focus:outline-hidden">
                  <span className="sr-only">Abrir menú de usuario</span>
                  <img
                    alt="Perfil"
                    src="https://img.freepik.com/vector-gratis/circulo-azul-usuario-blanco_78370-4707.jpg"
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="/userprofile"
                      className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      <CircleUserRound className="w-5 h-5 mr-2" />
                      Mi Perfil
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="/canbiarContra"
                      className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      <KeyRound className="w-5 h-5 mr-2" />
                      Cambiar Contraseña
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Cerrar sesión
                    </a>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* Panel de Navegación Móvil */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {filteredNavigation.map((item) =>
            item.subItems ? (
              <Disclosure key={item.name} as="div">
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-blue-700 hover:text-white transition-colors duration-200">
                      <div className="flex items-center">
                        {item.icon && (
                          <item.icon
                            className="h-6 w-6 mr-3"
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.name}</span>
                      </div>
                      <ChevronDownIcon
                        className={classNames(
                          open ? "rotate-180 transform" : "",
                          "ml-2 h-5 w-5 transition-transform duration-200"
                        )}
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 space-y-1 pl-4">
                      {item.subItems
                        ?.filter((subItem) => subItem.roles?.includes(userRole))
                        .map((subItem) => (
                          <DisclosureButton
                            key={subItem.name}
                            as={Link}
                            href={subItem.href}
                            className={classNames(
                              "block rounded-md py-2 pl-3 pr-4 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center transition-colors duration-200"
                            )}
                          >
                            {subItem.icon && (
                              <subItem.icon
                                className="h-5 w-5 mr-2"
                                aria-hidden="true"
                              />
                            )}
                            {subItem.name}
                          </DisclosureButton>
                        ))}
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            ) : (
              item.roles?.includes(userRole) && (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={classNames(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    "text-gray-200 hover:bg-blue-700 hover:text-white",
                    "flex items-center transition-colors duration-200"
                  )}
                >
                  {item.icon && (
                    <item.icon className="h-6 w-6 mr-3" aria-hidden="true" />
                  )}
                  {item.name}
                </DisclosureButton>
              )
            )
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

export default Navbar;
