// Funny Videos
/*^*^*^*^*^*^*^*
index.js
The server for Funny Videos.
*^*^*^*^*^*^*^*/

const express = require("express");
const app = express();
const port = 9000;
const path = require("path");

app.use(express.static("./"));
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
