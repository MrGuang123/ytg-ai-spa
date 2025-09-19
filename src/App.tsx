import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes";

const App = () => {
	return (
		<StrictMode>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</StrictMode>
	);
};

App.whyDidYouRender = true;

export default App;
