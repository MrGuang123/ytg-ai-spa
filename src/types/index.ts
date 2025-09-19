import type { BigNumberish } from "ethers";

export interface EnvelopeInfo {
	creator: string;
	totalAmount: BigNumberish;
	remainingAmount: BigNumberish;
	totalCount: BigNumberish;
	remainingCount: BigNumberish;
	isRandom: boolean;
	isActive: boolean;
	message: string;
}
