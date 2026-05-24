"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { ChartType2 } from '@/typeScriptType/dashboard';


export default function Step1(props: {data: ChartType2[]}) {
  return (
     <LineChart style={{ width: '100%', aspectRatio: 1.618,  margin: 'auto' }}  width={600} height={371} responsive data={props.data}>
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