import ReactDOM from 'react-dom/client';
import { hydrate } from "./shared/store/auth";
import './shared/data/util/fetch';
import './shared/styles/tailwind.css';
import './shared/styles/main.css';
import './shared/store/order';
import App from './app/App';

hydrate(sessionStorage.getItem('token')).then(() => {
    const container = document.getElementById('root')!;
    const root = ReactDOM.createRoot(container);
    root.render(<App/>);
}).catch(() => {
    console.log("Hydration failed");
});
