import { lazy } from "react";
import { Navigate, type RouteObject, useRoutes } from "react-router-dom";
import Layout from "../layout/Layout";

const CreateRedEnvelope = lazy(() => import("@/pages/CreateRedEnvelope"));
const ClaimRedEnvelope = lazy(() => import("@/pages/ClaimRedEnvelope"));

const RoutesConfig: RouteObject[] = [
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Navigate to="/create" replace />,
			},
			{
				path: "/create",
				element: <CreateRedEnvelope />,
			},
			{
				path: "/claim",
				element: <ClaimRedEnvelope />,
			},
		],
	},
	{
		path: "*",
		element: <Navigate to="/" replace />,
	},
];

const AppRoutes = () => {
	return useRoutes(RoutesConfig);
};

export default AppRoutes;
