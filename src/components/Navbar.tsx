// @/app/components/Navbar.tsx (or wherever your Navbar component is)
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
  // ... any other Heroicons you're using directly in the navbar
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react"; // Import these types
import { TbChartHistogram } from "react-icons/tb";
import { ThemeSwitcher } from './CambioTema'; 

// Extend the session user type to include 'role'
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user?: User;
  }
}

// === NEW TYPE DEFINITION FOR ICONS ===
// This type allows both Heroicons and react-icons components as icons
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

// === UPDATED INTERFACES FOR NAVIGATION ITEMS ===
interface NavigationItem {
  name: string;
  href: string;
  roles?: string[];
  icon?: NavbarIcon; // Accept both Heroicons and react-icons
  subItems?: SubNavigationItem[];
}

interface SubNavigationItem {
  name: string;
  href: string;
  roles?: string[];
  icon?: NavbarIcon; // Accept both Heroicons and react-icons
}

// Your navigation configuration (ensure you've added the `icon` property to each item/subItem)
const navigationConfig: NavigationItem[] = [
  {
    name: "Home",
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
    name: "Adminstradores",
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
  if (!userRole) return null; // Esperar a que se cargue el rol

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
    <Disclosure as="nav" style={{ backgroundColor: "#1d4ed8" }}>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Botón de menú para móviles */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
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
                      style={{
                        display: item.roles?.includes(userRole) ? "" : "none",
                      }}
                    >
                      <MenuButton className="text-gray-300 hover:bg-blue-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium flex items-center">
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
                      <MenuItems className="absolute top-full left-0 mt-1 w-32 bg-white shadow-md rounded-md z-10">
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
                                      "block px-4 py-2 text-sm whitespace-nowrap flex items-center"
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
                          "text-gray-300 hover:bg-blue-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium flex items-center"
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
                  {({ active }) => (
                    <a // Usamos <a> o <Link> para navegar a la página de perfil
                      href="/userprofile" // O la ruta que corresponda
                      className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-700" : "text-gray-700"
                      }`}
                    >
                      <CircleUserRound className="w-5 h-5 mr-2" />
                      Mi Perfil
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a // Usamos <a> o <Link> para navegar
                      href="/canbiarContra" // O la ruta que corresponda
                      className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-700" : "text-gray-700"
                      }`}
                    >
                      <KeyRound className="w-5 h-5 mr-2" />
                      Cambiar Contraseña
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-700" : "text-gray-700"
                      }`}
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Cerrar sesión
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {filteredNavigation.map((item) =>
            item.subItems ? (
              <Disclosure key={item.name} as="div">
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
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
                          "ml-2 h-5 w-5"
                        )}
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 space-y-1 pl-4">
                      {item.subItems // Optional chaining to prevent undefined error
                        ?.filter((subItem) => subItem.roles?.includes(userRole))
                        .map((subItem) => (
                          <DisclosureButton
                            key={subItem.name}
                            as={Link}
                            href={subItem.href}
                            className={classNames(
                              "block rounded-md py-2 pl-3 pr-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center"
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
                    "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "flex items-center"
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
