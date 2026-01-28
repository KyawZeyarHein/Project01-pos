import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import productsJson from "../data/pos_item.json";
import "./SalesJournal.css";

function getProducts() {
  const stored = localStorage.getItem("products");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("products", JSON.stringify(productsJson));
  return productsJson;
}

const selectStyles = {
  control: (base) => ({
    ...base,
    background: "#1a1a1a",
    borderColor: "#444",
    color: "#fff",
    minWidth: 340,
  }),
  menu: (base) => ({
    ...base,
    background: "#1e1e1e",
    border: "1px solid #444",
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? "#2a2a3a" : "transparent",
    color: "#fff",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff",
  }),
  input: (base) => ({
    ...base,
    color: "#fff",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#888",
  }),
};

function SalesJournal() {
  const [products, setProducts] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");
  const [sales, setSales] = useState([]);

  const [pendingName, setPendingName] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCategoryOption, setNewCategoryOption] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newInventory, setNewInventory] = useState("");

  useEffect(() => {
    setProducts(getProducts());
    const savedSales = JSON.parse(localStorage.getItem("sales")) || [];
    setSales(savedSales);
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  const options = products.map((p) => ({
    value: p.itemName,
    label: p.itemName,
  }));

  const product = selectedOption
    ? products.find((p) => p.itemName === selectedOption.value)
    : null;
  const totalPrice = product ? product.unitPrice * quantity : 0;

  function handleSelectChange(option) {
    setSelectedOption(option);
    setShowNewForm(false);
  }

  function handleCreate(inputValue) {
    setPendingName(inputValue);
    setShowNewForm(true);
    setSelectedOption(null);
    setNewCategoryOption(
      categories[0]
        ? { value: categories[0], label: categories[0].replace(/_/g, " ") }
        : null
    );
  }

  function handleSaveNewProduct() {
    if (!pendingName.trim() || !newPrice || !newCategoryOption) {
      alert("Please fill in a product name, category, and unit price");
      return;
    }

    const newProduct = {
      itemName: pendingName.trim(),
      category: newCategoryOption.value,
      description: newDescription,
      unitPrice: Number(newPrice),
      inventory: Number(newInventory) || 0,
    };

    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));

    setSelectedOption({
      value: newProduct.itemName,
      label: newProduct.itemName,
    });

    setShowNewForm(false);
    setPendingName("");
    setNewPrice("");
    setNewDescription("");
    setNewInventory("");
    setNewCategoryOption(
      categories[0]
        ? { value: categories[0], label: categories[0].replace(/_/g, " ") }
        : null
    );
  }

  const handleAddSale = () => {
    if (!product || !date) {
      alert("Please select a product and date");
      return;
    }

    if (quantity > product.inventory) {
      alert(
        `Not enough inventory. "${product.itemName}" only has ${product.inventory} in stock.`
      );
      return;
    }

    const newSale = {
      itemName: product.itemName,
      category: product.category,
      unitPrice: product.unitPrice,
      quantity,
      totalPrice,
      date,
    };

    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    localStorage.setItem("sales", JSON.stringify(updatedSales));

    const updatedProducts = products.map((p) =>
      p.itemName === product.itemName
        ? { ...p, inventory: p.inventory - quantity }
        : p
    );
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    setSelectedOption(null);
    setQuantity(1);
    setDate("");
  };

  return (
    <div className="container">
      <h2>Sales Journal</h2>

      <nav className="nav-links">
        <Link to="/">Back to Dashboard</Link>
      </nav>

      {/* Form */}
      <div style={{ marginBottom: "20px" }}>
        <div>
          <label>Product: </label>
          <CreatableSelect
            isClearable
            options={options}
            value={selectedOption}
            onChange={handleSelectChange}
            onCreateOption={handleCreate}
            placeholder="Search or create a product..."
            formatCreateLabel={(input) => `+ Create "${input}"`}
            styles={selectStyles}
          />
        </div>

        {/* Selected product details */}
        {product && (
          <div className="product-detail">
            <span><b>Category:</b> {product.category.replace(/_/g, " ")}</span>
            <span><b>Unit Price:</b> ฿{product.unitPrice}</span>
            <span><b>In Stock:</b> {product.inventory}</span>
          </div>
        )}

        {/* Inline new-product form */}
        {showNewForm && (
          <div className="new-product-form">
            <h4>New Product: {pendingName}</h4>
            <div>
              <label>Category: </label>
              <div className="inline-select">
                <CreatableSelect
                  isClearable
                  options={categories.map((c) => ({
                    value: c,
                    label: c.replace(/_/g, " "),
                  }))}
                  value={newCategoryOption}
                  onChange={setNewCategoryOption}
                  onCreateOption={(input) =>
                    setNewCategoryOption({
                      value: input.toLowerCase().replace(/\s+/g, "_"),
                      label: input,
                    })
                  }
                  placeholder="Select or type new..."
                  formatCreateLabel={(input) => `+ Add "${input}"`}
                  styles={selectStyles}
                />
              </div>
            </div>
            <div>
              <label>Unit Price (฿): </label>
              <input
                type="number"
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
            <div>
              <label>Inventory: </label>
              <input
                type="number"
                min="0"
                value={newInventory}
                onChange={(e) => setNewInventory(e.target.value)}
              />
            </div>
            <div>
              <label>Description: </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="new-product-actions">
              <button onClick={handleSaveNewProduct}>Save Product</button>
              <button
                onClick={() => {
                  setShowNewForm(false);
                  setPendingName("");
                }}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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

        <p>
          <b>Total Price:</b> ฿{totalPrice}
        </p>

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
