import React, { useState } from "react";

function AddItem() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const createProduct = async () => {
    const res = await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productName, productPrice, quantity }),
    });
    const data = await res.json();
    const newProducts = [...products, data];
    setProducts(newProducts);
    localStorage.setItem("products", JSON.stringify(newProducts));
    setProductName("");
    setProductPrice("");
    setQuantity("");
  };

  const updateProduct = async () => {
    const res = await fetch(`http://localhost:5000/products/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productName, productPrice, quantity }),
    });
    const data = await res.json();
    const updatedProducts = products.map((product) =>
      product._id === editId ? data : product
    );
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts)); 
    setProductName("");
    setProductPrice("");
    setQuantity("");
    setEditId(null);
  };

  const deleteProduct = async (id) => {
    await fetch(`http://localhost:5000/products/${id}`, { method: "DELETE" });
    const remainingProducts = products.filter((product) => product._id !== id);
    setProducts(remainingProducts);
    localStorage.setItem("products", JSON.stringify(remainingProducts));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editId ? updateProduct() : createProduct();
  };

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className=" mb-3">
          <label htmlFor="name" className="form-label">
            Product Name
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter Price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </div>
        <div className=" mb-3">
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editId ? "Update" : "Add"} Item
        </button>
      </form>

      {products.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Product Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <h1 className="mt-4">Product List</h1>
        </div>
      )}

      <div className="container">
        <ul className="list-group">
          {filteredProducts.map((product) => (
            <li
              key={product._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                Product Name: {product.productName} <br /> Price: Rs.
                {product.productPrice}
                <br />
                (Qty: {product.quantity})
              </span>
              <div>
                <button
                  onClick={() => {
                    setProductName(product.productName);
                    setProductPrice(product.productPrice);
                    setQuantity(product.quantity);
                    setEditId(product._id);
                  }}
                  className="btn btn-sm btn-warning mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddItem;
