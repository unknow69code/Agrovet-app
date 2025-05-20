'use client';
import { SnackbarProvider } from 'notistack';
import { SessionProvider } from "next-auth/react";
import { ReactNode } from 'react';

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3000}
    >
      {children}
    </SnackbarProvider>
    </ SessionProvider>
  );
}
