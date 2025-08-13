// components/MyBarChart.tsx
'use client';

import { ResponsiveBar } from '@nivo/bar';
import { useEffect, useState } from 'react';

// Define las props que el componente MyBarChart recibirá
interface ChartProps {
  data: Array<{ mes: string; [key: string]: string | number }>;
}

export const MyBarChart = ({ data }: ChartProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const coloresPersonalizados = ['#6c8eecff'];

  // Detecta si el usuario está en un dispositivo móvil solo después de montar el componente
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Establece el valor inicial
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Ahora, usa la propiedad 'data' que te llegó
  const keys = Object.keys(data[0]).filter(key => key !== 'mes');

  return (
    <div style={{ height: '400px' }}>
      <ResponsiveBar
        data={data}
        keys={keys} // Usa las claves del objeto de datos
        indexBy="mes"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        axisBottom={{
          tickRotation: isMobile ? -45 : 0,
        }}
        colors={coloresPersonalizados}
        // Otras configuraciones aquí...
      />
    </div>
  );
};