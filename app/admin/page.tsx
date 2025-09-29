"use client";

import { useState, useEffect } from "react";

interface FoodItem {
  _id: string;
  name: string;
  price: number;
}

export default function Admin() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [newItem, setNewItem] = useState({ name: "", price: "" });

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const res = await fetch("/api/admin", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch items");
      const { data } = await res.json();
      setFoodItems(data || []);
    } catch (err) {
      console.error("Error fetching:", err);
      setFoodItems([]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNewItem = false
  ) => {
    const { name, value } = e.target;
    if (isNewItem) {
      setNewItem({ ...newItem, [name]: value });
    } else if (editingItem) {
      setEditingItem({ ...editingItem, [name]: value });
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newItem,
          price: parseFloat(newItem.price),
        }),
      });
      if (!res.ok) throw new Error("Failed to add");
      await fetchFoodItems();
      setNewItem({ name: "", price: "" });
    } catch (err) {
      console.error("Error adding:", err);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await fetch(`/api/admin?id=${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingItem.name,
          price: parseFloat(String(editingItem.price)),
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await fetchFoodItems();
      setEditingItem(null);
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/admin?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchFoodItems();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary">Admin Panel</h1>

        {/* Add New Item */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Menu Item</h2>
          <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Item name"
                className="w-full p-3 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                name="price"
                value={newItem.price}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Price"
                className="w-full p-3 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                step="0.01"
                min="0"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
            >
              Add Item
            </button>
          </form>
        </div>

        {/* Items Table */}
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {foodItems.map((item) => (
                  <tr key={item._id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-foreground">Rs.{item.price.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="px-3 py-1.5 text-sm font-medium rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {foodItems.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                      No menu items found. Add your first item above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-md p-6 border border-border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Menu Item</h2>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleUpdateItem} className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-muted-foreground mb-1">
                    Item Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    name="name"
                    value={editingItem.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-price" className="block text-sm font-medium text-muted-foreground mb-1">
                    Price
                  </label>
                  <input
                    id="edit-price"
                    type="number"
                    name="price"
                    value={String(editingItem.price)}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-transparent hover:bg-accent/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
