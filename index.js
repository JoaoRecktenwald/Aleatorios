const express = require('express');
const app = express();

app.use(express.json());

// Endpoint que o jambonz vai chamar
app.post('/webhook', (req, res) => {
  console.log("Incoming call:", req.body);

  res.json([
    {
      verb: "dial",
      target: {
        type: "phone",
        number: "+551152866333" // TROCA PELO SEU NÚMERO
      }
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