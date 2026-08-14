const API_URL = "http://localhost:5000";

export const getPuzzle = async () => {
  const response = await fetch(`${API_URL}/api/puzzle`);

  if (!response.ok) {
    throw new Error("Failed to fetch puzzle");
  }

  return response.json();
};

export const getPlayer = async (username) => {
  const response = await fetch(
    `${API_URL}/api/player/${encodeURIComponent(username)}`
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch player");
  }

  return response.json();
};

export const submitGuess = async (username, guess) => {
  const response = await fetch(`${API_URL}/api/guess`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      guess,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit guess");
  }

  return data;
};