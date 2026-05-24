"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

const data = [
  {
    name: 'A',
    uv: 400,
    pv: 240,
    amt: 2400,
  },
  {
    name: 'B',
    uv: 300,
    pv: 456,
    amt: 2400,
  },
  {
    name: 'C',
    uv: 300,
    pv: 139,
    amt: 2400,
  },
  {
    name: 'D',
    uv: 200,
    pv: 980,
    amt: 2400,
  },
  {
    name: 'E',
    uv: 278,
    pv: 390,
    amt: 2400,
  },
  {
    name: 'F',
    uv: 189,
    pv: 480,
    amt: 2400,
  },
];

// #endregion
export default function Step1() {
  return (
     <LineChart style={{ width: '100%', aspectRatio: 1.618,  margin: 'auto' }}  width={600} height={371} responsive data={data}>
      <CartesianGrid strokeDasharray="5 5" />
      <XAxis dataKey="name"  />
      <YAxis width="auto"  />
      <Line
        type="monotone"
        dataKey="uv"
        stroke="var(--color-chart-1)"
        dot={{
          fill: 'var(--color-surface-base)',
        }}
        activeDot={{
          stroke: 'var(--color-surface-base)',
        }}
      />
      <Line
        type="monotone"
        dataKey="pv"
        stroke="var(--color-chart-2)"
        dot={{
          fill: 'var(--color-surface-base)',
        }}
        activeDot={{
          stroke: 'var(--color-surface-base)',
        }}
      />
      <RechartsDevtools />
    </LineChart>
  );
}