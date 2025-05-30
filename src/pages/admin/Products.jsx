// src/pages/admin/Products.jsx
import { useEffect, useState } from "react";
// import { useAuthContext } from '../../context/AuthContext'; // <--- REMOVE THIS LINE IF YOU'RE NOT USING IT FOR PRODUCTS
import { getAllProducts } from "../../api/adminService"; // This is the correct import!

const Products = () => {
	// If you removed useAuthContext completely because it's not needed for products,
	// then you don't need the line below either.
	// const { getAllProducts } = useAuthContext(); // <--- REMOVE THIS LINE AS WELL

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null); // Added for error handling

	useEffect(() => {
		const loadProducts = async () => {
			try {
				setLoading(true); // Set loading to true before the API call
				setError(null); // Clear any previous errors

				// Call the imported getAllProducts function
				const allProducts = await getAllProducts(); // Use the imported function directly
				setProducts(allProducts);
			} catch (err) {
				console.error("Failed to fetch products:", err);
				setError("Failed to load products. Please try again."); // More user-friendly message
			} finally {
				setLoading(false); // Set loading to false after the API call, regardless of success or failure
			}
		};
		loadProducts();
	}, []); // Empty dependency array means this effect runs once after the initial render

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
									<td className="py-3 px-6">
										{product.category || "N/A"}
									</td>{" "}
									{/* Added fallback for category */}
									<td className="py-3 px-6">{product.stock}</td>
									<td className="py-3 px-6 text-center">
										<div className="flex items-center justify-center space-x-2">
											{" "}
											{/* Improved spacing */}
											{/* Edit Button with SVG Icon */}
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
											{/* Delete Button with SVG Icon */}
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
