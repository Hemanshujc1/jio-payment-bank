import ReviewHeader from "./ReviewHeader";
import ReviewRow from "./ReviewRow";

const ReviewFamilyDetails = ({ data, applicant, onEdit }) => {
  
  // ✅ Helper to build full name safely
  const getFullName = (obj) => {
    if (!obj) return "-";
    return [obj.firstName, obj.middleName, obj.lastName]
      .filter(Boolean)
      .join(" ");
  };

  const maritalStatus = applicant?.maritalStatus || "-";

  return (
    <section className="w-full relative px-1 sm:px-0">
      <ReviewHeader title="Family Details" onEdit={onEdit} />

      <div className="flex flex-col gap-6 w-full mx-auto">
        
        {/* Marital Status */}
        <ReviewRow
          label="Marital Status"
          value={maritalStatus}
          className="px-1"
        />

        {/* Family Names */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
          
          <ReviewRow
            label="Father Name"
            value={getFullName(data?.fatherName)}
          />

          <ReviewRow
            label="Mother Name"
            value={getFullName(data?.motherName)}
          />

          {maritalStatus === "Married" && (
            <ReviewRow
              label="Spouse Name"
              value={getFullName(data?.spouseName)}
            />
          )}

        </div>
      </div>
    </section>
  );
};

export default ReviewFamilyDetails;