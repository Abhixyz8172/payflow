const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000/api/wallet";

const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_BASE_URL ||
  "http://localhost:8000/api/token";

const SENDER_USERNAME = "Abhishek Yadav";

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        data.message ||
        "Backend request failed."
    );
  }

  return data;
}

// Real JWT login
export async function login(username, password) {
  if (!username || !password) {
    throw new Error("Username and password are required.");
  }

  const data = await request(AUTH_BASE_URL + "/", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
  });

  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  localStorage.setItem("username", username);

  return {
    token: data.access,
    user: {
      username,
      name: username,
    },
  };
}

// Get JWT token
function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("You are not logged in.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

// Real backend balance
export async function getBalance() {
  const username =
    localStorage.getItem("username") || SENDER_USERNAME;

  const data = await request(
    `${API_BASE_URL}/balance/${encodeURIComponent(username)}/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return Number(data.balance);
}

// Real backend transaction history
export async function getTransactions() {
  const username =
    localStorage.getItem("username") || SENDER_USERNAME;

  const data = await request(
    `${API_BASE_URL}/history/${encodeURIComponent(username)}/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return (data.transactions || []).map((tx, index) => {
    const amount = Number(tx.amount);
    const isCredit = tx.transaction_type === "CREDIT";

    return {
      id: `${tx.timestamp}-${index}`,
      label: isCredit ? "Money received" : "Money sent",
      amount: isCredit ? amount : -amount,
      type: isCredit ? "credit" : "debit",
      time: new Date(tx.timestamp).toLocaleString(),
    };
  });
}

// Real backend transfer
export async function transferMoney(recipient, amount) {
  const numericAmount = Number(amount);
  const username =
    localStorage.getItem("username") || SENDER_USERNAME;

  if (!recipient || !recipient.trim()) {
    throw new Error("Enter a recipient.");
  }

  if (!numericAmount || numericAmount <= 0) {
    throw new Error("Enter a valid amount.");
  }

  const data = await request(`${API_BASE_URL}/transfer/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      from_username: username,
      to_username: recipient.trim(),
      amount: numericAmount,
    }),
  });

  return {
    balance: Number(data.sender_balance),
    transaction: {
      id: Date.now().toString(),
      label: `Transfer to ${recipient}`,
      amount: -numericAmount,
      type: "debit",
      time: "just now",
    },
  };
}

// Logout
export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("username");
}