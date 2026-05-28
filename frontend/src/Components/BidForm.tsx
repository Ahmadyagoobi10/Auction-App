import { useRef, useState } from "react";
import { placeBid } from "../api/api";
import "./BidForm.css";

export default function BidForm({
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

  const errorTimeout = useRef<any>(null);
  const successTimeout = useRef<any>(null);

  const list = Array.isArray(images) && images.length > 0
    ? images
    : ["https://via.placeholder.com/600"];

  const sendBid = async () => {
    const amount = Number(bid);

    if (!amount || amount <= currentPrice) {
      setError("Ditt bud måste vara högre än nuvarande pris");
      setSuccess("");

      if (errorTimeout.current) {
        clearTimeout(errorTimeout.current);
      }

      errorTimeout.current = setTimeout(() => {
        setError("");
      }, 5000);

      return;
    }

    setError("");

    await placeBid(id, amount);

    setCurrentPrice(amount);
    setBid("");
    setSuccess("Ditt bud har skickats!");

    if (successTimeout.current) {
      clearTimeout(successTimeout.current);
    }

    successTimeout.current = setTimeout(() => {
      setSuccess("");
    }, 5000);
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

      <div className="content-bid">

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

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

      </div>

    </div>
  );
}