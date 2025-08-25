import React from "react";

const ApartmentInfo = ({ apartment }) => {
  return (
    <div className="flex-col card bg-base-20 border border-solid border-[#000000] p-2">
      <div>Rent: {apartment.rent}</div>
      <div>Lease Start Date: {apartment.leaseStartDate}</div>
      <div>Lease End Date: {apartment.leaseEndDate}</div>
      <div>Security Deposit: {apartment.securityDeposit}</div>
      <div>Lease Type: {apartment.leaseType}</div>
      <div>Notes: {apartment.notes}</div>
    </div>
  );
};

export default ApartmentInfo;
