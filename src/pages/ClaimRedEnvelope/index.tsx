import { BrowserProvider, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import RedEnvelopeAbi from "@/abis/RedEnvelope.json";
import { RED_ENVELOPE_ADDRESS } from "@/constants";
import ClaimSection from "./ClaimSection";
import EnvelopeItem from "./EnvelopeItem";

const EnvelopeList = () => {
	const [address, setAddress] = useState<string | null>(null);
	const [chainId, setChainId] = useState<bigint | null>(null);
	const [provider, setProvider] = useState<BrowserProvider | null>(null);

	const [envelopes, setEnvelopes] = useState<{ id: number }[]>([]);
	const [selectedEnvelope, setSelectedEnvelope] = useState<number | null>(null);
	const [totalEnvelopes, setTotalEnvelopes] = useState<bigint | null>(null);
	const [totalError, setTotalError] = useState<Error | null>(null);

	useEffect(() => {
		if (window.ethereum) {
			const browserProvider = new BrowserProvider(window.ethereum);
			setProvider(browserProvider);

			const getAccountAndNetwork = async () => {
				try {
					const accounts = await browserProvider.send("eth_accounts", []);
					if (accounts.length > 0) {
						setAddress(accounts[0]);
					}
					const network = await browserProvider.getNetwork();
					setChainId(network.chainId);
				} catch (err) {
					console.error("Failed to get account and network:", err);
				}
			};

			getAccountAndNetwork();

			const handleAccountsChanged = (accounts: unknown) => {
				if (Array.isArray(accounts)) {
					setAddress(accounts.length > 0 ? accounts[0] : null);
				}
			};
			const handleChainChanged = (newChainId: unknown) => {
				setChainId(BigInt(newChainId as string));
			};

			window.ethereum.on("accountsChanged", handleAccountsChanged);
			window.ethereum.on("chainChanged", handleChainChanged);

			return () => {
				window.ethereum?.removeListener(
					"accountsChanged",
					handleAccountsChanged,
				);
				window.ethereum?.removeListener("chainChanged", handleChainChanged);
			};
		}
	}, []);

	const contractAddress = chainId
		? (RED_ENVELOPE_ADDRESS as Record<number, string>)[Number(chainId)]
		: undefined;

	const fetchTotalEnvelopes = useCallback(async () => {
		if (provider && contractAddress) {
			try {
				const contract = new ethers.Contract(
					contractAddress,
					RedEnvelopeAbi.abi,
					provider,
				);
				const total = await contract.getTotalEnvelopes();
				setTotalEnvelopes(total);
			} catch (err) {
				setTotalError(err as Error);
				console.error("Failed to fetch total envelopes:", err);
			}
		}
	}, [provider, contractAddress]);

	useEffect(() => {
		fetchTotalEnvelopes();
	}, [fetchTotalEnvelopes]);

	useEffect(() => {
		if (provider && contractAddress) {
			const contract = new ethers.Contract(
				contractAddress,
				RedEnvelopeAbi.abi,
				provider,
			);
			const onEnvelopeCreated = () => {
				console.log("A new envelope was created");
				fetchTotalEnvelopes();
			};
			const onEnvelopeClaimed = () => {
				console.log("An envelope was claimed");
				setSelectedEnvelope((prev) => (prev === null ? null : prev));
			};

			contract.on("EnvelopeCreated", onEnvelopeCreated);
			contract.on("EnvelopeClaimed", onEnvelopeClaimed);

			return () => {
				contract.off("EnvelopeCreated", onEnvelopeCreated);
				contract.off("EnvelopeClaimed", onEnvelopeClaimed);
			};
		}
	}, [provider, contractAddress, fetchTotalEnvelopes]);

	useEffect(() => {
		if (totalEnvelopes && Number(totalEnvelopes) > 0) {
			const count = Number(totalEnvelopes);
			const list = [];
			const start = Math.max(0, count - 5);
			for (let i = count - 1; i >= start; i--) {
				list.push({ id: i });
			}
			setEnvelopes(list);
		} else if (!totalError) {
			setEnvelopes([]);
		}
	}, [totalEnvelopes, totalError]);

	if (totalError) {
		return (
			<div className="bg-white rounded-lg shadow-lg p-6">
				<h2 className="text-2xl font-bold text-gray-800 mb-6">红包列表</h2>
				<div className="text-center py-8">
					<p className="text-gray-500">暂时无法加载红包列表</p>
					<p className="text-sm text-gray-400 mt-2">请稍后重试</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-gray-800">红包列表</h2>
				<div className="text-sm text-gray-600">
					{totalEnvelopes !== null
						? `总计: ${totalEnvelopes.toString()} 个`
						: "加载中..."}
				</div>
			</div>

			{envelopes.length === 0 ? (
				<div className="text-center py-12">
					<div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
						🧧
					</div>
					<p className="text-gray-500 text-lg mb-2">还没有红包</p>
					<p className="text-gray-400 text-sm">
						创建第一个红包，开始分享喜悦吧！
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{envelopes.map((envelope) => (
						<EnvelopeItem
							key={envelope.id}
							envelopeId={envelope.id}
							isSelected={selectedEnvelope === envelope.id}
							onSelect={() =>
								setSelectedEnvelope(
									selectedEnvelope === envelope.id ? null : envelope.id,
								)
							}
							provider={provider}
							chainId={chainId}
						/>
					))}

					{selectedEnvelope !== null && (
						<div className="mt-6 border-t pt-6">
							<ClaimSection
								envelopeId={selectedEnvelope}
								provider={provider}
								address={address}
								chainId={chainId}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default EnvelopeList;
