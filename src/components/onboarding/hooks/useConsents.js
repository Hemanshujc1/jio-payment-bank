import { useState, useEffect } from "react";
import onboardingService from "../../../services/onboardingService";

export const useConsents = (language, setValue = null, activityType = "AADHAR_PAN") => {
  const [consentsList, setConsentsList] = useState([]);
  const [selectedConsents, setSelectedConsents] = useState({});

  const languagesList = [
    { name: "English", code: "EN" },
    { name: "Hindi", code: "HI" },
    { name: "Telugu", code: "TA" },
    { name: "Tamil", code: "TE" },
    { name: "Kannada", code: "KN" },
    { name: "Marathi", code: "MR" },
    { name: "Bengali", code: "BN" },
  ];

  useEffect(() => {
    const fetchConsents = async () => {
      try {
        const selectedLang = languagesList.find((l) => l.name === language);
        const langCode = selectedLang ? selectedLang.code : "EN";
        const res = await onboardingService.getConsents(langCode);
        if (res.status === "SUCCESS" && res.response?.consents) {
          const allConsents = res.response.consents;
          
          const filtered = allConsents.filter(
            (c) =>
              c.activityType === activityType &&
              (!c.language || c.language === langCode)
          );
          setConsentsList(filtered);
          const initial = {};
          filtered.forEach((c) => {
            initial[c.consentTextCode] = false;
          });
          setSelectedConsents(initial);
        }
      } catch (err) {
        console.error("Failed to fetch consents", err);
      }
    };
    fetchConsents();
  }, [language, setValue, activityType]); // Note: React Hook useEffect has a missing dependency 'languagesList'. Since it's outside or inside, it's fine.

  const isAllConsentsSelected =
    consentsList.length > 0 &&
    consentsList.every(
      (c) => c.mandatory !== "Y" || selectedConsents[c.consentTextCode]
    );

  return {
    languagesList,
    consentsList,
    selectedConsents,
    setSelectedConsents,
    isAllConsentsSelected,
  };
};
