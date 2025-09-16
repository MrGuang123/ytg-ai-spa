import { useRoutes } from "react-router-dom";
import Routes from "@routes/index";

const App = () => {
	return useRoutes(Routes);
};

App.whyDidYouRender = true;

export default App;
