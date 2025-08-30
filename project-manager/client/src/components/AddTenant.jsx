import { useState } from "react";

const PORT = import.meta.env.VITE_PORT;

const AddTenant = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name field is required");
      return;
    }
    setLoading(true);
    await onSuccess({
      name: name,
      email: email,
      phone: phone,
    });
    setName("")
    setEmail("")
    setPhone("")
    setLoading(false);
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto p-3">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Add Tenant</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="form-control flex flex-row items-center gap-3">
                  <label className="w-20 text-right">Name</label>
                  <input
                    type="text"
                    placeholder="Input Name..."
                    className="input input-bordered flex-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-control flex flex-row items-center gap-3">
                  <label className="w-20 text-right">Email</label>
                  <input
                    type="text"
                    placeholder="Input Email..."
                    className="input input-bordered flex-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-control flex flex-row items-center gap-3">
                  <label className="w-20 text-right">Phone</label>
                  <input
                    type="text"
                    placeholder="Input Phone..."
                    className="input input-bordered flex-1"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Divider */}
                <div className="divider"></div>

                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Modifying..." : "Add Tenant"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTenant;