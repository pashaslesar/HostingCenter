import { Navigate, Route, Routes } from "react-router-dom";
import { PublicRoutes } from "../../shared/components/Routing";
import Login from "./Login";
import Recovery from "./Recovery";
import Register from "./Register";

export default function Auth() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center py-10">
            <Routes>
                <Route path="/" element={<Navigate to="/"/>}/>
                <Route element={<PublicRoutes />}>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/recovery" element={<Recovery/>}/>
                </Route>
				<Route path="/*" element={<Navigate to="/"/>}/>
			</Routes>
        </div>
    );
}