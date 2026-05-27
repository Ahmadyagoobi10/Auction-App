
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      
      <video autoPlay loop muted playsInline className="bg-video">
        <source src="/videos/7727416-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>

      <div className="overlay"></div>

      <div className="content">
        <h2>Köp och sälj exklusiva bilar online.</h2>
        <h2>Buda live på lyxbilar i realtid.</h2>
        <h2>En modern marknadsplats för premiumbilar.</h2>
      </div>

    </div>
  );
}