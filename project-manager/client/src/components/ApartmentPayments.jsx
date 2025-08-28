import React from "react";
import { formatDate, formatCurrency } from "../lib/utils";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useRef } from "react";
import AddPayment from "./AddPayment";

const ApartmentPayments = ({ apartment, leases, handleAddPayment, handleDeletePayment}) => {
  // Helper function to group payments by month
  const groupPaymentsByMonth = (payments) => {
    const grouped = {};

    payments.forEach((payment) => {
      const date = new Date(payment.date || payment.dateFor);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        timeZone: "UTC",
      });

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          monthName,
          payments: [],
        };
      }
      grouped[monthKey].payments.push(payment);
    });

    // Sort by month (newest first)
    return Object.entries(grouped)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, value]) => value);
  };

  const calcExpectedRent = (leaseStartDate, leaseEndDate, rent) => {
    // Validate inputs
    if (!leaseStartDate || !leaseEndDate || !rent) {
      return 5;
    }

    const currentDate = new Date();

    // If lease hasn't started yet
    if (leaseStartDate > currentDate) {
      return 0;
    }

    // Use the earlier of lease end date or current date
    const calculationEndDate =
      leaseEndDate > currentDate ? currentDate : leaseEndDate;

    // Calculate month difference
    const startYear = leaseStartDate.getFullYear();
    const startMonth = leaseStartDate.getMonth();
    const endYear = calculationEndDate.getFullYear();
    const endMonth = calculationEndDate.getMonth();

    // Calculate total months (inclusive)
    let monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth);
    if (monthsDiff === 0) monthsDiff = 1;
    // Return total expected rent
    return monthsDiff * rent;
  };

  return (
    <div className="text-lg space-y-4">
      
      {leases?.length > 0 ? (
        <div className="space-y-3">
          {leases.map((lease, leaseIndex) => {
            const monthlyGroups = groupPaymentsByMonth(lease.payments);

            return (
              <div
                key={`${lease.leaseStart}-${leaseIndex}`}
                className="collapse collapse-arrow bg-base-100 border border-base-300"
              >
                <input
                  type="checkbox"
                  name="lease-accordion"
                  defaultChecked={leaseIndex === 0}
                />

                <div className="collapse-title font-semibold">
                  <div className="flex justify-between items-center">
                    <span>
                      Lease: {formatDate(new Date(lease.leaseStart))} -{" "}
                      {formatDate(new Date(lease.leaseEnd))}
                    </span>
                    <span className="text-sm font-normal">
                      Total: {formatCurrency(lease.totalAmount)} / Expected:{" "}
                      {formatCurrency(
                        calcExpectedRent(
                          new Date(lease.leaseStart),
                          new Date(lease.leaseEnd),
                          lease.currentRent
                        )
                      )}
                    </span>
                  </div>
                </div>

                <div className="collapse-content">
                  <div className="space-y-4 pt-4">
                    {monthlyGroups.map((monthGroup, monthIndex) => (
                      <div
                        key={`${monthGroup.monthName}-${monthIndex}`}
                        className="border-l-2 border-base-300 pl-4"
                      >
                        <h3 className="flex font-semibold text-base mb-2 justify-between">
                          {monthGroup.monthName}
                          {lease.currentRent && (
                            <div>
                              <span className="text-sm">
                                Paid:{" "}
                                {formatCurrency(
                                  monthlyGroups[monthIndex].payments.reduce(
                                    (acc, current) => acc + current.amount,
                                    0
                                  )
                                )}{" "}
                                / Expected: {formatCurrency(lease.currentRent)}
                              </span>
                            </div>
                          )}
                        </h3>

                        <div className="space-y-2">
                          {monthGroup.payments.map((payment) => (
                            <div
                              key={payment._id}
                              className="bg-base-200 p-3 rounded-lg text-sm"
                            >
                              <div className="grid grid-cols-3 items-center gap-2">
                                {payment.datePaid && (
                                  <div className="justify-self-start">
                                    <span className="font-medium">
                                      Date Paid:{" "}
                                    </span>
                                    {formatDate(new Date(payment.datePaid))}
                                  </div>
                                )}

                                <div className="justify-self-center">
                                  <span className="font-medium">
                                    Amount Paid:{" "}
                                  </span>
                                  <span
                                    className={
                                      payment.amount > 0
                                        ? "text-success"
                                        : "text-error"
                                    }
                                  >
                                    {formatCurrency(payment.amount || 0)}
                                  </span>
                                </div>

                                <div className="justify-self-end">
                                  <button onClick={() => handleDeletePayment(payment._id)}>
                                    <TrashIcon />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
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
