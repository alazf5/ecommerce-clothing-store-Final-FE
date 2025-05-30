// src/pages/admin/Orders.jsx (or wherever you keep your Orders component)
import { useEffect, useState } from "react";
import { getAllOrders } from "../../api/adminService"; // Assuming your service file is at this path, adjust if needed
import { toast } from "react-hot-toast"; // Import react-hot-toast

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadOrders = async () => {
			try {
				setLoading(true); // Indicate loading state
				setError(null); // Clear any previous errors

				const allOrders = await getAllOrders(); // Call your service function
				setOrders(allOrders);
			} catch (err) {
				console.error("Failed to fetch orders:", err);
				setError("Failed to load orders. Please try again.");
				toast.error("Failed to load orders."); // Show a toast notification on error
			} finally {
				setLoading(false); // End loading state
			}
		};

		loadOrders();
	}, []); // Empty dependency array means this runs once on component mount

	// Optional: Function to handle viewing/editing an order (example)
	const handleViewOrder = (orderId) => {
		toast("Viewing order ID: " + orderId, {
			icon: "👁️",
		});
		// In a real app, you'd navigate to an order detail page:
		// navigate(`/admin/orders/${orderId}`);
	};

	// Optional: Function to handle deleting an order (requires backend API)
	const handleDeleteOrder = async (orderId) => {
		if (
			window.confirm(
				"Are you sure you want to delete this order? This action cannot be undone."
			)
		) {
			try {
				// You would need a deleteOrder function in your adminService
				// await deleteOrder(orderId); // Call your service function
				toast.success("Order deleted successfully!");
				// Update the state to remove the deleted order from the UI
				setOrders(orders.filter((order) => order.id !== orderId));
			} catch (err) {
				console.error("Failed to delete order:", err);
				toast.error("Failed to delete order.");
			}
		}
	};

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">Customer Orders</h1>
				{/* You might add a "Add New Order" button here if relevant,
                    or a "Filter Orders" button etc. */}
				{/* <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out">
                    Add New Order
                </button> */}
			</div>

			{loading ? (
				<div className="text-center py-4 text-gray-600">Loading orders...</div>
			) : error ? (
				<div className="text-center py-4 text-red-500 font-semibold">
					{error}
				</div>
			) : orders.length === 0 ? (
				<div className="text-center py-4 text-gray-600">No orders found.</div>
			) : (
				<div className="overflow-x-auto bg-white shadow-md rounded-lg">
					<table className="min-w-full leading-normal">
						<thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
							<tr>
								<th className="py-3 px-6 text-left">Order ID</th>
								<th className="py-3 px-6 text-left">Customer</th>
								<th className="py-3 px-6 text-left">Total</th>
								<th className="py-3 px-6 text-left">Status</th>
								<th className="py-3 px-6 text-left">Date</th>
								<th className="py-3 px-6 text-center">Actions</th>
							</tr>
						</thead>
						<tbody className="text-gray-700 text-sm">
							{orders.map((order) => (
								<tr
									key={order.id}
									className="border-b border-gray-200 hover:bg-gray-100"
								>
									<td className="py-3 px-6 whitespace-nowrap">{order.id}</td>
									<td className="py-3 px-6">{order.customerName || "N/A"}</td>
									<td className="py-3 px-6">
										${order.total ? order.total.toFixed(2) : "0.00"}
									</td>
									<td className="py-3 px-6">
										<span
											className={`px-3 py-1 font-semibold leading-tight rounded-full ${
												order.status === "Completed"
													? "bg-green-200 text-green-800"
													: order.status === "Pending"
													? "bg-yellow-200 text-yellow-800"
													: order.status === "Cancelled"
													? "bg-red-200 text-red-800"
													: "bg-gray-200 text-gray-800"
											}`}
										>
											{order.status}
										</span>
									</td>
									<td className="py-3 px-6">
										{order.date
											? new Date(order.date).toLocaleDateString()
											: "N/A"}
									</td>
									<td className="py-3 px-6 text-center">
										<div className="flex items-center justify-center space-x-2">
											{/* View Order Button */}
											<button
												className="text-blue-500 hover:text-blue-700 transition duration-300 transform hover:scale-110"
												onClick={() => handleViewOrder(order.id)}
												title="View Order Details"
											>
												<svg
													className="w-5 h-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													/>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
													/>
												</svg>
											</button>
											{/* Delete Order Button */}
											<button
												className="text-red-500 hover:text-red-700 transition duration-300 transform hover:scale-110"
												onClick={() => handleDeleteOrder(order.id)}
												title="Delete Order"
											>
												<svg
													className="w-5 h-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default Orders;
