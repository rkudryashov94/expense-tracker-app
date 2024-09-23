"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

export default function Home() {
  const [items, setItems] = useState([]);

  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [total, setTotal] = useState(0);

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    const priceValue = parseFloat(newItem.price);

    if (newItem.name !== "" && !isNaN(priceValue) && priceValue > 0) {
      try {
        await addDoc(collection(db, "items"), {
          name: newItem.name.trim(),
          price: priceValue, // Store as a number
        });
        setNewItem({ name: "", price: "" });
      } catch (error) {
        console.error("Error adding item:", error);
        alert("Failed to add item. Please try again.");
      }
    } else {
      if (newItem.name == "") {
        alert("Please enter a valid item name");
      }
      else if (priceValue < 0) {
        alert("Please enter a positive price.");
      }
    }
  };

  // Read item from database

  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      let totalPrice = 0;
  
      querySnapshot.forEach((doc) => {
        const itemData = { ...doc.data(), id: doc.id };
        itemsArr.push(itemData);
        totalPrice += parseFloat(itemData.price); // Accumulate total price
      });
  
      setItems(itemsArr);
      setTotal(totalPrice); // Update total after processing all items
    });
  
    return () => unsubscribe();
  }, []);

  // Delete item from database
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "items", id));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Expense Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border"
              type="text"
              placeholder="Enter Item"
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="col-span-2 p-3 border mx-3"
              type="number"
              min="0"
              placeholder="Enter $"
            />
            <button
              onClick={addItem}
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
              type="submit"
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className="my-4 w-full flex justify-between bg-slate-950"
              >
                <div className="p-4 w-full flex justify-between">
                  <span className="capitalize">{item.name}</span>
                  <span>${item.price}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            ""
          ) : (
            <div className="flex justify-between p-3">
              <span>Total</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
