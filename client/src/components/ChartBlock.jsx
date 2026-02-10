import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

function ChartBlock({ title, avg, yourRent, verdict, insight }) {
  //Force Numbers
  const chartData = [
    {
      name: "Your Rent",
      value: Number(yourRent),
      fill: "#fb923c", // orange
    },
    {
      name: "Market Avg",
      value: Number(avg),
      fill: "#3b82f6", // blue
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>

      <div className="w-full" style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={180}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v) => `₹ ${v}`} />
            <Bar
              dataKey="value"
              animationDuration={1500}
              radius={[6, 6, 0, 0]}
            >
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v) => `₹ ${v}`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center">
        <p
          className={`font-bold text-lg ${
            verdict === "Underpriced"
              ? "text-green-600"
              : verdict === "Overpriced"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {verdict}
        </p>
        <p className="text-sm text-gray-600">{insight}</p>
      </div>
    </div>
  );
}

export default ChartBlock;
