/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...otras configuraciones que puedas tener...

  async rewrites() {
    return [
      {
        source: '/cuentas/pendientes', // <-- La URL que quieres que el usuario VEA
        destination: '/deudas',      // <-- La ruta REAL de tu página
      },
      // Puedes agregar más reglas aquí
      // Ejemplo:
      // {
      //   source: '/perfil-admin',
      //   destination: '/admin',
      // },
    ];
  },
};

export default nextConfig;