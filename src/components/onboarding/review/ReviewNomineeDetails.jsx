import ReviewHeader from "./ReviewHeader";
import ReviewRow from "./ReviewRow";

const ReviewNomineeDetails = ({ data, guardian, onEdit }) => {

  // ✅ FULL NAME HELPER
  const getFullName = (obj) => {
    if (!obj) return "-";
    return [obj.firstName, obj.middleName, obj.lastName]
      .filter(Boolean)
      .join(" ");
  };

  // ✅ ADDRESS FORMATTER
  const formatAddress = (addr) => {
    if (!addr) return "-";

    const full = [
      addr.addressLine1,
      addr.addressLine2,
      addr.addressLine3,
      addr.city,
      addr.state,
    ]
      .filter(Boolean)
      .join(", ");

    return full ? `${full} - ${addr.pincode || ""}` : "-";
  };

  // ✅ MINOR CHECK (based on DOB)
  const isMinor = (() => {
    if (!data?.dob) return false;

    const [dd, mm, yyyy] = data.dob.split("/");
    const dob = new Date(`${yyyy}-${mm}-${dd}`);
    const age = new Date().getFullYear() - dob.getFullYear();

    return age < 18;
  })();

  return (
    <section className="w-full relative px-1 sm:px-0">
      <ReviewHeader title="Nominee Details" onEdit={onEdit} />

      <div className="flex flex-col gap-6 w-full mx-auto">

        {/* ================= NOMINEE ================= */}
        <div className="flex flex-col gap-5">

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
            <ReviewRow
              label="Nominee Name"
              value={getFullName(data)}
            />
            <ReviewRow
              label="Relationship"
              value={data?.relationship || "-"}
            />
            <ReviewRow
              label="Date Of Birth"
              value={data?.dob || "-"}
            />
            <ReviewRow
              label="Address Option"
              value={data?.addressType || "Permanent"}
            />
          </div>

          <div className="px-1">
            <ReviewRow
              label="Nominee Address"
              value={formatAddress(data)}
            />
          </div>
        </div>

        {/* ================= GUARDIAN ================= */}
        {isMinor && (
          <div className="mt-4 flex flex-col gap-6 pt-4 border-t border-gray-100/50">

            <h4 className="font-bold text-[15px] sm:text-[16px] text-gray-800 text-center">
              Guardian Details
            </h4>

            <div className="flex flex-col gap-5">

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
                <ReviewRow
                  label="Guardian Name"
                  value={getFullName(guardian)}
                />
                <ReviewRow
                  label="Relationship"
                  value={guardian?.relationship || "-"}
                />
                <ReviewRow
                  label="Date Of Birth"
                  value={guardian?.dob || "-"}
                />
                <ReviewRow
                  label="Address Option"
                  value={guardian?.addressType || "Permanent"}
                />
              </div>

              <div className="px-1">
                <ReviewRow
                  label="Guardian Address"
                  value={formatAddress(guardian)}
                />
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ReviewNomineeDetails;