import "./styles.scss";
import React, { useState } from "react";
import randomColor from "randomcolor"; // import the script
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

export default function BarChartComponent({
  columnName = "",
  columnLabel = "",
  chartLabel = "",
  data = [],
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          angle={-15}
          textAnchor="end"
          minTickGap={-120}
          // axisLine={false}
          dataKey="name"
          height={80}
          tick={{ fontSize: 12 }}
        >
          <Label
            value={chartLabel}
            offset={0}
            position="insideBottom"
          />
        </XAxis>
        <YAxis width={20} />
        <Tooltip />
        <Legend verticalAlign="top" align="right" />
        <Bar
          name={columnLabel}
          dataKey={columnName}
          stackId="a"
          fill={randomColor({ seed: columnName })}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
