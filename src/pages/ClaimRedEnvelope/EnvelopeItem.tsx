import { type BrowserProvider, ethers, formatEther } from "ethers";
import { Equal, Gift, Loader2, Shuffle, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import RedEnvelopeAbi from "@/abis/RedEnvelope.json";
import { RED_ENVELOPE_ADDRESS } from "@/constants";
import type { EnvelopeInfo } from "@/types";

interface EnvelopeItemProps {
	envelopeId: number;
	isSelected: boolean;
	onSelect: () => void;
	provider: BrowserProvider | null;
	chainId: bigint | null;
}

const EnvelopeItem = ({
	envelopeId,
	isSelected,
	onSelect,
	provider,
	chainId,
}: EnvelopeItemProps) => {
	const [envelopeData, setEnvelopeData] = useState<EnvelopeInfo | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const contractAddress = chainId
		? (RED_ENVELOPE_ADDRESS as Record<number, string>)[Number(chainId)]
		: undefined;

	const fetchEnvelopeInfo = useCallback(async () => {
		if (provider && contractAddress) {
			setIsLoading(true);
			try {
				const contract = new ethers.Contract(
					contractAddress,
					RedEnvelopeAbi.abi,
					provider,
				);
				const data = await contract.getEnvelopeInfo(BigInt(envelopeId));
				setEnvelopeData(data);
			} catch (err) {
				setError(err as Error);
				console.error(`Failed to fetch info for envelope #${envelopeId}:`, err);
			} finally {
				setIsLoading(false);
			}
		}
	}, [provider, contractAddress, envelopeId]);

	useEffect(() => {
		fetchEnvelopeInfo();
	}, [fetchEnvelopeInfo]);

	useEffect(() => {
		if (provider && contractAddress) {
			const contract = new ethers.Contract(
				contractAddress,
				RedEnvelopeAbi.abi,
				provider,
			);
			const onEnvelopeClaimed = (claimedEnvelopeId: bigint) => {
				if (Number(claimedEnvelopeId) === envelopeId) {
					console.log(`红包 ${envelopeId} 被抢，刷新数据`);
					fetchEnvelopeInfo();
				}
			};

			contract.on("EnvelopeClaimed", onEnvelopeClaimed);

			return () => {
				contract.off("EnvelopeClaimed", onEnvelopeClaimed);
			};
		}
	}, [provider, contractAddress, envelopeId, fetchEnvelopeInfo]);

	if (isLoading) {
		return (
			<div className="border rounded-lg p-4 bg-gray-50">
				<div className="flex items-center justify-center py-4">
					<Loader2 className="w-5 h-5 animate-spin text-gray-400" />
					<span className="ml-2 text-gray-500">加载红包 #{envelopeId}...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="border rounded-lg p-4 border-red-200 bg-red-50">
				<div className="text-center py-4">
					<span className="text-red-600">红包 #{envelopeId} 加载失败</span>
				</div>
			</div>
		);
	}

	if (!envelopeData) {
		return null;
	}

	const {
		creator,
		totalAmount,
		remainingAmount,
		totalCount,
		remainingCount,
		isRandom,
		isActive,
		message,
	} = envelopeData;

	return (
		<button
			type="button"
			className={`border rounded-lg p-4 cursor-pointer transition-all w-full text-left ${
				isSelected
					? "border-red-300 bg-red-50"
					: "border-gray-200 hover:border-red-200 hover:bg-red-50/50"
			}`}
			onClick={onSelect}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
						<Gift className="w-6 h-6 text-white" />
					</div>

					<div>
						<div className="flex items-center space-x-2">
							<span className="font-medium text-gray-800">
								红包 #{envelopeId}
							</span>
							{isRandom ? (
								<Shuffle
									className="w-4 h-4 text-orange-500"
									aria-label="随机红包"
								/>
							) : (
								<Equal
									className="w-4 h-4 text-blue-500"
									aria-label="均分红包"
								/>
							)}
						</div>

						<div className="text-sm text-gray-600 mt-1">
							{message || "恭喜发财，大吉大利！"}
						</div>

						<div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
							<span className="flex items-center">
								<Users className="w-3 h-3 mr-1" />
								{Number(remainingCount)}/{Number(totalCount)}
							</span>
							<span>剩余: {formatEther(remainingAmount)} ETH</span>
							<span
								className={`px-2 py-1 rounded ${
									isActive
										? "bg-green-100 text-green-700"
										: "bg-gray-100 text-gray-600"
								}`}
							>
								{isActive ? "可抢" : "已完成"}
							</span>
						</div>
					</div>
				</div>

				<div className="text-right">
					<div className="text-lg font-bold text-gray-800">
						{formatEther(totalAmount)} ETH
					</div>
					<div className="text-xs text-gray-500">
						来自: {creator.slice(0, 6)}...{creator.slice(-4)}
					</div>
				</div>
			</div>
		</button>
	);
};

export default EnvelopeItem;
