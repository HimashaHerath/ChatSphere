const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const CHAT_ENGINE_PROJECT_ID = process.env.CHAT_ENGINE_PROJECT_ID;
const CHAT_ENGINE_PRIVATE_KEY = process.env.CHAT_ENGINE_PRIVATE_KEY;

app.post("/authenticate", async (req, res) => {
  const { username } = req.body;
  // Get or create user on Chat Engine!
  try {
    const r = await axios.put(
      "https://api.chatengine.io/users/",
      { username: username, secret: username, first_name: username },
      { headers: { "Private-Key": CHAT_ENGINE_PRIVATE_KEY } }
    );
    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
});

app.post("/signup", async (req, res) => {
  const { username, secret, email, first_name, last_name } = req.body;

  // Store a user-copy on Chat Engine!
  // Docs at rest.chatengine.io
  try {
    const r = await axios.post(
      "https://api.chatengine.io/users/",
      { username, secret, email, first_name, last_name },
      { headers: { "Private-Key": CHAT_ENGINE_PRIVATE_KEY } }
    );
    return res.status(r.status).json(r.data);
  } catch (e) {
    if (e.response) {
      return res.status(e.response.status).json(e.response.data);
    } else {
      console.error("Error:", e.message);
      return res.status(500).json({ detail: "Internal Server Error" });
    }
  }
});


app.post("/login", async (req, res) => {
  const { username, secret } = req.body;

  console.log("Request body:", req.body);

  const headers = {
    "Project-ID": CHAT_ENGINE_PROJECT_ID,
    "User-Name": username,
    "User-Secret": secret,
  };

  console.log("API request headers:", headers);

  try {
    const r = await axios.get("https://api.chatengine.io/users/me/", { headers });
    console.log("API response:", r.data);
    return res.status(r.status).json(r.data);
  } catch (e) {
    console.log("API error:", e.response.data);
    return res.status(e.response.status).json(e.response.data);
  }
});



// vvv On port 3001!
app.listen(3001);