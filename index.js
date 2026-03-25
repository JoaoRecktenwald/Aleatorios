const express = require('express');
const app = express();

app.use(express.json());

// Função para garantir formato correto do número
function formatarNumero(numero) {
  if (!numero) return null;

  // remove tudo que não for número
  numero = numero.replace(/\D/g, '');

  // se já tem 55 na frente
  if (numero.startsWith('55')) {
    return `+${numero}`;
  }

  // adiciona Brasil
  return `+55${numero}`;
}

// WEBHOOK PRINCIPAL (Jambonz chama aqui)
app.post('/webhook', (req, res) => {
  console.log("📞 Incoming call:", req.body);

  let numeroDestino = req.body.to.replace(/\D/g, '');

  // 🔥 TESTE COM PREFIXO 0
  numeroDestino = "0" + numeroDestino;

  console.log("📲 Discando:", numeroDestino);

  res.json([
    {
      verb: "dial",
      callerId: "138943002",
      target: [
        {
          type: "phone",
          number: numeroDestino,
          trunk: "NVOIP"
        }
      ]
    }
  ]);
});

// STATUS DA CHAMADA (obrigatório no Jambonz)
app.post('/status', (req, res) => {
  console.log("📊 Call status:", req.body);
  res.sendStatus(200);
});

// Health check
app.get('/', (req, res) => {
  res.send("Webhook rodando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});