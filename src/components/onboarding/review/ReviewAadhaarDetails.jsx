import React from 'react';
import { useFormContext } from 'react-hook-form';

const ReviewAadhaarDetails = ({ onEdit }) => {
  const dummyApplicant = {
    phoneNumber:"9876543210",
    emailid:"customer@example.com",
    panNumber:"ABCDE1234F",
    aadharNumber:"XXXX XXXX 9012",
    firstName: "Test",
    middleName: "Name",
    lastName: "Singh",
    gender: "Male",
    dob: "15/08/1995",
    communicationAddress: {
      addressLine1: "123, Bhairav Plaza",
      addressLine2: "150 Feet Road",
      addressLine3: "",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400013"
    },
  };

  const applicant = dummyApplicant;

  return (
    <section className="w-full relative">
      <div className="relative w-full flex justify-center mb-6">
        <h3 className="font-bold text-[16.5px]">Personal Details</h3>
        <button
          onClick={onEdit}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#3A1E08] text-sand-350 rounded px-5 py-1 text-[13px] font-bold border border-[#2A1505] shadow-sm hover:opacity-90 tracking-wide"
        >
          Edit
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-32.5 h-37.5 bg-[#D4D5D9] shrink-0 overflow-hidden rounded-md border border-neutral-light/30">
          <img src="/jpb/2.jpeg" alt="user photo" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-5 w-full mt-2 lg:ml-4">
          <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
            <span className="text-[14.5px]">
              <span className="font-bold text-gray-700">Name:</span> {`${applicant.firstName} ${applicant.middleName || ''} ${applicant.lastName}`}
            </span>
            <span className="text-[14.5px]">
              <span className="font-bold text-gray-700">Gender:</span> {applicant.gender}
            </span>
            <span className="text-[14.5px]">
              <span className="font-bold text-gray-700">Date of Birth:</span> {applicant.dob}
            </span>
          </div>
          
          <div className="text-[14.5px] leading-relaxed max-w-5xl">
            <span className="font-bold text-gray-700">Communication Address:</span>{" "}
            {[
              applicant.communicationAddress.addressLine1,
              applicant.communicationAddress.addressLine2,
              applicant.communicationAddress.addressLine3,
              applicant.communicationAddress.city,
              applicant.communicationAddress.state
            ].filter(Boolean).join(", ")} - {applicant.communicationAddress.pincode}
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-3 text-[14.5px]">
  <span>
    <span className="font-bold text-gray-700">Email:</span> {applicant.emailid}
  </span>

  <span>
    <span className="font-bold text-gray-700">Phone:</span> {applicant.phoneNumber}
  </span>

  <span>
    <span className="font-bold text-gray-700">PAN:</span> {applicant.panNumber}
  </span>

  <span>
    <span className="font-bold text-gray-700">Aadhaar:</span> {applicant.aadharNumber}
  </span>
</div>
        </div>

      </div>
    </section>
  );
};

export default ReviewAadhaarDetails;
