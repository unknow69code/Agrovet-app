// components/graficas/AdaptedBarChart.tsx
'use client';

import React, { CSSProperties } from "react";
import { scaleBand, scaleLinear, max } from "d3";

// 1. Definimos las props que recibirá el componente
interface ChartProps {
  data: Array<{ name: string; value: number }>;
  sortByValue?: boolean; // Prop opcional para ordenar
}

// 2. Paleta de colores con gradientes de Tailwind
const colorPalette = [
  "from-pink-300 to-pink-400",
  "from-purple-300 to-purple-400",
  "from-indigo-300 to-indigo-400",
  "from-sky-300 to-sky-400",
  "from-orange-200 to-orange-300",
  "from-lime-300 to-lime-400",
];

export const AdaptedBarChart = ({ data, sortByValue = false }: ChartProps) => {
  if (!data || data.length === 0) {
    return <div className="h-72 flex items-center justify-center">No hay datos para mostrar</div>;
  }

  // 3. Combinamos los datos con los colores y los ordenamos si es necesario
  const processedData = data
    .map((item, i) => ({
      key: item.name,
      value: item.value,
      color: colorPalette[i % colorPalette.length],
    }))
    .sort((a, b) => (sortByValue ? b.value - a.value : 0));

  // El resto del código usa `processedData` en lugar de los datos fijos
  const yScale = scaleBand()
    .domain(processedData.map((d) => d.key))
    .range([0, 100])
    .padding(0.175);

  const xScale = scaleLinear()
    .domain([0, max(processedData.map((d) => d.value)) ?? 0])
    .range([0, 100]);

  const longestWord = max(processedData.map((d) => d.key.length)) || 1;

  return (
    <div
      className="relative w-full h-72"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "0px",
          "--marginBottom": "16px",
          "--marginLeft": `${longestWord * 7}px`,
        } as CSSProperties
      }
    >
      {/* Chart Area */}
      <div className="absolute inset-0 z-10 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible">
        {/* Bars */}
        {processedData.map((d, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: "0",
              top: `${yScale(d.key)}%`,
              width: `${xScale(d.value)}%`,
              height: `${yScale.bandwidth()}%`,
              borderRadius: "0 6px 6px 0",
            }}
            className={`bg-gradient-to-r ${d.color}`} // Cambiado a to-r para un mejor efecto
          />
        ))}
        {/* Grid lines */}
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {xScale
            .ticks(5)
            .map((tickValue, i) => (
              <g
                transform={`translate(${xScale(tickValue)},0)`}
                className="text-gray-700"
                key={i}
              >
                <line
                  y1={0}
                  y2={100}
                  stroke="currentColor"
                  strokeDasharray="2,3"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
        </svg>
        {/* X Axis (Values) */}
        {xScale.ticks(5).map((value, i) => (
          <div
            key={i}
            style={{
              left: `${xScale(value)}%`,
              top: "100%",
            }}
            className="absolute -translate-x-1/2 text-xs tabular-nums text-gray-400"
          >
            {value.toLocaleString()}
          </div>
        ))}
      </div>

      {/* Y Axis (Labels) */}
      <div className="h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible">
        {processedData.map((entry, i) => (
          <span
            key={i}
            style={{
              left: "-8px",
              top: `${yScale(entry.key)! + yScale.bandwidth() / 2}%`,
            }}
            className="absolute w-full -translate-y-1/2 text-right text-xs text-gray-400"
          >
            {entry.key}
          </span>
        ))}
      </div>
    </div>
  );
};