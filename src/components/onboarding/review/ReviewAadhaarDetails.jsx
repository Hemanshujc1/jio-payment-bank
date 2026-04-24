import ReviewHeader from './ReviewHeader';
import ReviewRow from './ReviewRow';

const ReviewAadhaarDetails = ({ onEdit }) => {
  const dummyApplicant = {
    phoneNumber:"9876543210",
    emailId:"customer@example.com",
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

  const fullAddress = [
    applicant.communicationAddress.addressLine1,
    applicant.communicationAddress.addressLine2,
    applicant.communicationAddress.addressLine3,
    applicant.communicationAddress.city,
    applicant.communicationAddress.state
  ].filter(Boolean).join(", ") + ` - ${applicant.communicationAddress.pincode}`;

  return (
    <section className="w-full relative px-1 sm:px-0">
      <ReviewHeader title="Personal Details" onEdit={onEdit} />
      
      <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-start md:items-start text-left md:text-left">
        <div className="w-32 sm:w-36 h-36 sm:h-44 bg-gray-50 shrink-0 overflow-hidden rounded-2xl border border-gray-100 shadow-sm p-1 mx-auto md:mx-0">
          <img src="/jpb/2.jpeg" alt="user photo" className="w-full h-full object-contain mix-blend-multiply" />
        </div>
        
        <div className="flex flex-col gap-4 sm:gap-5 w-full mt-2 lg:ml-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-12 px-1">
            <ReviewRow label="Name" value={`${applicant.firstName} ${applicant.middleName || ''} ${applicant.lastName}`} labelWidth="sm:w-auto" />
            <ReviewRow label="Gender" value={applicant.gender} labelWidth="sm:w-auto" />
            <ReviewRow label="DOB" value={applicant.dob} labelWidth="sm:w-auto" />
          </div>
          
          <div className="px-1">
            <ReviewRow label="Communication Address" value={fullAddress} labelWidth="sm:w-auto" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-x-12 px-1">
            <ReviewRow label="Email" value={applicant.emailId} labelWidth="sm:w-auto" />
            <ReviewRow label="Phone" value={applicant.phoneNumber} labelWidth="sm:w-auto" />
            <ReviewRow label="PAN" value={applicant.panNumber} labelWidth="sm:w-auto" />
            <ReviewRow label="Aadhaar" value={applicant.aadharNumber} labelWidth="sm:w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewAadhaarDetails;
