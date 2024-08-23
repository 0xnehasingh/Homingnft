"use client"
import { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';

const ContactUs: React.FC = () => {
	const [state, handleSubmit] = useForm('xqazlppj');
	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
		subject: '',
		message: '',
	});
	if (state.succeeded) {
		return <p>Thanks for joining!</p>;
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	return (
		<section className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-6">
			<div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
				<h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Contact Us</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex space-x-4">
						<div className="flex flex-col w-1/2">
							<label htmlFor="firstName" className="text-gray-700 font-semibold">
								First Name
							</label>
							<input
								type="text"
								id="firstName"
								name="firstName"
								value={form.firstName}
								onChange={handleChange}
								className="mt-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>
						<div className="flex flex-col w-1/2">
							<label htmlFor="lastName" className="text-gray-700 font-semibold">
								Last Name
							</label>
							<input
								type="text"
								id="lastName"
								name="lastName"
								value={form.lastName}
								onChange={handleChange}
								className="mt-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>
					</div>
					<div className="flex flex-col">
						<label htmlFor="email" className="text-gray-700 font-semibold">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							className="mt-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>
					<div className="flex flex-col">
						<label htmlFor="subject" className="text-gray-700 font-semibold">
							Subject
						</label>
						<input
							type="text"
							id="subject"
							name="subject"
							value={form.subject}
							onChange={handleChange}
							className="mt-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>
					<div className="flex flex-col">
						<label htmlFor="message" className="text-gray-700 font-semibold">
							Message
						</label>
						<textarea
							id="message"
							name="message"
							value={form.message}
							onChange={handleChange}
							rows={5}
							className="mt-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
							required
						></textarea>
					</div>
					<button
						type="submit"
						className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded hover:opacity-90 transition-opacity"
					>
						Send it our way
					</button>
				</form>
			</div>
		</section>
	);
};

export default ContactUs;
