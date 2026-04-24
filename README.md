# JioPayment Onboarding Application

A React-based web application for the JioPayment onboarding process, featuring a multi-step flow for account selection, identity verification, and KYC.

## 🚀 Technology Stack
*   **Frontend**: React (Vite)
*   **Styling**: Tailwind CSS / Vanilla CSS
*   **Form Management**: React Hook Form
*   **Validation**: Zod
*   **Navigation**: React Router DOM

## 🛠 Project Structure
- `src/pages`: Main entry points (Savings Variant, Onboarding Flow).
- `src/components/onboarding/tabs`: Individual steps of the onboarding process.
- `src/schema`: Zod validation schemas.
- `src/assets`: Image and SVG assets.

## 📋 Onboarding Workflow

### 1. Savings Account Variant Selection
Agent land on the home page to select their preferred savings account:
*   **Platinum Savings Account**: Includes a Physical Debit Card and premium benefits (Lounge access, Insurance, etc.).
*   **Standard Savings Account**: Includes a Virtual Debit Card for digital-only use.

### 2. Multi-Step Onboarding Flow
Once a variant is selected, Agent proceed through a 5-step guided stepper:

#### **Step 1: Onboarding (Initial Verification)**
*   **Identity**: Mobile & Email verification via OTP.
*   **Documents**: PAN & Aadhaar number input with real-time format validation.
*   **Consent**: Mandatory acceptance of T&C, Aadhaar consent, and FATCA Declaration.

#### **Step 2: Aadhaar Details (KYC)**
*   Capturing personal details (Full Name, Gender, DOB).
*   **Validation**: Ensures applicant is at least 18 years old.

#### **Step 3: Family & Financial Details**
*   **Family**: Names of Father, Mother, and Spouse.
*   **Financial**: Occupation, Source of Income, and Annual Income selection.

#### **Step 4: Nominee Details (Optional)**
*   Allows adding a nominee for the account.
*   Validates relationship and date of birth (Min year: 1900).

#### **Step 5: Review & Submit**
*   Comprehensive summary of all entered information.
*   Provides the ability to jump back to any step for corrections before final submission.

---

## 🔑 Key Features
*   **State Persistence**: OTP verification state is maintained within the session to avoid redundant prompts.
*   **Dynamic UI**: Real-time generation of Application Numbers once verification is complete.
*   **Robust Validation**: Integrated Zod schemas to ensure data integrity across all forms.
*   **Modern Design**: Premium aesthetics with smooth transitions and responsive layouts.

