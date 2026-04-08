import { z } from 'zod';
import { differenceInYears } from 'date-fns';
import { 
  NAME_REGEX, 
  LAST_NAME_REGEX, 
  REPEATING_CHARS_REGEX, 
  parseDate, 
  normalizeName, 
  checkNamesMatch,
  validateAgeDifference,
  hasConsecutiveLetters
} from '../utils/validationUtils';

const nameField = (isLastName = false) => z.string()
  .min(1, "Name is required")
  .max(20, "Maximum 20 characters allowed")
  .refine(val => (isLastName ? LAST_NAME_REGEX : NAME_REGEX).test(val), "No special or numeric characters allowed")
  .refine(val => !REPEATING_CHARS_REGEX.test(val), "Enter valid name")
  .refine(val => !hasConsecutiveLetters(val), "Enter valid name");

const optionalNameField = z.string()
  .max(20, "Maximum 20 characters allowed")
  .optional()
  .refine(val => !val || NAME_REGEX.test(val), "No special or numeric characters allowed")
  .refine(val => !val || !REPEATING_CHARS_REGEX.test(val), "Enter valid name")
  .refine(val => !val || !hasConsecutiveLetters(val), "Enter valid name");

const optionalLastNameField = z.string()
  .max(20, "Maximum 20 characters allowed")
  .optional()
  .refine(val => !val || LAST_NAME_REGEX.test(val), "No special or numeric characters allowed")
  .refine(val => !val || !REPEATING_CHARS_REGEX.test(val), "Enter valid name")
  .refine(val => !val || !hasConsecutiveLetters(val), "Enter valid name");

