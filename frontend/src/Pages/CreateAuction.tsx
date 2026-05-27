import { useState } from "react";

export default function CreateAuction() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await fetch("http://localhost:5039/api/Auction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        price: Number(price)
      })
    });

    alert("Auction created");
  };

  return (
    <div>
      <h1>Create Auction</h1>

      <form onSubmit={handleCreate}>
        <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
        <input placeholder="Price" onChange={(e) => setPrice(e.target.value)} />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}