// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import {
	ArchiveBoxIcon,
	CurrencyDollarIcon,
	ChatBubbleLeftEllipsisIcon,
	PlusCircleIcon,
	ChartBarIcon,
	EyeIcon,
	UsersIcon,
	ShoppingBagIcon,
	ShieldCheckIcon,
	CogIcon,
} from "@heroicons/react/24/outline";

// Import API service functions
import {
	getAllProducts,
	getAllUsers,
	getAllOrders,
} from "../../api/adminService";
import { toast } from "react-hot-toast"; // For notifications

export default function AdminDashboard() {
	const { currentUser, isLoading: isAuthLoading, userRole } = useAuthContext();

	const [productCount, setProductCount] = useState(0);
	const [userCount, setUserCount] = useState(0);
	const [sellerCount, setSellerCount] = useState(0);
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [recentSignups, setRecentSignups] = useState([]);
	const [ordersCount, setOrdersCount] = useState(0);
	const [dashboardLoading, setDashboardLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			// Check if current user is admin, if not, no need to fetch
			if (!currentUser || userRole !== "Admin") {
				setDashboardLoading(false);
				return;
			}

			setDashboardLoading(true);
			try {
				const products = await getAllProducts();
				setProductCount(products.length);

				const users = await getAllUsers();
				setUserCount(users.length);
				const sellers = users.filter((user) => user.role === "Seller");
				setSellerCount(sellers.length);

				const recentUsers = [...users]
					.sort(
						(a, b) =>
							new Date(b.createdAt || b.joinDate) -
							new Date(a.createdAt || a.joinDate)
					)
					.slice(0, 5);
				setRecentSignups(recentUsers);

				const orders = await getAllOrders();
				setOrdersCount(orders.length);
				const revenue = orders.reduce(
					(acc, order) => acc + (order.totalAmount || 0),
					0
				);
				setTotalRevenue(revenue);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
				toast.error("Failed to load dashboard data. Please check console.");
			} finally {
				setDashboardLoading(false);
			}
		};

		fetchDashboardData();
	}, [currentUser, userRole]);

	// Mock data for recent activity (consider fetching this from backend activity logs)
	const recentActivity = [
		{
			id: 1,
			text: `New user "JohnDoe" registered.`,
			time: "1 hour ago",
			type: "user",
			linkTo: "/admin/users",
		},
		{
			id: 2,
			text: `Seller "FashionStore" added 3 new products.`,
			time: "3 hours ago",
			type: "product",
			linkTo: "/admin/products",
		},
		{
			id: 3,
			text: `${ordersCount} new orders received in the last 24 hours.`,
			time: "1 day ago",
			type: "order",
			linkTo: "/admin/orders",
		},
	].slice(0, 3);

	// AuthContext loading check (for the entire app initialization)
	if (isAuthLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-100">
				<p className="text-gray-500 animate-pulse">
					Loading Admin Dashboard...
				</p>
			</div>
		);
	}

	// Role-based access control (for this specific page, though AdminProtectedRoute handles global access)
	if (!currentUser || userRole !== "Admin") {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-100">
				<p className="text-red-500 font-medium">
					Access denied. Administrator privileges required.
				</p>
			</div>
		);
	}

	return (
		<main className="flex-1 p-6 sm:p-8 space-y-8">
			{" "}
			{/* This `main` tag will be correctly placed by AdminLayout */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
						Admin Dashboard
					</h1>
					<p className="text-sm text-gray-600 mt-1">
						System overview and management
					</p>
				</div>
				<div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
					<ShieldCheckIcon className="h-5 w-5 text-blue-600" />
					<span className="text-sm font-medium text-blue-700">
						Administrator
					</span>
				</div>
			</div>
			{dashboardLoading ? (
				<div className="text-center py-10">
					<p className="text-gray-500 text-lg">Fetching latest data...</p>
					{/* You can add a CSS spinner here */}
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mt-4"></div>
				</div>
			) : (
				<>
					{/* Stats Overview Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
										Total Users
									</p>
									<p className="text-3xl font-bold text-gray-800 mt-1">
										{userCount}
									</p>
								</div>
								<div className="p-3 bg-blue-100 rounded-full">
									<UsersIcon className="h-6 w-6 text-blue-600" />
								</div>
							</div>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
										Total Sellers
									</p>
									<p className="text-3xl font-bold text-gray-800 mt-1">
										{sellerCount}
									</p>
								</div>
								<div className="p-3 bg-green-100 rounded-full">
									<UsersIcon className="h-6 w-6 text-green-600" />
								</div>
							</div>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
										Total Products
									</p>
									<p className="text-3xl font-bold text-gray-800 mt-1">
										{productCount}
									</p>
								</div>
								<div className="p-3 bg-purple-100 rounded-full">
									<ArchiveBoxIcon className="h-6 w-6 text-purple-600" />
								</div>
							</div>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
										Total Revenue
									</p>
									<p className="text-3xl font-bold text-gray-800 mt-1">
										${totalRevenue.toFixed(2)}
									</p>
								</div>
								<div className="p-3 bg-yellow-100 rounded-full">
									<CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
								</div>
							</div>
						</div>
					</div>

					{/* Recent Activity & Recent Signups */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
							<h2 className="text-xl font-semibold text-gray-700 mb-5">
								Recent Activity
							</h2>
							{recentActivity.length > 0 ? (
								<ul className="space-y-4">
									{recentActivity.map((activity) => (
										<li
											key={activity.id}
											className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
										>
											<div
												className={`flex-shrink-0 p-2.5 rounded-full ${
													activity.type === "user"
														? "bg-blue-100 text-blue-600"
														: activity.type === "product"
														? "bg-purple-100 text-purple-600"
														: "bg-green-100 text-green-600"
												}`}
											>
												{activity.type === "user" && (
													<UsersIcon className="h-5 w-5" />
												)}
												{activity.type === "product" && (
													<ArchiveBoxIcon className="h-5 w-5" />
												)}
												{activity.type === "order" && (
													<ShoppingBagIcon className="h-5 w-5" />
												)}
											</div>
											<div className="flex-grow">
												<p className="text-sm text-gray-700 leading-snug">
													{activity.text}
												</p>
												<p className="text-xs text-gray-500 mt-0.5">
													{activity.time}
												</p>
											</div>
											{activity.linkTo && activity.linkTo !== "#" && (
												<Link
													to={activity.linkTo}
													className="text-xs text-blue-600 hover:underline self-center ml-auto"
												>
													View
												</Link>
											)}
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-gray-500 py-4 text-center">
									No recent activity to display.
								</p>
							)}
						</div>

						<div className="bg-white p-6 rounded-xl shadow-lg">
							<h2 className="text-xl font-semibold text-gray-700 mb-5">
								Recent Signups
							</h2>
							{recentSignups.length > 0 ? (
								<ul className="space-y-3">
									{recentSignups.map((user) => (
										<li
											key={user.id}
											className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
										>
											<div className="flex-shrink-0">
												<div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
													{user.firstName?.charAt(0) || ""}
													{user.lastName?.charAt(0) || ""}
												</div>
											</div>
											<div className="flex-grow min-w-0">
												<p className="text-sm font-medium text-gray-800 truncate">
													{user.firstName} {user.lastName}
												</p>
												<p className="text-xs text-gray-500 truncate">
													{user.email}
												</p>
											</div>
											<span
												className={`text-xs px-2 py-1 rounded-full ${
													user.role === "Admin"
														? "bg-purple-100 text-purple-800"
														: user.role === "Seller"
														? "bg-green-100 text-green-800"
														: "bg-blue-100 text-blue-800"
												}`}
											>
												{user.role}
											</span>
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-gray-500 py-4 text-center">
									No recent signups to display.
								</p>
							)}
							<div className="mt-4 text-right">
								<Link
									to="/admin/users"
									className="text-sm text-blue-600 hover:underline"
								>
									View all users →
								</Link>
							</div>
						</div>
					</div>
				</>
			)}
		</main>
	);
}
