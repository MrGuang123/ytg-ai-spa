import Routes from "@routes/index";
import { StrictMode } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";

const App = () => {
	return (
		<StrictMode>
			<BrowserRouter>{useRoutes(Routes)}</BrowserRouter>
		</StrictMode>
	);
};

App.whyDidYouRender = true;

export default App;
