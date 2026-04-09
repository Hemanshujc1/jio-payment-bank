import ReviewHeader from './ReviewHeader';
import ReviewRow from './ReviewRow';

const ReviewFinancialDetails = ({ onEdit }) => {
  const dummyFinancial = {
    occupation: "Salaried",
    sourceOfIncome: "Salary",
    annualIncome: "5 Lakhs - 25 lakhs",
    fatcaDeclared: true
  };
  const financial = dummyFinancial;

  return (
    <section className="w-full relative px-1 sm:px-0">
      <ReviewHeader title="Financial Details" onEdit={onEdit} />
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
        <ReviewRow label="Occupation" value={financial.occupation} labelWidth="sm:w-auto" />
        <ReviewRow label="Source of Income" value={financial.sourceOfIncome} labelWidth="sm:w-auto" />
        <ReviewRow label="Annual Income" value={financial.annualIncome} labelWidth="sm:w-auto" />
      </div>
    </section>
  );
};

export default ReviewFinancialDetails;
