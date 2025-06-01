import React, { useState } from "react";
import {
	EnvelopeIcon,
	PhoneIcon,
	MapPinIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import axios from "axios"; // Import axios

const ContactPage = () => {
	const heroImageUrl = "/assets/contact-us/contact-hero.jpg";
	const mapImageUrl = "/assets/contact-us/map-placeholder.jpg";

	const [formData, setFormData] = useState({
		// IMPORTANT: These keys MUST match the field names in your Spring Boot ContactMessage entity
		senderName: "", // Maps to 'senderName' in ContactMessage.java
		senderEmail: "", // Maps to 'senderEmail' in ContactMessage.java
		subject: "",
		message: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitMessage("");

		try {
			// --- ACTUAL API CALL TO YOUR SPRING BOOT BACKEND ---
			// Ensure this URL exactly matches your ContactMessageController's @RequestMapping
			// which should be "/api/contact"
			const response = await axios.post(
				"http://localhost:8080/api/contact",
				formData
			);

			// Check for a successful response status (e.g., 200 OK or 201 Created)
			if (response.status === 201 || response.status === 200) {
				setSubmitMessage("Thank you! Your message has been sent successfully.");
				// Reset form data after successful submission
				setFormData({
					senderName: "",
					senderEmail: "",
					subject: "",
					message: "",
				});
			} else {
				// Handle unexpected successful responses if needed
				setSubmitMessage(
					"Message sent, but with an unexpected response from the server."
				);
				console.warn(
					"Unexpected response status:",
					response.status,
					response.data
				);
			}
		} catch (error) {
			console.error("Contact form submission error:", error);
			// Provide a more user-friendly error message based on the error response
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				setSubmitMessage(
					`Failed to send message: ${error.response.data || error.message}`
				);
			} else if (error.request) {
				// The request was made but no response was received
				setSubmitMessage(
					"Failed to send message: No response from server. Check your network or server status."
				);
			} else {
				// Something else happened in setting up the request that triggered an Error
				setSubmitMessage(
					"An unknown error occurred while sending your message."
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Hero Section */}
			<section
				className="relative bg-cover bg-center py-24 sm:py-32 md:py-40"
				style={{ backgroundImage: `url(${heroImageUrl})` }}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-purple-600/70"></div>
				<div className="relative container mx-auto px-6 lg:px-8 text-center z-10">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
						Get In Touch
					</h1>
					<p className="mt-6 text-lg sm:text-xl text-gray-100 max-w-2xl mx-auto">
						We're here to help! Whether you have a question about our products,
						an order, or just want to say hello, we'd love to hear from you.
					</p>
				</div>
			</section>

			{/* Contact Form and Info Section */}
			<section className="py-16 sm:py-20">
				<div className="container mx-auto px-6 lg:px-8">
					<div className="grid lg:grid-cols-12 gap-12">
						{/* Contact Form */}
						<div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-xl shadow-xl">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
								Send Us a Message
							</h2>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<label
										htmlFor="senderName"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Full Name
									</label>
									<input
										type="text"
										name="senderName" // Updated to match backend entity field
										id="senderName"
										value={formData.senderName}
										onChange={handleChange}
										required
										className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										placeholder="John Doe"
									/>
								</div>
								<div>
									<label
										htmlFor="senderEmail"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Email Address
									</label>
									<input
										type="email"
										name="senderEmail" // Updated to match backend entity field
										id="senderEmail"
										value={formData.senderEmail}
										onChange={handleChange}
										required
										className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										placeholder="you@example.com"
									/>
								</div>
								<div>
									<label
										htmlFor="subject"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Subject
									</label>
									<input
										type="text"
										name="subject"
										id="subject"
										value={formData.subject}
										onChange={handleChange}
										required
										className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										placeholder="Question about an order"
									/>
								</div>
								<div>
									<label
										htmlFor="message"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Message
									</label>
									<textarea
										name="message"
										id="message"
										rows="5"
										value={formData.message}
										onChange={handleChange}
										required
										className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
										placeholder="Your message here..."
									></textarea>
								</div>
								<div>
									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
									>
										{isSubmitting ? (
											<>
												<svg
													className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Sending...
											</>
										) : (
											<>
												<PaperAirplaneIcon className="h-5 w-5 mr-1" />
												Send Message
											</>
										)}
									</button>
								</div>
								{submitMessage && (
									<p
										className={`mt-4 text-sm text-center ${
											submitMessage.includes("error")
												? "text-red-600"
												: "text-green-600"
										}`}
									>
										{submitMessage}
									</p>
								)}
							</form>
						</div>

						{/* Contact Info & Map */}
						<div className="lg:col-span-5">
							<div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl h-full">
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
									Contact Information
								</h2>
								<div className="space-y-6">
									<div className="flex items-start">
										<MapPinIcon className="h-7 w-7 text-blue-600 mr-4 flex-shrink-0 mt-1" />
										<div>
											<h3 className="text-lg font-semibold text-gray-700">
												Our Address
											</h3>
											<p className="text-gray-600 text-sm">
												123 E-commerce Avenue, Fashion City, FS 12345,
												YourCountry
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<EnvelopeIcon className="h-7 w-7 text-blue-600 mr-4 flex-shrink-0 mt-1" />
										<div>
											<h3 className="text-lg font-semibold text-gray-700">
												Email Us
											</h3>
											<a
												href="mailto:support@clothingstore.com"
												className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
											>
												support@clothingstore.com
											</a>
											<br />
											<a
												href="mailto:partnerships@clothingstore.com"
												className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
											>
												partnerships@clothingstore.com
											</a>
										</div>
									</div>
									<div className="flex items-start">
										<PhoneIcon className="h-7 w-7 text-blue-600 mr-4 flex-shrink-0 mt-1" />
										<div>
											<h3 className="text-lg font-semibold text-gray-700">
												Call Us
											</h3>
											<a
												href="tel:+120000000000"
												className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
											>
												+12-000-000-0000
											</a>
										</div>
									</div>
								</div>

								{/* Map Placeholder */}
								<div className="mt-10">
									<h3 className="text-lg font-semibold text-gray-700 mb-3">
										Find Us Here
									</h3>
									<img
										src={mapImageUrl}
										alt="Location Map Placeholder"
										className="w-full h-56 object-cover rounded-lg shadow-md"
									/>
									{/* In a real app, you would embed an interactive map here (e.g., Google Maps iframe) */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ContactPage;
