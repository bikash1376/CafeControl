"use client";

import React from "react";

interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PrintableBillProps {
  bill: BillItem[];
  total: string; // This is the total BEFORE discount/tax
  discount: number;
  gst: number;
}

const PrintableBill = React.forwardRef<HTMLDivElement, PrintableBillProps>(
  ({ bill, total, discount, gst }, ref) => {
    const restaurantName = "CafeControl Invoice";
    const restaurantAddress = "123 Tasty Street, Flavortown, FC 12345";
    
    // Parse the total string back to a number for calculations
    const rawTotal = parseFloat(total);

    // Calculations
    const discountAmount = (rawTotal * discount);
    const subtotalAfterDiscount = (rawTotal - discountAmount);
    const gstAmount = (subtotalAfterDiscount * gst);
    const finalTotal = (subtotalAfterDiscount + gstAmount);

    return (
      // Reduced padding for a thermal printer receipt feel
      <div ref={ref} className="p-2 bg-white text-sm w-[80mm]"> 
        <h1 className="text-xl font-bold text-center mb-1">
          {restaurantName}
        </h1>
        <p className="text-center mb-2 text-xs">{restaurantAddress}</p>
        <p className="text-center mb-4 text-xs">Date: {new Date().toLocaleDateString()}</p>

        <table className="w-full mb-4">
          <thead>
            <tr className="border-y border-gray-400">
              <th className="text-left py-1 text-xs">Item</th>
              <th className="text-center py-1 text-xs">Qty</th>
              <th className="text-right py-1 text-xs">Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.map((item) => (
              <tr key={item.id}>
                <td className="py-1 text-xs">{item.name}</td>
                <td className="text-center py-1 text-xs">{item.quantity}</td>
                <td className="text-right py-1 text-xs">
                  Rs.{(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Summary Table */}
        <div className="flex flex-col items-end text-xs">
          <div className="flex justify-between w-full sm:w-1/2 md:w-2/3 lg:w-3/4 mb-1">
            <span>Subtotal:</span>
            <span>Rs.{rawTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full sm:w-1/2 md:w-2/3 lg:w-3/4 mb-1">
            <span>Discount ({(discount * 100).toFixed(0)}%):</span>
            <span className="text-red-600">-Rs.{discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full sm:w-1/2 md:w-2/3 lg:w-3/4 border-t border-gray-400 pt-1 mb-1">
            <span>Subtotal After Discount:</span>
            <span>Rs.{subtotalAfterDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full sm:w-1/2 md:w-2/3 lg:w-3/4 mb-2">
            <span>GST ({(gst * 100).toFixed(0)}%):</span>
            <span>+Rs.{gstAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full sm:w-1/2 md:w-2/3 lg:w-3/4 font-bold text-base border-t border-gray-800 pt-2">
            <span>Total Payable:</span>
            <span>Rs.{finalTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <p className="mt-4 text-center text-xs">Thank you for dining with us!</p>
      </div>
    );
  }
);

PrintableBill.displayName = "PrintableBill";
export default PrintableBill;