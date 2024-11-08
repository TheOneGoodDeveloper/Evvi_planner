// Node modules
const express = require("express");
const cors = require("cors");
const path = require("path");

const messageRoute = require("./Routes/message_route.js"); // Assuming routes are defined in message_routes.js
const AdminRoute = require("./Routes/Admin_routes.js");
const UserRoute = require("./Routes/User_routes.js");

const app = express();
const port = 5000;
app.use(express.json());
// app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: "https://enrichminds.co.in/" }));
app.use(cors());

app.use("/blog_images", express.static(path.join(__dirname, "/Assets/blog_images")));
app.use("/changeAbit_images",express.static(path.join(__dirname,"/Assets/changeAbit_images")))
app.use("/safety_images",express.static(path.join(__dirname,"/Assets/safety_images")))

app.use(express.static(path.join(__dirname, "/dist")));


app.use("/admin", AdminRoute);
app.use("/", UserRoute);
app.use("/api",messageRoute)


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

app.listen(port, () => {
  console.log(`Server running successfully on port ${port}`);
});
