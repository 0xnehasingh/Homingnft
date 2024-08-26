'use client';

import {
	Avatar,
	Badge,
	Button,
	Card,
	Col,
	Form,
	InputNumber,
	Modal,
	Progress,
	Result,
	Row,
	Spin,
	Statistic,
	theme as ThemeManager,
	Typography,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useContractReads, useWalletClient } from 'wagmi';
import { getPublicClient, waitForTransaction } from 'wagmi/actions';
import { KlaytnConstants } from '../../../constants/klaytn';
import { Metadata } from '../../_interfaces/metadata';
import { TokenUtils } from '../../_utils/token-utils';
import { TypeMapper } from '../../_utils/type-mapper';
import { ProjectUtils } from '../../_utils/project-utils';
import Icon from '@ant-design/icons';
import { HiOutlineIdentification, HiOutlineCubeTransparent } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const RESULT_ICON_SIZE = 64;

export default function ProjectPage({ params }: { params: { projectId: bigint } }) {
	const router = useRouter();
	const { token } = ThemeManager.useToken();

	const projectId = useMemo(() => {
		return params.projectId;
	}, [params]);

	const { data, isError, isLoading, refetch } = useContractReads({
		contracts: [
			{
				address: KlaytnConstants.NETWORK_DATA.contracts.HouseformManager.address as any,
				abi: [
					{
						inputs: [
							{
								internalType: 'uint256',
								name: '_projectId',
								type: 'uint256',
							},
						],
						name: 'getProject',
						outputs: [
							{
								components: [
									{
										internalType: 'uint256',
										name: 'projectId',
										type: 'uint256',
									},
									{
										internalType: 'address',
										name: 'builder',
										type: 'address',
									},
									{
										internalType: 'uint256',
										name: 'currentAmount',
										type: 'uint256',
									},
									{
										internalType: 'uint256',
										name: 'goalAmount',
										type: 'uint256',
									},
									{
										internalType: 'uint256',
										name: 'saleAmount',
										type: 'uint256',
									},
									{
										internalType: 'uint256',
										name: 'expectedProfit',
										type: 'uint256',
									},
									{
										internalType: 'uint256',
										name: 'builderFee',
										type: 'uint256',
									},
									{
										internalType: 'uint256',
										name: 'currentShares',
										type: 'uint256',
									},
									{
										internalType: 'uint256',
										name: 'totalShares',
										type: 'uint256',
									},
									{
										internalType: 'uint256',
										name: 'fundraisingDeadline',
										type: 'uint256',
									},
									{
										internalType: 'uint256',
										name: 'fundraisingCompletedOn',
										type: 'uint256',
									},
									{
										internalType: 'uint256',
										name: 'buildingStartedOn',
										type: 'uint256',
									},
									{
										internalType: 'uint256',
										name: 'buildingCompletedOn',
										type: 'uint256',
									},
								],
								internalType: 'struct HouseformManager.Project',
								name: '',
								type: 'tuple',
							},
						],
						stateMutability: 'view',
						type: 'function',
					},
				],
				functionName: 'getProject',
				args: [projectId],
			},
			{
				address: KlaytnConstants.NETWORK_DATA.contracts.HouseformShare.address as any,
				abi: [
					{
						inputs: [
							{
								internalType: 'uint256',
								name: '_id',
								type: 'uint256',
							},
						],
						name: 'uri',
						outputs: [
							{
								internalType: 'string',
								name: '',
								type: 'string',
							},
						],
						stateMutability: 'view',
						type: 'function',
					},
				],
				functionName: 'uri',
				args: [projectId],
			},
		],
	});

	// Convert project adhering interface
	const project = useMemo(() => {
		if (!data) return null;
		return TypeMapper.toProject(data[0].result as any);
	}, [data]);

	// Get project state
	const projectState = useMemo(() => {
		if (!project) return null;
		return ProjectUtils.getProjetState(project);
	}, [project]);

	// Handle metadata
	const [metadata, setMetadata] = useState<Metadata | null>(null);
	useEffect(() => {
		const fetchMetadata = async () => {
			if (!data) return;
			const result = await fetch(data[1].result as any);
			const _metadata = await result.json();
			setMetadata(_metadata);
		};

		fetchMetadata();
	}, [data]);

	// To handle buy shares loading modal
	const [loadingModal, loadingModalContextHolder] = Modal.useModal();

	// Get wallet client to do transactions
	const { data: walletClient } = useWalletClient();
	// Execute share buy
	const onBuyShares = useCallback(
		async (projectId: bigint, shares: number, amount: bigint) => {
			try {
				// Validate it exists
				if (!walletClient) throw new Error();

				const instance = loadingModal.success({
					icon: null,
					title: 'Buying ' + shares + (shares > 1 ? ' shares ...' : ' share ...'),
					content: (
						<Result
							icon={
								<Spin
									indicator={
										<Icon
											style={{ fontSize: RESULT_ICON_SIZE, color: token.colorPrimary }}
											component={(props: any) => <HiOutlineCubeTransparent {...props} fill={'none'} />}
											spin={true}
										/>
									}
								/>
							}
							title={'Submitting transaction...'}
							style={{ paddingTop: token.paddingLG, paddingBottom: token.paddingLG }}
						/>
					),
					footer: null,
					closable: false,
					centered: true,
					maskClosable: false,
				});

				// Execute write with simulate to validate transaction
				const { request } = await getPublicClient().simulateContract({
					account: walletClient.account.address,
					address: KlaytnConstants.NETWORK_DATA.contracts.HouseformManager.address as any,
					abi: [
						{
							inputs: [
								{
									internalType: 'uint256',
									name: '_projectId',
									type: 'uint256',
								},
								{
									internalType: 'uint256',
									name: '_shares',
									type: 'uint256',
								},
							],
							name: 'buyShares',
							outputs: [],
							stateMutability: 'payable',
							type: 'function',
						},
					],
					functionName: 'buyShares',
					args: [projectId, TokenUtils.toBigInt(shares, 0)],
					value: amount,
				});

				// If we are here it means no error has been thrown so continue and execute the transaction
				const hash = await walletClient.writeContract(request);
				// Wait for transaction to be confirmed
				const receipt = await waitForTransaction({ hash });
				console.log(receipt);

				// Refetch projects to update data
				await refetch();

				instance.destroy();
			} catch (error) {
				// hehe
				console.log(error);
			}
		},
		[walletClient, loadingModal, token, refetch],
	);

	// Calculate share cost
	const shareCost = useMemo(() => {
		if (!project) return null;
		return project.goalAmount / BigInt(project.totalShares);
	}, [project]);

	// Get connected user if any
	const { address, isConnecting, isConnected, isDisconnected } = useAccount();
	// Get if connected user is builder
	const isBuilder = useMemo(() => {
		if (!isConnected || !address || !project) return false;
		return project.builder === address;
	}, [address, isConnected, project]);

	if (!project || !projectState || !metadata || !shareCost) return null;
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<header className="bg-white shadow-md">
				<div className="container mx-auto px-4 py-4 flex justify-between items-center">
					<div className="flex items-center space-x-2">
						<img src="/logo.png" alt="Logo" className="h-8 w-8" />
						<span className="text-xl font-bold text-blue-600">HOME</span>
					</div>
					<nav>
						<ul className="flex space-x-4">
							<li>
								<a href="#" className="text-blue-600 hover:text-blue-800">
									Home
								</a>
							</li>
							<li>
								<a href="#" className="text-blue-600 hover:text-blue-800">
									Projects
								</a>
							</li>
							<li>
								<a href="#" className="text-blue-600 hover:text-blue-800">
									About
								</a>
							</li>
						</ul>
					</nav>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				{loadingModalContextHolder}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col lg:flex-row gap-8"
				>
					<div className="w-full lg:w-2/3">
						<motion.div
							whileHover={{ scale: 1.02 }}
							transition={{ type: 'spring', stiffness: 300 }}
							className="bg-white rounded-lg shadow-lg overflow-hidden"
						>
							<div className="p-4">
								<div className="relative w-full h-0 pb-[56.25%]">
									<img
										src={metadata?.image}
										className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
										alt={metadata?.name}
									/>
								</div>
							</div>
							<div className="p-6">
								<div className="flex justify-between items-center mb-4">
									<div
										className="flex items-center space-x-2 cursor-pointer"
										onClick={() => router.push('/users/' + project.builder)}
									>
										<Avatar
											shape="circle"
											icon={<HiOutlineIdentification className="text-blue-600" />}
											className="bg-blue-100"
										/>
										<Typography.Text className="text-sm text-blue-600">
											{project.builder.slice(0, 4) + '...' + project.builder.slice(-4)}
										</Typography.Text>
									</div>
									<Badge count={'#' + project.projectId} className="bg-blue-500" />
								</div>
								<Typography.Title level={4} className="mb-2 text-blue-800">
									{metadata?.name}
								</Typography.Title>
								<Typography.Paragraph className="text-blue-600">{metadata?.description}</Typography.Paragraph>
							</div>
						</motion.div>
					</div>
					<div className="w-full lg:w-1/3 space-y-6">
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="bg-white rounded-lg shadow-lg p-6"
						>
							<div className="space-y-4">
								<Badge
									className="mb-2"
									text={projectState ? ProjectUtils.getProjetStateData(projectState)[0] : undefined}
									color={projectState ? ProjectUtils.getProjetStateData(projectState)[1] : undefined}
								/>
								<Statistic
									title="Available shares"
									value={project.totalShares - project.currentShares}
									suffix={'/ ' + project.totalShares}
									className="mb-4"
								/>
								<Statistic
									title="Expected profit"
									value={project.expectedProfit}
									valueStyle={{ color: '#10B981' }}
									suffix="%"
									className="mb-4"
								/>
								<div>
									<Statistic
										title="Current amount"
										value={TokenUtils.toNumber(project.currentAmount, 18)}
										suffix={' / ' + TokenUtils.toNumber(project.goalAmount, 18) + ' KLAY'}
										className="mb-2"
									/>
									<motion.div
										initial={{ width: 0 }}
										animate={{ width: `${(project.currentShares / project.totalShares) * 100}%` }}
										transition={{ duration: 1, ease: 'easeOut' }}
										className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
									/>
								</div>
								<Typography.Text type="secondary" className="block text-sm">
									1 share = {Math.round(TokenUtils.toNumber(shareCost, 18))} KLAY (~
									{Math.round(
										(KlaytnConstants.NETWORK_DATA.general.klaytnPrice * TokenUtils.toNumber(project.goalAmount, 18)) /
											project.totalShares,
									)}{' '}
									USD)
								</Typography.Text>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className="bg-white rounded-lg shadow-lg p-6"
						>
							<Form
								layout="vertical"
								initialValues={{ shares: 1 }}
								onFinish={(values) => onBuyShares(params.projectId, values.shares, BigInt(values.shares) * shareCost)}
								disabled={!isConnected || projectState !== 'fundraising'}
								className="space-y-4"
							>
								<Form.Item name="shares" rules={[{ required: true }]}>
									<InputNumber
										min={1}
										max={project.totalShares - project.currentShares}
										addonAfter="Shares"
										className="w-full"
									/>
								</Form.Item>
								<Form.Item>
									<Button
										type="primary"
										htmlType="submit"
										className="w-full bg-blue-500 hover:bg-blue-600 transition duration-300"
									>
										Buy Shares
									</Button>
								</Form.Item>
							</Form>
							{projectState === 'fundraising' && (
								<Typography.Text type="secondary" className="block text-sm mt-2">
									Fundraising ends on{' '}
									{new Date(project.fundraisingDeadline * 1000).toLocaleDateString('en-us', {
										day: 'numeric',
										month: 'short',
									})}
								</Typography.Text>
							)}
						</motion.div>
					</div>
				</motion.div>
			</main>

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
						<p className="text-gray-600">&copy; 2024 GoHomes. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