const addressSchema = z.object({
  addressLine1: z.string()
    .min(10, "Address Line 1 must be at least 10 characters")
    .max(50, "Address Line 1 cannot exceed 50 characters"),
  addressLine2: z.string()
    .max(50, "Address Line 2 cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  addressLine3: z.string()
    .max(50, "Address Line 3 cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  city: z.string()
    .min(4, "City must be at least 4 characters")
    .max(20, "City cannot exceed 20 characters"),
  state: z.string()
    .min(4, "State must be at least 4 characters")
    .max(20, "State cannot exceed 20 characters"),
  pincode: z.string()
    .length(6, "Pincode must be 6 digits")
    .regex(/^\d+$/, "Pincode must be numeric"),
});

const personSchema = z.object({
  firstName: nameField(),
  middleName: optionalNameField,
  lastName: nameField(true),
});

export const  onboardingSchema = z.object({
  onboarding: z.object({
    productType: z.enum(["savings", "current"]).default("savings"),
    aepsConsent: z.enum(["yes", "no"]).default("yes"),
    language: z.string().default("English"),
    agreeTerms: z.boolean().refine(val => val === true, "Must agree to terms and conditions"),
    agreeAeps: z.boolean().refine(val => val === true, "Must agree to AEPS terms"),
    agreeSweep: z.boolean().refine(val => val === true, "Must agree to sweep terms"),
    pan: z.string().min(1, "PAN Number is required").regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter Valid PAN Number"),
    aadhaar: z.string().min(1, "Aadhaar Number is required").length(12, "Aadhaar must be 12 digits").regex(/^\d+$/, "Aadhaar must be numeric"),
    fatcaDeclared: z.boolean().refine(val => val === true, "Must declare FATCA status"),
  }),
  applicant: z.object({
    firstName: nameField(),
    middleName: optionalNameField,
    lastName: nameField(true),
    gender: z.enum(["Male", "Female"]),
    dob: z.string()
      .refine(val => {
        const date = parseDate(val);
        if (!date) return false;
        const year = date.getFullYear();
        return year >= 1900 && year <= new Date().getFullYear();
      }, "Enter a valid Date")
      .refine(val => {
        const date = parseDate(val);
        if (!date) return false;
        const age = differenceInYears(new Date(), date);
        return age >= 18;
      }, "Applicant must be at least 18 years old"),
    maritalStatus: z.enum(["Married", "Unmarried"]),
    email: z.string().optional().or(z.literal("")),
    communicationAddress: addressSchema,
  }),
  family: z.object({
    fatherName: personSchema,
    motherName: personSchema,
    spouseName: z.object({
      firstName: z.string().optional(),
      middleName: z.string().optional(),
      lastName: z.string().optional(),
    }).optional(),
  }),
  nominee: z.object({
    provide: z.enum(["Yes", "No"]),
    relationship: z.string().optional(),
    firstName: nameField().optional().or(z.literal("")),
    lastName: nameField(true).optional().or(z.literal("")),
    middleName: optionalNameField,
    dob: z.string().optional().refine(val => {
      if (!val) return true;
      const date = parseDate(val);
      if (!date) return false;
      const year = date.getFullYear();
      return year >= 1900 && year <= new Date().getFullYear();
    }, "Enter a valid Date"),
    address: z.string().optional(),
    addressDetails: addressSchema.optional(),
  }),
  guardian: z.object({
    firstName: optionalNameField,
    lastName: optionalLastNameField,
    middleName: optionalNameField,
    relationship: z.string().optional(),
    dob: z.string().optional().refine(val => {
      if (!val) return true;
      const date = parseDate(val);
      if (!date) return false;
      const year = date.getFullYear();
      return year >= 1900 && year <= new Date().getFullYear();
    }, "Enter a valid Date"),
    address: z.string().optional(),
    addressDetails: addressSchema.optional(),
  }),
  financial: z.object({
    occupation: z.string().min(1, "Occupation is required"),
    sourceOfIncome: z.string().min(1, "Source of income is required"),
    annualIncome: z.string().min(1, "Annual income is required"),
  }),
}).superRefine((data, ctx) => {
  const applicantFullName = `${data.applicant.firstName} ${data.applicant.middleName || ""} ${data.applicant.lastName}`.replace(/\s+/g, ' ').trim();
  const fatherFullName = `${data.family.fatherName.firstName} ${data.family.fatherName.middleName || ""} ${data.family.fatherName.lastName}`.replace(/\s+/g, ' ').trim();
  const motherFullName = `${data.family.motherName.firstName} ${data.family.motherName.middleName || ""} ${data.family.motherName.lastName}`.replace(/\s+/g, ' ').trim();
  const spouseFullName = data.applicant.maritalStatus === 'Married' 
    ? `${data.family.spouseName?.firstName || ""} ${data.family.spouseName?.middleName || ""} ${data.family.spouseName?.lastName || ""}`.replace(/\s+/g, ' ').trim()
    : "";

  const namesToSync = [
    { label: "Applicant", name: applicantFullName, path: ["applicant", "firstName"] },
    { label: "Father", name: fatherFullName, path: ["family", "fatherName", "firstName"] },
    { label: "Mother", name: motherFullName, path: ["family", "motherName", "firstName"] },
    { label: "Spouse", name: spouseFullName, path: ["family", "spouseName", "firstName"] },
  ].filter(n => n.name.trim() !== "");

  // Helper to add specific cross-match issues
  const addNameMatchIssue = (sourceLabel, targetLabel, targetPath) => {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${targetLabel} Name cannot be the same as ${sourceLabel} Name`,
      path: targetPath,
    });
  };

  // Cross-match check for core family members
  for (let i = 0; i < namesToSync.length; i++) {
    for (let j = i + 1; j < namesToSync.length; j++) {
      if (checkNamesMatch(namesToSync[i].name, namesToSync[j].name)) {
        addNameMatchIssue(namesToSync[i].label, namesToSync[j].label, namesToSync[j].path);
      }
    }
  }

  // Nominee/Guardian checks against core family
  /* Relaxing name duplication constraints as per user request
  if (data.nominee.provide === "Yes") {
    const nominee = data.nominee;
    const nomineeFullName = `${nominee.firstName || ""} ${nominee.middleName || ""} ${nominee.lastName || ""}`.replace(/\s+/g, ' ').trim();
    
    // Check Nominee against Applicant, Father, Mother, Spouse
    if (nomineeFullName !== "") {
      for (const familyMember of namesToSync) {
        if (checkNamesMatch(nomineeFullName, familyMember.name)) {
          addNameMatchIssue(familyMember.label, "Nominee", ["nominee", "firstName"]);
        }
      }
    }

    const isNomineeMinor = nominee.dob ? differenceInYears(new Date(), parseDate(nominee.dob)) < 18 : false;
    if (isNomineeMinor) {
      const g = data.guardian;
      const guardianFullName = `${g.firstName || ""} ${g.middleName || ""} ${g.lastName || ""}`.replace(/\s+/g, ' ').trim();

      // Check Guardian against Applicant, Father, Mother, Spouse AND Nominee
      if (guardianFullName !== "") {
        for (const familyMember of namesToSync) {
          if (checkNamesMatch(guardianFullName, familyMember.name)) {
            addNameMatchIssue(familyMember.label, "Guardian", ["guardian", "firstName"]);
          }
        }
        if (nomineeFullName !== "" && checkNamesMatch(guardianFullName, nomineeFullName)) {
          addNameMatchIssue("Nominee", "Guardian", ["guardian", "firstName"]);
        }
      }
    }
  }
  */

  // Explicit Spouse Validation when Married
  if (data.applicant.maritalStatus === 'Married') {
    const spouse = data.family.spouseName;
    
    if (!spouse?.firstName || spouse.firstName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required",
        path: ["family", "spouseName", "firstName"],
      });
    } else {
      // Manual check for format since top-level is optional
      if (!NAME_REGEX.test(spouse.firstName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No special or numeric characters allowed",
          path: ["family", "spouseName", "firstName"],
        });
      }
      if (REPEATING_CHARS_REGEX.test(spouse.firstName) || hasConsecutiveLetters(spouse.firstName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter valid name",
          path: ["family", "spouseName", "firstName"],
        });
      }
    }

    if (!spouse?.lastName || spouse.lastName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required",
        path: ["family", "spouseName", "lastName"],
      });
    } else {
      if (!LAST_NAME_REGEX.test(spouse.lastName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No special or numeric characters allowed",
          path: ["family", "spouseName", "lastName"],
        });
      }
      if (REPEATING_CHARS_REGEX.test(spouse.lastName) || hasConsecutiveLetters(spouse.lastName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter valid name",
          path: ["family", "spouseName", "lastName"],
        });
      }
    }

    if (spouse?.middleName && spouse.middleName.trim() !== "") {
      if (!NAME_REGEX.test(spouse.middleName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No special or numeric characters allowed",
          path: ["family", "spouseName", "middleName"],
        });
      }
      if (REPEATING_CHARS_REGEX.test(spouse.middleName) || hasConsecutiveLetters(spouse.middleName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter valid name",
          path: ["family", "spouseName", "middleName"],
        });
      }
    }
  }

  // Nominee/Guardian checks
  if (data.nominee.provide === "Yes") {
    const nominee = data.nominee;
    const nomineeFullName = `${nominee.firstName || ""} ${nominee.middleName || ""} ${nominee.lastName || ""}`.replace(/\s+/g, ' ').trim();
    const applicantFullName = `${data.applicant.firstName} ${data.applicant.middleName || ""} ${data.applicant.lastName}`.replace(/\s+/g, ' ').trim();

    // Mandatory Nominee fields
    if (!nominee.firstName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required", path: ["nominee", "firstName"] });
    if (!nominee.lastName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required", path: ["nominee", "lastName"] });
    if (!nominee.relationship) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select valid relationship", path: ["nominee", "relationship"] });
    if (!nominee.dob) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter Valid Date of Birth", path: ["nominee", "dob"] });
    if (!nominee.address) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select an address option", path: ["nominee", "address"] });

    // Address Details if 'Others'
    if (nominee.address === "Others") {
      if (!nominee.addressDetails?.addressLine1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Address Line 1 is required", path: ["nominee", "addressDetails", "addressLine1"] });
      if (!nominee.addressDetails?.city) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required", path: ["nominee", "addressDetails", "city"] });
      if (!nominee.addressDetails?.state) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "State is required", path: ["nominee", "addressDetails", "state"] });
      if (!nominee.addressDetails?.pincode) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Pincode is required", path: ["nominee", "addressDetails", "pincode"] });
      } else if (nominee.addressDetails.pincode.length !== 6 || !/^\d+$/.test(nominee.addressDetails.pincode)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Pincode must be 6 digits", path: ["nominee", "addressDetails", "pincode"] });
      }
    }

    // Gender vs Spouse check
    if (data.applicant.gender === "Male" && nominee.relationship === "Husband") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select valid Nominee relation", path: ["nominee", "relationship"] });
    }
    if (data.applicant.gender === "Female" && nominee.relationship === "Wife") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select valid Nominee relation", path: ["nominee", "relationship"] });
    }

    // Marital Status check
    if (data.applicant.maritalStatus === "" && (nominee.relationship === "Husband" || nominee.relationship === "Wife")) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select valid Nominee relation", path: ["nominee", "relationship"] });
    }

    // DOB age differences
    if (nominee.dob) {
      const isValidAgeDiff = validateAgeDifference(data.applicant.dob, nominee.dob, nominee.relationship);
      if (!isValidAgeDiff) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid Date of Birth",
          path: ["nominee", "dob"],
        });
      }
    }

    // Guardian Condition: Only if Nominee is Minor
    const isNomineeMinor = nominee.dob ? differenceInYears(new Date(), parseDate(nominee.dob)) < 18 : false;

    if (isNomineeMinor) {
      const g = data.guardian;
      const guardianFullName = `${g.firstName || ""} ${g.middleName || ""} ${g.lastName || ""}`.replace(/\s+/g, ' ').trim();
      
      // Enforce Guardian fields if nominee is minor
      if (!g.firstName || g.firstName.trim() === "") ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required", path: ["guardian", "firstName"] });
      if (!g.lastName || g.lastName.trim() === "") ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required", path: ["guardian", "lastName"] });
      if (!g.relationship || g.relationship === "") ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select valid relationship", path: ["guardian", "relationship"] });

      if (g.dob) {
        const guardianDate = parseDate(g.dob);
        if (guardianDate && differenceInYears(new Date(), guardianDate) < 18) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Date of birth of Guardian cannot be less than 18 years of age.",
            path: ["guardian", "dob"],
          });
        }
      } else {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter Valid Date of Birth", path: ["guardian", "dob"] });
      }

      // Guardian Address if 'Others'
      if (!g.address) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select an address option", path: ["guardian", "address"] });
      } else if (g.address === "Others") {
        if (!g.addressDetails?.addressLine1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Address Line 1 is required", path: ["guardian", "addressDetails", "addressLine1"] });
        if (!g.addressDetails?.city) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required", path: ["guardian", "addressDetails", "city"] });
        if (!g.addressDetails?.state) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "State is required", path: ["guardian", "addressDetails", "state"] });
        if (!g.addressDetails?.pincode) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Pincode is required", path: ["guardian", "addressDetails", "pincode"] });
        } else if (g.addressDetails.pincode.length !== 6 || !/^\d+$/.test(g.addressDetails.pincode)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Pincode must be 6 digits", path: ["guardian", "addressDetails", "pincode"] });
        }
      }
    }
  }
});
