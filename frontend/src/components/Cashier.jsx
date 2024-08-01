import React, { useState, useEffect, useRef} from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintableBill from './PrintableBill';
import { FaCircleMinus } from "react-icons/fa6";






const Cashier = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [bill, setBill] = useState([]);
  const printableBillRef = useRef();
  

  
const colorArray = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'];


  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/food-items`);
      if (!response.ok) throw new Error('Failed to fetch food items');
      const data = await response.json();
      setFoodItems(data.foodItems);
      console.log(data);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };


  const addToBill = (item) => {
    const existingItem = bill.find((billItem) => billItem.id === item._id);
    if (existingItem) {
      setBill(bill.map((billItem) =>
        billItem.id === item._id
          ? { ...billItem, quantity: billItem.quantity + 1 }
          : billItem
      ));
    } else {
      setBill([...bill, { ...item, id: item._id, quantity: 1 }]);
    }
  };
  

  const removeBillItem = (itemId) => {
    setBill(bill.filter((item) => item.id !== itemId));
  };
  
  const removeFromBill = (item) => {
    const existingItem = bill.find((billItem) => billItem.id === item._id);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        setBill(bill.map((billItem) =>
          billItem.id === item._id
            ? { ...billItem, quantity: billItem.quantity - 1 }
            : billItem
        ));
      } else {
        setBill(bill.filter((billItem) => billItem.id !== item._id));
      }
    }
  };
  


  const calculateTotal = () => {
    return bill.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePrint = useReactToPrint({
    content: () => printableBillRef.current,
  });

  return (
    <div className="flex p-4">
      <div className="w-1/1 pr-4">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        
    <div className="mx-auto max-w-7xl">
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-x-2 gap-y-2 text-base leading-10 text-gray-600 sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-x-2 lg:gap-y-2">
        {foodItems.map((item) => (
          <div key={item._id} className={`relative border bg-green-400 border-gray-300 p-12`} onClick={() => addToBill(item)}> {/* Added border and padding */}
            <div className="flex flex-col" > {/* Fixed onClick handler */}
              <div className="text-md inline font-semibold text-black text-center">
                {item.name}
              </div>
              <div className='text-center'>Rs.{item.price.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
      </div>
      <div className="w-1/2 pl-4">
        <h2 className="text-xl font-bold mb-4">Bill</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity (inc/dec)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bill.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">

                      <button  onClick={() => removeFromBill(item)}><FaCircleMinus size={20} /></button>
                      {/* <FaCircleMinus size={20} /> */}
                      
                      {/* <FaCircleMinus size={22} /> */}
                      <span className="px-6 py-4 whitespace-nowrap text-right">{item.quantity}</span>
                    <button  className='text-2xl' onClick={() => addToBill(item)}><i class="ri-add-circle-fill"></i></button>
                    {/* <FaCirclePlus size={22}/> */}
                    {/* <i class="ri-add-circle-fill"></i> */}
                  
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">Rs.{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-right font-bold">Total:</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-bold">Rs.{calculateTotal()}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <button 
            onClick={handlePrint}
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Generate Bill
          </button>
        </div>
      </div>
      <div style={{ display: 'none' }}>
        <PrintableBill
          ref={printableBillRef}
          bill={bill}
          total={calculateTotal()}
          discount={0.1} // 10% discount
          gst={0.05} // 5% GST
        />
      </div>
    </div>
  );
};

export default Cashier;
