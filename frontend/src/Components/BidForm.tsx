import { useState } from "react";
import { getToken } from "../Utils/Auth";

type Props = {
  auctionId: number;
  currentPrice: number;
  onBidSuccess?: (newPrice: number) => void;
};

export default function BidForm({ auctionId, currentPrice, onBidSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const token = getToken();

    const res = await fetch("http://localhost:5039/api/Bid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: Number(amount),
        auctionId: auctionId
      })
    });

    const data = await res.json().catch(() => null);

    setLoading(false);

    if (!res.ok) {
      setMessage(data?.message || "Error placing bid");
      return;
    }

    setMessage("Bid placed successfully 🚗🔥");

    
    if (onBidSuccess) {
      onBidSuccess(data.bid.amount);
    }

    setAmount("");
  };

  return (
    <form className="bid-form" onSubmit={handleBid}>
      <h3>Place Bid</h3>

      <p className="price-info">
        Current: {currentPrice.toLocaleString()} kr
      </p>

      <input
        placeholder="Your bid amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button disabled={loading} type="submit">
        {loading ? "Placing bid..." : "Bid"}
      </button>

      {message && <p className="msg">{message}</p>}
    </form>
  );
}