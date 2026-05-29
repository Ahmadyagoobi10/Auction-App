import { useEffect, useState } from "react";
import { getAuctions } from "../api/api";
import Bidform from "../Components/BidForm";
import "./Auctions.css";

export default function Auctions() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await getAuctions();
      setAuctions(Array.isArray(data) ? data : []);
    };
    load();
  }, []);

  return (
    <div className="page">

      <video autoPlay loop muted playsInline className="bg-video">
        <source src="/videos/13335495_3840_2160_24fps.mp4" />
      </video>

      <div className="overlay"></div>

      <div className="container">

        <h1 className="title">Exklusiva bilar</h1>

        <input
          className="search-input"
          placeholder="Sök auktion..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid">
          {auctions
            .filter(a => {
              if (!search) return true;
              return a.title.toLowerCase().includes(search.toLowerCase());
            })
            .filter(a =>
              new Date(a.endDate) > new Date()
            )
            .map((a) => (
              <Bidform
                key={a.id}
                id={a.id}
                title={a.title}
                description={a.description}
                price={a.price}
                images={a.images}
                createdByUserId={a.userId}
              />
            ))}
        </div>

      </div>
    </div>
  );
}