import { differenceInYears, parse, isValid } from 'date-fns';

export const NAME_REGEX = /^[A-Za-z\s]+$/;
export const LAST_NAME_REGEX = /^([A-Za-z\s]+|\.)$/;
export const REPEATING_CHARS_REGEX = /(.)\1{2,}/i;
export const MOBILE_REGEX = /^[6-9]\d{9}$/;
export const isRepeatingDigits = (val) => /^(.)\1{9}$/.test(val);

export const parseDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;

  // Try dd/MM/yyyy first
  let parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
  if (isValid(parsed)) return parsed;

  // Try yyyy-MM-dd
  parsed = parse(dateStr, 'yyyy-MM-dd', new Date());
  if (isValid(parsed)) return parsed;

  // Try dd-MM-yyyy
  parsed = parse(dateStr, 'dd-MM-yyyy', new Date());
  if (isValid(parsed)) return parsed;

  // Try yyyy/MM/dd
  parsed = parse(dateStr, 'yyyy/MM/dd', new Date());
  if (isValid(parsed)) return parsed;

  return null;
};

export const normalizeName = (name) => {
  if (!name) return "";
  return name.trim().toLowerCase();
};

export const hasConsecutiveLetters = (str) => {
  if (!str || str.length < 4) return false;
  const lowercaseStr = str.toLowerCase();
  for (let i = 0; i <= lowercaseStr.length - 4; i++) {
    const char1 = lowercaseStr.charCodeAt(i);
    const char2 = lowercaseStr.charCodeAt(i + 1);
    const char3 = lowercaseStr.charCodeAt(i + 2);
    const char4 = lowercaseStr.charCodeAt(i + 3);

    if (
      char2 === char1 + 1 &&
      char3 === char2 + 1 &&
      char4 === char3 + 1 &&
      char1 >= 97 && char4 <= 122 // Ensure they are letters
    ) {
      return true;
    }
  }
  return false;
};

export const validateNameFormat = (name, isLastName = false) => {
  if (!name) return "Name is required";
  if (name.length > 20) return "Maximum 20 characters allowed";
  
  const regex = isLastName ? LAST_NAME_REGEX : NAME_REGEX;
  if (!regex.test(name)) return "No special or numeric characters allowed";
  
  if (REPEATING_CHARS_REGEX.test(name)) return "Enter valid name";
  if (hasConsecutiveLetters(name)) return "Enter valid name";
  
  return null;
};

export const checkNamesMatch = (name1, name2) => {
  if (!name1 || !name2) return false;
  return normalizeName(name1) === normalizeName(name2);
};

export const focusFirstError = () => {
  setTimeout(() => {
    const elements = document.querySelectorAll('.border-red-500, .text-red-500, [aria-invalid="true"]');
    let errorElement = null;
    
    for (let el of elements) {
      if (el.tagName === 'SPAN' && el.textContent.trim() === '*') {
        continue;
      }
      errorElement = el;
      break;
    }

    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (errorElement.tagName === 'INPUT' || errorElement.tagName === 'SELECT') {
        errorElement.focus();
      } else {
        const input = errorElement.parentElement?.querySelector('input, select');
        if (input) input.focus();
      }
    }
  }, 150);
};

export const validateAgeDifference = (applicantDob, nomineeDob, relationship) => {
  const appDate = typeof applicantDob === 'string' ? parseDate(applicantDob) : applicantDob;
  const nomDate = typeof nomineeDob === 'string' ? parseDate(nomineeDob) : nomineeDob;
  
  if (!appDate || !nomDate) return true;

  const ageDiff = differenceInYears(appDate, nomDate);

  if (relationship === 'Father' || relationship === 'Mother') {
    // Nominee (Parent) must be at least 18 years older than Applicant
    // So Nominee DOB < Applicant DOB - 18
    // differenceInYears(appDate, nomDate) should be >= 18
    return ageDiff >= 18;
  }
  
  if (relationship === 'Son' || relationship === 'Daughter') {
    // Parent must be at least 18 years older than child
    return ageDiff <= -18; 
  }

  if (relationship === 'Spouse' || relationship === 'Husband' || relationship === 'Wife') {
    // Nominee cannot be minor (18+)
    return differenceInYears(new Date(), nomDate) >= 18;
  }

  return true;
};
