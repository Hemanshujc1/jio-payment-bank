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

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd JioPayment/jiopayment
```

### 2. Environment Setup (.env)
To connect the frontend application to the backend API services, you must configure the environment variables.

1. Create a new file named `.env` in the root directory of the `jiopayment` project (where `package.json` and `vite.config.js` are located).
2. Add the following line to the `.env` file to set the base URL for the API endpoints:
```env
VITE_API_BASE_URL=/api/customer
```
> **Note:** Adjust `/api/customer` to the actual base URL of your backend if you are running it on a different domain or port locally (e.g., `http://localhost:8080/api/customer`).

### 3. Install Dependencies & Run
```bash
npm install
npm run dev
```

---

## 🔌 API Integration Guide

This project uses `axios` for HTTP requests, configured via a central API client. To integrate or add a new API, follow these detailed steps:

### Step 1: Understand the API Client (`src/utils/apiClient.js`)
All API requests flow through a customized Axios instance in `apiClient.js`. 
- It automatically attaches the `VITE_API_BASE_URL` from your `.env` file.
- It includes request and response interceptors to log activity and handle errors globally.
- You do not need to import `axios` directly in your components.

### Step 2: Define API Calls in a Service (`src/services/`)
Instead of calling APIs directly from React components, we use the **Service Pattern**. All API endpoints are defined as asynchronous functions inside service objects (like `onboardingService.js`).

To add a new API integration:
1. Open or create the relevant service file (e.g., `src/services/onboardingService.js`).
2. Import the `apiClient`.
3. Create an `async` function for your endpoint.

**Example of adding a new API:**
```javascript
import apiClient from '../utils/apiClient';

const myCustomService = {
  /**
   * Fetches user profile data.
   * @param {string} userId
   */
  getUserProfile: async (userId) => {
    try {
      // apiClient will automatically prepend VITE_API_BASE_URL
      // So this calls: <VITE_API_BASE_URL>/profile/${userId}
      const response = await apiClient.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      // The error is already logged by the apiClient interceptor
      throw error; 
    }
  },
  
  // Add more API calls here...
};

export default myCustomService;
```

### Step 3: Consume the Service in a React Component
Once the API is defined in the service, you can import and call it within your component, usually inside a `useEffect` hook or an event handler (like a button click).

```javascript
import React, { useState } from 'react';
import myCustomService from '../../services/myCustomService'; // Adjust path

const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await myCustomService.getUserProfile(userId);
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      // Handle error state (e.g., show a toast notification)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchProfile}>Load Profile</button>
      {loading && <p>Loading...</p>}
      {profile && <p>Name: {profile.name}</p>}
    </div>
  );
};

export default UserProfile;
```

By following this pattern, your API logic remains decoupled from the UI, making it easier to maintain, test, and reuse across the application.

// AAAPA1334A