import { useState } from "react";
import { placeBid } from "../api/api";
import "./AuctionCard.css";

export default function AuctionCard({
  id,
  title,
  description,
  price,
  images
}: any) {

  const [index, setIndex] = useState(0);
  const [bid, setBid] = useState("");
  const [currentPrice, setCurrentPrice] = useState(price);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const list = Array.isArray(images) && images.length > 0
    ? images
    : ["https://via.placeholder.com/600"];

  const sendBid = async () => {
    const amount = Number(bid);

    if (!amount || amount <= currentPrice) {
      setError("Ditt bud måste vara högre än nuvarande pris");
      setSuccess("");
      return;
    }

    setError("");

    await placeBid(id, amount);

    setCurrentPrice(amount);
    setBid("");
    setSuccess("Ditt bud har skickats!");

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  return (
    <div className="card">

      <div className="image">

        <button
          className="arrow left"
          onClick={() =>
            setIndex((i) => (i === 0 ? list.length - 1 : i - 1))
          }
        >
          ‹
        </button>

        <img src={list[index]} alt={title} />

        <button
          className="arrow right"
          onClick={() =>
            setIndex((i) => (i + 1) % list.length)
          }
        >
          ›
        </button>

      </div>

      <div className="content">

        <h2>{title}</h2>

        <p className="desc">{description}</p>

        <div className="price">
          Nuvarande bud: {currentPrice.toLocaleString()} kr
        </div>

        <div className="bidRow">
          <input
            placeholder="Skriv ditt bud..."
            value={bid}
            onChange={(e) => setBid(e.target.value)}
          />

          <button onClick={sendBid}>
            Lägg bud
          </button>
        </div>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {success && (
          <p className="success-message">{success}</p>
        )}

      </div>

    </div>
  );
}