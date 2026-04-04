import React from 'react';
import { useNavigate } from 'react-router-dom';
import SectionBox from '../components/SectionBox';
import ActionItem from '../components/ActionItem';
import BankAccount from "../assets/BankAccount.svg"

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-start">
      <SectionBox title="BANKING">
        <ActionItem 
          img={BankAccount} 
          label={
            <>
              Open<br />Account
            </>
          } 
          onClick={() => {
            navigate('/savings-variant');
          }}
        />
      </SectionBox>
    </div>
  );
};

export default Dashboard;
