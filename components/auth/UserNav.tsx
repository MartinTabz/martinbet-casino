import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserNavDropDown from "./UserNavDropDown";
import { ThemeSwitch } from "../theme/ThemeSwitch";

export default function UserNav({
	username,
	imgUrl,
}: {
	username: string;
	imgUrl: string;
}) {
	return (
		<div className="flex items-center justify-end gap-5">
			<ThemeSwitch />
			<div className="flex items-center justify-end gap-2">
				<Avatar>
					<AvatarImage src={imgUrl} />
					<AvatarFallback>MB</AvatarFallback>
				</Avatar>
				<span>{username}</span>
				<UserNavDropDown />
			</div>
		</div>
	);
}
