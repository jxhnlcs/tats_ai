import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import MistralClient from './mistralClient.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({ origin: '*' }));

const mistral = new MistralClient(process.env.MISTRAL_API_KEY);

app.get('/ping', (req, res) => {
  res.send('ok');
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  const promptFarmacia = {
    role: 'system',
    content:
      'Seu nome é Verônica. Você é uma IA especialista em auditoria farmacêutica. Responda perguntas sobre medicamentos, farmacologia, auditoria farmaceutica, rdc, leis e outros assuntos farmacêuticos com clareza e precisão.',
  };

  try {
    const chatResponse = await mistral.chat({
      model: 'mistral-tiny', // Ajuste o modelo conforme disponível na API do Mistral.
      messages: [promptFarmacia, ...messages],
    });

    res.json({ reply: chatResponse.choices[0].message.content });
  } catch (error) {
    console.error('Erro API Mistral:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em ${port}`);
});
