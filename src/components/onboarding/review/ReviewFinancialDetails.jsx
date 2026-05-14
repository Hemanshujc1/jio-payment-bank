import ReviewHeader from './ReviewHeader';
import ReviewRow from './ReviewRow';

const occupationMap = {
  'JP1': 'Private Sector Service',
  'JP2': 'Public Sector Service',
  'JP3': 'Government Sector Service',
  'JP4': 'Business',
  'JP5': 'Professional',
  'JP6': 'Self Employed',
  'JP7': 'Retired',
  'JP8': 'Homemaker',
  'JP9': 'Student',
  'JP10': 'Farmer',
  'JP11': 'Others',
};

const sourceOfIncomeMap = {
  'A01': 'Salary',
  'A02': 'Business',
  'A03': 'Professional Fees',
  'A04': 'Agriculture',
  'A05': 'Savings',
  'A06': 'Family Wealth',
  'A07': 'Inheritance',
  'A08': 'Others',
};

const annualIncomeMap = {
  '1': 'Upto 50K',
  '2': '50K – 1 lakh',
  '3': '1 lakh – 5 lakhs',
  '4': '5 lakhs – 25 lakhs',
  '5': '25 lakhs – 1 crore',
  '6': 'Above 1 crore',
};

const ReviewFinancialDetails = ({ data, onEdit }) => {
  const financial = data || {};

  return (
    <section className="w-full relative px-1 sm:px-0">
      <ReviewHeader title="Financial Details" onEdit={onEdit} />
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
        <ReviewRow label="Occupation" value={occupationMap[financial.occupation] || financial.occupation || "-"} labelWidth="sm:w-auto" />
        <ReviewRow label="Source of Income" value={sourceOfIncomeMap[financial.sourceOfIncome] || financial.sourceOfIncome || "-"} labelWidth="sm:w-auto" />
        <ReviewRow label="Annual Income" value={annualIncomeMap[financial.annualIncome] || financial.annualIncome || "-"} labelWidth="sm:w-auto" />
      </div>
    </section>
  );
};

export default ReviewFinancialDetails;
