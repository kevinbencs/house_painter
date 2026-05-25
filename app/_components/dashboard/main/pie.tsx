"use client"

import { Pie, PieChart, PieLabelRenderProps, PieSectorShapeProps, Sector, Tooltip } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { PieType2 } from '@/typeScriptType/dashboard';


const RADIAN = Math.PI / 180;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28',];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
        return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
};

const MyCustomPie = (props: PieSectorShapeProps) => {
    return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
};

export default function PieChartDefaultIndex({ isAnimationActive = true, data }: { isAnimationActive?: boolean, data: PieType2[] }) {
    return (
        <PieChart style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }} responsive>
            <Pie
                activeShape={{
                    fill: 'red',
                }}
                data={data}
                labelLine={false}
                label={renderCustomizedLabel}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={isAnimationActive}
                shape={MyCustomPie}
            />
            <Tooltip defaultIndex={2} />
            <RechartsDevtools />
        </PieChart>
    );
}