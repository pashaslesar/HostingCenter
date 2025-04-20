import { Navigate, Route, Routes } from "react-router-dom";
import Domain from "./Domain";
import Home from "./Home";
import Hosting from "./Hosting";
import Unavailable from "./Unavailable";

export default function Auth() {
    return (
        <div className="h-5/6 my-auto flex flex-col">
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/hosting" element={<Hosting/>}/>
                <Route path="/domain" element={<Domain/>}/>
                <Route path="/unavailable" element={<Unavailable/>}/>
                <Route path="/*" element={<Navigate to="/unavailable"/>}/>
            </Routes>
        </div>
    );
}