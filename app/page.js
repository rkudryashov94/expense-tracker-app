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
			} else if (priceValue < 0) {
				alert("Please enter a positive price.");
			}
		}
	};

	// Read items from database
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
		<main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
			<div className="z-10 w-full max-w-5xl p-8 bg-gray-800 rounded-lg shadow-lg">
				<h1 className="text-4xl text-center text-white mb-6">
					Expense Tracker
				</h1>
				<div className="bg-gray-700 p-4 rounded-lg">
					<form className="grid grid-cols-6 items-center mb-4">
						<input
							value={newItem.name}
							onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
							className="col-span-3 p-3 border border-gray-600 bg-gray-800 text-white rounded focus:outline-none focus:ring focus:ring-blue-500"
							type="text"
							placeholder="Enter Item"
						/>
						<input
							value={newItem.price}
							onChange={(e) =>
								setNewItem({ ...newItem, price: e.target.value })
							}
							className="col-span-2 p-3 border border-gray-600 bg-gray-800 text-white rounded mx-3 focus:outline-none focus:ring focus:ring-blue-500"
							type="number"
							min="0"
							placeholder="Enter $"
						/>
						<button
							onClick={addItem}
							className="col-span-1 text-white bg-blue-600 hover:bg-blue-500 p-3 rounded transition"
							type="submit"
						>
							+
						</button>
					</form>
					<ul className="space-y-4">
						{items.map((item) => (
							<li
								key={item.id}
								className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 transition"
							>
								<div className="flex justify-between w-full">
									<span className="capitalize text-white">{item.name}</span>
									<span className="text-white">${item.price}</span>
								</div>
								<button
									onClick={() => deleteItem(item.id)}
									className="ml-4 p-2 text-red-500 hover:bg-red-400 rounded transition"
								>
									X
								</button>
							</li>
						))}
					</ul>
					{items.length > 0 && (
						<div className="flex justify-between p-3 mt-4 bg-gray-700 rounded-lg">
							<span className="text-white">Total</span>
							<span className="text-white">${total}</span>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
