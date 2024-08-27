'use client';

import Icon from '@ant-design/icons';
import { Button, Layout, theme as ThemeManager } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { HiOutlineUser } from 'react-icons/hi';
import { useAccount, useConnect } from 'wagmi';
import { CreateButton } from './components/create-button';

export const Application = function Application({ children }: React.PropsWithChildren) {
	const router = useRouter();

	// Antd design token
	const { token } = ThemeManager.useToken();

	// Wagmi account data
	const { address, isConnecting, isConnected, isDisconnected } = useAccount();
	const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

	// NB: Only use metamask that is 0 in connectors array
	const connector = useMemo(() => {
		return connectors[0];
	}, [connectors]);

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Layout style={{ width: '100%', margin: 0 }}>
				<Layout.Header
					style={{
						height: 64 + token.padding,
						padding: `${token.padding / 2}px ${token.paddingLG}px`,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: 'transparent',
					}}
				>
					<div style={{ display: 'flex', cursor: 'pointer' }} onClick={() => router.push('/')}>
						<img src="/homing.svg" alt={'houseform logo'} className='w-40'/>
					</div>

					<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
						{isDisconnected ? (
							<Button disabled={!connector.ready} onClick={() => connect({ connector })}>
								{'Connect wallet'}
							</Button>
						) : (
							<>
								<CreateButton style={{ marginRight: token.margin }} />
								<Button
									icon={<Icon component={() => <HiOutlineUser />} />}
									onClick={() => router.push('/users/' + address)}
								/>
							</>
						)}
					</div>
				</Layout.Header>

				<Layout.Content>{children}</Layout.Content>

				<Layout.Footer className="bg-gradient-to-r from-white to-blue-50 text-gray-800 py-12">
					<div className="container mx-auto px-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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
				</Layout.Footer>
			</Layout>
		</Layout>
	);
};
