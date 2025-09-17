import { ethers } from "ethers";
import { AlertCircle, ChevronDown, LogOut, User, Wallet } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// 支持的网络配置
const SUPPORTED_NETWORKS = {
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

interface WalletState {
	address: string | null;
	isConnected: boolean;
	chainId: number | null;
	balance: string | null;
	ensName: string | null;
	ensAvatar: string | null;
}

const WalletConnect = () => {
	const [walletState, setWalletState] = useState<WalletState>({
		address: null,
		isConnected: false,
		chainId: null,
		balance: null,
		ensName: null,
		ensAvatar: null,
	});
	const [isConnecting, setIsConnecting] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
	const buttonRef = useRef<HTMLButtonElement>(null);

	const disconnectWallet = useCallback(() => {
		setWalletState({
			address: null,
			isConnected: false,
			chainId: null,
			balance: null,
			ensName: null,
			ensAvatar: null,
		});
		setShowUserMenu(false);
	}, []);

	const checkWalletConnection = useCallback(async () => {
		try {
			if (!window.ethereum) return;

			const provider = new ethers.BrowserProvider(window.ethereum);
			const accounts = await provider.listAccounts();

			if (accounts.length > 0) {
				const network = await provider.getNetwork();
				const balance = await provider.getBalance(accounts[0].address);

				setWalletState((prev) => ({
					...prev,
					address: accounts[0].address,
					isConnected: true,
					chainId: Number(network.chainId),
					balance: ethers.formatEther(balance),
					// 保持已有的 ENS 信息，除非地址发生变化
					...(prev.address !== accounts[0].address
						? {
								ensName: null,
								ensAvatar: null,
							}
						: {}),
				}));
			}
		} catch (error) {
			console.error("检查钱包连接失败:", error);
		}
	}, []);

	const fetchENSInfo = useCallback(async (address: string) => {
		try {
			console.log(`开始查询地址 ${address} 的ENS信息（仅查询一次）...`);

			// 使用最稳定的方式：指定静态网络的 JsonRpcProvider
			const stableProviders = [
				"https://eth.llamarpc.com",
				"https://rpc.ankr.com/eth",
				"https://cloudflare-eth.com",
			];

			for (const rpcUrl of stableProviders) {
				try {
					console.log(`尝试使用稳定提供者: ${rpcUrl}`);

					// 创建提供者时指定静态网络，避免网络检测
					const provider = new ethers.JsonRpcProvider(rpcUrl, 1, {
						staticNetwork: ethers.Network.from(1),
					});

					// 设置超时
					const createTimeoutPromise = (ms: number, name: string) => {
						return new Promise((_, reject) => {
							setTimeout(() => reject(new Error(`${name}超时`)), ms);
						});
					};

					// 查询 ENS 名称
					const namePromise = provider.lookupAddress(address);
					const ensName = (await Promise.race([
						namePromise,
						createTimeoutPromise(5000, "ENS名称查询"),
					])) as string | null;

					if (ensName) {
						console.log(`ENS名称查询成功: ${ensName}`);
						let ensAvatar = null;

						// 查询 ENS 头像
						try {
							console.log(`开始获取 ${ensName} 的头像...`);
							const resolverPromise = provider.getResolver(ensName);
							const resolver = (await Promise.race([
								resolverPromise,
								createTimeoutPromise(5000, "Resolver查询"),
							])) as ethers.EnsResolver | null;

							if (resolver) {
								const avatarPromise = resolver.getAvatar();
								ensAvatar = (await Promise.race([
									avatarPromise,
									createTimeoutPromise(5000, "头像查询"),
								])) as string | null;

								if (ensAvatar) {
									console.log(`ENS头像获取成功: ${ensAvatar}`);
								} else {
									console.log("该ENS没有设置头像");
								}
							}
						} catch (avatarError) {
							console.warn(`获取 ${ensName} 头像失败:`, avatarError);
							// 头像获取失败不影响名称显示
						}

						// 更新状态
						setWalletState((prev) => ({
							...prev,
							ensName,
							ensAvatar,
						}));

						console.log(
							`ENS信息获取完成 - 名称: ${ensName}, 头像: ${ensAvatar ? "有" : "无"}`,
						);
						return; // 成功获取，退出循环
					} else {
						console.log(`地址 ${address} 没有ENS名称`);
					}
				} catch (providerError) {
					const errorMsg =
						providerError instanceof Error
							? providerError.message
							: String(providerError);
					console.warn(`提供者 ${rpcUrl} 查询失败:`, errorMsg);
				}
			}

			console.log("所有提供者都无法查询到ENS信息");
		} catch (error) {
			console.error("获取ENS信息失败:", error);
		}
	}, []);

	const handleAccountsChanged = useCallback(
		(accounts: string[]) => {
			if (accounts.length === 0) {
				disconnectWallet();
			} else {
				checkWalletConnection();
			}
		},
		[disconnectWallet, checkWalletConnection],
	);

	const handleChainChanged = useCallback(() => {
		checkWalletConnection();
	}, [checkWalletConnection]);

	const handleDisconnect = useCallback(() => {
		disconnectWallet();
	}, [disconnectWallet]);

	// 检查钱包连接状态
	useEffect(() => {
		const handleAccountsChangedWrapper = (accounts: unknown) => {
			handleAccountsChanged(accounts as string[]);
		};

		const handleChainChangedWrapper = () => {
			handleChainChanged();
		};

		const handleDisconnectWrapper = () => {
			handleDisconnect();
		};

		checkWalletConnection();

		if (window.ethereum) {
			window.ethereum.on("accountsChanged", handleAccountsChangedWrapper);
			window.ethereum.on("chainChanged", handleChainChangedWrapper);
			window.ethereum.on("disconnect", handleDisconnectWrapper);
		}

		return () => {
			if (window.ethereum) {
				window.ethereum.removeListener(
					"accountsChanged",
					handleAccountsChangedWrapper,
				);
				window.ethereum.removeListener(
					"chainChanged",
					handleChainChangedWrapper,
				);
				window.ethereum.removeListener("disconnect", handleDisconnectWrapper);
			}
		};
	}, [
		checkWalletConnection,
		handleAccountsChanged,
		handleChainChanged,
		handleDisconnect,
	]);

	// 获取ENS信息（只在地址变化时查询一次）
	useEffect(() => {
		if (walletState.address && !walletState.ensName) {
			fetchENSInfo(walletState.address);
		}
	}, [walletState.address, walletState.ensName, fetchENSInfo]);

	const connectWallet = async () => {
		if (!window.ethereum) {
			alert("请安装 MetaMask 钱包");
			return;
		}

		setIsConnecting(true);
		try {
			const provider = new ethers.BrowserProvider(window.ethereum);
			await provider.send("eth_requestAccounts", []);
			await checkWalletConnection();
		} catch (error) {
			console.error("连接钱包失败:", error);
		} finally {
			setIsConnecting(false);
		}
	};

	const formatAddress = (addr: string) => {
		if (!addr) return "";
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	const formatBalance = (balance: string | null) => {
		if (!balance) return "0";
		const num = parseFloat(balance);
		return num.toFixed(4);
	};

	// 切换网络
	const switchNetwork = async (chainId: number) => {
		if (!window.ethereum) return;

		try {
			// 尝试切换到指定网络
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: `0x${chainId.toString(16)}` }],
			});
		} catch (switchError: unknown) {
			// 如果网络不存在，尝试添加网络
			if (
				switchError &&
				typeof switchError === "object" &&
				"code" in switchError &&
				switchError.code === 4902
			) {
				const network =
					SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS];
				if (network) {
					try {
						await window.ethereum.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId: `0x${chainId.toString(16)}`,
									chainName: network.name,
									nativeCurrency: {
										name: network.symbol,
										symbol: network.symbol,
										decimals: 18,
									},
									rpcUrls: [network.rpcUrl],
									blockExplorerUrls: network.blockExplorer
										? [network.blockExplorer]
										: null,
								},
							],
						});
					} catch (addError) {
						console.error("添加网络失败:", addError);
					}
				}
			} else {
				console.error("切换网络失败:", switchError);
			}
		}
	};

	// 获取当前网络信息
	const getCurrentNetwork = () => {
		if (!walletState.chainId) return null;
		return SUPPORTED_NETWORKS[
			walletState.chainId as keyof typeof SUPPORTED_NETWORKS
		];
	};

	// 检查是否为支持的网络
	const isSupportedNetwork = () => {
		if (!walletState.chainId) return false;
		return walletState.chainId in SUPPORTED_NETWORKS;
	};

	return (
		<>
			{walletState.isConnected ? (
				<div className="relative z-50">
					{/* 网络状态指示器 */}
					{!isSupportedNetwork() && (
						<div className="absolute -top-2 -left-2 z-10">
							<div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
								<AlertCircle className="w-3 h-3" />
								<span>不支持的网络</span>
							</div>
						</div>
					)}

					<button
						ref={buttonRef}
						type="button"
						onClick={() => {
							if (buttonRef.current) {
								const rect = buttonRef.current.getBoundingClientRect();
								setMenuPosition({
									top: rect.bottom + 8,
									right: window.innerWidth - rect.right,
								});
							}
							setShowUserMenu(!showUserMenu);
						}}
						className={`flex items-center space-x-3 backdrop-blur-sm rounded-2xl px-4 py-3 border transition-all duration-300 group ${
							isSupportedNetwork()
								? "bg-white/15 border-white/20 hover:bg-white/20"
								: "bg-yellow-500/20 border-yellow-500/40 hover:bg-yellow-500/30"
						}`}
					>
						{/* 只有当有 ENS 信息时才显示头像和名称 */}
						{walletState.ensName || walletState.ensAvatar ? (
							<>
								{walletState.ensAvatar ? (
									<img
										src={walletState.ensAvatar}
										alt="ENS Avatar"
										className="w-8 h-8 rounded-full border-2 border-white/30"
									/>
								) : (
									<div className="w-8 h-8 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center">
										<User className="w-5 h-5" />
									</div>
								)}
								{walletState.ensName && (
									<div className="text-left hidden lg:block">
										<div className="text-sm font-semibold">
											{walletState.ensName}
										</div>
										<div className="text-xs text-white/70">
											{formatBalance(walletState.balance)} ETH
										</div>
									</div>
								)}
								<ChevronDown
									className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
								/>
							</>
						) : (
							/* 没有 ENS 信息时显示简洁的钱包图标 */
							<>
								<Wallet className="w-5 h-5" />
								<span className="text-sm font-medium hidden sm:inline">
									{formatAddress(walletState.address || "")}
								</span>
								<ChevronDown
									className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
								/>
							</>
						)}
					</button>
				</div>
			) : (
				<button
					type="button"
					onClick={connectWallet}
					disabled={isConnecting}
					className="flex items-center space-x-2 bg-white text-red-500 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
				>
					<Wallet className="w-5 h-5" />
					<span>{isConnecting ? "连接中..." : "连接钱包"}</span>
				</button>
			)}

			{/* Portal 渲染的用户菜单 */}
			{showUserMenu &&
				createPortal(
					<>
						{/* 背景遮罩 */}
						<button
							type="button"
							className="fixed inset-0 z-[90] bg-transparent border-0 cursor-default"
							onClick={() => setShowUserMenu(false)}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									setShowUserMenu(false);
								}
							}}
							aria-label="关闭菜单"
						/>

						{/* 下拉菜单 */}
						<div
							className="fixed w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-[100] transform transition-all duration-200 ease-out"
							style={{
								top: menuPosition.top,
								right: menuPosition.right,
								boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
							}}
						>
							<div className="px-4 py-3 border-b border-gray-100">
								<div className="flex items-center space-x-3">
									{walletState.ensAvatar ? (
										<img
											src={walletState.ensAvatar}
											alt="ENS Avatar"
											className="w-10 h-10 rounded-full"
										/>
									) : (
										<div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
											<User className="w-6 h-6 text-white" />
										</div>
									)}
									<div>
										<div className="font-semibold text-gray-900">
											{walletState.ensName ||
												formatAddress(walletState.address || "")}
										</div>
										<div className="text-sm text-gray-500">
											{formatAddress(walletState.address || "")}
										</div>
									</div>
								</div>
							</div>

							<div className="px-4 py-3 border-b border-gray-100">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">余额</span>
									<span className="font-semibold text-gray-900">
										{formatBalance(walletState.balance)}{" "}
										{getCurrentNetwork()?.symbol || "ETH"}
									</span>
								</div>
								<div className="flex justify-between items-center mt-1">
									<span className="text-sm text-gray-600">网络</span>
									<span
										className={`text-sm font-medium ${isSupportedNetwork() ? "text-green-600" : "text-yellow-600"}`}
									>
										{getCurrentNetwork()?.name ||
											`未知网络 (${walletState.chainId})`}
									</span>
								</div>
								{!isSupportedNetwork() && (
									<div className="mt-2 p-2 bg-yellow-50 rounded-lg">
										<p className="text-xs text-yellow-700">
											当前网络不受支持，请切换到支持的网络
										</p>
									</div>
								)}
							</div>

							{/* 网络切换选项 */}
							<div className="px-4 py-3 border-b border-gray-100">
								<div className="text-sm font-medium text-gray-700 mb-2">
									切换网络
								</div>
								<div className="space-y-1">
									{Object.entries(SUPPORTED_NETWORKS).map(
										([chainId, network]) => (
											<button
												key={chainId}
												type="button"
												onClick={() => switchNetwork(Number(chainId))}
												className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-between ${
													walletState.chainId === Number(chainId)
														? "bg-blue-50 text-blue-700 border border-blue-200"
														: "hover:bg-gray-50 text-gray-700"
												}`}
											>
												<span>{network.name}</span>
												{walletState.chainId === Number(chainId) && (
													<span className="text-blue-500 text-xs">当前</span>
												)}
											</button>
										),
									)}
								</div>
							</div>

							<button
								type="button"
								onClick={disconnectWallet}
								className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
							>
								<LogOut className="w-4 h-4" />
								<span>断开连接</span>
							</button>
						</div>
					</>,
					document.body,
				)}
		</>
	);
};

export default WalletConnect;
