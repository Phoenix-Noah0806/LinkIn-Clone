// ===== CORS CONFIGURATION =====
const allowedOrigins = [
  "http://localhost:3000",
  "https://linkin-clone.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. curl, Postman)
      if (!origin) return callback(null, true);
      // Check if the request's origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
