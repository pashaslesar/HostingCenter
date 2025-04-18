import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "../../shared/components/Routing";
import Home from "./Home";
import Hosting from "./Hosting";


export default function Dashboard() {
    return (
        <div className="flex-1 flex flex-col py-10">
            <div className="flex-1 flex">
                <div className="w-1/6 flex flex-col">
                    <div className="my-2 font-bold text-gray-600 text-sm tracking-wide uppercase">
                        Title
                    </div>
                    <NavLink to="/dashboard" className="py-1 duration-150 hover:text-gray-300 hover:px-1 text-gray-500 cursor-pointer">
                        Dashboard
                    </NavLink>
                    <NavLink to="/dashboard/hosting" className="py-1 duration-150 hover:text-gray-300 hover:px-1 text-gray-500 cursor-pointer">
                        Hosting
                    </NavLink>
                </div>
                <div className="flex-1">
                    <Routes>
                        <Route element={<PrivateRoutes />}>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/hosting" element={<Hosting/>}/>
                        </Route>
                        <Route path="/*" element={<Navigate to="/"/>}/>
                    </Routes>
                </div>
            </div>
        </div>
    );
}