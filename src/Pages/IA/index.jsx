import React, { useState, useEffect, useRef } from 'react';
import "./index.css";
import Navbar from '../../Components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatHistoryRef = useRef(null);
    const navigate = useNavigate();

    // Safely get user email with null checks
    const getUserEmail = () => {
        try {
            const userData = localStorage.getItem("@user");
            if (!userData) {
                navigate('/'); // Redirect if not authenticated
                return null;
            }
            console.log(userData);
            const user = JSON.parse(userData);
            console.log(user);
            return user?.email || null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            navigate('/');
            return null;
        }
    };

    const email = getUserEmail();

    const scrollToBottom = () => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        const loadHistory = async () => {
            if (!email) return;

            try {
                setIsLoading(true);
                const response = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/api/history/${email}`);
                if (!response.ok) throw new Error(`Erro ${response.status}`);
                const data = await response.json();
                setMessages(data || []);
            } catch (error) {
                console.error("Falha ao carregar histórico:", error);
                setMessages([{
                    role: 'system',
                    content: 'Não foi possível carregar o histórico. As novas mensagens serão salvas normalmente.'
                }]);
            } finally {
                setIsLoading(false);
            }
        };

        loadHistory();
    }, [email]);




    // useEffect(() => {
    //     const loadHistory = async () => {
    //         try {
    //             setIsLoading(true);
    //             const response = await fetch(`http://localhost:3001/api/history/${email}`);
    //             if (!response.ok) throw new Error(`Erro ${response.status}`);
    //             const data = await response.json();
    //             setMessages(data || []);
    //         } catch (error) {
    //             console.error("Falha ao carregar histórico:", error);
    //             setMessages([{
    //                 role: 'system',
    //                 content: 'Não foi possível carregar o histórico. As novas mensagens serão salvas normalmente.'
    //             }]);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     if (email) loadHistory();
    // }, [email]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const sendMessage = async () => {
        if (!prompt.trim() || isLoading) return;

        try {
            setIsLoading(true);
            const userMessage = { role: 'user', content: prompt };
            setMessages(prev => [...prev, userMessage]);
            setPrompt('');

            const response = await fetch('https://backend-pilulas-mentoria.herokuapp.com/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, prompt, messages }),
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };


    

    const formatAIMessage = (content) => {
        // Primeiro, normalizamos as quebras de linha
        const normalizedContent = content.replace(/\r\n/g, '\n');
        
        // Dividimos em blocos (parágrafos/listas) considerando múltiplas quebras
        const blocks = normalizedContent.split(/\n\n+/);
        
        return (
          <div className="ai-message-content">
            {blocks.map((block, blockIndex) => {
              if (!block.trim()) return null;
              
              const lines = block.split('\n');
              const isList = lines.every(line => 
                /^\s*[*\-•]\s|\d+\.\s/.test(line) || 
                (lines.length > 1 && /^\s*\*\*[^*]+\*\*\s*$/.test(line))
              );
      
              // Processa títulos e subtítulos
              if (lines.length === 1) {
                // Título nível 1 (###)
                if (block.startsWith('### ')) {
                  return <h3 key={blockIndex}>{block.substring(4)}</h3>;
                }
                // Título nível 2 (##)
                if (block.startsWith('## ')) {
                  return <h4 key={blockIndex}>{block.substring(3)}</h4>;
                }
                // Subtítulo em negrito (linha só com **texto**)
                if (/^\s*\*\*[^*]+\*\*\s*$/.test(block)) {
                  return <h4 key={blockIndex} className="bold-subtitle">
                    {block.replace(/\*\*/g, '')}
                  </h4>;
                }
              }
      
              // Processa listas
              if (isList) {
                const isOrdered = lines.some(line => /^\d+\.\s/.test(line));
                
                const ListTag = isOrdered ? 'ol' : 'ul';
                
                return (
                  <ListTag key={blockIndex} className="ai-list">
                    {lines.filter(line => line.trim()).map((line, lineIndex) => {
                      const text = line
                        .replace(/^\s*[*\-•]\s|\d+\.\s/, '')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>');
                      
                      return (
                        <li key={lineIndex} dangerouslySetInnerHTML={{ __html: text }} />
                      );
                    })}
                  </ListTag>
                );
              }
      
              // Processa parágrafos normais
              const processedText = block
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code>$1</code>')
                .replace(/_(.*?)_/g, '<em>$1</em>');
      
              return (
                <p key={blockIndex} dangerouslySetInnerHTML={{ __html: processedText }} />
              );
            })}
          </div>
        );
      };


    return (
        <div className='fundo_da_pagina'>
            <Navbar />
            <div className="detalhe_imagem_dash"></div>
            <div className="chat-container">


                {/* <div className="chat-history" ref={chatHistoryRef}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`message ${msg.role}`}>
                            {msg.content}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message assistant">
                            <div className="typing-indicator"></div>
                        </div>
                    )}
                </div> */}

                <div className="chat-history" ref={chatHistoryRef}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`message ${msg.role}`}>
                            {msg.role === 'assistant' ? formatAIMessage(msg.content) : msg.content}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message assistant">
                            <div className="typing-indicator"></div>
                        </div>
                    )}
                </div>

                <div className="input-area">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Mensagem..."
                        disabled={isLoading}
                    />
                    <button onClick={sendMessage} disabled={isLoading || !prompt.trim()}>
                        {isLoading ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
