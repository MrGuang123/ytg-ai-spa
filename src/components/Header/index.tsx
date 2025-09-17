import { Gift } from "lucide-react";
import { NavLink } from "react-router-dom";
import { WalletConnect } from "@/components";

const Header = () => {
	return (
		<header className="bg-gradient-to-br from-red-500 via-pink-500 to-orange-400 text-white shadow-xl relative overflow-hidden">
			{/* 背景装饰 */}
			<div className="absolute inset-0 bg-black/5"></div>
			<div className="absolute top-0 left-0 w-full h-full">
				<div className="absolute top-4 left-8 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
				<div className="absolute top-8 right-16 w-12 h-12 bg-yellow-300/20 rounded-full blur-lg"></div>
				<div className="absolute bottom-4 left-1/3 w-8 h-8 bg-white/15 rounded-full blur-md"></div>
			</div>

			<div className="container mx-auto px-6 py-5 relative z-10">
				<div className="flex items-center justify-between">
					{/* 左侧 - 品牌标识 */}
					<div className="flex items-center space-x-4">
						<div className="relative">
							<div className="bg-gradient-to-br from-white/30 to-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
								<Gift className="w-10 h-10 drop-shadow-sm" />
							</div>
							<div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
						</div>
						<div>
							<h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent drop-shadow-sm">
								链上红包系统
							</h1>
							<p className="text-red-100/90 text-sm font-medium mt-1">
								🧧 发红包，抢红包，新年快乐！
							</p>
						</div>
					</div>

					{/* 中间 - 导航菜单 */}
					<nav className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
						<NavLink
							to="/create"
							className={({ isActive }) =>
								`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
									isActive
										? "bg-white text-red-500 shadow-lg transform scale-105"
										: "hover:bg-white/20 hover:scale-105"
								}`
							}
						>
							🎁 创建红包
						</NavLink>
						<NavLink
							to="/claim"
							className={({ isActive }) =>
								`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
									isActive
										? "bg-white text-red-500 shadow-lg transform scale-105"
										: "hover:bg-white/20 hover:scale-105"
								}`
							}
						>
							🧧 抢红包
						</NavLink>
					</nav>

					{/* 右侧 - 钱包连接 */}
					<div className="flex items-center space-x-4">
						<WalletConnect />
					</div>
				</div>

				{/* 移动端导航 */}
				<nav className="md:hidden mt-4 flex justify-center space-x-4">
					<NavLink
						to="/create"
						className={({ isActive }) =>
							`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
								isActive
									? "bg-white text-red-500 shadow-lg"
									: "bg-white/20 hover:bg-white/30"
							}`
						}
					>
						🎁 创建红包
					</NavLink>
					<NavLink
						to="/claim"
						className={({ isActive }) =>
							`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
								isActive
									? "bg-white text-red-500 shadow-lg"
									: "bg-white/20 hover:bg-white/30"
							}`
						}
					>
						🧧 抢红包
					</NavLink>
				</nav>
			</div>
		</header>
	);
};

export default Header;
