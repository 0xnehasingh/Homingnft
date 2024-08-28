'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, DollarSign, Compass, ArrowRight, ChevronDown, Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';

const GoHomesLandingPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-white text-gray-800 font-sans">
			<Hero />
			<TopListedProperties />
			<WhyTokenizedRealEstate />
			<GettingStarted />
			<Benefits />
			<FAQ />
		</div>
	);
};

export const Header: React.FC = () => (
	<header className="bg-gradient-to-r from-white via-blue-50 to-white shadow-md border-b border-blue-200">
		<div className="container mx-auto py-4 px-6 flex justify-between items-center">
			<div className="flex items-center">
				<img
					src="/homing.svg"
					alt="GoHomes Logo"
					className="w-40"
					style={{marginLeft: -40}}
				/>
			</div>
			<nav>
				<ul className="flex space-x-8 text-lg">
					<li>
						<a href="About-us" className="text-gray-800 hover:text-blue-700 transition-colors duration-300">
							About Us
						</a>
					</li>
					<li>
						<a href="/dashboard" className="text-gray-800 hover:text-blue-700 transition-colors duration-300">
							Marketplace
						</a>
					</li>
					<li>
						<a href="#" className="text-gray-800 hover:text-blue-700 transition-colors duration-300">
							White Paper
						</a>
					</li>
					<li>
						<a href="/contact" className="text-gray-800 hover:text-blue-700 transition-colors duration-300">
							Contact
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</header>
);

const Hero: React.FC = () => (
	<motion.section
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		transition={{ duration: 1 }}
		className="bg-gradient-to-r from-blue-100 to-purple-200 text-gray-900 py-24"
	>
		<div className="container mx-auto px-6 text-center">
			<motion.h2
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="text-5xl md:text-6xl font-extrabold mb-6"
			>
				Revolutionizing Real Estate Investment
			</motion.h2>
			<motion.p
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.5, duration: 0.6 }}
				className="text-2xl mb-10"
			>
				Tokenized commercial real estate for the modern investor
			</motion.p>
			<Link href="/dashboard">
				<motion.button
					whileHover={{ scale: 1.08 }}
					whileTap={{ scale: 0.95 }}
					className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-full inline-flex items-center shadow-lg hover:bg-blue-700 transition-colors duration-300"
				>
					Explore Properties
					<ArrowRight className="ml-3 w-6 h-6" />
				</motion.button>
			</Link>
		</div>
	</motion.section>
);

