import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}

const CashierHome: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);

  const products: Product[] = [
    { id: 1, name: "Product A", price: 200 },
    { id: 2, name: "Product B", price: 150 },
    { id: 3, name: "Product C", price: 300 },
  ];

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Left: Product List */}
      <div className="w-2/3 p-4">
        <h1 className="text-2xl font-semibold mb-4">POS Billing</h1>

        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-50"
              onClick={() => addToCart(product)}
            >
              <h2 className="font-semibold">{product.name}</h2>
              <p>₹{product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-1/3 bg-white p-4 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Cart</h2>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-500">No items added</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex justify-between border-b pb-1">
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </div>
            ))
          )}
        </div>

        {/* Total */}
        <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-bold">Total: ₹{total}</h3>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-2">
          <button className="w-full bg-green-600 text-white py-2 rounded">
            Pay Now
          </button>

          <button
            className="w-full bg-red-500 text-white py-2 rounded"
            onClick={() => setCart([])}
          >
            Clear Cart
          </button>
        </div>
      </div>

    </div>
  );
};

export default CashierHome;