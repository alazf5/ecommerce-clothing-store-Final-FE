// src/pages/admin/Products.jsx
import { useEffect, useState } from "react";
import { getAllProducts } from "../../api/adminService";

const Products = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadProducts = async () => {
			console.log("Products: Starting loadProducts...");
			try {
				setLoading(true);
				setError(null);

				const response = await getAllProducts(); // Get the full response object
				console.log("Products: Full API Response:", response); // Log the full response to see its structure

				// --- THIS IS THE CRUCIAL CHANGE ---
				// Check if response has a 'content' property and it's an array
				if (response && Array.isArray(response.content)) {
					setProducts(response.content); // Set products to the 'content' array
					console.log(
						"Products: Fetched products (from content):",
						response.content
					);
				} else {
					// Handle cases where 'content' is missing or not an array (e.g., unexpected API response)
					setProducts([]);
					console.warn(
						"Products: API response did not contain an array in 'content'. Response:",
						response
					);
				}
				// --- END OF CRUCIAL CHANGE ---
			} catch (err) {
				console.error("Products: Failed to fetch products:", err);
				// Ensure error message is meaningful, e.g., if err.response exists
				setError(
					err.response?.data?.message ||
						"Failed to load products. Please try again."
				);
			} finally {
				setLoading(false);
				console.log("Products: Finished loadProducts. Loading set to false.");
			}
		};
		loadProducts();
	}, []);

	console.log(
		"Products: Component re-rendered. Loading:",
		loading,
		"Error:",
		error,
		"Products count:",
		products.length
	);

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out">
					Add New Product
				</button>
			</div>
			{loading ? (
				<div className="text-center py-4 text-gray-600">
					Loading products...
				</div>
			) : error ? (
				<div className="text-center py-4 text-red-500 font-semibold">
					{error}
				</div>
			) : products.length === 0 ? (
				<div className="text-center py-4 text-gray-600">No products found.</div>
			) : (
				<div className="overflow-x-auto bg-white shadow-md rounded-lg">
					<table className="min-w-full leading-normal">
						<thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
							<tr>
								<th className="py-3 px-6 text-left">ID</th>
								<th className="py-3 px-6 text-left">Product Name</th>
								<th className="py-3 px-6 text-left">Price</th>
								<th className="py-3 px-6 text-left">Category</th>
								<th className="py-3 px-6 text-left">Stock</th>
								<th className="py-3 px-6 text-center">Actions</th>
							</tr>
						</thead>
						<tbody className="text-gray-700 text-sm">
							{products.map((product) => (
								<tr
									key={product.id}
									className="border-b border-gray-200 hover:bg-gray-100"
								>
									<td className="py-3 px-6 whitespace-nowrap">{product.id}</td>
									<td className="py-3 px-6">{product.name}</td>
									<td className="py-3 px-6">${product.price.toFixed(2)}</td>
									<td className="py-3 px-6">{product.category || "N/A"}</td>
									<td className="py-3 px-6">{product.stock}</td>
									<td className="py-3 px-6 text-center">
										<div className="flex items-center justify-center space-x-2">
											<button className="text-blue-500 hover:text-blue-700 transition duration-300 transform hover:scale-110">
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
														d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
													/>
												</svg>
											</button>
											<button className="text-red-500 hover:text-red-700 transition duration-300 transform hover:scale-110">
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

export default Products;