const TopListedProperties: React.FC = () => (
	<section className="py-16 bg-gray-100">
		<div className="container mx-auto px-6">
			<h2 className="text-3xl font-bold mb-8 text-center">Top Listed Properties</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{[1, 2, 3].map((i) => (
					<motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-white rounded-lg shadow-lg overflow-hidden">
						<img
							src={`/house/house${i}.png`}
							alt={`Property ${i}`}
							className="w-full h-48 object-cover"
						/>
						<div className="p-6">
							<h3 className="text-xl font-semibold mb-2">Luxury Office Space {i}</h3>
							<p className="text-gray-600 mb-4">Prime location, high yield potential</p>
							<button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
								View Details
							</button>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	</section>
);

const WhyTokenizedRealEstate: React.FC = () => (
	<section className="py-16">
		<div className="container mx-auto px-6">
			<h2 className="text-3xl font-bold mb-8 text-center">Why Tokenized Commercial Real Estate?</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div>
					<h3 className="text-2xl font-semibold mb-4">Accessibility</h3>
					<p>Invest in high-value properties with lower capital requirements through fractional ownership.</p>
				</div>
				<div>
					<h3 className="text-2xl font-semibold mb-4">Liquidity</h3>
					<p>Trade your real estate tokens easily on our marketplace, providing unprecedented liquidity.</p>
				</div>
				<div>
					<h3 className="text-2xl font-semibold mb-4">Transparency</h3>
					<p>Blockchain technology ensures all transactions and ownership records are transparent and immutable.</p>
				</div>
				<div>
					<h3 className="text-2xl font-semibold mb-4">Diversification</h3>
					<p>Spread your investment across multiple properties and markets with ease.</p>
				</div>
			</div>
		</div>
	</section>
);

const GettingStarted: React.FC = () => (
	<section className="py-16 bg-blue-50">
		<div className="container mx-auto px-6">
			<h2 className="text-3xl font-bold mb-8 text-center">Getting Started is Easy</h2>
			<div className="flex flex-col md:flex-row justify-between items-center">
				<motion.div
					whileHover={{ scale: 1.05 }}
					className="bg-white p-6 rounded-lg shadow-md mb-6 md:mb-0 md:mr-4 flex-1"
				>
					<h3 className="text-xl font-semibold mb-2">1. Create an Account</h3>
					<p>Sign up and complete our simple verification process.</p>
				</motion.div>
				<motion.div
					whileHover={{ scale: 1.05 }}
					className="bg-white p-6 rounded-lg shadow-md mb-6 md:mb-0 md:mx-4 flex-1"
				>
					<h3 className="text-xl font-semibold mb-2">2. Browse Properties</h3>
					<p>Explore our curated selection of high-quality commercial real estate.</p>
				</motion.div>
				<motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-md flex-1">
					<h3 className="text-xl font-semibold mb-2">3. Invest</h3>
					<p>Choose your investment amount and become a property owner.</p>
				</motion.div>
			</div>
		</div>
	</section>
);

const Benefits: React.FC = () => (
	<section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800">
		<div className="container mx-auto px-6">
			<h2 className="text-4xl font-extrabold mb-8 text-center">Why Invest with Us?</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{[
					'Low minimum investment',
					'Professional property management',
					'Regular dividend payments',
					'Tax benefits of real estate ownership',
					'Portfolio diversification',
					'Access to premium properties',
				].map((benefit, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.2 }}
						className="flex items-center p-4 bg-white rounded-lg shadow-lg"
					>
						<Check className="text-green-400 w-6 h-6 mr-4" />
						<span className="text-lg font-medium">{benefit}</span>
					</motion.div>
				))}
			</div>
		</div>
	</section>
);

const FAQ: React.FC = () => {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const toggleAccordion = (index: number) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	const faqs = [
		{
			title: 'What is tokenized real estate?',
			content:
				'Tokenized real estate involves dividing ownership of a property into digital tokens on a blockchain, allowing for fractional ownership and easier trading of real estate assets.',
		},
		{
			title: 'How do I earn returns?',
			content:
				'You can earn returns through regular dividend payments from rental income and potential capital appreciation of the property value.',
		},
		{
			title: 'Is my investment secure?',
			content:
				'Yes, your investment is backed by real, physical assets. We use advanced blockchain technology and follow strict regulatory guidelines to ensure the security of your investment.',
		},
		{
			title: 'How do I get started?',
			content:
				'To get started, simply sign up on our platform, complete the KYC process, and start exploring investment opportunities tailored to your preferences.',
		},
		{
			title: 'Can I sell my tokens?',
			content:
				"Yes, you can sell your tokens on our platform's secondary market, providing liquidity for your investments.",
		},
		{
			title: 'Are there any fees?',
			content:
				'We charge a small management fee for property upkeep and a platform fee for transactions. All fees are transparent and detailed in your account.',
		},
	];

	return (
		<section className="py-16 bg-gray-50 text-gray-800">
			<div className="container mx-auto px-6">
				<h2 className="text-4xl font-extrabold mb-8 text-center">Frequently Asked Questions</h2>
				<div className="w-full max-w-2xl mx-auto">
					{faqs.map((faq, index) => (
						<div key={index} className="mb-4">
							<button
								onClick={() => toggleAccordion(index)}
								className="w-full text-left text-lg font-semibold focus:outline-none"
							>
								<div
									className={`flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow ${
										activeIndex === index ? 'text-blue-500' : ''
									}`}
								>
									<span>{faq.title}</span>
									<span>{activeIndex === index ? '-' : '+'}</span>
								</div>
							</button>
							{activeIndex === index && (
								<div className="px-4 pt-2 pb-4 bg-white rounded-b-lg text-gray-600">{faq.content}</div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export const Footer: React.FC = () => (
	<footer className="bg-gradient-to-r from-white to-blue-50 text-gray-800 py-12">
		<div className="container mx-auto px-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				<div>
					<h3 className="text-xl font-bold text-blue-700 mb-4">Homing</h3>
					<p className="text-gray-600">Revolutionizing real estate investment through tokenization.</p>
				</div>
				<div>
					<h3 className="text-lg font-semibold text-blue-700 mb-4">Quick Links</h3>
					<ul className="space-y-2">
						<li>
							<a href="#" className="hover:text-blue-600 transition-colors duration-300">
								Home
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-blue-600 transition-colors duration-300">
								Properties
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-blue-600 transition-colors duration-300">
								About Us
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-blue-600 transition-colors duration-300">
								Contact
							</a>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="text-lg font-semibold text-blue-700 mb-4">Legal</h3>
					<ul className="space-y-2">
						<li>
							<a href="#" className="hover:text-blue-600 transition-colors duration-300">
								Terms of Service
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-blue-600 transition-colors duration-300">
								Privacy Policy
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-blue-600 transition-colors duration-300">
								Cookie Policy
							</a>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="text-lg font-semibold text-blue-700 mb-4">Connect</h3>
					<ul className="space-y-2">
						<li>
							<a href="#" className="hover:text-blue-600 transition-colors duration-300">
								Twitter
							</a>
						</li>
						<li>
							<a href="#" className="hover:text-blue-600 transition-colors duration-300">
								LinkedIn
							</a>
						</li>
						
					</ul>
				</div>
			</div>
			<div className="mt-8 pt-8 border-t border-blue-200 text-center">
				<p className="text-gray-600">&copy; 2024 Homing. All rights reserved.</p>
			</div>
		</div>
	</footer>
);

export default GoHomesLandingPage;
