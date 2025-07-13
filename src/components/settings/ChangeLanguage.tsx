import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

const languageOptions = [
    { code: "en", name: "English" },
    { code: "vi", name: "Tiếng Việt" },
]

const ChangeLanguage = () => {
    const { i18n, t } = useTranslation();

    const handleLanguageChange = (value: string) => {
        i18n.changeLanguage(value);
        localStorage.setItem('language', value);
    };

    return (
        <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
                <SelectValue>{languageOptions.find(c => c['code'] === i18n.language)?.name}</SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{t('language')}</SelectLabel>
                    {languageOptions.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export { ChangeLanguage };
