import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
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
import productsData from "../../data/products.json";

export default function AdminDashboard() {
	const { currentUser, isLoading: isAuthLoading, userRole } = useAuthContext();

	const [productCount, setProductCount] = useState(0);
	const [userCount, setUserCount] = useState(0);
	const [sellerCount, setSellerCount] = useState(0);
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [recentSignups, setRecentSignups] = useState([]);

	// // Admin Sidebar Links
	// const adminLinks = [
	// 	{ label: "Dashboard", path: "/admin/Dashboard", icon: ChartBarIcon },
	// 	{ label: "Users", path: "/admin/Users", icon: UsersIcon },
	// 	{ label: "Products", path: "/admin/Products", icon: ArchiveBoxIcon },
	// 	{ label: "Orders", path: "/admin/Orders", icon: ShoppingBagIcon },
	// 	{
	// 		label: "Messages",
	// 		path: "/admin/Messages",
	// 		icon: ChatBubbleLeftEllipsisIcon,
	// 	},
	// 	{ label: "Settings", path: "/admin/Settings", icon: CogIcon },
	// ];

	useEffect(() => {
		if (currentUser && userRole === "Admin") {
			// Count all products
			setProductCount(productsData.length);

			// // Count all users
			// setUserCount(usersData.length);

			// // Count sellers
			// const sellers = usersData.filter((user) => user.role === "Seller");
			// setSellerCount(sellers.length);

			// Calculate total revenue (mock)
			const revenue = productsData.reduce(
				(acc, curr) => acc + curr.price * (Math.floor(Math.random() * 10) + 1),
				0
			);
			setTotalRevenue(revenue);

			// // Get recent signups (last 5)
			// const recentUsers = [...usersData]
			// 	.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
			// 	.slice(0, 5);
			// setRecentSignups(recentUsers);
		}
	}, [currentUser, userRole]);

	// Mock data for recent activity
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
			linkTo: "/data/products",
		},
		{
			id: 3,
			text: `5 new orders received in the last 24 hours.`,
			time: "1 day ago",
			type: "order",
			linkTo: "/admin/orders",
		},
	].slice(0, 3);
    
	// Show loading state while AuthContext is initializing
	if (isAuthLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-100">
				<p className="text-gray-500 animate-pulse">
					Loading Admin Dashboard...
				</p>
			</div>
		);
	}

	// If not authenticated or not an admin
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
		<div className="flex min-h-screen bg-gray-100">
			{/* <Sidebar
				links={adminLinks}
				userRole="Admin"
				userName={currentUser.firstName}
			/> */}

			<main className="flex-1 p-6 sm:p-8 space-y-8">
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
												{user.firstName.charAt(0)}
												{user.lastName.charAt(0)}
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
			</main>
		</div>
	);
}
