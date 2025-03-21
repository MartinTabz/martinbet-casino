"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { BiCheck, BiError } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
	message: string;
	error: boolean;
}

interface NotificationContextType {
	notifications: Message[];
	newError: (info: string) => void;
	newSuccess: (info: string) => void;
	removeNotification: (index: number) => void;
}

const defaultValue: NotificationContextType = {
	notifications: [],
	newError: () => {},
	newSuccess: () => {},
	removeNotification: () => {},
};

const Context = createContext<NotificationContextType>(defaultValue);

const Provider = ({ children }: { children: ReactNode }) => {
	const [notifications, setNotifications] = useState<Message[]>([]);

	const newError = (info: string) => {
		if (info) {
			setNotifications((notifications) => [
				...notifications,
				{ message: info, error: true },
			]);
		}
	};

	const newSuccess = (info: string) => {
		if (info) {
			const index = notifications.length;
			setNotifications((notifications) => [
				...notifications,
				{ message: info, error: false },
			]);

			// Set a timeout to remove the notification after 3 seconds
			setTimeout(() => {
				removeNotification(index);
			}, 3000);
		}
	};

	const removeNotification = (index: number) => {
		const newNotifications = [...notifications];
		newNotifications.splice(index, 1);
		setNotifications(newNotifications);
	};

	const exposed = {
		newError,
		newSuccess,
		notifications,
		removeNotification,
	};

	return (
		<>
			<div className="flex flex-col p-1 gap-1 w-full fixed z-[1000] right-0 top-0 sm:w-96">
				<AnimatePresence>
					{notifications.map((notification, index) => (
						<motion.div
							className={`border-2 flex min-h-14 items-center justify-between p-2 gap-2 relative font-semibold rounded-md ${
								notification.error
									? "bg-red-700 border-red-600 text-white"
									: "bg-green-700 border-green-600 text-white"
							}`}
							key={index}
							initial={{ y: -100 }}
							animate={{ y: 0 }}
							exit={{ y: -100 * index * 2 }}
						>
							<div className="flex items-center justify-start gap-2 w-[calc(100%-24px)]">
								{notification.error ? (
									<BiError className="text-xl w-10" />
								) : (
									<BiCheck className="text-2xl w-10" />
								)}
								<p className="text-xs md:text-sm break-words w-[calc(100%-40px)]">
									{notification.message}
								</p>
							</div>
							<span
								className="cursor-pointer h-full  w-6 text-xl"
								onClick={() => removeNotification(index)}
							>
								<IoClose />
							</span>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
			<Context.Provider value={exposed}>{children}</Context.Provider>
		</>
	);
};

export const useNotifications = () => useContext(Context);

export default Provider;
