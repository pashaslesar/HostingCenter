import { useTranslation } from "react-i18next";

export default function Footer() {
	const { t } = useTranslation();

	return (
		<footer className="w-full flex bg-slate-200 text-gray-400 text-sm px-5 py-1">
			{'© ' +  new Date().getFullYear() + ', ' + t('footer') }
		</footer>
	);
}
