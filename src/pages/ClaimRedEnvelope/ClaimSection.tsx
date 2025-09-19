import {
	type BrowserProvider,
	type EthersError,
	ethers,
	formatEther,
} from "ethers";
import { Gift, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import RedEnvelopeAbi from "@/abis/RedEnvelope.json";
import { RED_ENVELOPE_ADDRESS } from "@/constants";
import type { EnvelopeInfo } from "@/types";

interface ClaimSectionProps {
	envelopeId: number;
	provider: BrowserProvider | null;
	address: string | null;
	chainId: bigint | null;
}

const ClaimSection = ({
	envelopeId,
	provider,
	address,
	chainId,
}: ClaimSectionProps) => {
	const [envelopeData, setEnvelopeData] = useState<EnvelopeInfo | null>(null);
	const [hasClaimed, setHasClaimed] = useState<boolean | null>(null);
	const [isPending, setIsPending] = useState(false);
	const [isConfirming, setIsConfirming] = useState(false);
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [error, setError] = useState<EthersError | null>(null);

	const contractAddress = chainId
		? (RED_ENVELOPE_ADDRESS as Record<number, string>)[Number(chainId)]
		: undefined;

	const fetchEnvelopeAndClaimStatus = useCallback(async () => {
		if (provider && contractAddress && address) {
			try {
				const contract = new ethers.Contract(
					contractAddress,
					RedEnvelopeAbi.abi,
					provider,
				);
				const [data, claimed] = await Promise.all([
					contract.getEnvelopeInfo(BigInt(envelopeId)),
					contract.hasClaimed(BigInt(envelopeId), address),
				]);
				setEnvelopeData(data);
				setHasClaimed(claimed);
			} catch (err) {
				console.error("Failed to fetch envelope and claim status:", err);
			}
		}
	}, [provider, contractAddress, address, envelopeId]);

	useEffect(() => {
		fetchEnvelopeAndClaimStatus();
	}, [fetchEnvelopeAndClaimStatus]);

	const handleClaim = async () => {
		if (!provider || !contractAddress) return;

		setError(null);
		setIsConfirmed(false);

		try {
			const signer = await provider.getSigner();
			const contract = new ethers.Contract(
				contractAddress,
				RedEnvelopeAbi.abi,
				signer,
			);

			setIsPending(true);
			const tx = await contract.claimEnvelope(BigInt(envelopeId));

			setIsPending(false);
			setIsConfirming(true);
			await tx.wait();

			setIsConfirming(false);
			setIsConfirmed(true);
		} catch (err) {
			setError(err as EthersError);
			console.error("Failed to claim envelope:", err);
			setIsPending(false);
			setIsConfirming(false);
		}
	};

	if (!envelopeData) {
		return (
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
				<div className="text-center py-4">
					<Loader2 className="w-5 h-5 animate-spin text-gray-400 mx-auto mb-2" />
					<p className="text-gray-500 text-sm">加载红包信息...</p>
				</div>
			</div>
		);
	}

	const { creator, remainingAmount, totalCount, remainingCount, isActive } =
		envelopeData;

	const isCreator = address && creator.toLowerCase() === address.toLowerCase();
	const hasRemaining = Number(remainingCount) > 0 && isActive;

	if (isCreator) {
		return (
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="text-center">
					<div className="text-2xl mb-2">👤</div>
					<p className="text-blue-800 font-medium">这是您创建的红包</p>
					<p className="text-blue-600 text-sm mt-1">不能抢自己发的红包哦</p>
					<div className="mt-3 text-xs text-blue-500">
						<p>红包状态: {hasRemaining ? "进行中" : "已完成"}</p>
						<p>
							剩余: {Number(remainingCount)}/{Number(totalCount)} 个
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (!hasRemaining) {
		return (
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
				<div className="text-center">
					<div className="text-2xl mb-2">😔</div>
					<p className="text-gray-700 font-medium">红包已经抢完了</p>
					<p className="text-gray-500 text-sm mt-1">来晚了一步，下次要快点哦</p>
					<div className="mt-3 text-xs text-gray-500">
						<p>总共: {Number(totalCount)} 个红包</p>
						<p>剩余: {Number(remainingCount)} 个</p>
					</div>
				</div>
			</div>
		);
	}

	if (hasClaimed) {
		return (
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<div className="text-center">
					<div className="text-2xl mb-2">🎉</div>
					<p className="text-yellow-800 font-medium">您已经抢过这个红包了！</p>
					<p className="text-yellow-600 text-sm mt-1">每个红包只能抢一次哦</p>
				</div>
			</div>
		);
	}

	if (isConfirmed) {
		return (
			<div className="bg-green-50 border border-green-200 rounded-lg p-4">
				<div className="text-center">
					<div className="text-2xl mb-2">🎊</div>
					<p className="text-green-800 font-medium">红包抢成功！</p>
					<p className="text-green-600 text-sm mt-1">恭喜您获得了红包奖励！</p>
					<div className="mt-3 text-xs text-green-600">
						<p>
							红包剩余: {Number(remainingCount) - 1}/{Number(totalCount)} 个
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
			<div className="text-center">
				<div className="text-3xl mb-3">🧧</div>
				<h3 className="text-lg font-bold text-gray-800 mb-2">抢红包</h3>
				<div className="text-sm text-gray-600 mb-4">
					<p>
						剩余: {Number(remainingCount)}/{Number(totalCount)} 个
					</p>
					<p>金额: {formatEther(remainingAmount)} ETH</p>
				</div>

				{error && (
					<div className="mb-4 p-3 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
						抢红包失败: {error.shortMessage || error.message}
					</div>
				)}

				<button
					type="button"
					onClick={handleClaim}
					disabled={isPending || isConfirming}
					className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
				>
					{isPending || isConfirming ? (
						<>
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							{isPending ? "确认中..." : "处理中..."}
						</>
					) : (
						<>
							<Gift className="w-4 h-4 mr-2" />
							立即抢红包
						</>
					)}
				</button>

				<p className="text-xs text-gray-500 mt-3">
					点击按钮抢红包，每个红包只能抢一次
				</p>
			</div>
		</div>
	);
};

export default ClaimSection;
