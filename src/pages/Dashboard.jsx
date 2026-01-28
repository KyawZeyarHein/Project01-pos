import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import productsJson from "../data/pos_item.json";

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
  if (localStorage.getItem("sales") === null) {
    localStorage.setItem("sales", JSON.stringify(seedSales));
    return seedSales;
  }
  return JSON.parse(localStorage.getItem("sales")) || [];
}

function startOfWeek(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

function formatMonth(dateStr) {
  return dateStr.slice(0, 7); // YYYY-MM
}

function groupSales(sales, mode) {
  const groups = {};
  for (const sale of sales) {
    let key;
    if (mode === "daily") key = sale.date;
    else if (mode === "weekly") key = startOfWeek(sale.date);
    else key = formatMonth(sale.date);

    if (!groups[key]) groups[key] = { period: key, totalSales: 0, totalQty: 0, count: 0 };
    groups[key].totalSales += sale.totalPrice;
    groups[key].totalQty += sale.quantity;
    groups[key].count += 1;
  }
  return Object.values(groups).sort((a, b) => b.period.localeCompare(a.period));
}

function Dashboard() {
  const [sales, setSales] = useState([]);
  const [mode, setMode] = useState("daily");

  useEffect(() => {
    getProducts();
    setSales(getSales());
  }, []);

  const allTimeTotal = useMemo(
    () => sales.reduce((sum, s) => sum + s.totalPrice, 0),
    [sales]
  );

  const allTimeQty = useMemo(
    () => sales.reduce((sum, s) => sum + s.quantity, 0),
    [sales]
  );

  const grouped = useMemo(() => groupSales(sales, mode), [sales, mode]);

  const modeLabel = mode === "daily" ? "Day" : mode === "weekly" ? "Week Starting" : "Month";

  const salesByProduct = {};

sales.forEach((sale) => {
  if (!salesByProduct[sale.itemName]) {
    salesByProduct[sale.itemName] = {
      itemName: sale.itemName,
      quantity: 0,
      total: 0,
    };
  }

  salesByProduct[sale.itemName].quantity += sale.quantity;
  salesByProduct[sale.itemName].total += sale.totalPrice;
});

  const top5Products = Object.values(salesByProduct)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
  <div className="container">
    <h2>Dashboard</h2>

    <nav className="nav-links">
      <Link to="/sales-journal">Go to Sales Journal</Link>
    </nav>

    {/* All-time totals */}
    <div className="summary-cards">
      <div className="card">
        <div className="card-label">Total Revenue (All Time)</div>
        <div className="card-value">฿{allTimeTotal.toLocaleString()}</div>
      </div>
      <div className="card">
        <div className="card-label">Total Transactions</div>
        <div className="card-value">{sales.length}</div>
      </div>
      <div className="card">
        <div className="card-label">Total Items Sold</div>
        <div className="card-value">{allTimeQty.toLocaleString()}</div>
      </div>
    </div>

    {/* Period summary */}
    <div className="period-section">
      <h3>Sales Summary by Period</h3>

      <div className="period-selector">
        {["daily", "weekly", "monthly"].map((m) => (
          <button
            key={m}
            className={mode === m ? "active" : ""}
            onClick={() => setMode(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <p>No sales recorded yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>{modeLabel}</th>
              <th>Transactions</th>
              <th>Items Sold</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {grouped.map((g) => (
              <tr key={g.period}>
                <td>{g.period}</td>
                <td>{g.count}</td>
                <td>{g.totalQty}</td>
                <td>฿{g.totalSales.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    {/* Sales by Product */}
    <h3>Sales by Product</h3>

    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Product</th>
          <th>Total Quantity</th>
          <th>Total Sales (฿)</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(salesByProduct).map((p, index) => (
          <tr key={index}>
            <td>{p.itemName}</td>
            <td>{p.quantity}</td>
            <td>{p.total.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3>Top 5 Selling Items</h3>

    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Product</th>
          <th>Quantity Sold</th>
          <th>Total Sales (฿)</th>
        </tr>
      </thead>
      <tbody>
        {top5Products.map((p, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
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

export default Dashboard;
