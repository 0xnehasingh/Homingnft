'use client';

import Icon from '@ant-design/icons';
import { List, Modal, Result, Spin, theme as ThemeManager } from 'antd';
import React, { useCallback } from 'react';
import { HiOutlineCubeTransparent } from 'react-icons/hi';
import { Project } from '../../_interfaces/project';
import { ProjectCard } from './components/project-card';
import { Metadata } from '../../_interfaces/metadata';

const RESULT_ICON_SIZE = 64;

export const ProjectCardGrid = function ProjectCardGrid({
	projects,
	disabled,
	onItemClick,
	onGetMetadata,
	onBuyShares,
}: {
	projects: Project[];
	disabled?: boolean;
	onItemClick: (projectId: bigint) => void;
	onGetMetadata: (projectId: bigint) => Promise<Metadata | null> | Metadata | null;
	onBuyShares: (projectId: bigint, shares: number, amount: bigint) => Promise<void> | void;
}) {
	const { token } = ThemeManager.useToken();

	// To handle buy shares loading modal
	const [loadingModal, loadingModalContextHolder] = Modal.useModal();
	// To handle buying shares for a project
	const onBuySharesWrapper = useCallback(
		async (projectId: bigint, shares: number, amount: bigint) => {
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

			await onBuyShares(projectId, shares, amount);
			instance.destroy();
		},
		[loadingModal, token, onBuyShares],
	);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
				padding: '20px',
				width: '100%',
				minHeight: '100vh',
				boxSizing: 'border-box',
			}}
		>
			<List
				grid={{
					gutter: 24,
					xs: 1, // 1 column for mobile devices
					sm: 2, // 2 columns for tablets
					md: 3, // 3 columns for smaller laptops
					lg: 4, // 4 columns for larger laptops and desktops
					xl: 4, // Maintain 4 columns for extra large screens
					xxl: 4, // Maintain 4 columns for extra extra large screens
				}}
				dataSource={projects}
				renderItem={(item, index) => (
					<List.Item
						style={{
							transition: 'transform 0.3s',
							cursor: 'pointer',
						}}
					>
						<ProjectCard
							id={index}
							project={item}
							onClick={() => onItemClick(item.projectId)}
							onGetMetadata={async () => await onGetMetadata(item.projectId)}
							onBuyShares={async (shares, amount) => await onBuySharesWrapper(item.projectId, shares, amount)}
							disabled={disabled}
						/>
					</List.Item>
				)}
			/>
		</div>
	);
};
