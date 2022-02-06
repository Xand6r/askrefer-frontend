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
} from "recharts";

export default function App({ columnName = "", columnLabel = "", data = [] }) {
  return (
    <BarChart
      width={500}
      height={300}
      data={data}

    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        angle={-45}
        textAnchor="end" 
        minTickGap={-200}
        // axisLine={false}
        dataKey="name"
        height={50}
        tick={{fontSize: 12}} 
      />
      <YAxis />
      <Tooltip />
      {/* <Legend verticalAlign="middle" align="right" /> */}
      <Bar
        name={columnLabel}
        dataKey={columnName}
        stackId="a"
        fill={randomColor({ seed: columnName })}
      />
    </BarChart>
  );
}
