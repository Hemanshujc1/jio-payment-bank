import ReviewHeader from './ReviewHeader';
import ReviewRow from './ReviewRow';

const ReviewNomineeDetails = ({ onEdit }) => {
  const dummyNominee = {
    firstName: "Aryan",
    middleName: "",
    lastName: "Singh",
    relationship: "Son",
    dob: "10/05/2015",
    address: "Address as per Aadhaar",
    addressDetails: {
      addressLine1: "401, XYZ House",
      addressLine2: "Fake Street",
      addressLine3: "150 Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400059",
    },
  };
  const dummyGuardian = {
    firstName: "Anjali",
    middleName: "Deepak",
    lastName: "Singh",
    relationship: "Mother",
    dob: "20/06/1990",
    address: "Others",
    addressDetails: {
      addressLine1: "402, ABC House",
      addressLine2: "DEF Street",
      addressLine3: "",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400059",
    },
  };
  const nominee = dummyNominee;
  const guardian = dummyGuardian;

  const isMinor = true; // Hardcoded for dummy display

  const formatAddress = (details) => {
    if (!details) return "";
    return [
      details.addressLine1,
      details.addressLine2,
      details.addressLine3,
      details.city,
      details.state,
    ].filter(Boolean).join(", ") + ` - ${details.pincode}`;
  };

  return (
    <section className="w-full relative px-1 sm:px-0">
      <ReviewHeader title="Nominee Details" onEdit={onEdit} />

      <div className="flex flex-col gap-6 w-full mx-auto">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
            <ReviewRow label="Nominee Name" value={`${nominee.firstName} ${nominee.middleName || ""} ${nominee.lastName}`} labelWidth="sm:w-auto" />
            <ReviewRow label="Relationship" value={nominee.relationship} labelWidth="sm:w-auto" />
            <ReviewRow label="Date Of Birth" value={nominee.dob} labelWidth="sm:w-auto" />
            <ReviewRow label="Address Option" value={nominee.address} labelWidth="sm:w-auto" />
          </div>

          {nominee.addressDetails && (
            <div className="px-1">
              <ReviewRow label="Nominee Address" value={formatAddress(nominee.addressDetails)} labelWidth="sm:w-auto" />
            </div>
          )}
        </div>

        {isMinor && (
          <div className="mt-4 flex flex-col gap-6 pt-4 border-t border-gray-100/50">
            <h4 className="font-bold text-[15px] sm:text-[16px] text-gray-800 text-center">
              Guardian Details
            </h4>
            
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
                <ReviewRow label="Guardian Name" value={`${guardian.firstName} ${guardian.middleName || ""} ${guardian.lastName}`} labelWidth="sm:w-auto" />
                <ReviewRow label="Relationship" value={guardian.relationship} labelWidth="sm:w-auto" />
                <ReviewRow label="Date Of Birth" value={guardian.dob} labelWidth="sm:w-auto" />
                <ReviewRow label="Address Option" value={guardian.address} labelWidth="sm:w-auto" />
              </div>

              {guardian.addressDetails && (
                <div className="px-1">
                  <ReviewRow label="Guardian Address" value={formatAddress(guardian.addressDetails)} labelWidth="sm:w-auto" />
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
