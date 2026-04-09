import ReviewHeader from "./ReviewHeader";
import ReviewRow from "./ReviewRow";

const ReviewFamilyDetails = ({ onEdit }) => {
  const maritalStatus = "Married";

  const dummyFamily = {
    fatherName: { firstName: "Rajesh", middleName: "Kumar", lastName: "Singh" },
    motherName: { firstName: "Suman", middleName: "", lastName: "Singh" },
    spouseName: {
      firstName: "Anjali",
      middleName: "Deepak",
      lastName: "Singh",
    },
  };

  const displayFamily = dummyFamily;

  return (
    <section className="w-full relative px-1 sm:px-0">
      <ReviewHeader title="Family Details" onEdit={onEdit} />
      
      <div className="flex flex-col gap-6 w-full mx-auto">
        <ReviewRow label="Marital Status" value={maritalStatus} className="px-1" />
        {/* <div className="flex flex-row gap-4 justify-start sm:gap-12 mt-2"> */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
          <ReviewRow 
            label="Father Name" 
            value={`${displayFamily?.fatherName?.firstName} ${displayFamily?.fatherName?.middleName || ""} ${displayFamily?.fatherName?.lastName}`} 
          />
          <ReviewRow 
            label="Mother Name" 
            value={`${displayFamily?.motherName?.firstName} ${displayFamily?.motherName?.middleName || ""} ${displayFamily?.motherName?.lastName}`} 
          />
          {maritalStatus === "Married" && (
            <ReviewRow 
              label="Spouse Name" 
              value={`${displayFamily?.spouseName?.firstName} ${displayFamily?.spouseName?.middleName || ""} ${displayFamily?.spouseName?.lastName}`} 
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewFamilyDetails;
