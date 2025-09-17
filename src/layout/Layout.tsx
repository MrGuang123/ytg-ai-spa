import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Header, Loading } from "@/components/index";

const Layout = () => {
	return (
		<div className="min-h-screen relative">
			<Header />
			<main className="relative">
				<Suspense fallback={<Loading />}>
					<Outlet />
				</Suspense>
			</main>
		</div>
	);
};

export default Layout;
