import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', price: '' });


useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/food-items`);
      if (!response.ok) throw new Error('Failed to fetch food items');
      const data = await response.json();
      setFoodItems(data.foodItems);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  const handleInputChange = (e, isNewItem = false) => {
    const { name, value } = e.target;
    if (isNewItem) {
      setNewItem({ ...newItem, [name]: value });
    } else {
      setEditingItem({ ...editingItem, [name]: value });
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/food-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItem, price: parseFloat(newItem.price) }),
      });
      if (!response.ok) throw new Error('Failed to add item');
      await fetchFoodItems();
      setNewItem({ name: '', price: '' });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${editingItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingItem, price: parseFloat(editingItem.price) }),
      });
      if (!response.ok) throw new Error('Failed to update item');
      await fetchFoodItems();
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (_id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/food-items/${_id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete item');
      await fetchFoodItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Item</h2>
        <form onSubmit={handleAddItem} className="flex gap-2">
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={(e) => handleInputChange(e, true)}
            placeholder="Item name"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="price"
            value={newItem.price}
            onChange={(e) => handleInputChange(e, true)}
            placeholder="Price"
            className="border p-2 rounded"
            step="0.01"
            min="0"
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add Item
          </button>
        </form>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Food Items</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map(item => (
              <tr key={item._id}>
                {/* <td className="border p-2">{item._id}</td> */}
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">Rs.{item.price.toFixed(2)}</td>
                <td className="border p-2">
                  <button 
                    onClick={() => handleEditItem(item)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                  >
                    <i class="ri-edit-2-fill"></i>
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                   <i class="ri-delete-bin-6-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Edit Item</h2>
            <form onSubmit={handleUpdateItem} className="flex flex-col gap-2">
              <input
                type="text"
                name="name"
                value={editingItem.name}
                onChange={handleInputChange}
                placeholder="Item name"
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="price"
                value={editingItem.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="border p-2 rounded"
                step="0.01"
                min="0"
                required
              />
              <div className="flex justify-end gap-2 mt-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Update
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingItem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;