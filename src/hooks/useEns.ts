import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

export interface EnsInfo {
	name: string | null;
	avatar: string | null;
}

const stableProviders = [
	"https://eth.llamarpc.com",
	"https://rpc.ankr.com/eth",
	"https://cloudflare-eth.com",
];

export const useEns = (address: string | null) => {
	const [ensInfo, setEnsInfo] = useState<EnsInfo>({
		name: null,
		avatar: null,
	});
	const [isLoading, setIsLoading] = useState(false);

	const fetchEnsInfo = useCallback(async (addr: string) => {
		setIsLoading(true);
		setEnsInfo({ name: null, avatar: null });

		try {
			for (const rpcUrl of stableProviders) {
				try {
					const provider = new ethers.JsonRpcProvider(rpcUrl, 1, {
						staticNetwork: ethers.Network.from(1),
					});

					const createTimeoutPromise = (ms: number, name: string) => {
						return new Promise((_, reject) => {
							setTimeout(() => reject(new Error(`${name}超时`)), ms);
						});
					};

					const namePromise = provider.lookupAddress(addr);
					const ensName = (await Promise.race([
						namePromise,
						createTimeoutPromise(5000, "ENS名称查询"),
					])) as string | null;

					if (ensName) {
						let ensAvatar = null;
						try {
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
							}
						} catch (avatarError) {
							console.warn(`获取 ${ensName} 头像失败:`, avatarError);
						}

						setEnsInfo({ name: ensName, avatar: ensAvatar });
						return;
					}
				} catch (providerError) {
					const errorMsg =
						providerError instanceof Error
							? providerError.message
							: String(providerError);
					console.warn(`提供者 ${rpcUrl} 查询失败:`, errorMsg);
				}
			}
		} catch (error) {
			console.error("获取ENS信息失败:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!address) {
			setEnsInfo({ name: null, avatar: null });
			return;
		}

		fetchEnsInfo(address);
	}, [address, fetchEnsInfo]);

	return {
		ensName: ensInfo.name,
		ensAvatar: ensInfo.avatar,
		isLoadingEns: isLoading,
	};
};
