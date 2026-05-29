import { useState } from "react";
import "./CreateAuction.css";

export default function CreateAuction() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Du måste vara inloggad");
      return;
    }

    try {
      const res = await fetch("http://localhost:5039/api/Auction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          startDate,
          endDate,
          images
        })
      });

      if (res.ok) {
        alert("Auction created!");

        setTitle("");
        setDescription("");
        setPrice("");
        setStartDate("");
        setEndDate("");
        setImages([]);
        setImageInput("");
      } else {
        const msg = await res.text();
        alert(msg || "Error creating auction");
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="create-page">

      <video autoPlay loop muted playsInline className="create-bg-video">
        <source src="/videos/car.mp4" type="video/mp4" />
      </video>

      <div className="create-overlay"></div>

      <form className="create-form" onSubmit={handleCreate}>

        <label>Title</label>
        <input className="create-input" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Beskrivning</label>
        <input className="create-input" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Pris</label>
        <input className="create-input" value={price} onChange={(e) => setPrice(e.target.value)} />

        <label>Start datum</label>
        <input className="create-input" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label>End datum</label>
        <input className="create-input" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        
        <div className="image-section">

          <label>Bilder</label>

          <div className="image-row">
            <input
              className="create-input"
              placeholder="Paste image URL..."
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
            />

            <button
              type="button"
              className="create-btn"
              onClick={() => {
                if (imageInput.trim()) {
                  setImages([...images, imageInput]);
                  setImageInput("");
                }
              }}
            >
              Lägg till
            </button>
          </div>

          <div className="image-preview">
            {images.map((img, i) => (
              <img key={i} src={img} alt="" />
            ))}
          </div>

        </div>

        <button className="create-btn" type="submit">
          Skapa Auktion
        </button>

      </form>

    </div>
  );
}