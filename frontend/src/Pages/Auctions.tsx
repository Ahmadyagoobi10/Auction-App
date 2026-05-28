import { useEffect, useState } from "react";
import { getAuctions } from "../api/api";
import Bidform from "../Components/BidForm";
import "./Auctions.css";

export default function Auctions() {
  const [auctions, setAuctions] = useState<any[]>([]);

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

        <div className="grid">
          {auctions.map((a) => (
            <Bidform
              key={a.id}
              id={a.id}
              title={a.title}
              description={a.description}
              price={a.price}
              images={a.images}
            />
          ))}
        </div>

      </div>
    </div>
  );
}