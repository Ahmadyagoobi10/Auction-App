const BASE_URL = "http://localhost:5039";

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
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/Auction`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Kunde inte hämta auktioner");
  }

  return res.json();
};

export const placeBid = async (auctionId: number, amount: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/Bid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      auctionId,
      amount
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Kunde inte lägga bud");
  }

  return res.json();
};