import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../api/adminService"; // Assuming you'll add updateOrderStatus to your service
import { toast } from "react-hot-toast";

const Orders = () => {
	const [orders, setOrders] = useState([]); // Initialize as an empty array
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filterStatus, setFilterStatus] = useState("All");
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const loadOrders = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await getAllOrders(); // Assuming getAllOrders returns the axios response object

				// Ensure the data from the backend is an array.
				// Axios typically puts the actual response data in `response.data`.
				const allOrdersData = response;

				if (Array.isArray(allOrdersData)) {
					setOrders(allOrdersData);
				} else {
					// Log the unexpected data and set an error
					console.error(
						"Backend returned unexpected data format for orders:",
						allOrdersData
					);
					setError(
						"Failed to load orders: Server returned invalid data format."
					);
					setOrders([]); // Ensure `orders` remains an array
				}
				
			} catch (err) {
				console.error("Failed to fetch orders:", err);
				// More informative error message for the user
				setError(
					`Failed to load orders: ${
						err.message || "Network error"
					}. Please try again.`
				);
				toast.error("Failed to load orders.");
				setOrders([]); // Ensure `orders` is reset to an empty array on error
			} finally {
				setLoading(false);
			}
		};

		loadOrders();
	}, []); // Empty dependency array means this runs once on component mount

	// Function to handle updating order status
	const handleStatusChange = async (orderId, newStatus) => {
		try {
			// Optimistically update UI
			setOrders((prevOrders) =>
				prevOrders.map((order) =>
					order.id === orderId ? { ...order, status: newStatus } : order
				)
			);
			await updateOrderStatus(orderId, newStatus); // Call your service function
			toast.success(`Order ${orderId} status updated to ${newStatus}`);
		} catch (err) {
			console.error(`Failed to update order ${orderId} status:`, err);
			toast.error(`Failed to update order ${orderId} status.`);
			// Revert UI on error - use `prevOrders` to find the original status
			setOrders((prevOrders) =>
				prevOrders.map((order) =>
					order.id === orderId
						? {
								...order,
								status:
									prevOrders.find((o) => o.id === orderId)?.status ||
									order.status,
						  } // Fallback to current if not found
						: order
				)
			);
		}
	};

	const handleViewOrder = (orderId) => {
		toast("Viewing order ID: " + orderId, {
			icon: "👁️",
		});
		// In a real app, you'd navigate to an order detail page:
		// navigate(`/admin/orders/${orderId}`);
	};

	const handleDeleteOrder = async (orderId) => {
		if (
			window.confirm(
				"Are you sure you want to delete this order? This action cannot be undone."
			)
		) {
			try {
				// Assuming you have a deleteOrder function in your adminService
				// await deleteOrder(orderId); // Uncomment and implement this!
				toast.success("Order deleted successfully!");
				// Filter out the deleted order from the current state
				setOrders((prevOrders) =>
					prevOrders.filter((order) => order.id !== orderId)
				);
			} catch (err) {
				console.error("Failed to delete order:", err);
				toast.error("Failed to delete order.");
			}
		}
	};

	// Filtered and searched orders logic.
	// This will now always run on an array because `orders` is guaranteed to be an array.
	const filteredOrders = orders.filter((order) => {
		// You'll likely need to adjust 'customerName' or 'status' to match your actual Order entity structure.
		// Based on Order.java, you might have 'user.username' or similar.
		const customerIdentifier =
			order.user?.username || order.user?.id?.toString() || ""; // Adapt this based on your actual OrderResponseDto

		const matchesStatus =
			filterStatus === "All" || order.status === filterStatus; // Ensure 'order.status' exists and matches your backend statuses

		const matchesSearch =
			customerIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.id.toString().includes(searchTerm.toLowerCase()) ||
			order.product?.productName
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()); // Add product name search if applicable

		return matchesStatus && matchesSearch;
	});

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">Customer Orders</h1>
				<div className="flex space-x-4">
					{/* Search Input */}
					<input
						type="text"
						placeholder="Search orders..."
						className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>

					{/* Status Filter Dropdown */}
					<select
						className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
					>
						<option value="All">All Statuses</option>
						<option value="Pending">Pending</option>
						<option value="Processing">Processing</option>{" "}
						{/* Added for consistency */}
						<option value="Completed">Completed</option>
						<option value="Cancelled">Cancelled</option>
					</select>
				</div>
			</div>

			{loading ? (
				<div className="text-center py-4 text-gray-600">Loading orders...</div>
			) : error ? (
				<div className="text-center py-4 text-red-500 font-semibold">
					{error}
				</div>
			) : filteredOrders.length === 0 ? (
				<div className="text-center py-4 text-gray-600">
					No orders found matching your criteria.
				</div>
			) : (
				<div className="overflow-x-auto bg-white shadow-md rounded-lg">
					<table className="min-w-full leading-normal">
						<thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
							<tr>
								<th className="py-3 px-6 text-left">Order ID</th>
								<th className="py-3 px-6 text-left">Customer</th>
								<th className="py-3 px-6 text-left">Product</th>{" "}
								{/* Added Product Column */}
								<th className="py-3 px-6 text-left">Quantity</th>{" "}
								{/* Added Quantity Column */}
								<th className="py-3 px-6 text-left">Total</th>
								<th className="py-3 px-6 text-left">Status</th>
								<th className="py-3 px-6 text-left">Date</th>
								<th className="py-3 px-6 text-center">Actions</th>
							</tr>
						</thead>
						<tbody className="text-gray-700 text-sm">
							{filteredOrders.map((order) => (
								<tr
									key={order.id}
									className="border-b border-gray-200 hover:bg-gray-100"
								>
									<td className="py-3 px-6 whitespace-nowrap">{order.id}</td>
									{/* Updated to show user's ID or username, based on OrderResponseDto */}
									<td className="py-3 px-6">
										{order.userId || "N/A"}
										{/* If you have user's name in OrderResponseDto, use it here */}
									</td>
									<td className="py-3 px-6">{order.productName || "N/A"}</td>
									<td className="py-3 px-6">{order.quantity}</td>
									<td className="py-3 px-6">
										${order.total ? order.total.toFixed(2) : "0.00"}
									</td>
									<td className="py-3 px-6">
										<select
											className={`px-3 py-1 font-semibold leading-tight rounded-full ${
												order.status === "Completed" // Assuming 'status' field exists in OrderResponseDto
													? "bg-green-200 text-green-800"
													: order.status === "Pending"
													? "bg-yellow-200 text-yellow-800"
													: order.status === "Cancelled"
													? "bg-red-200 text-red-800"
													: "bg-gray-200 text-gray-800"
											}`}
											value={order.status || "Pending"} // Default to 'Pending' if status is missing
											onChange={(e) =>
												handleStatusChange(order.id, e.target.value)
											}
										>
											<option value="Pending">Pending</option>
											<option value="Processing">Processing</option>
											<option value="Completed">Completed</option>
											<option value="Cancelled">Cancelled</option>
										</select>
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
