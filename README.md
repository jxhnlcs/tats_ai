# Tats: IA Farmacêutica

Tats é um projeto de chat que utiliza inteligência artificial para responder perguntas sobre farmácia e farmacologia. O sistema permite a criação e gerenciamento de múltiplos chats, persistindo as conversas no navegador via Local Storage. O backend utiliza uma API customizada baseada na [Mistral API](https://mistral.ai) para processar as mensagens e fornecer respostas precisas.

## Funcionalidades

- **Chat Interativo:**  
  Permite que o usuário envie perguntas e receba respostas da IA especializada em farmácia.

- **Múltiplos Chats:**  
  Crie e gerencie diferentes sessões de chat, armazenadas no Local Storage.

- **Interface Responsiva:**  
  Layout moderno com tema dark fixo, sidebar para navegação e menu hamburger para dispositivos móveis.

- **Health Check:**  
  Rota `/ping` para monitoramento, permitindo a configuração de cron jobs para manter o serviço ativo.

- **Notificações Visuais:**  
  Uso de SweetAlert2 para confirmação de ações importantes, como apagar todos os chats.

## Tecnologias Utilizadas

### Frontend
- **Next.js:** Framework React para criação de aplicações modernas e escaláveis.
- **Tailwind CSS:** Biblioteca de classes utilitárias para estilização rápida e responsiva.
- **React Icons:** Conjunto de ícones para enriquecer a interface de usuário.
- **Axios:** Biblioteca para fazer requisições HTTP ao backend.

### Backend
- **Node.js com Express:** Ambiente de execução JavaScript no servidor, utilizando Express para criação de APIs REST.
- **CORS:** Middleware utilizado para permitir requisições de diferentes origens.
- **dotenv:** Para gerenciamento de variáveis de ambiente.
- **Mistral API:** Utilizada através de um client customizado para processar mensagens e retornar respostas da IA especializada em farmácia.

## Como Executar o Projeto

**Backend**  
1. Navegue até a pasta `backend`.  
2. Execute `npm install` para instalar as dependências.  
3. Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:  
   - MISTRAL_API_KEY=SuaChaveDaMistral  
   - PORT=3333  
4. Inicie o servidor com `npm run dev`.

**Frontend**  
1. Navegue até a pasta `frontend`.  
2. Execute `npm install` para instalar as dependências.  
3. Inicie o projeto Next.js com `npm run dev`.  
4. Acesse o projeto no navegador em `http://localhost:3000`.

## Finalidade do Projeto

O projeto foi desenvolvido para facilitar o acesso a informações farmacêuticas de forma interativa, utilizando inteligência artificial. Ele tem como objetivo oferecer uma ferramenta que responda dúvidas sobre medicamentos, posologia, interações e demais tópicos relacionados à farmácia, auxiliando profissionais e estudantes da área.
