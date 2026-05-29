const BASE_URL = "http://localhost:5039";

const getToken = () => localStorage.getItem("token");

const authHeader = (): HeadersInit => {
  const token = getToken();

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`
  };
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/api/Auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    throw new Error("Fel e-post eller lösenord");
  }

  return res.json();
};

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${BASE_URL}/api/Auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      email,
      password
    })
  });

  if (!res.ok) {
    throw new Error("Kunde inte skapa konto");
  }

  return res.json();
};

export const getAuctions = async () => {
  const res = await fetch(`${BASE_URL}/api/Auction`, {
    headers: {
      ...authHeader()
    }
  });

  if (!res.ok) {
    throw new Error("Kunde inte hämta auktioner");
  }

  return res.json();
};

export const placeBid = async (auctionId: number, amount: number) => {
  const res = await fetch(`${BASE_URL}/api/Bid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader()
    },
    body: JSON.stringify({
      auctionId,
      amount
    })
  });

  if (!res.ok) {
    let message = "Kunde inte lägga bud";

    try {
      const text = await res.text();
      message = text || message;
    } catch {}

    throw new Error(message);
  }

  return res.json();
};