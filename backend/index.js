const express = require("express");
const rootRouter = require("./routes/index");
const cors = require('cors');
const PORT = 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


