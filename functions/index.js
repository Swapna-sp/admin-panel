// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const express = require("express");
// const cors = require("cors");

// admin.initializeApp();
// const db = admin.firestore();
// const app = express();

// // Enable CORS
// app.use(cors({ origin: true }));

// // Middleware to verify Firebase ID Token from Authorization header
// const verifyFirebaseToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Unauthorized: No token provided" });
//   }

//   const idToken = authHeader.split(" ")[1];

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Unauthorized: Invalid token" });
//   }
// };

// //Apply the token check middleware to secure the endpoint
// app.get("/getTravelSearches", verifyFirebaseToken, async (req, res) => {
//   try {
//     const snapshot = await db.collection("travelSearches").get();
//     const data = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     return res.status(200).json(data);
//   } catch (error) {
//     console.error("Error getting travelSearches:", error);
//     return res.status(500).json({ error: "Failed to fetch travelSearches" });
//   }
// });

// exports.api = functions.https.onRequest(app);







const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();
const app = express();

// Enable CORS
app.use(cors({ origin: true }));

// ✅ Accessing the correct API key from Firebase Functions config
const API_KEY = functions.config().dmc.api_key;  // Correct path to access api_key

// Middleware to verify API key from Authorization header
const verifyApiKey = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the API key is provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No API key provided" });
  }

  const apiKey = authHeader.split(" ")[1]; // Extract the key after "Bearer "

  // Verify the API key
  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid API key" });
  }

  next(); // API key is valid, proceed to the route
};

// Apply the API key check middleware to secure the endpoint
app.get("/getTravelSearches", verifyApiKey, async (req, res) => {
  try {
    const snapshot = await db.collection("travelSearches").get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error getting travelSearches:", error);
    return res.status(500).json({ error: "Failed to fetch travelSearches" });
  }
});

// Export the Express app as a Firebase HTTPS function
exports.api = functions.https.onRequest(app);
