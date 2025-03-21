import GamesMenu from "@/components/index/GamesMenu";

export default function IndexPage() {
	return (
		<div className="w-full h-48 flex justify-center px-2 py-2 lg:py-10">
			<div className="max-w-[1000px] w-full h-full">
				<GamesMenu />
			</div>
		</div>
	);
}
