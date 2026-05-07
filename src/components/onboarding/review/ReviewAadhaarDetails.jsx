import ReviewHeader from "./ReviewHeader";
import ReviewRow from "./ReviewRow";

const ReviewAadhaarDetails = ({ data, onEdit }) => {

  // ✅ Safe full name
  const getFullName = () => {
    return [data?.firstName, data?.middleName, data?.lastName]
      .filter(Boolean)
      .join(" ") || "-";
  };

  // ✅ Safe address formatter
  const getFullAddress = () => {
    const addr = data?.communicationAddress || {};

    const address = [
      addr.addressLine1,
      addr.addressLine2,
      addr.addressLine3,
      addr.city,
      addr.state,
    ].filter(Boolean).join(", ");

    return address
      ? `${address} - ${addr.pincode || ""}`
      : "-";
  };

  // ✅ Base64 image support
  const getImageSrc = () => {
    if (data?.photo) {
      return `data:image/jpeg;base64,${data.photo}`;
    }
    return "/jpb/2.jpeg"; // fallback
  };

  return (
    <section className="w-full relative px-1 sm:px-0">
      <ReviewHeader title="Personal Details" onEdit={onEdit} />

      <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-start">

        {/* IMAGE */}
        <div className="w-32 sm:w-36 h-36 sm:h-44 bg-gray-50 shrink-0 overflow-hidden rounded-2xl border border-gray-100 shadow-sm p-1 mx-auto md:mx-0">
          <img
            src={getImageSrc()}
            alt="user"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 w-full mt-2 lg:ml-4">

          {/* BASIC DETAILS */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-12 px-1">
            <ReviewRow label="Name" value={getFullName()} />
            <ReviewRow label="Gender" value={data?.gender || "-"} />
            <ReviewRow label="DOB" value={data?.dob || "-"} />
          </div>

          {/* ADDRESS */}
          <div className="px-1">
            <ReviewRow
              label="Communication Address"
              value={getFullAddress()}
            />
          </div>

          {/* CONTACT + IDS */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-x-12 px-1">
            <ReviewRow label="Email" value={data?.emailId || "-"} />
            <ReviewRow label="Phone" value={data?.mobileNumber || "-"} />
            <ReviewRow label="PAN" value={data?.pan || "-"} />
            <ReviewRow label="Aadhaar" value={data?.aadhaar || "-"} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewAadhaarDetails;
