import { lazy, Suspense } from "react";
import { Navigate, Outlet, type RouteObject } from "react-router-dom";

const Index = lazy(() => import("@pages/Index"));

const Layout = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Outlet />
		</Suspense>
	);
};

const Routes: RouteObject[] = [];

const mainRoutes = [
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Index />,
			},
		],
	},
	{
		path: "*",
		element: <Navigate to="/" replace />,
	},
];

const businessRoutes = [
	{
		path: "/business",
		element: <Layout />,
		children: [
			{
				path: "/business",
				element: <Index />,
			},
		],
	},
];

Routes.push(...mainRoutes, ...businessRoutes);

export default Routes;
