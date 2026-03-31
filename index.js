require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

// 🔢 controle simples
let chamadasAtivas = 0;
const LIMITE_CHAMADAS = 3;

// 🔧 formatador
function formatarNumero(numero) {
  if (!numero) return null;

  numero = numero.replace(/\D/g, '');

  if (numero.startsWith('55')) {
    return numero;
  }

  return '55' + numero;
}

//
// 📞 WEBHOOK DO RETELL (OUTBOUND FLOW)
//
app.post('/webhook', async (req, res) => {
  console.log("\n📞 Retell Webhook:");
  console.log(req.body);

  if (chamadasAtivas >= LIMITE_CHAMADAS) {
    console.log("🚫 Limite atingido");

    return res.json([
      {
        verb: "hangup"
      }
    ]);
  }

  try {
    chamadasAtivas++;

    const numeroDestino = formatarNumero(req.body.to);

    console.log("📲 Destino:", numeroDestino);
    console.log("📊 Chamadas ativas:", chamadasAtivas);

    // 🔥 AQUI você manda para Direct Call via SIP
    // 👉 use seu domínio/host do tronco SIP

    const sipDirectCall = `sip:${numeroDestino}@SEU_DOMINIO_DIRECTCALL`;

    console.log("🔗 Enviando para Direct Call:", sipDirectCall);

    return res.json([
      {
        verb: "dial",
        target: [
          {
            type: "sip",
            sipUri: sipDirectCall
          }
        ]
      }
    ]);

  } catch (error) {
    console.error("❌ Erro:", error);

    chamadasAtivas = Math.max(0, chamadasAtivas - 1);

    return res.json([
      {
        verb: "hangup"
      }
    ]);
  }
});

//
// 📊 STATUS (Retell envia eventos aqui se configurado)
//
app.post('/status', (req, res) => {
  console.log("\n📊 Status:");
  console.log(req.body);

  const status = req.body.call_status || req.body.CallStatus;

  if (
    status === "completed" ||
    status === "failed" ||
    status === "busy" ||
    status === "no-answer"
  ) {
    chamadasAtivas = Math.max(0, chamadasAtivas - 1);
    console.log("📉 Chamadas ativas:", chamadasAtivas);
  }

  res.sendStatus(200);
});

//
// ❤️ Health
//
app.get('/', (req, res) => {
  res.send("🚀 Retell → Direct Call webhook rodando");
});

//
// 🚀 Start
//
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});
