const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: "Hello from Express!" })
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});