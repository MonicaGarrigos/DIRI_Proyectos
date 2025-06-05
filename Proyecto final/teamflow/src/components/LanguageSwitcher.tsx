import { useTranslation } from "react-i18next";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography
} from "@mui/material";

import esFlag from "../assets/flags/es.png";
import enFlag from "../assets/flags/en.png";

const LanguageSelect = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const { t } = useTranslation();
  
  const handleChange = (event: any) => {
    const selectedLang = event.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("appLang", selectedLang);
  };

  const languages = [
    { code: "es", label: "Español", flag: esFlag },
    { code: "en", label: "English", flag: enFlag }
  ];

  return (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel>{t("language.label")}</InputLabel>
      <Select
        labelId="lang-label"
        value={currentLang}
        onChange={handleChange}
        label="Idioma"
      >
        {languages.map(({ code, label, flag }) => (
          <MenuItem key={code} value={code}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src={flag} alt={code} width={20} height={14} />
              <Typography variant="body2">{label}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelect;
