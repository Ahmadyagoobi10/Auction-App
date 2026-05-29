import { useState } from "react";
import { login, register } from "../api/api";
import { setToken } from "../Utils/Auth";
import "./Login.css";

export default function Login() {

  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async () => {

    if (isRegister) {
      if (!username || !email || !password) {
        setMessage(" Fyll i alla fält");
        return;
      }
    } else {
      if (!email || !password) {
        setMessage(" Fyll i alla fält");
        return;
      }
    }

    try {

      if (isRegister) {

        await register(username, email, password);

        setMessage("Konto skapat! Logga in nu.");

        setIsRegister(false);

      } else {

        const data = await login(email, password);

        setToken(data.token);

        window.location.href = "/";
      }

    } catch (err: any) {

      setMessage(" " + err.message);
    }
  };

  return (
    <div className="login-page">

      <div className="overlay"></div>

      <div className="login-box">

        <h1>
          {isRegister ? "Skapa konto" : "Aybilar"}
        </h1>

        {isRegister && (
          <input
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {isRegister ? "Registrera" : "Logga in"}
        </button>

        <p
          className="switch"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage("");
          }}
        >
          {isRegister
            ? "Har du redan konto? Logga in"
            : "Har du inget konto? Registrera"}
        </p>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}