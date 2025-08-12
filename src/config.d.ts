export interface PrismConfig {
	manual?: boolean;
}

export type GlobalConfig = Record<string, PrismConfig[keyof PrismConfig] | null>;
