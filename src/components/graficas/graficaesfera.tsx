// components/graficas/AdaptedPieChart.tsx
'use client';

import React from "react";
import { pie, arc, PieArcDatum } from "d3";

// 1. Definimos las props que recibirá el componente
interface ChartProps {
  data: Array<{ name: string; value: number }>;
}

// 2. Definimos una paleta de colores dentro del componente
const colorPalette = [
  { from: "text-pink-400", to: "text-pink-400" },
  { from: "text-purple-400", to: "text-purple-400" },
  { from: "text-indigo-400", to: "text-indigo-400" },
  { from: "text-sky-400", to: "text-sky-400" },
  { from: "text-lime-400", to: "text-lime-400" },
  { from: "text-amber-400", to: "text-amber-400" },
];

// 3. El componente ahora acepta 'data' como prop
export const AdaptedPieChart = ({ data }: ChartProps) => {
  // 4. Combinamos los datos recibidos con nuestra paleta de colores
  const chartData = data.map((item, i) => ({
    ...item,
    colorFrom: colorPalette[i % colorPalette.length].from,
    colorTo: colorPalette[i % colorPalette.length].to,
  }));

  // El resto del código del gráfico permanece igual...
  const radius = Math.PI * 100;
  const gap = 0.02;

  const pieLayout = pie<typeof chartData[0]>()
    .sort(null)
    .value((d) => d.value)
    .padAngle(gap);

  const arcGenerator = arc<PieArcDatum<typeof chartData[0]>>()
    .innerRadius(20)
    .outerRadius(radius)
    .cornerRadius(8);

  const labelRadius = radius * 0.8;
  const arcLabel = arc<PieArcDatum<typeof chartData[0]>>().innerRadius(labelRadius).outerRadius(labelRadius);

  // Usamos 'chartData' en lugar de los datos fijos de antes
  const arcs = pieLayout(chartData);

  const computeAngle = (d: PieArcDatum<typeof chartData[0]>) => {
    return ((d.endAngle - d.startAngle) * 180) / Math.PI;
  };

  const MIN_ANGLE = 20;

  return (
    <div className="p-4">
      <div className="relative mx-auto max-w-[16rem]">
        <svg
          viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
          className="overflow-visible"
        >
          {arcs.map((d, i) => {
            const midAngle = (d.startAngle + d.endAngle) / 2;
            return (
              <g key={i}>
                <path fill={`url(#pieColors-${i})`} d={arcGenerator(d)!} />
                <linearGradient
                  id={`pieColors-${i}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                  gradientTransform={`rotate(${(midAngle * 180) / Math.PI - 90}, 0.5, 0.5)`}
                >
                  <stop offset="0%" stopColor={"currentColor"} className={d.data.colorFrom} />
                  <stop offset="100%" stopColor={"currentColor"} className={d.data.colorTo} />
                </linearGradient>
              </g>
            );
          })}
        </svg>

        <div className="absolute inset-0 pointer-events-none">
          {arcs.map((d: PieArcDatum<typeof chartData[0]>, i) => {
            const angle = computeAngle(d);
            if (angle <= MIN_ANGLE) return null;

            const [x, y] = arcLabel.centroid(d);
            const CENTER_PCT = 50;

            const nameLeft = `${CENTER_PCT + (x / radius) * 40}%`;
            const nameTop = `${CENTER_PCT + (y / radius) * 40}%`;
            const valueLeft = `${CENTER_PCT + (x / radius) * 72}%`;
            const valueTop = `${CENTER_PCT + (y / radius) * 70}%`;

            return (
              <div key={i}>
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 transform text-black font-bold"
                  style={{ left: valueLeft, top: valueTop }}
                >
                  {d.data.value}
                </div>
                <div
                  className="absolute max-w-[80px] truncate text-center text-sm font-medium text-white"
                  style={{
                    left: nameLeft,
                    top: nameTop,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {d.data.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};