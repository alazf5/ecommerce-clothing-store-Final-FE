import { useEffect, useState } from "react";
import { getAllUsers as fetchAllUsersApi } from "../../api/adminService"; // Renamed to avoid conflict

const User = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadUsers = async () => {
			try {
				setLoading(true);
				setError(null);

				const allUsers = await fetchAllUsersApi();
				setUsers(allUsers);
			} catch (err) {
				console.error("Failed to fetch users:", err);
				setError("Failed to load users. Please try again.");
			} finally {
				setLoading(false);
			}
		};
		loadUsers();
	}, []);

	return (
		<div className="container mx-auto p-6">
			{" "}
			{/* Added some basic padding */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">User Management</h1>
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out">
					Add New User
				</button>
			</div>
			{loading ? (
				<div className="text-center py-4 text-gray-600">Loading users...</div>
			) : error ? (
				<div className="text-center py-4 text-red-500 font-semibold">
					{error}
				</div>
			) : users.length === 0 ? (
				<div className="text-center py-4 text-gray-600">No users found.</div>
			) : (
				// This is your "users table" built directly within User.jsx
				<div className="overflow-x-auto bg-white shadow-md rounded-lg">
					<table className="min-w-full leading-normal">
						<thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
							<tr>
								<th className="py-3 px-6 text-left">ID</th>
								<th className="py-3 px-6 text-left">Username</th>
								<th className="py-3 px-6 text-left">Email</th>
								<th className="py-3 px-6 text-left">Role</th>
								<th className="py-3 px-6 text-left">Created At</th>
								<th className="py-3 px-6 text-center">Actions</th>
							</tr>
						</thead>
						<tbody className="text-gray-700 text-sm">
							{users.map((user) => (
								<tr
									key={user.id}
									className="border-b border-gray-200 hover:bg-gray-100"
								>
									<td className="py-3 px-6 text-left whitespace-nowrap">
										{user.id}
									</td>
									<td className="py-3 px-6 text-left">
										{user.username || "N/A"}
									</td>
									<td className="py-3 px-6 text-left">{user.email}</td>
									<td className="py-3 px-6 text-left">{user.role || "user"}</td>
									<td className="py-3 px-6 text-left">
										{new Date(user.createdAt).toLocaleDateString()}
									</td>
									<td className="py-3 px-6 text-center">
										<div className="flex item-center justify-center">
											<button className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
												{/* Edit Icon (e.g., from an icon library like Heroicons or Font Awesome) */}
												<svg
													xmlns="http://www.w3.org/2000/svg"
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
											<button className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
												{/* Delete Icon */}
												<svg
													xmlns="http://www.w3.org/2000/svg"
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

export default User;
