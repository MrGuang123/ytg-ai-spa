/**
 * 数组倒序工具函数
 * @param arr 输入的数组
 * @returns 返回倒序后的新数组（不改变原数组）
 */
export function reverseArray<T>(arr: T[]): T[] {
	if (!Array.isArray(arr)) {
		throw new Error("Input must be an array");
	}

	return [...arr].reverse();
}

/**
 * 原地倒序数组（会改变原数组）
 * @param arr 输入的数组
 * @returns 返回倒序后的原数组
 */
export function reverseArrayInPlace<T>(arr: T[]): T[] {
	if (!Array.isArray(arr)) {
		throw new Error("Input must be an array");
	}

	return arr.reverse();
}
