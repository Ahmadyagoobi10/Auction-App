import "./About.css";

export default function About() {
  return (
    <div className="about">

      <video autoPlay loop muted playsInline className="about-video">
        <source
          src="/videos/13335495_3840_2160_24fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="about-overlay"></div>

      <div className="about-content">

        <p>
          Aybilar är en svensk marknadsplats för bilauktioner online.
          Här kan användare köpa och sälja exklusiva bilar i realtid.
          Plattformen erbjuder en säker och enkel budgivningsupplevelse.
          Kunder kan utforska sportbilar, elbilar och lyxiga fordon.
          Vårt mål är att skapa framtidens digitala bilmarknad i Sverige.
          Vi fokuserar på trygghet, kvalitet och modern teknik.
        </p>

      </div>

    </div>
  );
}