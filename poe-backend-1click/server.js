const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3333;

const POE_SESSION = process.env.POE_SESSION;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Pergunta não enviada.' });

  try {
    const response = await axios.post(
      'https://poe.com/api/gql_POST',
      {
        query: `mutation { addMessage(message: { chatId: null, content: "${question}", attachments: [] }) { message { text } } }`
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `p-b=${POE_SESSION}`,
          'User-Agent': 'Mozilla/5.0',
        }
      }
    );

    const answer = response.data?.data?.addMessage?.message?.text || 'Sem resposta.';
    res.json({ answer });

  } catch (error) {
    console.error('Erro na API do Poe:', error.message);
    res.status(500).json({ error: 'Erro ao consultar IA.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});