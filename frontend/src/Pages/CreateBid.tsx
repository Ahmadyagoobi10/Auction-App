import { useState } from "react";

export default function CreateBid() {
  const [amount, setAmount] = useState("");
  const [auctionId, setAuctionId] = useState("");

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5039/api/Bid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: Number(amount),
        auctionId: Number(auctionId)
      })
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <h1>Create Bid</h1>

      <form onSubmit={handleBid}>
        <input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
        <input placeholder="Auction ID" onChange={(e) => setAuctionId(e.target.value)} />

        <button type="submit">Place Bid</button>
      </form>
    </div>
  );
}