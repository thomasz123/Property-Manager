import React from "react";
import { formatDate, formatCurrency } from "../lib/utils";

const ApartmentPayments = ({apartment}) => {
  return (
    
    <div className="text-lg">
      <h2 className="card-title text-xl font-bold">
                  Payments ({apartment.payments?.length || 0})
      </h2>
      {apartment.payments?.length > 0 ? (
        <div className="space-y-3">
          {apartment.payments.map((payment) => (
            // <div key={payment._id} className="p-1 rounded-lg bg-base-200 border">
            //   <div className="flex justify-between items-start mb-2">
            //     <h3 className="font-medium">{formatDate(new Date(payment.datePaid))}</h3>
            //   </div>

            //   <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
            //     {payment.amount && (
            //       <div className="flex items-center gap-1">
            //         <span>Amount Paid: {formatCurrency(payment.amount)}</span>
            //       </div>
            //     )}
            //     {payment.currentRent && (
            //       <div className="flex items-center gap-1">
            //         <span> Current Rent: {formatCurrency(payment.currentRent)}</span>
            //       </div>
            //     )}
            //   </div>
            // </div>
            <div className="collapse collapse-arrow bg-base-100 border border-base-300">
              <input type="radio" name="my-accordion-2" defaultChecked />
              <div className="collapse-title font-semibold">{formatDate(new Date(payment.datePaid))}</div>
              <div className="collapse-content text-sm">
                {payment.dateFor && (
                  <div className="flex items-center gap-1">
                    <span>Date For: {formatDate(new Date(payment.dateFor))}</span>
                  </div>
                )}
                {payment.amount && (
                  <div className="flex items-center gap-1">
                    <span>Amount Paid: {formatCurrency(payment.amount)}</span>
                  </div>
                )}
                {payment.currentRent && (
                  <div className="flex items-center gap-1">
                    <span> Current Rent: {formatCurrency(payment.currentRent)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert">
          <span>No payments found.</span>
        </div>
      )}
    </div>
  );
};

export default ApartmentPayments;
