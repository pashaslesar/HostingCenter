import { Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "../../shared/components/Routing";
import Cart from "./Cart";

export default function Auth() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center py-10">
            <Routes>
                <Route path="/" element={<Cart/>}/>
                <Route element={<PrivateRoutes />}>
                    <Route path="/checkout"/>
                </Route>
				<Route path="/*" element={<Navigate to="/"/>}/>
			</Routes>
        </div>
    );
}