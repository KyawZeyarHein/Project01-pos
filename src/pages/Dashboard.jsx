import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import productsJson from "../data/pos_item.json";

function getProducts() {
  const stored = localStorage.getItem("products");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("products", JSON.stringify(productsJson));
  return productsJson;
}

function getSales() {
  return JSON.parse(localStorage.getItem("sales")) || [];
}

// Helpers
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
    getProducts(); // ensure products are seeded
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
    </div>
  );
}

export default Dashboard;
