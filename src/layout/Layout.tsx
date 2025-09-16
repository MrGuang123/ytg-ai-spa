import { Header, Loading } from "@components/index";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
	return (
		<div>
			<Header />
			<main>
				<Suspense fallback={<Loading />}>
					<Outlet />
				</Suspense>
			</main>
		</div>
	);
};

export default Layout;
