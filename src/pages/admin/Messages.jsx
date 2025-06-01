import { useEffect, useState } from "react";
import {
	getAllAdminMessages,
	deleteAdminMessage,
	updateMessageStatus,
} from "../../api/adminService"; // Assuming these functions exist
import { toast } from "react-hot-toast";

const Messages = () => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedMessage, setSelectedMessage] = useState(null); // State for viewing message details
	const [filterStatus, setFilterStatus] = useState("All"); // "All", "Read", "Unread"
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const loadMessages = async () => {
			try {
				setLoading(true);
				setError(null);

				const allMessages = await getAllAdminMessages();
				// Sort messages by createdAt in descending order (newest first)
				setMessages(
					allMessages.sort(
						(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
					)
				);
			} catch (err) {
				console.error("Failed to fetch admin messages:", err);
				setError("Failed to load messages. Please try again.");
				toast.error("Failed to load messages.");
			} finally {
				setLoading(false);
			}
		};

		loadMessages();
	}, []);

	const handleToggleReadStatus = async (messageId, currentStatus) => {
		const newStatus = currentStatus === "read" ? "unread" : "read";
		try {
			// Optimistically update UI
			setMessages((prevMessages) =>
				prevMessages.map((msg) =>
					msg.id === messageId ? { ...msg, status: newStatus } : msg
				)
			);
			await updateMessageStatus(messageId, newStatus); // Call your service function
			toast.success(`Message marked as ${newStatus}.`);
		} catch (err) {
			console.error("Failed to update message status:", err);
			toast.error("Failed to update message status.");
			// Revert UI on error
			setMessages((prevMessages) =>
				prevMessages.map((msg) =>
					msg.id === messageId ? { ...msg, status: currentStatus } : msg
				)
			);
		}
	};

	const handleDeleteMessage = async (messageId) => {
		if (
			window.confirm(
				"Are you sure you want to delete this message permanently?"
			)
		) {
			try {
				await deleteAdminMessage(messageId); // Call your service function
				toast.success("Message deleted successfully!");
				setMessages(messages.filter((msg) => msg.id !== messageId));
				// Close modal if the deleted message was open
				if (selectedMessage && selectedMessage.id === messageId) {
					setSelectedMessage(null);
				}
			} catch (err) {
				console.error("Failed to delete message:", err);
				toast.error("Failed to delete message.");
			}
		}
	};

	const handleViewMessage = (message) => {
		setSelectedMessage(message);
		// If the message is unread, mark it as read when viewed
		if (message.status === "unread") {
			handleToggleReadStatus(message.id, "unread");
		}
	};

	const handleCloseModal = () => {
		setSelectedMessage(null);
	};

	// Filtered and searched messages
	const filteredAndSearchedMessages = messages.filter((message) => {
		const matchesStatus =
			filterStatus === "All" || message.status === filterStatus;
		const matchesSearch =
			message.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			message.senderEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			message.message?.toLowerCase().includes(searchTerm.toLowerCase()); // Also search in message body

		return matchesStatus && matchesSearch;
	});

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">Customer Messages</h1>
				<div className="flex space-x-4">
					{/* Search Input */}
					<input
						type="text"
						placeholder="Search messages..."
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
						<option value="All">All Messages</option>
						<option value="unread">Unread</option>
						<option value="read">Read</option>
					</select>
				</div>
			</div>

			{loading ? (
				<div className="text-center py-4 text-gray-600">
					Loading messages...
				</div>
			) : error ? (
				<div className="text-center py-4 text-red-500 font-semibold">
					{error}
				</div>
			) : filteredAndSearchedMessages.length === 0 ? (
				<div className="text-center py-4 text-gray-600">
					No messages found matching your criteria.
				</div>
			) : (
				<div className="overflow-x-auto bg-white shadow-md rounded-lg">
					<table className="min-w-full leading-normal">
						<thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
							<tr>
								<th className="py-3 px-6 text-left">ID</th>
								<th className="py-3 px-6 text-left">Sender</th>
								<th className="py-3 px-6 text-left">Email</th>
								<th className="py-3 px-6 text-left">Subject</th>
								<th className="py-3 px-6 text-left">Status</th>
								<th className="py-3 px-6 text-left">Date</th>
								<th className="py-3 px-6 text-center">Actions</th>
							</tr>
						</thead>
						<tbody className="text-gray-700 text-sm">
							{filteredAndSearchedMessages.map((message) => (
								<tr
									key={message.id}
									className={`border-b border-gray-200 ${
										message.status === "unread"
											? "bg-blue-50 hover:bg-blue-100 font-medium"
											: "hover:bg-gray-100"
									}`}
								>
									<td className="py-3 px-6 whitespace-nowrap">{message.id}</td>
									<td className="py-3 px-6">{message.senderName || "N/A"}</td>
									<td className="py-3 px-6">{message.senderEmail || "N/A"}</td>
									<td className="py-3 px-6 truncate max-w-xs">
										{message.subject || "No Subject"}
									</td>
									<td className="py-3 px-6">
										<span
											className={`px-3 py-1 font-semibold leading-tight rounded-full text-xs ${
												message.status === "unread"
													? "bg-purple-200 text-purple-800"
													: "bg-gray-200 text-gray-800"
											}`}
										>
											{message.status}
										</span>
									</td>
									<td className="py-3 px-6">
										{new Date(message.createdAt).toLocaleString()}
									</td>
									<td className="py-3 px-6 text-center">
										<div className="flex items-center justify-center space-x-2">
											{/* View Message Button */}
											<button
												className="text-blue-500 hover:text-blue-700 transition duration-300 transform hover:scale-110"
												onClick={() => handleViewMessage(message)}
												title="View Message"
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
											{/* Toggle Read/Unread Button */}
											<button
												className={`transition duration-300 transform hover:scale-110 ${
													message.status === "unread"
														? "text-green-500 hover:text-green-700"
														: "text-gray-500 hover:text-gray-700"
												}`}
												onClick={() =>
													handleToggleReadStatus(message.id, message.status)
												}
												title={
													message.status === "unread"
														? "Mark as Read"
														: "Mark as Unread"
												}
											>
												{message.status === "unread" ? (
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
															d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
												) : (
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
															d="M13 10V3L4 14h7v7l9-11h-7z"
														/>{" "}
														{/* Icon for unread/eye-slash maybe? Using lightning bolt as a placeholder for 'mark as unread' */}
													</svg>
												)}
											</button>
											{/* Delete Message Button */}
											<button
												className="text-red-500 hover:text-red-700 transition duration-300 transform hover:scale-110"
												onClick={() => handleDeleteMessage(message.id)}
												title="Delete Message"
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

			{/* Message Detail Modal */}
			{selectedMessage && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
					<div className="relative p-8 bg-white w-full max-w-2xl mx-auto rounded-lg shadow-lg">
						<h2 className="text-2xl font-bold mb-4">
							Message from {selectedMessage.senderName}
						</h2>
						<p className="text-gray-600 mb-2">
							<strong>Email:</strong> {selectedMessage.senderEmail}
						</p>
						<p className="text-gray-600 mb-2">
							<strong>Subject:</strong>{" "}
							{selectedMessage.subject || "No Subject"}
						</p>
						<p className="text-gray-600 mb-4">
							<strong>Date:</strong>{" "}
							{new Date(selectedMessage.createdAt).toLocaleString()}
						</p>
						<div className="bg-gray-100 p-4 rounded-md overflow-y-auto max-h-96 border border-gray-300">
							<p className="whitespace-pre-wrap">{selectedMessage.message}</p>
						</div>
						<div className="mt-6 flex justify-end space-x-3">
							<button
								className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
								onClick={() => handleDeleteMessage(selectedMessage.id)}
							>
								Delete
							</button>
							<button
								className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
								onClick={handleCloseModal}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Messages;
