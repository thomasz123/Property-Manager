import React, { useState } from "react";

function AddPayment({onSuccess}) {
  const [amount, setAmount] = useState(0);
  const [datePaid, setDatePaid] = useState("");
  const [monthPaidFor, setMonthPaidFor] = useState("");
  const [loading, setLoading] = useState(false);

  const getAvailableMonths = () => {};

  const handleSubmit = () => {
    onSuccess({
        
    })
  }
  return (
    <div className="bg-white">
      <div className="container mx-auto p-3">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Add Payment</h2>
              <form onSubmit={handleSubmit}>
                {/* Date Paid For */}
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Select Lease Term</span>
                    </label>
                    <select className="select w-full max-w-xs">
                      <option disabled selected>
                        Select your month
                      </option>
                      <option>2025</option>
                      <option>2024</option>
                      <option>March</option>
                      <option>April</option>
                    </select>
                  </div>  
                <div className="form-control mb-4">
                  <label className="label-text">
                    <span className="label-text">Amount:</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Input Amount Paid..."
                    className="input input-bordered"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  ></input>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Date Paid On */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date Paid On</span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={datePaid}
                      onChange={(e) => setDatePaid(e.target.value)}
                    />
                  </div>

                  {/* Date Paid For */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Select Month</span>
                    </label>
                    <select className="select w-full max-w-xs">
                      <option disabled selected>
                        Select your month
                      </option>
                      <option>January</option>
                      <option>February</option>
                      <option>March</option>
                      <option>April</option>
                    </select>
                  </div>
                </div>
                {/* Divider */}
                <div className="divider"></div>
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Add Payment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPayment;
