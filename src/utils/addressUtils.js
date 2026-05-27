/**
 * MASTER ADDRESS STRUCTURE
 * Use this structure everywhere in the project.
 * Never rename or add fields outside this shape.
 *
 * {
 *   addressType: "",
 *
 *   houseNumber: "", // blank in case of manual
 *
 *   line1: "",
 *   line2: "",
 *   line3: "",
 *
 *   locality: "", // blank in case of manual
 *   street: "", // blank in case of manual
 *   landmark: "", // blank in case of manual
 *
 *   city: "",
 *   district: "",
 *   state: "",
 *   stateCode: "",
 *   country: "India",
 *   pincode: "",
 *
 *   sameAsPermanent: false,
 * }
 */

/**
 * Returns a blank master address object.
 */
export const emptyAddress = () => ({
  addressType: "",
  houseNumber: "",
  line1: "",
  line2: "",
  line3: "",
  locality: "",
  street: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  stateCode: "",
  country: "India",
  pincode: "",
  sameAsPermanent: false,
});

/**
 * Deep-clones an address object into the master structure.
 * Per Rule 1 & 3: NO transformation, NO rebuilding.
 * Use this for:
 *   - "Same as Aadhaar Address"
 *   - "Same as Communication Address"
 *
 * @param {Object} addr - source address (Aadhaar address or communication address)
 * @param {string} [addressType] - override addressType (e.g. "CURRENT", "PERMANENT")
 * @param {boolean} [sameAsPermanent]
 * @returns {Object} cloned master address
 */
export const cloneAddress = (addr, addressType, sameAsPermanent = false) => {
  if (!addr) return emptyAddress();
  return {
    addressType: addressType ?? addr.addressType ?? "",
    houseNumber: addr.houseNumber ?? "",
    line1: addr.line1 ?? "",
    line2: addr.line2 ?? "",
    line3: addr.line3 ?? "",
    locality: addr.locality ?? "",
    street: addr.street ?? "",
    landmark: addr.landmark ?? "",
    city: addr.city ?? "",
    district: addr.district ?? "",
    state: addr.state ?? "",
    stateCode: addr.stateCode !== undefined ? String(addr.stateCode) : "",
    country: addr.country ?? "India",
    pincode: addr.pincode ?? "",
    sameAsPermanent,
  };
};

/**
 * Maps a pincode API response to master address fields.
 * Per Rule 2: only city, district, state, stateCode come from the API.
 *
 * @param {Object} res - pincode API response { cityName, district, stateName, stateCode }
 * @returns {{ city, district, state, stateCode }}
 */
export const mapPincodeResponse = (res) => ({
  city: res.cityName ?? "",
  district: res.district ?? "",
  state: res.stateName ?? "",
  stateCode: res.stateCode !== undefined ? String(res.stateCode) : "",
});

/**
 * Returns a frontend display string for an address.
 *
 * CASE 1 — Aadhaar-copied address (sameAsPermanent or explicitly aadhaar type):
 *   Shows:  line1 | line2 | line3
 *
 * CASE 2 — Others / manually entered:
 *   Shows:  line1, [line2], [line3], district, city - pincode, state
 *
 * Per Rule 4: formatted string is for DISPLAY ONLY.
 * NEVER store or send this in a payload.
 *
 * @param {Object} addr - master address object
 * @param {"aadhaar"|"others"} mode
 * @returns {string}
 */
export const getDisplayAddress = (addr, mode = "others") => {
  if (!addr) return "";

  if (mode === "aadhaar") {
    return [addr.line1, addr.line2, addr.line3].filter(Boolean).join(", ");
  }

  // "others" mode
  const parts = [addr.line1, addr.line2, addr.line3, addr.district].filter(
    Boolean,
  );

  let result = parts.join(", ");

  if (addr.city && addr.pincode) {
    result += `, ${addr.city} - ${addr.pincode}`;
  } else if (addr.city) {
    result += `, ${addr.city}`;
  } else if (addr.pincode) {
    result += ` - ${addr.pincode}`;
  }

  if (addr.state) {
    result += `, ${addr.state}`;
  }

  return result;
};

/**
 * Writes all master address fields into react-hook-form via setValue.
 * Call this instead of setting individual fields one by one.
 *
 * @param {Function} setValue - from useFormContext
 * @param {string} prefix - e.g. "applicant.communicationAddress" or "nominee.addressDetails"
 * @param {Object} addr - master address object
 * @param {boolean} shouldValidate
 */
export const setAddressFields = (
  setValue,
  prefix,
  addr,
  shouldValidate = true,
) => {
  const a = addr ?? emptyAddress();
  const opts = { shouldValidate };
  setValue(`${prefix}.addressType`, a.addressType, opts);
  setValue(`${prefix}.houseNumber`, a.houseNumber, opts);
  setValue(`${prefix}.line1`, a.line1, opts);
  setValue(`${prefix}.line2`, a.line2, opts);
  setValue(`${prefix}.line3`, a.line3, opts);
  setValue(`${prefix}.locality`, a.locality, opts);
  setValue(`${prefix}.street`, a.street, opts);
  setValue(`${prefix}.landmark`, a.landmark, opts);
  setValue(`${prefix}.city`, a.city, opts);
  setValue(`${prefix}.district`, a.district, opts);
  setValue(`${prefix}.state`, a.state, opts);
  setValue(`${prefix}.stateCode`, a.stateCode, opts);
  setValue(`${prefix}.country`, a.country || "India", opts);
  setValue(`${prefix}.pincode`, a.pincode, opts);
  setValue(`${prefix}.sameAsPermanent`, a.sameAsPermanent ?? false, opts);
};

/**
 * Clears all master address fields in react-hook-form.
 *
 * @param {Function} setValue - from useFormContext
 * @param {string} prefix
 */
export const clearAddressFields = (setValue, prefix) => {
  setAddressFields(setValue, prefix, emptyAddress(), false);
};
