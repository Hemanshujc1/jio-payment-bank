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

  // ✅ ADDRESS FORMATTER — uses master field names (per Rule 4 Case 2)
  const formatAddress = (addr) => {
    if (!addr) return "-";

    const parts = [addr.line1, addr.line2, addr.line3, addr.district].filter(Boolean);
    let result = parts.join(", ");
    if (addr.city && addr.pincode) result += `, ${addr.city} - ${addr.pincode}`;
    else if (addr.city) result += `, ${addr.city}`;
    if (addr.state) result += `, ${addr.state}`;

    return result || "-";
  };

  // ✅ MINOR CHECK (based on DOB)
  const isMinor = (() => {
    if (!data?.dob) return false;

    let dobStr = data.dob;
    if (dobStr.includes("-")) {
      const parts = dobStr.split("-");
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // yyyy-mm-dd
          dobStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
        } else {
          // dd-mm-yyyy
          dobStr = `${parts[0]}/${parts[1]}/${parts[2]}`;
        }
      }
    }

    const [dd, mm, yyyy] = dobStr.split("/");
    const dob = new Date(`${yyyy}-${mm}-${dd}`);
    const age = new Date().getFullYear() - dob.getFullYear();

    return age < 18;
  })();

  if (data?.provide === "No") {
    return (
      <section className="w-full relative px-1 sm:px-0">
        <ReviewHeader title="Nominee Details" onEdit={onEdit} />
        <div className="flex flex-col gap-2 mt-4 px-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <span className="font-semibold text-[16px] shrink-0 text-gray-800">
              Do you want to provide nominee details:
            </span>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-default opacity-60">
                <input
                  type="radio"
                  checked={false}
                  readOnly
                  className="w-5 h-5 accent-black cursor-default"
                />
                <span className="text-[16px] font-medium text-gray-900">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-default">
                <input
                  type="radio"
                  checked={true}
                  readOnly
                  className="w-5 h-5 accent-black cursor-default"
                />
                <span className="text-[16px] font-medium text-gray-900">No</span>
              </label>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
              value={formatAddress(data?.addressDetails)}
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
                  value={formatAddress(guardian?.addressDetails)}
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