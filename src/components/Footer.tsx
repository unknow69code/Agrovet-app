"use client";

import { useSession } from "next-auth/react";

function Footer() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session) return null;

  return (
    <footer style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: '#ffffff', backgroundColor: '#0D47A1' }}>
      <p>&copy; {new Date().getFullYear()} Agrovet. Todos los derechos reservados.</p>
    </footer>
  );
}

export default Footer;
