import React, { useRef } from "react";
import { formatDate, formatCurrency } from "../lib/utils";
import { TrashIcon } from "lucide-react";
import AddLease from "./AddLease";
import AddPayment from "./AddPayment";

const ApartmentPayments = ({
  apartment,
  leases,
  handleAddPayment,
  handleDeletePayment,
  handleDeleteLease,
  handleAddLease,
}) => {
  const leaseModalRef = useRef(null);
  const paymentModalRef = useRef(null);

  const openLeaseModal = () => leaseModalRef.current.showModal();
  const openPaymentModal = () => paymentModalRef.current.showModal();

  const groupPaymentsByMonth = (payments) => {
    const grouped = {};
    payments.forEach((payment) => {
      if (!payment.dateFor) return;
      const date = new Date(payment.dateFor);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        timeZone: "UTC",
      });

      if (!grouped[monthKey]) grouped[monthKey] = { monthName, payments: [] };
      grouped[monthKey].payments.push(payment);
    });

    return Object.entries(grouped)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([_, value]) => value);
  };

  const calcExpectedRent = (leaseStartDate, leaseEndDate, rent) => {
    if (!leaseStartDate || !leaseEndDate || !rent) return 0;

    const currentDate = new Date();
    const start = new Date(leaseStartDate);
    const end = new Date(leaseEndDate);
    if (start > currentDate) return 0;
    const calculationEndDate = end > currentDate ? currentDate : end;

    let monthsDiff =
      (calculationEndDate.getFullYear() - start.getFullYear()) * 12 +
      (calculationEndDate.getMonth() - start.getMonth()) +
      1;
    return monthsDiff * rent;
  };

  return (
    <div className="text-lg space-y-6">
      {/* Header with Add Lease and Add Payment buttons */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <h2 className="card-title text-xl font-bold">
          Leases ({leases?.length || 0} terms)
        </h2>
        <div className="justify-end">
          <button
            className="btn btn-xs btn-success mr-2"
            onClick={openPaymentModal}
          >
            Add Payment
          </button>

          <button className="btn btn-xs btn-primary" onClick={openLeaseModal}>
            Add Lease
          </button>
        </div>
        {/* Lease Modal */}
        <dialog ref={leaseModalRef} className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-xs btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <AddLease onSuccess={handleAddLease} />
          </div>
        </dialog>

        {/* Payment Modal */}
        <dialog ref={paymentModalRef} className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-xs btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <AddPayment onSuccess={handleAddPayment} leases={leases} />
          </div>
        </dialog>
      </div>
      {/* Loop through leases */}
      {leases?.length > 0 ? (
        <div className="space-y-4">
          {leases.map((lease) => {
            const monthlyGroups = groupPaymentsByMonth(lease.payments);

            return (
              <div
                key={lease._id}
                className="border border-base-300 rounded-lg p-4 bg-base-100"
              >
                {/* Lease Header */}
                <div className="flex justify-between items-center">
                  <span className="font-bold">
                    Lease: {formatDate(new Date(lease.leaseStartDate))} -{" "}
                    {formatDate(new Date(lease.leaseEndDate))}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-normal">
                      Total Paid:{" "}
                      {formatCurrency(
                        lease.payments.reduce(
                          (acc, p) => acc + (p.amount || 0),
                          0
                        )
                      )}{" "}
                      / Expected:{" "}
                      {formatCurrency(
                        calcExpectedRent(
                          lease.leaseStartDate,
                          lease.leaseEndDate,
                          lease.rent
                        )
                      )}
                    </span>
                    <button
                      onClick={() => handleDeleteLease(lease._id)}
                      className="btn btn-xs btn-error"
                    >
                      Delete Lease
                    </button>
                  </div>
                </div>
                <div className="text-sm mb-1">
                  <span className="mr-6">
                    <b>Security Deposit:</b> {lease.securityDeposit}
                  </span>
                  <span className="mr-6">
                    <b>Monthly Rent:</b> {lease.rent}
                  </span>
                  <span>
                    <b>Lease Type:</b> {lease.leaseType}
                  </span>
                </div>

                {/* Payments inside lease */}
                {monthlyGroups.length > 0 ? (
                  <div className="space-y-4">
                    {monthlyGroups.map((monthGroup) => (
                      <div
                        key={monthGroup.monthName}
                        className="border-l-2 border-base-300 pl-4"
                      >
                        <h3 className="font-semibold text-base mb-2">
                          {monthGroup.monthName}
                        </h3>
                        <div className="space-y-2">
                          {monthGroup.payments.map((payment) => (
                            <div
                              key={payment._id}
                              className="bg-base-200 p-3 rounded-lg text-sm"
                            >
                              <div className="grid grid-cols-3 items-center gap-2">
                                <div className="justify-self-start">
                                  <span className="font-medium">
                                    Date Paid:{" "}
                                  </span>
                                  {payment.datePaid
                                    ? formatDate(new Date(payment.datePaid))
                                    : "—"}
                                </div>
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
                                  <button
                                    onClick={() =>
                                      handleDeletePayment(
                                        lease._id,
                                        payment._id
                                      )
                                    }
                                    className="btn btn-xs"
                                  >
                                    <TrashIcon className="text-error" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm italic text-gray-500">
                    No payments for this lease.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="alert">
          <span>No leases found.</span>
        </div>
      )}
    </div>
  );
};

export default ApartmentPayments;
