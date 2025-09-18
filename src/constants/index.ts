// 合约地址 - 已部署
export const RED_ENVELOPE_ADDRESS = {
	31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Hardhat 本地网络
	// 1337: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Hardhat 本地网络 (备用)
	11155111: "0x54b7c1B0ff111AcAd646298f3cA0227f0C6804AD", // Sepolia 测试网 - 部署后填入
};

// 支持的网络配置
export const SUPPORTED_NETWORKS = {
	1: {
		name: "以太坊主网",
		symbol: "ETH",
		rpcUrl: "https://ethereum-rpc.publicnode.com",
		blockExplorer: "https://etherscan.io",
	},
	11155111: {
		name: "Sepolia 测试网",
		symbol: "ETH",
		rpcUrl: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
		blockExplorer: "https://sepolia.etherscan.io",
	},
	31337: {
		name: "本地网络",
		symbol: "ETH",
		rpcUrl: "http://localhost:8545",
		blockExplorer: null,
	},
} as const;
