import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import productsJson from "../data/pos_item.json";
import {
  LineChart,
  Line,
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
      salesByProduct[s.itemName] = { itemName: s.itemName, quantity: 0, total: 0 };
    }
    salesByProduct[s.itemName].quantity += s.quantity;
    salesByProduct[s.itemName].total += s.totalPrice;
  });

  const top5Products = Object.values(salesByProduct)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

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
      <h2>Dashboard</h2>

      <Link to="/sales-journal">Go to Sales Journal</Link>


      <div className="summary-cards">
        <div className="card">Revenue: ฿{allTimeRevenue.toLocaleString()}</div>
        <div className="card">Transactions: {sales.length}</div>
        <div className="card">Items Sold: {allTimeQty}</div>
      </div>

      {["daily", "weekly", "monthly"].map((m) => (
        <button key={m} onClick={() => setMode(m)} className={mode === m ? "active" : ""}>
          {m}
        </button>
      ))}

      <h3>Sales Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={grouped}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="totalSales" stroke="#007bff" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Sales by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <h3>Top 5 Products</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total (฿)</th>
          </tr>
        </thead>
        <tbody>
          {top5Products.map((p, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{p.itemName}</td>
              <td>{p.quantity}</td>
              <td>{p.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
