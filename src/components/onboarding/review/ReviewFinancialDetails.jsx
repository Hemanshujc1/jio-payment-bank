import ReviewHeader from './ReviewHeader';
import ReviewRow from './ReviewRow';

const occupationMap = {
  'OCC01': 'Private Sector Service',
  'OCC02': 'Public Sector Service',
  'OCC03': 'Government Sector Service',
  'JP1': 'Business',
  'OCC04': 'Professional',
  'OCC05': 'Self Employed',
  'OCC06': 'Retired',
  'OCC07': 'Homemaker',
  'OCC08': 'Student',
  'OCC09': 'Farmer',
  'OCC10': 'Others',
};

const sourceOfIncomeMap = {
  'INC01': 'Salary',
  'A04': 'Business',
  'INC02': 'Professional Fees',
  'INC03': 'Agriculture',
  'INC04': 'Savings',
  'INC05': 'Family Wealth',
  'INC06': 'Inheritance',
  'INC07': 'Others',
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
