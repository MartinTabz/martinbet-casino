"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BalanceContextType {
	balance: number;
	setBalance: (newBalance: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

interface BalanceProviderProps {
	children: ReactNode;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({
	children,
}) => {
	const [balance, setBalance] = useState<number>(0);

	return (
		<BalanceContext.Provider value={{ balance, setBalance }}>
			{children}
		</BalanceContext.Provider>
	);
};

export const useBalance = (): BalanceContextType => {
	const context = useContext(BalanceContext);
	if (!context) {
		throw new Error("useBalance must be used within a BalanceProvider");
	}
	return context;
};
