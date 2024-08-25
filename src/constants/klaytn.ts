export type NetworkType = 'testnet' | 'mainnet';

export const NETWORK_DATA_MAP = {
	mainnet: {
		general: {
			klaytnPrice: 0.15,
		},
		contracts: {
			HouseformManager: {
				address: '',
			},
			HouseformShare: {
				address: '',
			},
		},
	},
	testnet: {
		general: {
			klaytnPrice: 0.15,
		},
		contracts: {
			HouseformManager: {
				address: '0x363bE2137C39dFDa97d305C5a2BAc7df2ad51CD2',
			},
			HouseformShare: {
				address: '0x9E67591cCb8107Ede18373514Ade20794FF605d4',
			},
		},
	},
};

export class KlaytnConstants {
	// This defines the network to be used through the app (mainnet or testnet) loaded through env
	public static NETWORK_TYPE = (process.env.NEXT_PUBLIC_NETWORK_TYPE || 'testnet') as NetworkType;
	// This is always used to access network data
	public static NETWORK_DATA = NETWORK_DATA_MAP[KlaytnConstants.NETWORK_TYPE];
}
