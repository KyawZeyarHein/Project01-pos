import { useState, useEffect, useMemo } from "react";
import productsJson from "../data/pos_item.json";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./Dashboard.css";

function getProducts() {
  const stored = localStorage.getItem("products");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("products", JSON.stringify(productsJson));
  return productsJson;
}

const seedSales = [
  { itemName: "HB Pencil", category: "stationary", unitPrice: 5, quantity: 10, totalPrice: 50, date: "2026-01-05" },
  { itemName: "Wireless Mouse", category: "small_it_gadgets", unitPrice: 249, quantity: 2, totalPrice: 498, date: "2026-01-07" },
  { itemName: "Potato Chips Original 50g", category: "snacks", unitPrice: 25, quantity: 5, totalPrice: 125, date: "2026-01-07" },
  { itemName: "Toothpaste 120g", category: "consumer_products", unitPrice: 45, quantity: 3, totalPrice: 135, date: "2026-01-10" },
  { itemName: "Paracetamol 500mg 10 tablets", category: "simple_medicines", unitPrice: 35, quantity: 4, totalPrice: 140, date: "2026-01-12" },
  { itemName: "Ballpoint Pen Blue", category: "stationary", unitPrice: 12, quantity: 20, totalPrice: 240, date: "2026-01-14" },
  { itemName: "USB Flash Drive 32GB", category: "small_it_gadgets", unitPrice: 299, quantity: 1, totalPrice: 299, date: "2026-01-18" },
  { itemName: "Chocolate Bar 45g", category: "snacks", unitPrice: 30, quantity: 8, totalPrice: 240, date: "2026-01-20" },
  { itemName: "Shampoo 200ml", category: "consumer_products", unitPrice: 69, quantity: 2, totalPrice: 138, date: "2026-01-24" },
  { itemName: "Cough Syrup 60ml", category: "simple_medicines", unitPrice: 45, quantity: 3, totalPrice: 135, date: "2026-01-27" },
];

function getSales() {
  const stored = localStorage.getItem("sales");
  if (!stored) {
    localStorage.setItem("sales", JSON.stringify(seedSales));
    return seedSales;
  }
  return JSON.parse(stored);
}

function startOfWeek(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().slice(0, 10);
}

function groupSales(sales, mode) {
  const groups = {};
  sales.forEach((s) => {
    const key =
      mode === "daily"
        ? s.date
        : mode === "weekly"
        ? startOfWeek(s.date)
        : s.date.slice(0, 7);

    if (!groups[key]) {
      groups[key] = { period: key, totalSales: 0, totalQty: 0, count: 0 };
    }

    groups[key].totalSales += s.totalPrice;
    groups[key].totalQty += s.quantity;
    groups[key].count += 1;
  });

  return Object.values(groups).sort((a, b) =>
    a.period.localeCompare(b.period)
  );
}

function formatCategory(name) {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function SalesTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      <div className="tooltip-value">฿{payload[0].value.toLocaleString()}</div>
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{formatCategory(payload[0].name)}</div>
      <div className="tooltip-value">฿{payload[0].value.toLocaleString()}</div>
    </div>
  );
}

function DonutCenterLabel({ viewBox, total }) {
  const { cx, cy } = viewBox;
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" className="donut-center-label">
        Total
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" className="donut-center-value">
        ฿{total.toLocaleString()}
      </text>
    </g>
  );
}

export default function Dashboard() {
  const [sales, setSales] = useState([]);
  const [mode, setMode] = useState("daily");

  useEffect(() => {
    getProducts();
    setSales(getSales());
  }, []);

  const grouped = useMemo(() => groupSales(sales, mode), [sales, mode]);

  const allTimeRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const allTimeQty = sales.reduce((sum, s) => sum + s.quantity, 0);

  const salesByProduct = {};
  sales.forEach((s) => {
    if (!salesByProduct[s.itemName]) {
      salesByProduct[s.itemName] = { itemName: s.itemName, category: s.category, quantity: 0, total: 0 };
    }
    salesByProduct[s.itemName].quantity += s.quantity;
    salesByProduct[s.itemName].total += s.totalPrice;
  });

  const productSalesList = Object.values(salesByProduct).sort((a, b) => b.total - a.total);

  const top5Products = Object.values(salesByProduct)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const maxQty = top5Products.length > 0 ? top5Products[0].quantity : 1;

  const pieData = Object.values(
    sales.reduce((acc, s) => {
      acc[s.category] = acc[s.category] || { name: s.category, value: 0 };
      acc[s.category].value += s.totalPrice;
      return acc;
    }, {})
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-subtitle">Overview of your sales performance</div>
      </div>
      <div className="charts-grid charts-grid--overview">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Sales Overview</h3>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <div className="kpi-list">
              <div className="kpi-card kpi-card--revenue">
                <div className="card-label">Revenue</div>
                <div className="card-value">฿{allTimeRevenue.toLocaleString()}</div>
                <div className="card-subtitle">All time</div>
              </div>
              <div className="kpi-card kpi-card--transactions">
                <div className="card-label">Transactions</div>
                <div className="card-value">{sales.length}</div>
                <div className="card-subtitle">All time</div>
              </div>
              <div className="kpi-card kpi-card--items">
                <div className="card-label">Items Sold</div>
                <div className="card-value">{allTimeQty}</div>
                <div className="card-subtitle">All time</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Sales by Category</h3>
          </div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={2}
                  cornerRadius={4}
                  startAngle={90}
                  endAngle={-270}
                  animationDuration={800}
                  animationEasing="ease-out"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(value) => formatCategory(value)}
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="charts-grid middle">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Sales by Product</h3>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <div className="summary-table-wrap">
              <table className="summary-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Revenue (฿)</th>
                  </tr>
                </thead>
                <tbody>
                  {productSalesList.map((p) => (
                    <tr key={p.itemName}>
                      <td>{p.itemName}</td>
                      <td>{formatCategory(p.category)}</td>
                      <td>{p.quantity}</td>
                      <td>฿{p.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Top 5 Products</h3>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="top5-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product</th>
                  <th>Qty Sold</th>
                  <th>Total (฿)</th>
                </tr>
              </thead>
              <tbody>
                {top5Products.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <span className={`rank-badge rank-badge--${i + 1}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td>{p.itemName}</td>
                    <td>
                      <div className="qty-bar-wrapper">
                        <span className="qty-bar-value">{p.quantity}</span>
                        <div className="qty-bar">
                          <div
                            className="qty-bar-fill"
                            style={{ width: `${(p.quantity / maxQty) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>฿{p.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="charts-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Sales Trend</h3>
            <div className="period-selector">
              {["daily", "weekly", "monthly"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={mode === m ? "active" : ""}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={grouped}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-light)"
                  vertical={false}
                />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                  axisLine={{ stroke: "var(--border-light)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `฿${v}`}
                />
                <Tooltip content={<SalesTooltip />} />
                <Area
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Sales Summary ({mode.charAt(0).toUpperCase() + mode.slice(1)})</h3>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <div className="summary-table-wrap">
              <table className="summary-table">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Revenue (฿)</th>
                    <th>Qty</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped.map((g) => (
                    <tr key={g.period}>
                      <td>{g.period}</td>
                      <td>฿{g.totalSales.toLocaleString()}</td>
                      <td>{g.totalQty}</td>
                      <td>{g.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
