import React from "react";
import { formatDate } from "../lib/utils";

const ApartmentInfo = ({ apartment }) => {
  return (
    <div>
      <div className="text-lg">
        <div>Rent: {apartment.rent}</div>
        <div>Lease Start Date: {formatDate(new Date(apartment.leaseStartDate))}</div>
        <div>Lease End Date: {formatDate(new Date(apartment.leaseEndDate))}</div>
        <div>Security Deposit: {apartment.securityDeposit}</div>
        <div>Lease Type: {apartment.leaseType}</div>
        <div>Notes: {apartment.notes}</div>
      </div> 
    </div>
  );
};

export default ApartmentInfo;
