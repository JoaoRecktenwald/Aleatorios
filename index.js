const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log("Incoming call:", req.body);

  const numeroDestino = req.body.to;

  res.json([
    {
      verb: "dial",
      target: [
        {
          type: "phone",
          number: `+55${numeroDestino}`, // ou tratar formato
          trunk: "NVOIP"
        }
      ]
    }
  ]);
});

app.get('/', (req, res) => {
  res.send("Webhook rodando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});