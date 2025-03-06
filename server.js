const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Do you want a recipe?");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
