export type ForEachFn = <T extends {}>(
	value: null | undefined | T | readonly T[],
	callbackFn: (value: T, index: number) => void
) => void;
