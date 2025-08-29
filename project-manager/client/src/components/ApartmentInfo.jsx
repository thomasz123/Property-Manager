import React from "react";
import { formatDate } from "../lib/utils";

const ApartmentInfo = ({ apartment, leases, isLoading }) => {
  const lease = leases?.at(-1);

  if (isLoading) {
    return (
      <div className="text-center text-primary py-10">Loading Apartment...</div>
    );
  }

  if (!lease) {
    return (
      <div className="text-center text-gray-500 py-10">
        No lease information available.
      </div>
    );
  }

  return (
    <div className="text-lg space-y-1">
      <div>
        <b>Rent:</b> {lease.rent}
      </div>
      <div>
        <b>Lease Start Date:</b> {formatDate(new Date(lease.leaseStartDate))}
      </div>
      <div>
        <b>Lease End Date:</b> {formatDate(new Date(lease.leaseEndDate))}
      </div>
      <div>
        <b>Security Deposit:</b> {lease.securityDeposit}
      </div>
      <div>
        <b>Lease Type:</b> {lease.leaseType}
      </div>
      <div>
        <b>Notes:</b> {apartment?.notes || "—"}
      </div>
    </div>
  );
};

export default ApartmentInfo;
