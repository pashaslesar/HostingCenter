import { useToaster } from 'react-hot-toast/headless';

export const ToastDanger = `bg-red-100 border border-red-300 text-red-500`;
export const ToastSuccess = `bg-green-100 border border-green-300 text-green-600`;

export default function Toasts() {
	const { toasts, handlers } = useToaster({ duration: 5000 });
	const { startPause, endPause } = handlers;
	
	return (
		<div className="fixed top-4 transform-center" onMouseEnter={startPause} onMouseLeave={endPause}>
			{toasts.map((toast: any) => (
				<div className={toast.className + ` duration-150 text-center text-lg px-5 py-3 ease-in-out my-3 rounded-md ${toast.visible ? 'opacity-100' : 'opacity-0'}`} 
				key={toast.id} {...toast.ariaProps}>
					{toast.message}
				</div>
			))}
		</div>
	);
}