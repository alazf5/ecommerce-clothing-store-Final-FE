// src/pages/admin/Messages.jsx
import { useEffect, useState } from "react";
import { getAllAdminMessages } from "../../api/adminService"; // Import the service function
import { toast } from "react-hot-toast"; // Assuming you have react-hot-toast for notifications

const Messages = () => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadMessages = async () => {
			try {
				setLoading(true); // Indicate loading state
				setError(null); // Clear any previous errors

				const allMessages = await getAllAdminMessages();
				setMessages(allMessages);
			} catch (err) {
				console.error("Failed to fetch admin messages:", err);
				setError("Failed to load messages. Please try again.");
				toast.error("Failed to load messages."); // Show a toast notification on error
			} finally {
				setLoading(false); // End loading state
			}
		};

		loadMessages();
	}, []); // Empty dependency array means this runs once on component mount

	// Optional: Function to handle deleting a message
	const handleDeleteMessage = async (messageId) => {
		// You would typically add a confirmation dialog here
		if (window.confirm("Are you sure you want to delete this message?")) {
			try {
				// You'd need a deleteAdminMessage function in your adminService
				// await deleteAdminMessage(messageId);
				toast.success("Message deleted successfully!");
				// Update the state to remove the deleted message from the UI
				setMessages(messages.filter((msg) => msg.id !== messageId));
			} catch (err) {
				console.error("Failed to delete message:", err);
				toast.error("Failed to delete message.");
			}
		}
	};

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">Admin Messages</h1>
				{/* You might not have an "Add New Message" button for admin messages,
            but perhaps a "Mark All as Read" or "Archive" button */}
				{/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out">
          Archive Read Messages
        </button> */}
			</div>

			{loading ? (
				<div className="text-center py-4 text-gray-600">
					Loading messages...
				</div>
			) : error ? (
				<div className="text-center py-4 text-red-500 font-semibold">
					{error}
				</div>
			) : messages.length === 0 ? (
				<div className="text-center py-4 text-gray-600">
					No admin messages found.
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
								<th className="py-3 px-6 text-left">Date</th>
								<th className="py-3 px-6 text-center">Actions</th>
							</tr>
						</thead>
						<tbody className="text-gray-700 text-sm">
							{messages.map((message) => (
								<tr
									key={message.id}
									className="border-b border-gray-200 hover:bg-gray-100"
								>
									<td className="py-3 px-6 whitespace-nowrap">{message.id}</td>
									<td className="py-3 px-6">
										{message.senderName || "N/A"}
									</td>{" "}
									{/* Assuming 'senderName' */}
									<td className="py-3 px-6">
										{message.senderEmail || "N/A"}
									</td>{" "}
									{/* Assuming 'senderEmail' */}
									<td className="py-3 px-6 truncate max-w-xs">
										{message.subject || "No Subject"}
									</td>{" "}
									{/* Assuming 'subject' */}
									<td className="py-3 px-6">
										{new Date(message.createdAt).toLocaleString()}
									</td>{" "}
									{/* Assuming 'createdAt' */}
									<td className="py-3 px-6 text-center">
										<div className="flex items-center justify-center space-x-2">
											{/* View/Read Message Button */}
											<button
												className="text-blue-500 hover:text-blue-700 transition duration-300 transform hover:scale-110"
												onClick={() =>
													toast("Viewing message: " + message.subject, {
														icon: "👁️",
													})
												}
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
											{/* Delete Message Button */}
											<button
												className="text-red-500 hover:text-red-700 transition duration-300 transform hover:scale-110"
												onClick={() => handleDeleteMessage(message.id)}
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

export default Messages;
