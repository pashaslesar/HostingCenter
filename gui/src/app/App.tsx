import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "../shared/components/Footer";
import Header from "../shared/components/Header";
import Toasts from "../shared/components/Toasts";
import { Lazy } from "../shared/components/Routing";

export default function App() {
	return (
		<BrowserRouter>
			<Header/>
			<main className="flex-1 flex flex-col mx-auto w-10/12">
				<Routes>
					<Route path="/dashboard/*" element={<Lazy path="Dashboard"/>} />
					<Route path="/auth/*" element={<Lazy path="Auth"/>} />
					<Route path="/cart/*" element={<Lazy path="Cart"/>} />
					<Route path="/*" element={<Lazy path="Public"/>}/>
				</Routes>
			</main>
			<Toasts/>
			<Footer/>
		</BrowserRouter>
	);
}