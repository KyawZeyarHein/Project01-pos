import { useState, useEffect } from "react";
import products from "../data/pos_item.json";


function SalesJournal() {
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");
  const [sales, setSales] = useState([]);

  // Load sales from LocalStorage
  useEffect(() => {
    const savedSales = JSON.parse(localStorage.getItem("sales")) || [];
    setSales(savedSales);
  }, []);

  const product = products.find(p => p.itemName === selectedItem);
  const totalPrice = product ? product.unitPrice * quantity : 0;

  const handleAddSale = () => {
    if (!selectedItem || !date) {
      alert("Please select product and date");
      return;
    }

    const newSale = {
      itemName: product.itemName,
      category: product.category,
      unitPrice: product.unitPrice,
      quantity,
      totalPrice,
      date
    };

    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    localStorage.setItem("sales", JSON.stringify(updatedSales));

    // reset form
    setSelectedItem("");
    setQuantity(1);
    setDate("");
  };

  return (
    <div className="container">
      <h2>Sales Journal</h2>

      {/* Form */}
      <div style={{ marginBottom: "20px" }}>
        <div>
          <label>Product: </label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">Select product</option>
            {products.map((p, index) => (
              <option key={index} value={p.itemName}>
                {p.itemName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Quantity: </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Date: </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <p><b>Total Price:</b> ฿{totalPrice}</p>

        <button onClick={handleAddSale}>Add Sale</button>
      </div>

      {/* Table */}
      <h3>All Transactions</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s, index) => (
            <tr key={index}>
              <td>{s.date}</td>
              <td>{s.itemName}</td>
              <td>{s.category}</td>
              <td>{s.quantity}</td>
              <td>{s.unitPrice}</td>
              <td>{s.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesJournal;
