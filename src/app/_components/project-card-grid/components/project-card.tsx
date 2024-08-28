'use client';

import {
	Avatar,
	Badge,
	Button,
	Card,
	Col,
	Form,
	InputNumber,
	Progress,
	Row,
	Statistic,
	theme as ThemeManager,
	Typography,
} from 'antd';
import { JSX, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { KlaytnConstants } from '../../../../constants/klaytn';
import { Metadata } from '../../../_interfaces/metadata';
import { Project } from '../../../_interfaces/project';
import { TokenUtils } from '../../../_utils/token-utils';
import { ProjectUtils } from '../../../_utils/project-utils';
import Icon from '@ant-design/icons';
import { HiOutlineIdentification } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { IconBaseProps } from 'react-icons/lib';

export const ProjectCard = function ProjectCard({
	id,
	project,
	disabled,
	onClick,
	onGetMetadata,
	onBuyShares,
}: {
	id: number;
	project: Project;
	disabled?: boolean;
	onClick: () => void;
	onGetMetadata: () => Promise<Metadata | null> | Metadata | null;
	onBuyShares: (shares: number, amount: bigint) => Promise<void> | void;
}) {
	const { address, isConnecting, isConnected, isDisconnected } = useAccount();

	const router = useRouter();
	const { token } = ThemeManager.useToken();

	// Get project state
	const projectState = useMemo(() => {
		if (!project) return null;
		return ProjectUtils.getProjetState(project);
	}, [project]);

	const [metadata, setMetadata] = useState<Metadata | null>(null);
	useEffect(() => {
		const fetchMetadata = async () => {
			const _metadata = await onGetMetadata();
			setMetadata(_metadata);
		};
		fetchMetadata();
	}, [onGetMetadata]);

	const shareCost = useMemo(() => {
		return project.goalAmount / BigInt(project.totalShares);
	}, [project]);

	return (
		<Badge.Ribbon
			text={projectState ? ProjectUtils.getProjetStateData(projectState)[0] : undefined}
			color={projectState ? ProjectUtils.getProjetStateData(projectState)[1] : '#007bff'}
		>
			<Card
				cover={
					<div onClick={onClick} style={{ width: '100%', padding: '16px', cursor: 'pointer', borderRadius: '12px' }}>
						<img
							src={metadata?.image}
							width={'100%'}
							height={300}
							style={{ borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
						/>
					</div>
				}
				bodyStyle={{ paddingTop: 0, padding: '16px' }}
				style={{ borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}
			>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '8px',
						}}
					>
						<div
							style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}
							onClick={() => router.push('/users/' + project.builder)}
						>
							<Avatar
								shape={'circle'}
								icon={
									<Icon
										style={{ color: '#5a5a5a' }}
										component={(props: JSX.IntrinsicAttributes & IconBaseProps) => (
											<HiOutlineIdentification {...props} fill={'none'} />
										)}
									/>
								}
								style={{ backgroundColor: '#f0f0f0' }}
							/>
							<Typography.Text type={'secondary'} style={{ marginLeft: '8px', fontSize: '0.9em', color: '#5a5a5a' }}>
								{project.builder.slice(0, 4) + '...' + project.builder.slice(-4, project.builder.length)}
							</Typography.Text>
						</div>
						<Typography.Text style={{ margin: 0, fontSize: '0.9em', color: '#5a5a5a' }}>
							{'#' + project.projectId}
						</Typography.Text>
					</div>

					<Typography.Title level={5} style={{ marginTop: '8px', color: '#333' }}>
						{metadata?.name}
					</Typography.Title>

					<Typography.Text style={{ height: 60, overflow: 'hidden', color: '#666' }}>
						{metadata?.description}
					</Typography.Text>

					<Row gutter={16} style={{ height: 120, marginTop: '16px' }}>
						<Col span={12}>
							<Statistic
								title={
									<span>
										<Icon type="stock" /> Available shares
									</span>
								}
								value={project.totalShares - project.currentShares}
								suffix={'/ ' + project.totalShares}
							/>
						</Col>
						<Col span={12}>
							<Statistic
								title={
									<span>
										<Icon type="rise" /> Expected profit
									</span>
								}
								value={project.expectedProfit}
								valueStyle={{ color: '#3f8600' }}
								suffix={'%'}
							/>
						</Col>
					</Row>

					<div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
						<Typography.Text strong={true} style={{ color: '#333' }}>
							{TokenUtils.toNumber(project.currentAmount, 18) +
								' / ' +
								TokenUtils.toNumber(project.goalAmount, 18) +
								' KLAY'}
						</Typography.Text>
						<Progress
							percent={(project.currentShares / project.totalShares) * 100}
							size={'small'}
							showInfo={false}
							strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
						/>
					</div>

					<Typography.Text type={'secondary'} style={{ marginTop: '16px', color: '#5a5a5a' }}>
						{'1 share = ' +
							Math.round(TokenUtils.toNumber(shareCost, 18)) +
							' KLAY (~' +
							Math.round(
								(KlaytnConstants.NETWORK_DATA.general.klaytnPrice * TokenUtils.toNumber(project.goalAmount, 18)) /
									project.totalShares,
							) +
							' USD)'}
					</Typography.Text>

					<div style={{ display: 'flex', marginTop: '24px', alignItems: 'center' }}>
						<Form
							layout={'inline'}
							initialValues={{ shares: 1 }}
							style={{ width: '100%' }}
							onFinish={(values) => onBuyShares(values.shares, BigInt(values.shares) * shareCost)}
							disabled={disabled || projectState !== 'fundraising'}
						>
							<div style={{ width: '100%', display: 'flex' }}>
								<div>
									<Form.Item name={'shares'} rules={[{ required: true }]}>
										<InputNumber min={1} max={project.totalShares - project.currentShares} addonAfter={'Shares'} />
									</Form.Item>
								</div>
								<div style={{ flex: 1 }}>
									<Form.Item style={{ flex: 1, marginRight: 0 }}>
										<Button
											type={'primary'}
											htmlType={'submit'}
											block={true}
											style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
										>
											{'Buy'}
										</Button>
									</Form.Item>
								</div>
							</div>
						</Form>
					</div>
				</div>
			</Card>
		</Badge.Ribbon>
	);
};
