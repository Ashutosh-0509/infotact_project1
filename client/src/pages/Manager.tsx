import React from "react";

const ManagerHome: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">POS Manager</h2>
        <ul className="space-y-4">
          <li className="text-blue-600 font-semibold">Dashboard</li>
          <li>Sales</li>
          <li>Orders</li>
          <li>Inventory</li>
          <li>Staff</li>
          <li>Customers</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            View Reports
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Today's Sales</h3>
            <p className="text-xl font-bold">₹12,500</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Orders Today</h3>
            <p className="text-xl font-bold">45</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Customers</h3>
            <p className="text-xl font-bold">30</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Low Stock</h3>
            <p className="text-xl font-bold text-red-500">4 Items</p>
          </div>
        </div>

        {/* Sales + Staff */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Recent Orders */}
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

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
                  <td>#201</td>
                  <td>Amit</td>
                  <td>₹900</td>
                  <td className="text-green-600">Completed</td>
                </tr>

                <tr className="border-b">
                  <td>#202</td>
                  <td>Neha</td>
                  <td>₹700</td>
                  <td className="text-yellow-500">Pending</td>
                </tr>

                <tr>
                  <td>#203</td>
                  <td>Ravi</td>
                  <td>₹1500</td>
                  <td className="text-green-600">Completed</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Staff Performance */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Staff Performance</h2>

            <ul className="space-y-3">
              <li>
                <p className="font-medium">Rahul</p>
                <p className="text-sm text-gray-500">Sales: ₹5000</p>
              </li>

              <li>
                <p className="font-medium">Priya</p>
                <p className="text-sm text-gray-500">Sales: ₹4200</p>
              </li>

              <li>
                <p className="font-medium">Aman</p>
                <p className="text-sm text-gray-500">Sales: ₹3000</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white p-4 rounded shadow mt-6">
          <h2 className="text-lg font-semibold mb-4">Inventory Alerts</h2>

          <ul className="space-y-2">
            <li className="text-red-500">Product X - Only 2 left</li>
            <li className="text-red-500">Product Y - Out of stock</li>
          </ul>
        </div>

      </main>
    </div>
  );
};

export default ManagerHome;