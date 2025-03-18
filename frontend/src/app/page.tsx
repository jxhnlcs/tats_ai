'use client'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import {
  FiPlus,
  FiMessageSquare,
  FiZap,
  FiSettings,
  FiX,
  FiMenu,
} from 'react-icons/fi'

// Mensagem individual (usuário, assistant, etc.)
interface Message {
  role: string
  content: string
}

// Estrutura de cada Chat
interface ChatSession {
  id: string
  title: string
  messages: Message[]
}

export default function ChatPage() {
  // Estado para os chats salvos
  const [chats, setChats] = useState<ChatSession[]>([])
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  // Estado para o input e carregamento
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  // Estado para o modal de configurações
  const [showConfigModal, setShowConfigModal] = useState(false)
  // Estado para exibir o sidebar no mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Referência para o container de mensagens
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Carrega chats do localStorage ao montar o componente
  useEffect(() => {
    const storedChats = localStorage.getItem('tats_chats')
    if (storedChats) {
      const parsed = JSON.parse(storedChats) as ChatSession[]
      setChats(parsed)
      if (parsed.length > 0) {
        setSelectedChatId(parsed[0].id)
      }
    }
  }, [])

  // Sempre que as mensagens mudarem, scrolla para o final do container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chats, loading])

  // Salva os chats no localStorage e atualiza o estado
  function saveChatsToLocalStorage(updatedChats: ChatSession[]) {
    setChats(updatedChats)
    localStorage.setItem('tats_chats', JSON.stringify(updatedChats))
  }

  // Cria um novo chat e o seleciona
  function handleNewChat() {
    const newId = Date.now().toString()
    const newChat: ChatSession = {
      id: newId,
      title: `Chat #${chats.length + 1}`,
      messages: [],
    }
    const updatedChats = [newChat, ...chats]
    saveChatsToLocalStorage(updatedChats)
    setSelectedChatId(newId)
    setIsSidebarOpen(false)
  }

  // Seleciona um chat da lista
  function handleSelectChat(chatId: string) {
    setSelectedChatId(chatId)
    setIsSidebarOpen(false)
  }

  const currentChat = chats.find(c => c.id === selectedChatId)

  // Envia mensagem e atualiza o chat atual
  const sendMessage = async () => {
    if (!input.trim() || !currentChat) return
    setLoading(true)
    const updatedMessages = [
      ...currentChat.messages,
      { role: 'user', content: input },
    ]
    setInput('')

    // Atualiza o chat com a mensagem do usuário
    const updatedChat: ChatSession = {
      ...currentChat,
      messages: updatedMessages,
    }
    const updatedChats = chats.map(c =>
      c.id === currentChat.id ? updatedChat : c
    )
    saveChatsToLocalStorage(updatedChats)

    try {
      const { data } = await axios.post('https://tats-ai.onrender.com/api/chat', {
        messages: updatedMessages,
      })
      const newMessages = [
        ...updatedMessages,
        { role: 'assistant', content: data.reply },
      ]
      const finalChat: ChatSession = {
        ...currentChat,
        messages: newMessages,
      }
      const finalChats = chats.map(c =>
        c.id === currentChat.id ? finalChat : c
      )
      saveChatsToLocalStorage(finalChats)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setLoading(false)
    }
  }

  // Apaga TODOS os chats após confirmação com SweetAlert2
  const handleDeleteAllChats = async () => {
    const result = await Swal.fire({
      title: 'Você realmente deseja deletar TODOS os chats?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, apagar tudo!',
    })

    if (result.isConfirmed) {
      setChats([])
      setSelectedChatId(null)
      localStorage.removeItem('tats_chats')
      Swal.fire('Apagado!', 'Todos os chats foram removidos.', 'success')
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentChat?.messages, selectedChatId]);
  

  return (
    <div className="dark flex h-screen w-screen overflow-hidden bg-gray-900">
      {/* Sidebar para desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700 p-4 h-screen">
        <div className="flex items-center mb-6">
          <img
            src="https://avatar.iran.liara.run/public/73"
            alt="Tats Avatar"
            className="h-10 w-10 rounded-full mr-3"
          />
          <h1 className="text-xl font-semibold text-gray-200">Tats</h1>
        </div>

        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <FiPlus className="text-lg" />
          Novo Chat
        </button>

        <nav className="mt-6 flex flex-col gap-2 overflow-y-auto">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm transition text-gray-200 hover:bg-gray-700 ${
                chat.id === selectedChatId ? 'bg-gray-700' : ''
              }`}
            >
              <FiMessageSquare />
              {chat.title}
            </button>
          ))}
          <hr className="my-4 border-gray-600" />
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-2 py-2 px-3 rounded-md text-sm text-gray-200 hover:bg-gray-700 transition"
          >
            <FiSettings />
            Configurações
          </button>
          <button
            onClick={handleDeleteAllChats}
            className="flex items-center gap-2 py-2 px-3 rounded-md text-sm text-red-400 hover:bg-red-700 transition"
          >
            <FiX />
            Apagar todos os chats
          </button>
        </nav>

        <div className="mt-auto pt-6 text-center text-xs text-gray-500">
          © 2025 Tats (Beta)
        </div>
      </aside>

      {/* Sidebar para mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <aside className="relative flex flex-col w-64 bg-gray-800 p-4 h-screen">
            <div className="flex items-center mb-6">
              <img
                src="https://avatar.iran.liara.run/public/73"
                alt="Tats Avatar"
                className="h-10 w-10 rounded-full mr-3"
              />
              <h1 className="text-xl font-semibold text-gray-200">Tats</h1>
            </div>

            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <FiPlus className="text-lg" />
              Novo Chat
            </button>

            <nav className="mt-6 flex flex-col gap-2 overflow-y-auto">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm transition text-gray-200 hover:bg-gray-700 ${
                    chat.id === selectedChatId ? 'bg-gray-700' : ''
                  }`}
                >
                  <FiMessageSquare />
                  {chat.title}
                </button>
              ))}
              <hr className="my-4 border-gray-600" />
              <button
                onClick={() => setShowConfigModal(true)}
                className="flex items-center gap-2 py-2 px-3 rounded-md text-sm text-gray-200 hover:bg-gray-700 transition"
              >
                <FiSettings />
                Configurações
              </button>
              <button
                onClick={handleDeleteAllChats}
                className="flex items-center gap-2 py-2 px-3 rounded-md text-sm text-red-400 hover:bg-red-700 transition"
              >
                <FiX />
                Apagar todos os chats
              </button>
            </nav>

            <div className="mt-auto pt-6 text-center text-xs text-gray-500">
              © 2025 Tats (Beta)
            </div>
          </aside>
        </div>
      )}

      {/* Área principal do chat */}
      <main className="flex flex-col flex-1">
        <header className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-4">
            {/* Botão Hamburger para mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-200"
            >
              <FiMenu size={24} />
            </button>
            {currentChat ? (
              <h2 className="text-xl font-semibold text-gray-200">
                {currentChat.title}
              </h2>
            ) : (
              <h2 className="text-xl font-semibold text-gray-200">
                Selecione ou crie um chat
              </h2>
            )}
          </div>
          <div className="text-sm text-gray-400">Farmacêutico Virtual</div>
        </header>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-auto px-4 py-6 space-y-4"
        >
          {currentChat?.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Exibe o avatar dependendo do role */}
              {msg.role !== 'user' && (
                <img
                  src="https://avatar.iran.liara.run/public/73"
                  alt="Avatar Tats"
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div
                className={`max-w-sm px-4 py-2 rounded-lg shadow ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-200 border border-gray-600'
                }`}
              >
                {msg.role === 'assistant'
                  ? `${msg.content}`
                  : `${msg.content}`}
              </div>
              {msg.role === 'user' && (
                <img
                  src="https://avatar.iran.liara.run/public/6"
                  alt="Avatar do Usuário"
                  className="w-10 h-10 rounded-full"
                />
              )}
            </div>
          ))}
          {loading && (
            <div className="text-center text-gray-300 italic">
              Carregando...
            </div>
          )}
        </div>

        {currentChat && (
          <footer className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                className="flex-1 border border-gray-600 rounded-md px-3 py-2 text-gray-200 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Digite sua pergunta..."
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </footer>
        )}
      </main>

      {/* Modal de Configurações */}
      {showConfigModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Fundo semitransparente */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowConfigModal(false)}
          ></div>
          <div className="relative bg-gray-800 rounded-lg shadow-lg w-80 p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-200">
                Configurações
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-gray-400"
              >
                <FiX size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Versão Beta – sujeito a futuras atualizações.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}