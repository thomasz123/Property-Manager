import React from "react";
import {
  MailIcon,
  PhoneIcon,
  UsersIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";

function ApartmentTenants({ apartment, handleDeleteTenant }) {
  return (
    <div className="text-lg">
      {apartment.tenants?.length > 0 ? (
        <div className="space-y-3">
          {apartment.tenants.map((tenant) => (
            <div key={tenant._id} className="p-1 rounded-lg bg-base-200 border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{tenant.name}</h3>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
                {tenant.email && (
                  <div className="flex items-center gap-1">
                    <MailIcon className="w-3 h-3" />
                    <span>{tenant.email}</span>
                  </div>
                )}
                {tenant.phone && (
                  <div className="flex items-center gap-1">
                    <PhoneIcon className="w-3 h-3" />
                    <span>{tenant.phone}</span>
                  </div>
                )}
                <button
                  className="btn btn-ghost btn-xs text-error"
                  onClick={() => handleDeleteTenant(tenant._id)}
                >
                  <TrashIcon className="size-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert">
          <span>No tenants assigned to this apartment</span>
        </div>
      )}
    </div>
  );
}

export default ApartmentTenants;
