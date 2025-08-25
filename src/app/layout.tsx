import type { Metadata } from "next";
import { Providers } from "../components/providers";
import Navbar from "@/components/Navbar";
import { MantineProvider } from "@mantine/core";
import "./globals.css";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Agrovet || Sistema de Inventario",
  description: "Desarrollada por Jose Manuel Mendoza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MantineProvider>
            <Providers>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </Providers>
          </MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
