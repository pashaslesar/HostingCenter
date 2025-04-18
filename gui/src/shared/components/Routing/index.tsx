import { lazy, Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../store/auth";

export function Lazy({path}: {path: string}) {
	const LazyElement = lazy(() => import(`./../../../app/${path}/index.tsx`));
	return (
		<Suspense>
			<LazyElement></LazyElement>
		</Suspense>
	);
}

export function PublicRoutes() {
    const user = useAuth(state => state.user);
    return user ? <Navigate to="/"/> : <Outlet/>;
}

export function PrivateRoutes() {
    const user = useAuth(state => state.user);
	const location = useLocation();

    return user ? <Outlet/> : <Navigate to={"/auth/login?from=" + location.pathname}/>;
}