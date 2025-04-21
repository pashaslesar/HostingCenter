import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "../../shared/components/Routing";
import Hosting from "./Hosting";

export default function Dashboard() {
    return (
        <div className="flex-1 flex flex-col py-10">
            <div className="flex-1 flex">
                <div className="flex-1">
                    <Routes>
                        <Route element={<PrivateRoutes />}>
                            {/* Перенаправление на /dashboard/hosting по умолчанию */}
                            <Route path="/" element={<Navigate to="hosting" replace />} />
                            <Route path="hosting" element={<Hosting />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/dashboard/hosting" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
