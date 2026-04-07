import React from 'react';
import { useFormContext } from 'react-hook-form';
import { differenceInYears } from 'date-fns';
import { parseDate } from '../../../utils/validationUtils';

const ReviewNomineeDetails = ({ onEdit }) => {
  const dummyNominee = {
    firstName: "Aryan",
    middleName: "",
    lastName: "Singh",
    relationship: "Son",
    dob: "10/05/2015",
    address: "Address as per Aadhaar",
    addressDetails: {
      houseNo: "401",
      building: "XYZ House",
      street: "Fake Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400059"
    }
  };
  const dummyGuardian = {
    firstName: "Anjali",
    middleName: "Deepak",
    lastName: "Singh",
    relationship: "Mother",
    dob: "20/06/1990",
    address: "Others",
    addressDetails: {
      houseNo: "402",
      building: "ABC House",
      street: "DEF Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400059"
    }
  };
  const provideNominee = "Yes";
  const nominee = dummyNominee;
  const guardian = dummyGuardian;

  const NameRow = ({ label, person }) => (
    <div className="flex flex-col md:flex-row md:items-center gap-2">
      <span className="font-bold text-[14.5px] w-32 shrink-0 text-gray-700">
        {label} Name:
      </span>
      <span className="text-[14.5px] font-medium text-gray-900">
        {person?.firstName} {person?.middleName || ""} {person?.lastName}
      </span>
    </div>
  );

  const isMinor = true; // Hardcoded for dummy display

  return (
    <section className="w-full relative">
      <div className="relative w-full flex justify-center mb-8">
        <h3 className="font-bold text-[16.5px]">Nominee Details</h3>
        <button
          onClick={onEdit}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#3A1E08] text-sand-350 rounded px-5 py-1 text-[13px] font-bold border border-[#2A1505] shadow-sm hover:opacity-90 tracking-wide"
        >
          Edit
        </button>
      </div>
      <div className="flex flex-col gap-6 w-full mx-auto">
        <NameRow label="Nominee" person={nominee} />
        
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14.5px] w-32 shrink-0 text-gray-700">
              Relationship:
            </span>
            <span className="text-[14.5px] font-medium text-gray-900">{nominee.relationship}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14.5px] w-32 shrink-0 text-gray-700">
              Date Of Birth:
            </span>
            <span className="text-[14.5px] font-medium text-gray-900">{nominee.dob}</span>
          </div>
        </div>

        <div className="text-[14.5px] flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 shrink-0">Address Option:</span> 
            <span className="font-medium text-gray-900">{nominee.address}</span>
          </div>
          {nominee.addressDetails && (
            <div className="text-[14px] text-gray-800">
              <span className="font-bold text-gray-700">Nominee Address: </span>
              {nominee.addressDetails.houseNo}, {nominee.addressDetails.building}, {nominee.addressDetails.street}, {nominee.addressDetails.city}, {nominee.addressDetails.state} - {nominee.addressDetails.pincode}
            </div>
          )}
        </div>

        {/* Guardian details if needed */}
        {isMinor && (
          <div className="mt-2 flex flex-col gap-5">
            <h4 className="font-bold text-[15px] text-gray-800">Guardian Details</h4>
            <NameRow label="Guardian" person={guardian} />
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[14.5px] w-32 shrink-0 text-gray-700">
                  Relationship:
                </span>
                <span className="text-[14.5px] font-medium text-gray-900">{guardian.relationship}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[14.5px] w-32 shrink-0 text-gray-700">
                  Date Of Birth:
                </span>
                <span className="text-[14.5px] font-medium text-gray-900">{guardian.dob}</span>
              </div>
            </div>
            <div className="text-[14.5px] flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 shrink-0">Address Option:</span> 
            <span className="font-medium text-gray-900">{nominee.address}</span>
          </div>
          {guardian.addressDetails && (
            <div className="text-[14px] text-gray-800">
              <span className="font-bold text-gray-700">Gurdain Address: </span>
              {guardian.addressDetails.houseNo}, {guardian.addressDetails.building}, {guardian.addressDetails.street}, {guardian.addressDetails.city}, {guardian.addressDetails.state} - {guardian.addressDetails.pincode}
            </div>
          )}
        </div>
          </div>
        )}

       
      </div>
    </section>
  );
};

export default ReviewNomineeDetails;
