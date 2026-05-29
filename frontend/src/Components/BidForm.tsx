import { useRef, useState } from "react";
import { placeBid } from "../api/api";
import "./BidForm.css";

export default function BidForm({
  id,
  title,
  description,
  price,
  images,
  createdByUserId
}: any) {

  const token = localStorage.getItem("token");

  const userId = token
    ? Number(JSON.parse(atob(token.split(".")[1]))[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ])
    : null;

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
    await placeBid(id, Number(bid));

    setError("");
    setCurrentPrice(Number(bid));
    setBid("");

    setSuccess("Ditt bud har skickats!");

    if (successTimeout.current) clearTimeout(successTimeout.current);
    successTimeout.current = setTimeout(() => setSuccess(""), 4000);
  };

  const deleteAuction = async () => {

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5039/api/Auction/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || "Kunde inte ta bort auktionen");

      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      errorTimeout.current = setTimeout(() => setError(""), 4000);

      return;
    }

    window.location.reload();
  };

  return (
    <div className="card">

      <div className="image">
        <button className="arrow left" onClick={() => setIndex(i => (i === 0 ? list.length - 1 : i - 1))}>‹</button>

        <img src={list[index]} alt={title} />

        <button className="arrow right" onClick={() => setIndex(i => (i + 1) % list.length)}>›</button>
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

          {Number(userId) !== Number(createdByUserId) && (
            <button onClick={sendBid}>
              Lägg bud
            </button>
          )}

          {Number(userId) === Number(createdByUserId) && (
            <button className="delete-btn" onClick={deleteAuction}>
              Ta bort
            </button>
          )}

        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

      </div>
    </div>
  );
}