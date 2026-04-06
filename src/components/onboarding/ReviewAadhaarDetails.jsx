import React from 'react';
import { useFormContext } from 'react-hook-form';

const ReviewAadhaarDetails = ({ onEdit }) => {
  const dummyApplicant = {
    firstName: "Test",
    middleName: "Name",
    lastName: "Singh",
    gender: "Male",
    dob: "15/08/1995",
    email: "test.singh@example.com",
    communicationAddress: {
      houseNo: "123",
      building: "Bhairav Plaza",
      street: "150 Feet Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400013"
    }
  };

  const applicant = dummyApplicant;

  return (
    <section className="w-full relative">
      <div className="relative w-full flex justify-center mb-6">
        <h3 className="font-bold text-[16.5px]">Aadhaar Details</h3>
        <button
          onClick={onEdit}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#3A1E08] text-[#EBC080] rounded px-5 py-1 text-[13px] font-bold border border-[#2A1505] shadow-sm hover:opacity-90 tracking-wide"
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
            {`${applicant.communicationAddress.houseNo}, ${applicant.communicationAddress.building}, ${applicant.communicationAddress.street}, ${applicant.communicationAddress.city}, ${applicant.communicationAddress.state} - ${applicant.communicationAddress.pincode}`}
          </div>

          <div className="flex items-center gap-2 text-[14.5px]">
            <span className="font-bold text-gray-700">Email ID:</span>
    <span className="font-medium text-gray-900 ml-1"> {applicant.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewAadhaarDetails;
