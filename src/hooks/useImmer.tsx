import { type Draft, freeze, produce } from "immer";
import { useCallback, useState } from "react";

export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updator<S> = (arg: S | DraftFunction<S>) => void;
export function useImmer<S = unknown>(
	initialValue: S | (() => S),
): [S, Updator<S>];
export function useImmer<T>(initialValue: T) {
	const [val, updateValue] = useState(
		freeze(
			typeof initialValue === "function" ? initialValue() : initialValue,
			true,
		),
	);

	return [
		val,
		useCallback(
			(updater: T | DraftFunction<T>) => {
				if (typeof updater === "function") {
					updateValue(produce(updater as DraftFunction<T>));
				} else {
					updateValue(freeze(val));
				}
			},
			[val],
		),
	];
}
