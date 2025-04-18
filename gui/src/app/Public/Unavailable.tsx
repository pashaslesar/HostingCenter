import { useTranslation } from "react-i18next";

export default function Unavailable() {
    
    const { t } = useTranslation();
    
    return (
        <div className="justify-self-start font-['customsans'] text-4xl whitespace-pre-wrap text-gray-700">
            {t('page.unavailable')}
        </div>
    );
}