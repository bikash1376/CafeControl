"use client";

import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6"; // Added FaCirclePlus

// Interfaces (kept here as you requested everything in one file)
interface FoodItem {
  _id: string;
  name: string;
  price: number;
}

interface BillItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export default function Store() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [bill, setBill] = useState<BillItem[]>([]);
  // Ref for the printable content
  const printableContentRef = useRef<HTMLDivElement>(null); 

  // App configuration
  const discountRate = 0.1;
  const gstRate = 0.05;
  
  // Paper size configuration
  const paperSizes = {
    small: {
      width: '58mm',
      fontSize: '9px',
      padding: '1mm',
      margin: '1mm 2mm',
      lineHeight: '1.1'
    },
    large: {
      width: '80mm',
      fontSize: '11px',
      padding: '2mm',
      margin: '2mm 3mm',
      lineHeight: '1.2'
    }
  };
  
  const [paperSize, setPaperSize] = useState<'small' | 'large'>('large');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  const [selectedBillItemIndex, setSelectedBillItemIndex] = useState<number>(-1);
  const currentSize = paperSizes[paperSize];
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const billItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    fetchFoodItems();
    
    // Focus the first menu item on load
    if (foodItems.length > 0) {
      setSelectedItemIndex(0);
    }
  }, [foodItems.length]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys 1-9 for quick item selection
      if (e.key >= '1' && e.key <= '9' && foodItems.length > 0) {
        const index = parseInt(e.key) - 1;
        if (index < foodItems.length) {
          setSelectedItemIndex(index);
          addToBill(foodItems[index]);
        }
        return;
      }
      
      // Arrow keys navigation
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (selectedBillItemIndex >= 0) {
          // Navigate bill items
          const nextIndex = Math.min(selectedBillItemIndex + 1, bill.length - 1);
          setSelectedBillItemIndex(nextIndex);
          setSelectedItemIndex(-1);
          billItemsRef.current[nextIndex]?.focus();
        } else {
          // Navigate menu items
          const nextIndex = (selectedItemIndex + 1) % foodItems.length;
          setSelectedItemIndex(nextIndex);
          setSelectedBillItemIndex(-1);
          menuItemsRef.current[nextIndex]?.focus();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectedBillItemIndex >= 0) {
          // Navigate bill items
          const prevIndex = Math.max(selectedBillItemIndex - 1, 0);
          setSelectedBillItemIndex(prevIndex);
          setSelectedItemIndex(-1);
          billItemsRef.current[prevIndex]?.focus();
        } else {
          // Navigate menu items
          const prevIndex = (selectedItemIndex - 1 + foodItems.length) % foodItems.length;
          setSelectedItemIndex(prevIndex);
          setSelectedBillItemIndex(-1);
          menuItemsRef.current[prevIndex]?.focus();
        }
      }
      
      // Enter to add/select item
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedItemIndex >= 0 && selectedItemIndex < foodItems.length) {
          addToBill(foodItems[selectedItemIndex]);
        }
      }
      
      // + to increase quantity
      else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        if (selectedBillItemIndex >= 0 && selectedBillItemIndex < bill.length) {
          const item = bill[selectedBillItemIndex];
          addToBill(item);
        }
      }
      
      // - to decrease quantity
      else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        if (selectedBillItemIndex >= 0 && selectedBillItemIndex < bill.length) {
          const item = bill[selectedBillItemIndex];
          removeFromBill(item);
        }
      }
      
      // P for print
      else if (e.key.toLowerCase() === 'p' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handlePrint();
      }
      
      // Escape to clear selection
      else if (e.key === 'Escape') {
        setSelectedItemIndex(-1);
        setSelectedBillItemIndex(-1);
      }
      
      // Tab to switch between menu and bill
      else if (e.key === 'Tab') {
        if (selectedItemIndex >= 0 && bill.length > 0) {
          e.preventDefault();
          setSelectedItemIndex(-1);
          setSelectedBillItemIndex(0);
          billItemsRef.current[0]?.focus();
        } else if (selectedBillItemIndex >= 0) {
          e.preventDefault();
          setSelectedBillItemIndex(-1);
          setSelectedItemIndex(0);
          menuItemsRef.current[0]?.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemIndex, selectedBillItemIndex, foodItems, bill]);

  const fetchFoodItems = async () => {
    try {
      const res = await fetch("/api/admin", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch food items");
      const { data } = await res.json();
      setFoodItems(data || []);
    } catch (err) {
      console.error("Error fetching food items:", err);
      setFoodItems([]);
    }
  };

  const addToBill = (item: FoodItem | BillItem) => {
    const itemId = '_id' in item ? item._id : item.id;

    const existingItem = bill.find((billItem) => billItem.id === itemId);
    if (existingItem) {
      setBill(
        bill.map((billItem) =>
          billItem.id === itemId
            ? { ...billItem, quantity: billItem.quantity + 1 }
            : billItem
        )
      );
    } else {
      setBill([...bill, { ...item, id: itemId, quantity: 1, name: item.name, price: item.price }]);
    }
  };

  const removeFromBill = (item: FoodItem | BillItem) => {
    const itemId = '_id' in item ? item._id : item.id;
    const existingItem = bill.find((billItem) => billItem.id === itemId);
    
    if (existingItem) {
      if (existingItem.quantity > 1) {
        setBill(
          bill.map((billItem) =>
            billItem.id === itemId
              ? { ...billItem, quantity: billItem.quantity - 1 }
              : billItem
          )
        );
      } else {
        setBill(bill.filter((billItem) => billItem.id !== itemId));
      }
    }
  };

  const removeBillItem = (id: string) => {
    setBill(bill.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    // Total before discount/tax
    return bill
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const totalBeforeTaxAndDiscount = calculateTotal();
  const totalString = totalBeforeTaxAndDiscount.toFixed(2);
  const discountAmount = totalBeforeTaxAndDiscount * discountRate;
  const subtotalAfterDiscount = totalBeforeTaxAndDiscount - discountAmount;
  const gstAmount = subtotalAfterDiscount * gstRate;
  const finalTotal = subtotalAfterDiscount + gstAmount;

  const handlePrint = () => {
    if (!printableContentRef.current) {
      console.error("No printable content found");
      return;
    }
    
    // Get the current paper size settings
    const size = paperSizes[paperSize];

    // Create a new window
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (!printWindow) {
      alert('Pop-up was blocked. Please allow pop-ups for this site.');
      return;
    }

    // Generate the bill HTML with dynamic sizing
    const billItemsHTML = bill.map(item => `
      <tr>
        <td class="py-1" style="font-size: ${size.fontSize}; line-height: ${size.lineHeight};">
          ${item.name}
        </td>
        <td class="text-center py-1" style="font-size: ${size.fontSize}; line-height: ${size.lineHeight};">
          ${item.quantity}
        </td>
        <td class="text-right py-1" style="font-size: ${size.fontSize}; line-height: ${size.lineHeight};">
          Rs.${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    // Write the HTML content to the new window with dynamic sizing
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Bill (${paperSize === 'small' ? '58mm' : '80mm'})</title>
          <style>
            @page { 
              size: ${size.width} auto;
              margin: ${size.margin};
              padding: 0;
            }
            @media print {
              body { 
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                background: white !important;
                margin: 0;
                padding: ${size.padding};
                font-family: 'Courier New', monospace;
                font-size: ${size.fontSize};
                line-height: ${size.lineHeight};
                width: 100%;
              }
            }
            /* Utility Classes */
            .no-print { display: none !important; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .w-full { width: 100%; }
            .mb-1 { margin-bottom: ${paperSize === 'small' ? '1mm' : '2mm'}; }
            .mb-2 { margin-bottom: ${paperSize === 'small' ? '2mm' : '3mm'}; }
            .mb-4 { margin-bottom: ${paperSize === 'small' ? '3mm' : '4mm'}; }
            .mt-4 { margin-top: ${paperSize === 'small' ? '3mm' : '4mm'}; }
            .py-1 { padding-top: 1mm; padding-bottom: 1mm; }
            .border-y { border-top: 1px solid #000; border-bottom: 1px solid #000; }
            .border-t { border-top: 1px solid #000; }
            .border-b { border-bottom: 1px solid #000; }
            .border-gray-400 { border-color: #9ca3af; }
            .border-gray-800 { border-color: #000; }
            .pt-1 { padding-top: 1mm; }
            .pt-2 { padding-top: 2mm; }
            .text-xs { font-size: ${size.fontSize}; line-height: ${size.lineHeight}; }
            .text-sm { font-size: calc(${size.fontSize} * 1.1); line-height: ${size.lineHeight}; }
            .text-base { font-size: calc(${size.fontSize} * 1.3); line-height: ${size.lineHeight}; }
            .text-lg { font-size: calc(${size.fontSize} * 1.5); line-height: ${size.lineHeight}; }
            .font-bold { font-weight: 700; }
            .font-normal { font-weight: 400; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .items-center { align-items: center; }
            .items-end { align-items: flex-end; }
            .justify-between { justify-content: space-between; }
            .text-red-600 { color: #dc2626; }
          </style>
        </head>
        <body class="p-0">
          <div style="width: 100%; max-width: ${size.width}; margin: 0 auto;">
            <h1 class="text-base font-bold text-center mb-1">CafeControl</h1>
            <p class="text-center mb-1 text-xs">123 Tasty Street</p>
            <p class="text-center mb-2 text-xs">Flavortown, FC 12345</p>
            <p class="text-center mb-2 text-xs border-b border-gray-800 pb-1">${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>

            <table class="w-full mb-3" style="border-collapse: collapse;">
              <thead>
                <tr>
                  <th class="text-left py-1 text-xs border-b border-gray-800">Item</th>
                  <th class="text-center py-1 text-xs border-b border-gray-800">Qty</th>
                  <th class="text-right py-1 text-xs border-b border-gray-800">Total</th>
                </tr>
              </thead>
              <tbody>${billItemsHTML}</tbody>
            </table>
          
            <div class="flex flex-col w-full text-xs mb-3">
              <div class="flex justify-between w-full mb-1">
                <span>Subtotal:</span>
                <span>Rs.${totalString}</span>
              </div>
              <div class="flex justify-between w-full mb-1">
                <span>Discount (${(discountRate * 100).toFixed(0)}%):</span>
                <span class="text-red-600">-Rs.${discountAmount.toFixed(2)}</span>
              </div>
              <div class="flex justify-between w-full pt-1 mb-1 border-t border-gray-400">
                <span>After Discount:</span>
                <span>Rs.${subtotalAfterDiscount.toFixed(2)}</span>
              </div>
              <div class="flex justify-between w-full mb-1">
                <span>GST (${(gstRate * 100).toFixed(0)}%):</span>
                <span>+Rs.${gstAmount.toFixed(2)}</span>
              </div>
              <div class="flex justify-between w-full font-bold text-base pt-2 border-t-2 border-gray-800">
                <span>TOTAL:</span>
                <span>Rs.${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <p class="text-center text-xs mb-2">Thank you for dining with us!</p>
            <p class="text-center text-2xs" style="font-size: 8px;">${paperSize === 'small' ? '58mm' : '80mm'} Receipt • ${new Date().getFullYear()}</p>
          </div>
          
          <div class="no-print" style="position:fixed;top:10px;right:10px;display:flex;gap:5px;">
            <button onclick="window.close()" style="padding:5px 10px;background:#f00;color:white;border:none;border-radius:3px;cursor:pointer;font-size:12px;">Close</button>
            <button onclick="window.print()" style="padding:5px 10px;background:#4CAF50;color:white;border:none;border-radius:3px;cursor:pointer;font-size:12px;">Print Again</button>
          </div>
          
          <script>
            // Auto-print after a short delay
            setTimeout(() => {
              window.print();
              // Close the window after printing (may not work in all browsers due to security restrictions)
              setTimeout(() => {
                try { window.close(); } catch(e) { console.log('Could not close window'); }
              }, 1000);
            }, 250);
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };


  return (
    <div className="flex flex-col md:flex-row p-4 gap-4 bg-background text-foreground min-h-screen">
      {/* Menu */}
      <div className="w-full md:w-1/2 lg:w-2/3 p-4 bg-card rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Menu</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Paper Size:</span>
            <button 
              onClick={() => setPaperSize('small')} 
              className={`px-3 py-1 text-sm rounded-md ${paperSize === 'small' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              58mm
            </button>
            <button 
              onClick={() => setPaperSize('large')} 
              className={`px-3 py-1 text-sm rounded-md ${paperSize === 'large' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              80mm
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foodItems.map((item, index) => (
            <div
              key={item._id}
              className="relative border border-border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 bg-card hover:bg-card/80"
              onClick={() => addToBill(item)}
            >
              <div className="flex flex-col text-center">
                <div className="font-semibold text-foreground">{item.name}</div>
                <div className="text-primary font-medium">Rs.{item.price.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bill (Display) */}
      <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-card rounded-lg shadow h-fit sticky top-4">
        <h2 className="text-2xl font-bold mb-6 text-primary">Bill</h2>
        <div className="bg-background/50 rounded-lg overflow-hidden border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Item
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bill.map((item) => (
                <tr key={item.id} className="hover:bg-accent/50">
                  <td className="px-4 py-3 text-foreground">{item.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromBill(item);
                        }}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <FaCircleMinus size={16} />
                      </button>
                      <span className="min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToBill(item);
                        }}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <FaCirclePlus size={16} /> 
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    Rs.{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
              {bill.length > 0 && (
                <tr className="border-t border-border font-bold">
                  <td colSpan={2} className="px-4 py-3 text-right">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right text-primary">
                    Rs.{totalString}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {bill.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              Add items to see the bill
            </div>
          )}
        </div>
        {bill.length > 0 && (
          <div className="mt-4 text-right">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium w-full"
            >
              Generate Bill
            </button>
          </div>
        )}
      </div>

      {/* Hidden printable content (no longer needed for printing but keeping for reference) */}
      <div ref={printableContentRef} style={{ display: 'none' }}>
        <div className="p-2 bg-white text-sm w-[80mm]">
          <h1 className="text-xl font-bold text-center mb-1">CafeControl Invoice</h1>
          <p className="text-center mb-2 text-xs">123 Tasty Street, Flavortown, FC 12345</p>
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
          
          <div className="flex flex-col items-end text-xs">
            <div className="flex justify-between w-full mb-1">
              <span>Subtotal:</span>
              <span>Rs.{totalString}</span>
            </div>
            <div className="flex justify-between w-full mb-1">
              <span>Discount ({(discountRate * 100).toFixed(0)}%):</span>
              <span className="text-red-600">-Rs.{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full border-t border-gray-400 pt-1 mb-1">
              <span>Subtotal After Discount:</span>
              <span>Rs.{subtotalAfterDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full mb-2">
              <span>GST ({(gstRate * 100).toFixed(0)}%):</span>
              <span>+Rs.{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full font-bold text-base border-t border-gray-800 pt-2">
              <span>Total Payable:</span>
              <span>Rs.{finalTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <p className="mt-4 text-center text-xs">Thank you for dining with us!</p>
        </div>
      </div>
    </div>
  );
}