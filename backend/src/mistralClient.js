import axios from 'axios';

class MistralClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    // Substitua pela URL correta da API do Mistral, se necessário.
    this.baseUrl = 'https://api.mistral.ai/v1'; 
  }

  async chat({ model, messages }) {
    // Essa implementação depende da API real do Mistral. 
    // Verifique a documentação para ajustar o endpoint e os dados enviados.
    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model,
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }
}

export default MistralClient;