import React from "react";

const AdminHome: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">POS Admin</h2>
        <ul className="space-y-4">
          <li className="text-blue-600 font-semibold">Dashboard</li>
          <li>Products</li>
          <li>Inventory</li>
          <li>Orders</li>
          <li>Customers</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Inventory Dashboard</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Total Revenue</h3>
            <p className="text-xl font-bold">₹50,000</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Orders</h3>
            <p className="text-xl font-bold">120</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Products</h3>
            <p className="text-xl font-bold">80</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Low Stock</h3>
            <p className="text-xl font-bold text-red-500">5 Items</p>
          </div>
        </div>

        {/* Inventory + Low Stock */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Inventory Table */}
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Inventory</h2>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th>Name</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b">
                  <td>Product A</td>
                  <td>25</td>
                  <td>₹500</td>
                  <td className="text-green-600">In Stock</td>
                </tr>

                <tr className="border-b">
                  <td>Product B</td>
                  <td>3</td>
                  <td>₹300</td>
                  <td className="text-red-600">Low</td>
                </tr>

                <tr>
                  <td>Product C</td>
                  <td>0</td>
                  <td>₹200</td>
                  <td className="text-red-600">Out</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Low Stock Alerts</h2>

            <ul className="space-y-3">
              <li className="text-red-500">Product B (3 left)</li>
              <li className="text-red-500">Product C (Out of stock)</li>
            </ul>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white p-4 rounded shadow mt-6">
          <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td>#1001</td>
                <td>Rahul</td>
                <td>₹1200</td>
                <td className="text-green-600">Completed</td>
              </tr>

              <tr>
                <td>#1002</td>
                <td>Priya</td>
                <td>₹800</td>
                <td className="text-yellow-500">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

export default AdminHome;