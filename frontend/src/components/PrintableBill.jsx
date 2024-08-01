import React from 'react';

const PrintableBill = React.forwardRef(({ bill, total, discount, gst }, ref) => {
  const restaurantName = "CafeControl Invoice";
  const restaurantAddress = "123 Tasty Street, Flavortown, FC 12345";
  const discountAmount = (total * discount).toFixed(2);
  const subtotal = (total - discountAmount).toFixed(2);
  const gstAmount = (subtotal * gst).toFixed(2);
  const finalTotal = (parseFloat(subtotal) + parseFloat(gstAmount)).toFixed(2);

  return (
    <div ref={ref} className="p-8 bg-white">
      <h1 className="text-2xl font-bold text-center mb-2">{restaurantName}</h1>
      <p className="text-center mb-4">{restaurantAddress}</p>
      <table className="w-full mb-4">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-2">Item</th>
            <th className="text-right py-2">Qty</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {bill.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-2">{item.name}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">Rs.{item.price.toFixed(2)}</td>
              <td className="text-right py-2">Rs.{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-end">
        <div className="flex justify-between w-1/2 mb-1">
          <span>Subtotal:</span>
          <span>Rs.{total}</span>
        </div>
        <div className="flex justify-between w-1/2 mb-1">
          <span>Discount ({(discount * 100).toFixed(0)}%):</span>
          <span>-Rs.{discountAmount}</span>
        </div>
        <div className="flex justify-between w-1/2 mb-1">
          <span>Subtotal after discount:</span>
          <span>Rs.{subtotal}</span>
        </div>
        <div className="flex justify-between w-1/2 mb-1">
          <span>GST ({(gst * 100).toFixed(0)}%):</span>
          <span>Rs.{gstAmount}</span>
        </div>
        <div className="flex justify-between w-1/2 font-bold text-lg">
          <span>Total:</span>
          <span>Rs.{finalTotal}</span>
        </div>
      </div>
      <p className="mt-8 text-center">Thank you for dining with us!</p>
    </div>
  );
});

export default PrintableBill;