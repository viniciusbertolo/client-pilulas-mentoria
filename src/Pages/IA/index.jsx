// // import React, { useState, useEffect, useRef } from 'react';
// // import "./index.css";
// // import Navbar from '../../Components/Navbar';
// // import { useNavigate } from 'react-router-dom';

// // export default function Chat() {
// //     const [prompt, setPrompt] = useState('');
// //     const [messages, setMessages] = useState([]);
// //     const [isLoading, setIsLoading] = useState(false);
// //     const chatHistoryRef = useRef(null);
// //     const navigate = useNavigate();

// //     // Safely get user email with null checks
// //     const getUserEmail = () => {
// //         try {
// //             const userData = localStorage.getItem("@user");
// //             if (!userData) {
// //                 navigate('/'); // Redirect if not authenticated
// //                 return null;
// //             }
// //             console.log(userData);
// //             const user = JSON.parse(userData);
// //             console.log(user);
// //             return user?.email || null;
// //         } catch (error) {
// //             console.error("Error parsing user data:", error);
// //             navigate('/');
// //             return null;
// //         }
// //     };

// //     const email = getUserEmail();

// //     const scrollToBottom = () => {
// //         if (chatHistoryRef.current) {
// //             chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
// //         }
// //     };

// //     useEffect(() => {
// //         const loadHistory = async () => {
// //             if (!email) return;

// //             try {
// //                 setIsLoading(true);
// //                 const response = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/api/history/${email}`);
// //                 if (!response.ok) throw new Error(`Erro ${response.status}`);
// //                 const data = await response.json();
// //                 setMessages(data || []);
// //                 console.log("mes", messages)
// //             } catch (error) {
// //                 console.error("Falha ao carregar histórico:", error);
// //                 setMessages([{
// //                     role: 'system',
// //                     content: 'Não foi possível carregar o histórico. As novas mensagens serão salvas normalmente.'
// //                 }]);
// //             } finally {
// //                 setIsLoading(false);
// //             }
// //         };

// //         loadHistory();
// //     }, [email]);




// //     // useEffect(() => {
// //     //     const loadHistory = async () => {
// //     //         try {
// //     //             setIsLoading(true);
// //     //             const response = await fetch(`http://localhost:3001/api/history/${email}`);
// //     //             if (!response.ok) throw new Error(`Erro ${response.status}`);
// //     //             const data = await response.json();
// //     //             setMessages(data || []);
// //     //         } catch (error) {
// //     //             console.error("Falha ao carregar histórico:", error);
// //     //             setMessages([{
// //     //                 role: 'system',
// //     //                 content: 'Não foi possível carregar o histórico. As novas mensagens serão salvas normalmente.'
// //     //             }]);
// //     //         } finally {
// //     //             setIsLoading(false);
// //     //         }
// //     //     };

// //     //     if (email) loadHistory();
// //     // }, [email]);

// //     useEffect(() => {
// //         scrollToBottom();
// //     }, [messages, isLoading]);

// //     const sendMessage = async () => {
// //         if (!prompt.trim() || isLoading) return;

// //         try {
// //             setIsLoading(true);
// //             const userMessage = { role: 'user', content: prompt };
// //             setMessages(prev => [...prev, userMessage]);
// //             setPrompt('');

// //             const response = await fetch('https://backend-pilulas-mentoria.herokuapp.com/api/chat', {
// //                 method: 'POST',
// //                 headers: { 'Content-Type': 'application/json' },
// //                 body: JSON.stringify({ email, prompt, messages }),
// //             });

// //             const data = await response.json();
// //             setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
// //         } catch (error) {
// //             console.error("Erro ao enviar mensagem:", error);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     const handleKeyPress = (e) => {
// //         if (e.key === 'Enter' && !e.shiftKey) {
// //             e.preventDefault();
// //             sendMessage();
// //         }
// //     };

// //     console.log("Payload enviado para /api/chat:", { email, prompt, messages });



// //     const formatAIMessage = (content) => {

// //         if (typeof content !== 'string') return null;

// //         // Primeiro, normalizamos as quebras de linha
// //         const normalizedContent = content.replace(/\r\n/g, '\n');

// //         // Dividimos em blocos (parágrafos/listas) considerando múltiplas quebras
// //         const blocks = normalizedContent.split(/\n\n+/);

// //         return (
// //             <div className="ai-message-content">
// //                 {blocks.map((block, blockIndex) => {
// //                     if (!block.trim()) return null;

// //                     const lines = block.split('\n');
// //                     const isList = lines.every(line =>
// //                         /^\s*[*\-•]\s|\d+\.\s/.test(line) ||
// //                         (lines.length > 1 && /^\s*\*\*[^*]+\*\*\s*$/.test(line))
// //                     );

// //                     // Processa títulos e subtítulos
// //                     if (lines.length === 1) {
// //                         // Título nível 1 (###)
// //                         if (block.startsWith('### ')) {
// //                             return <h3 key={blockIndex}>{block.substring(4)}</h3>;
// //                         }
// //                         // Título nível 2 (##)
// //                         if (block.startsWith('## ')) {
// //                             return <h4 key={blockIndex}>{block.substring(3)}</h4>;
// //                         }
// //                         // Subtítulo em negrito (linha só com **texto**)
// //                         if (/^\s*\*\*[^*]+\*\*\s*$/.test(block)) {
// //                             return <h4 key={blockIndex} className="bold-subtitle">
// //                                 {block.replace(/\*\*/g, '')}
// //                             </h4>;
// //                         }
// //                     }

// //                     // Processa listas
// //                     if (isList) {
// //                         const isOrdered = lines.some(line => /^\d+\.\s/.test(line));

// //                         const ListTag = isOrdered ? 'ol' : 'ul';

// //                         return (
// //                             <ListTag key={blockIndex} className="ai-list">
// //                                 {lines.filter(line => line.trim()).map((line, lineIndex) => {
// //                                     const text = line
// //                                         .replace(/^\s*[*\-•]\s|\d+\.\s/, '')
// //                                         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
// //                                         .replace(/\*(.*?)\*/g, '<em>$1</em>');

// //                                     return (
// //                                         <li key={lineIndex} dangerouslySetInnerHTML={{ __html: text }} />
// //                                     );
// //                                 })}
// //                             </ListTag>
// //                         );
// //                     }

// //                     // Processa parágrafos normais
// //                     const processedText = block
// //                         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
// //                         .replace(/\*(.*?)\*/g, '<em>$1</em>')
// //                         .replace(/`(.*?)`/g, '<code>$1</code>')
// //                         .replace(/_(.*?)_/g, '<em>$1</em>');

// //                     return (
// //                         <p key={blockIndex} dangerouslySetInnerHTML={{ __html: processedText }} />
// //                     );
// //                 })}
// //             </div>
// //         );
// //     };


// //     return (
// //         <div className='fundo_da_pagina'>
// //             <Navbar />
// //             <div className="detalhe_imagem_dash"></div>
// //             <div className="chat-container">


// //                 {/* <div className="chat-history" ref={chatHistoryRef}>
// //                     {messages.map((msg, i) => (
// //                         <div key={i} className={`message ${msg.role}`}>
// //                             {msg.content}
// //                         </div>
// //                     ))}
// //                     {isLoading && (
// //                         <div className="message assistant">
// //                             <div className="typing-indicator"></div>
// //                         </div>
// //                     )}
// //                 </div> */}

// //                 {/* <div className="chat-history" ref={chatHistoryRef}>
// //                     {messages.map((msg, i) => (
// //                         <div key={i} className={`message ${msg.role}`}>
// //                             {msg.role === 'assistant' ? formatAIMessage(msg.content) : msg.content}
// //                         </div>
// //                     ))}
// //                     {isLoading && (
// //                         <div className="message assistant">
// //                             <div className="typing-indicator"></div>
// //                         </div>
// //                     )}
// //                 </div> */}

// //                 <div className="chat-history" ref={chatHistoryRef}>
// //                     {messages.length === 0 && !isLoading && (
// //                         <div className="message assistant">
// //                             Olá! Pode me contar qual medo você está sentindo agora? Estou aqui pra ajudar.
// //                         </div>
// //                     )}

// //                     {messages.map((msg, i) => (
// //                         <div key={i} className={`message ${msg.role}`}>
// //                             {msg.role === 'assistant' ? formatAIMessage(msg.content) : msg.content}
// //                         </div>
// //                     ))}

// //                     {isLoading && (
// //                         <div className="message assistant">
// //                             <div className="typing-indicator"></div>
// //                         </div>
// //                     )}
// //                 </div>


// //                 <div className="input-area">
// //                     <textarea
// //                         value={prompt}
// //                         onChange={(e) => setPrompt(e.target.value)}
// //                         onKeyDown={handleKeyPress}
// //                         placeholder="Mensagem..."
// //                         disabled={isLoading}
// //                     />
// //                     <button onClick={sendMessage} disabled={isLoading || !prompt.trim()}>
// //                         {isLoading ? 'Enviando...' : 'Enviar'}
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }






// import React, { useState, useEffect, useRef } from 'react';
// import "./index.css";
// import { useNavigate } from 'react-router-dom';

// export default function Chat() {
//     const [prompt, setPrompt] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();

//     const getUserEmail = () => {
//         try {
//             const userData = localStorage.getItem("@user");
//             if (!userData) {
//                 navigate('/');
//                 return null;
//             }
//             const user = JSON.parse(userData);
//             return user?.email || null;
//         } catch (error) {
//             console.error("Error parsing user data:", error);
//             navigate('/');
//             return null;
//         }
//     };

//     const email = getUserEmail();

//     // Nova lógica de scroll: Rola a página inteira até o final
//     const scrollToBottom = () => {
//         window.scrollTo({
//             top: document.documentElement.scrollHeight,
//             behavior: 'smooth'
//         });
//     };

//     useEffect(() => {
//         const loadHistory = async () => {
//             if (!email) return;

//             try {
//                 setIsLoading(true);
//                 const response = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/api/history/${email}`);
//                 if (!response.ok) throw new Error(`Erro ${response.status}`);
//                 const data = await response.json();
//                 setMessages(data || []);
//             } catch (error) {
//                 console.error("Falha ao carregar histórico:", error);
//                 setMessages([{
//                     role: 'system',
//                     content: 'A conexão com o núcleo foi interrompida. Suas novas mensagens serão sincronizadas em breve.'
//                 }]);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         loadHistory();
//     }, [email]);

//     // Dispara o scroll sempre que as mensagens mudam
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages, isLoading]);

//     const sendMessage = async () => {
//         if (!prompt.trim() || isLoading) return;

//         const currentPrompt = prompt;
//         try {
//             setIsLoading(true);
//             const userMessage = { role: 'user', content: currentPrompt };
//             setMessages(prev => [...prev, userMessage]);
//             setPrompt('');

//             const response = await fetch('https://backend-pilulas-mentoria.herokuapp.com/api/chat', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, prompt: currentPrompt }),
//             });

//             if (!response.ok) throw new Error("Falha na comunicação");

//             const data = await response.json();
//             setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
//         } catch (error) {
//             console.error("Erro ao enviar mensagem:", error);
//             setMessages(prev => [...prev, { 
//                 role: 'system', 
//                 content: 'Desculpe, uma interferência ocorreu. Tente enviar sua mensagem novamente.' 
//             }]);
//             setPrompt(currentPrompt);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//         }
//     };

//     const formatAIMessage = (content) => {
//         if (typeof content !== 'string') return null;

//         const normalizedContent = content.replace(/\r\n/g, '\n');
//         const blocks = normalizedContent.split(/\n\n+/);

//         return (
//             <div className="ai-message-content">
//                 {blocks.map((block, blockIndex) => {
//                     if (!block.trim()) return null;

//                     const lines = block.split('\n');
//                     const isList = lines.every(line =>
//                         /^\s*[*\-•]\s|\d+\.\s/.test(line) ||
//                         (lines.length > 1 && /^\s*\*\*[^*]+\*\*\s*$/.test(line))
//                     );

//                     if (lines.length === 1) {
//                         if (block.startsWith('### ')) {
//                             return <h3 key={blockIndex} className="ai-title">{block.substring(4)}</h3>;
//                         }
//                         if (block.startsWith('## ')) {
//                             return <h4 key={blockIndex} className="ai-subtitle">{block.substring(3)}</h4>;
//                         }
//                         if (/^\s*\*\*[^*]+\*\*\s*$/.test(block)) {
//                             return <h4 key={blockIndex} className="bold-subtitle">{block.replace(/\*\*/g, '')}</h4>;
//                         }
//                     }

//                     if (isList) {
//                         const isOrdered = lines.some(line => /^\d+\.\s/.test(line));
//                         const ListTag = isOrdered ? 'ol' : 'ul';

//                         return (
//                             <ListTag key={blockIndex} className="ai-list">
//                                 {lines.filter(line => line.trim()).map((line, lineIndex) => {
//                                     const text = line
//                                         .replace(/^\s*[*\-•]\s|\d+\.\s/, '')
//                                         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//                                         .replace(/\*(.*?)\*/g, '<em>$1</em>');
//                                     return <li key={lineIndex} dangerouslySetInnerHTML={{ __html: text }} />;
//                                 })}
//                             </ListTag>
//                         );
//                     }

//                     const processedText = block
//                         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//                         .replace(/\*(.*?)\*/g, '<em>$1</em>')
//                         .replace(/`(.*?)`/g, '<code>$1</code>')
//                         .replace(/_(.*?)_/g, '<em>$1</em>');

//                     return <p key={blockIndex} dangerouslySetInnerHTML={{ __html: processedText }} />;
//                 })}
//             </div>
//         );
//     };

//     return (
//         <div className='fundo_da_pagina'>
//             {/* Efeitos animados de fundo (Tenebris Theme) */}
//             <div className="ambient-glow glow-1"></div>
//             <div className="ambient-glow glow-2"></div>

//             <div className="chat-container">
//                 <div className="chat-history">
//                     {messages.length === 0 && !isLoading && (
//                         <div className="message assistant welcome-message">
//                             Olá. Eu sou Tenebris. Caminho pela escuridão da mente humana para encontrar a luz. Qual medo assombra os seus pensamentos hoje? Estou aqui para ajudar.
//                         </div>
//                     )}

//                     {messages.map((msg, i) => (
//                         <div key={i} className={`message-wrapper ${msg.role}`}>
//                             {msg.role === 'assistant' && (
//                                 <div className="mini-avatar"></div>
//                             )}
//                             <div className={`message ${msg.role}`}>
//                                 {msg.role === 'assistant' ? formatAIMessage(msg.content) : msg.content}
//                             </div>
//                         </div>
//                     ))}

//                     {isLoading && (
//                         <div className="message-wrapper assistant">
//                             <div className="mini-avatar thinking-avatar"></div>
//                             <div className="message assistant thinking-box">
//                                 <div className="cyber-typing">
//                                     <span className="dot"></span>
//                                     <span className="dot"></span>
//                                     <span className="dot"></span>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Input fixado no final da tela */}
//             <div className="input-container">
//                 <div className="input-area">
//                     <textarea
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                         onKeyDown={handleKeyPress}
//                         placeholder="Descreva o que você está sentindo..."
//                         disabled={isLoading}
//                         rows="1"
//                     />
//                     <button 
//                         className="send-btn" 
//                         onClick={sendMessage} 
//                         disabled={isLoading || !prompt.trim()}
//                         aria-label="Enviar mensagem"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
//                             <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
//                         </svg>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }



// import React, { useState, useEffect, useRef } from 'react';
// import "./index.css";
// import { useNavigate } from 'react-router-dom';

// export default function Chat() {
//     const [prompt, setPrompt] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();

//     // Busca o email do usuário de forma segura
//     const getUserEmail = () => {
//         try {
//             const userData = localStorage.getItem("@user");
//             if (!userData) {
//                 navigate('/');
//                 return null;
//             }
//             const user = JSON.parse(userData);
//             return user?.email || null;
//         } catch (error) {
//             console.error("Error parsing user data:", error);
//             navigate('/');
//             return null;
//         }
//     };

//     const email = getUserEmail();

//     // Rola a janela inteira até o final
//     const scrollToBottom = () => {
//         window.scrollTo({
//             top: document.documentElement.scrollHeight,
//             behavior: 'smooth'
//         });
//     };

//     // Carrega o histórico do backend
//     useEffect(() => {
//         const loadHistory = async () => {
//             if (!email) return;

//             try {
//                 setIsLoading(true);
//                 const response = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/api/history/${email}`);
//                 if (!response.ok) throw new Error(`Erro ${response.status}`);
//                 const data = await response.json();
//                 setMessages(data || []);
//             } catch (error) {
//                 console.error("Falha ao carregar histórico:", error);
//                 setMessages([{
//                     role: 'system',
//                     content: 'A conexão com o núcleo foi interrompida. Suas novas mensagens serão sincronizadas em breve.'
//                 }]);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         loadHistory();
//     }, [email]);

//     // Dispara o scroll sempre que as mensagens mudam
//     useEffect(() => {
//         scrollToBottom();
//     }, [messages, isLoading]);

//     // Envia a mensagem para a IA
//     const sendMessage = async () => {
//         if (!prompt.trim() || isLoading) return;

//         const currentPrompt = prompt;
//         try {
//             setIsLoading(true);
//             const userMessage = { role: 'user', content: currentPrompt };
//             setMessages(prev => [...prev, userMessage]);
//             setPrompt('');

//             const response = await fetch('https://backend-pilulas-mentoria.herokuapp.com/api/chat', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, prompt: currentPrompt }),
//             });

//             if (!response.ok) throw new Error("Falha na comunicação");

//             const data = await response.json();
//             setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
//         } catch (error) {
//             console.error("Erro ao enviar mensagem:", error);
//             setMessages(prev => [...prev, {
//                 role: 'system',
//                 content: 'Desculpe, uma interferência ocorreu. Tente enviar sua mensagem novamente.'
//             }]);
//             setPrompt(currentPrompt);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//         }
//     };

//     // Formata o Markdown retornado pela IA
//     const formatAIMessage = (content) => {
//         if (typeof content !== 'string') return null;

//         const normalizedContent = content.replace(/\r\n/g, '\n');
//         const blocks = normalizedContent.split(/\n\n+/);

//         return (
//             <div className="ai-message-content">
//                 {blocks.map((block, blockIndex) => {
//                     if (!block.trim()) return null;

//                     const lines = block.split('\n');
//                     const isList = lines.every(line =>
//                         /^\s*[*\-•]\s|\d+\.\s/.test(line) ||
//                         (lines.length > 1 && /^\s*\*\*[^*]+\*\*\s*$/.test(line))
//                     );

//                     if (lines.length === 1) {
//                         if (block.startsWith('### ')) {
//                             return <h3 key={blockIndex} className="ai-title">{block.substring(4)}</h3>;
//                         }
//                         if (block.startsWith('## ')) {
//                             return <h4 key={blockIndex} className="ai-subtitle">{block.substring(3)}</h4>;
//                         }
//                         if (/^\s*\*\*[^*]+\*\*\s*$/.test(block)) {
//                             return <h4 key={blockIndex} className="bold-subtitle">{block.replace(/\*\*/g, '')}</h4>;
//                         }
//                     }

//                     if (isList) {
//                         const isOrdered = lines.some(line => /^\d+\.\s/.test(line));
//                         const ListTag = isOrdered ? 'ol' : 'ul';

//                         return (
//                             <ListTag key={blockIndex} className="ai-list">
//                                 {lines.filter(line => line.trim()).map((line, lineIndex) => {
//                                     const text = line
//                                         .replace(/^\s*[*\-•]\s|\d+\.\s/, '')
//                                         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//                                         .replace(/\*(.*?)\*/g, '<em>$1</em>');
//                                     return <li key={lineIndex} dangerouslySetInnerHTML={{ __html: text }} />;
//                                 })}
//                             </ListTag>
//                         );
//                     }

//                     const processedText = block
//                         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//                         .replace(/\*(.*?)\*/g, '<em>$1</em>')
//                         .replace(/`(.*?)`/g, '<code>$1</code>')
//                         .replace(/_(.*?)_/g, '<em>$1</em>');

//                     return <p key={blockIndex} dangerouslySetInnerHTML={{ __html: processedText }} />;
//                 })}
//             </div>
//         );
//     };

//     return (
//         <div className='fundo_da_pagina'>
//             {/* Efeitos animados de fundo (Tenebris Theme) */}
//             <div className="ambient-glow glow-1"></div>
//             <div className="ambient-glow glow-2"></div>

//             {/* Morcegos Animados */}
//             {/* <div className="bats-container">
//                 <div className="bat bat-1">
//                     <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M12 4.5c-1.5 2-4 3-6 3-2 0-4.5-2-6-3.5 1.5 3 3 5 3 7 0 1.5-1 3.5-3 5 2.5-0.5 5-2 6.5-1 1.5 1 3.5 3.5 5.5 3.5s4-2.5 5.5-3.5c1.5-1 4 0.5 6.5 1-2-1.5-3-3.5-3-5 0-2 1.5-4 3-7-1.5 1.5-4 3.5-6 3.5-2 0-4.5-1-6-3z"/>
//                     </svg>
//                 </div>
//                 <div className="bat bat-2">
//                     <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M12 4.5c-1.5 2-4 3-6 3-2 0-4.5-2-6-3.5 1.5 3 3 5 3 7 0 1.5-1 3.5-3 5 2.5-0.5 5-2 6.5-1 1.5 1 3.5 3.5 5.5 3.5s4-2.5 5.5-3.5c1.5-1 4 0.5 6.5 1-2-1.5-3-3.5-3-5 0-2 1.5-4 3-7-1.5 1.5-4 3.5-6 3.5-2 0-4.5-1-6-3z"/>
//                     </svg>
//                 </div>
//                 <div className="bat bat-3">
//                     <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M12 4.5c-1.5 2-4 3-6 3-2 0-4.5-2-6-3.5 1.5 3 3 5 3 7 0 1.5-1 3.5-3 5 2.5-0.5 5-2 6.5-1 1.5 1 3.5 3.5 5.5 3.5s4-2.5 5.5-3.5c1.5-1 4 0.5 6.5 1-2-1.5-3-3.5-3-5 0-2 1.5-4 3-7-1.5 1.5-4 3.5-6 3.5-2 0-4.5-1-6-3z"/>
//                     </svg>
//                 </div>
//             </div> */}

//             {/* Efeitos animados de fundo (Tenebris Theme) */}
//             <div className="ambient-glow glow-1"></div>
//             <div className="ambient-glow glow-2"></div>

//             {/* Elementos Flutuantes (Morcegos em Imagem e Poeira) */}
//             <div className="floating-elements-container">
//                 {/* Morcegos (Certifique-se de ter o arquivo morcego.png na pasta public) */}
//                 <div className="bat bat-1"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego voando" /></div>
//                 <div className="bat bat-2"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego voando" /></div>
//                 <div className="bat bat-3"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego voando" /></div>
//                 <div className="bat bat-4"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego voando" /></div>
//                 <div className="bat bat-5"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego voando" /></div>
//                 <div className="bat bat-6"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego voando" /></div>
//                 <div className="bat bat-7"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego voando" /></div>
//                 <div className="bat bat-8"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego voando" /></div>
//                 <div className="bat bat-9"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego voando" /></div>
//                 <div className="bat bat-10"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego voando" /></div>
//                 <div className="bat bat-11"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego voando" /></div>
//                 <div className="bat bat-12"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego voando" /></div>

//                 {/* Partículas de poeira/energia escura flutuando */}
//                 <div className="dust dust-1"></div>
//                 <div className="dust dust-2"></div>
//                 <div className="dust dust-3"></div>
//                 <div className="dust dust-4"></div>
//                 <div className="dust dust-5"></div>
//                 <div className="dust dust-6"></div>
//                 <div className="dust dust-7"></div>
//                 <div className="dust dust-8"></div>
//                 <div className="dust dust-9"></div>
//                 <div className="dust dust-11"></div>
//                 <div className="dust dust-12"></div>
//             </div>

//             {/* Cabeçalho Fixo Tenebris */}
//             <div className="tenebris-fixed-header">
//                 <div className="tenebris-logo">
//                     <div className="mini-orb"></div>
//                     <h2>Tenebris</h2>
//                 </div>
//                 <div className="status-indicator">
//                     <span className="pulse-dot"></span>
//                     <span className="status-text">Conectada</span>
//                 </div>
//             </div>

//             {/* Container Principal do Chat */}
//             <div className="chat-container">
//                 <div className="chat-history">
//                     {messages.length === 0 && !isLoading && (
//                         <div className="message assistant welcome-message">
//                             Olá. Eu sou Tenebris. Caminho pela escuridão da mente humana para encontrar a luz. Qual medo assombra os seus pensamentos hoje? Estou aqui para ajudar.
//                         </div>
//                     )}

//                     {messages.map((msg, i) => (
//                         <div key={i} className={`message-wrapper ${msg.role}`}>
//                             {msg.role === 'assistant' && (
//                                 <img src="https://img.magnific.com/fotos-gratis/renderizacao-de-icone-de-fantasma-de-desenho-animado-fofo_23-2152026177.jpg?semt=ais_hybrid&w=740&q=80" alt="Avatar Tenebris" className="mini-avatar" />
//                             )}
//                             <div className={`message ${msg.role}`}>
//                                 {msg.role === 'assistant' ? formatAIMessage(msg.content) : msg.content}
//                             </div>
//                         </div>
//                     ))}

//                     {isLoading && (
//                         <div className="message-wrapper assistant">
//                             <img src="https://img.magnific.com/fotos-gratis/renderizacao-de-icone-de-fantasma-de-desenho-animado-fofo_23-2152026177.jpg?semt=ais_hybrid&w=740&q=80" alt="Avatar Tenebris" className="mini-avatar thinking-avatar" />
//                             <div className="message assistant thinking-box">
//                                 <div className="cyber-typing">
//                                     <span className="dot"></span>
//                                     <span className="dot"></span>
//                                     <span className="dot"></span>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Input fixado no final da tela */}
//             <div className="input-container">
//                 <div className="input-area">
//                     <textarea
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                         onKeyDown={handleKeyPress}
//                         placeholder="Descreva o que você está sentindo..."
//                         disabled={isLoading}
//                         rows="1"
//                     />
//                     <button
//                         className="send-btn"
//                         onClick={sendMessage}
//                         disabled={isLoading || !prompt.trim()}
//                         aria-label="Enviar mensagem"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
//                             <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
//                         </svg>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

















//NOVO FRONT CHATS LATERAL
import React, { useState, useEffect, useRef } from 'react';
import "./index.css";
import { useNavigate } from 'react-router-dom';

export default function Chat() {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Estados para gerenciar as múltiplas sessões (Sidebar)
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Interruptor para evitar o bug de recarregamento na primeira mensagem
    const skipFetch = useRef(false); 
    
    const navigate = useNavigate();

    // Busca o email do usuário de forma segura
    const getUserEmail = () => {
        try {
            const userData = localStorage.getItem("@user");
            if (!userData) {
                navigate('/');
                return null;
            }
            const user = JSON.parse(userData);
            return user?.email || null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            navigate('/');
            return null;
        }
    };

    const email = getUserEmail();

    // Rola a janela inteira até o final
    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    // 1. Carrega a lista de chats do usuário na barra lateral
    const loadChats = async () => {
        if (!email) return;
        try {
            const response = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/api/chats/${email}`);
            const data = await response.json();
            setChats(data || []);
            
            // 🛑 AQUI ESTAVA A REGRA ANTIGA QUE NÓS APAGAMOS!
            // Agora, o currentChatId vai permanecer como 'null' quando a tela carregar,
            // garantindo que a Tenebris sempre te receba com uma tela limpa e a mensagem de boas-vindas.
            
        } catch (error) {
            console.error("Erro ao carregar lista de chats:", error);
        }
    };

    // Carrega a lista de chats assim que a tela abre
    useEffect(() => {
        loadChats();
    }, [email]);

    // 2. Carrega o histórico da conversa ATUAL sempre que o currentChatId mudar
    useEffect(() => {
        const loadHistory = async () => {
            if (!currentChatId) {
                setMessages([]); // Limpa a tela se for uma conversa nova
                return;
            }

            // Se o chat acabou de ser criado, cancela a busca para não apagar a tela
            if (skipFetch.current) {
                skipFetch.current = false; 
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch(`https://backend-pilulas-mentoria.herokuapp.com/api/history/${currentChatId}`);
                if (!response.ok) throw new Error(`Erro ${response.status}`);
                const data = await response.json();
                setMessages(data || []);
            } catch (error) {
                console.error("Falha ao carregar histórico:", error);
                setMessages([{
                    role: 'system',
                    content: 'A conexão com o núcleo foi interrompida. Suas novas mensagens serão sincronizadas em breve.'
                }]);
            } finally {
                setIsLoading(false);
            }
        };

        loadHistory();
    }, [currentChatId]);

    // Dispara o scroll sempre que as mensagens mudam
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // 3. Deleta um chat
    const handleDeleteChat = async (id, e) => {
        e.stopPropagation(); // Evita que clicar na lixeira abra o chat
        if (!window.confirm("Deseja mesmo apagar essa sessão com a Tenebris?")) return;

        try {
            await fetch(`https://backend-pilulas-mentoria.herokuapp.com/api/chats/${id}`, { method: 'DELETE' });
            
            // Se apagou o chat que estava aberto, limpa a tela
            if (currentChatId === id) {
                setCurrentChatId(null);
                setMessages([]);
            }
            
            loadChats(); // Recarrega a lista lateral
        } catch (error) {
            console.error("Erro ao deletar chat:", error);
        }
    };

    // Inicia uma nova sessão vazia
    const handleNewChat = () => {
        setCurrentChatId(null);
        setMessages([]);
        setIsSidebarOpen(false);
    };

    // 4. Envia a mensagem para a IA
    const sendMessage = async () => {
        if (!prompt.trim() || isLoading) return;

        const currentPrompt = prompt;
        try {
            setIsLoading(true);
            const userMessage = { role: 'user', content: currentPrompt };
            setMessages(prev => [...prev, userMessage]);
            setPrompt('');

            let activeChatId = currentChatId;

            // Se for a primeira mensagem de uma NOVA sessão, cria o chat no banco
            if (!activeChatId) {
                const chatRes = await fetch('https://backend-pilulas-mentoria.herokuapp.com/api/chats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, title: currentPrompt.substring(0, 30) })
                });
                const chatData = await chatRes.json();
                activeChatId = chatData.id;
                
                // Liga o interruptor para impedir o React de apagar a mensagem da tela
                skipFetch.current = true; 
                setCurrentChatId(activeChatId);
            }

            const response = await fetch('https://backend-pilulas-mentoria.herokuapp.com/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, prompt: currentPrompt, chat_id: activeChatId }),
            });

            if (!response.ok) throw new Error("Falha na comunicação");

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            
            // Atualiza a barra lateral caso tenha gerado um novo título
            loadChats();

        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            setMessages(prev => [...prev, {
                role: 'system',
                content: 'Desculpe, uma interferência ocorreu. Tente enviar sua mensagem novamente.'
            }]);
            setPrompt(currentPrompt);
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

    // Formata o Markdown retornado pela IA
    const formatAIMessage = (content) => {
        if (typeof content !== 'string') return null;

        const normalizedContent = content.replace(/\r\n/g, '\n');
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

                    if (lines.length === 1) {
                        if (block.startsWith('### ')) {
                            return <h3 key={blockIndex} className="ai-title">{block.substring(4)}</h3>;
                        }
                        if (block.startsWith('## ')) {
                            return <h4 key={blockIndex} className="ai-subtitle">{block.substring(3)}</h4>;
                        }
                        if (/^\s*\*\*[^*]+\*\*\s*$/.test(block)) {
                            return <h4 key={blockIndex} className="bold-subtitle">{block.replace(/\*\*/g, '')}</h4>;
                        }
                    }

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
                                    return <li key={lineIndex} dangerouslySetInnerHTML={{ __html: text }} />;
                                })}
                            </ListTag>
                        );
                    }

                    const processedText = block
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`(.*?)`/g, '<code>$1</code>')
                        .replace(/_(.*?)_/g, '<em>$1</em>');

                    return <p key={blockIndex} dangerouslySetInnerHTML={{ __html: processedText }} />;
                })}
            </div>
        );
    };

    return (
        <div className='fundo_da_pagina'>
            {/* Efeitos animados de fundo (Tenebris Theme) */}
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>

            {/* Elementos Flutuantes (Morcegos e Poeira) */}
            <div className="floating-elements-container">
                <div className="bat bat-1"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego" /></div>
                <div className="bat bat-2"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego" /></div>
                <div className="bat bat-3"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego" /></div>
                <div className="bat bat-4"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego" /></div>
                <div className="bat bat-5"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego" /></div>
                <div className="bat bat-6"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego" /></div>
                <div className="bat bat-7"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego" /></div>
                <div className="bat bat-8"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego" /></div>
                <div className="bat bat-9"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego" /></div>
                <div className="bat bat-10"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego" /></div>
                <div className="bat bat-11"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego" /></div>
                <div className="bat bat-12"><img src="https://images.vexels.com/media/users/3/156085/isolated/preview/18a473c43d19b2c508f4c7c84cde7d4d-silhueta-de-morcego-preto-voando.png" alt="Morcego" /></div>

                <div className="dust dust-1"></div><div className="dust dust-2"></div><div className="dust dust-3"></div>
                <div className="dust dust-4"></div><div className="dust dust-5"></div><div className="dust dust-6"></div>
                <div className="dust dust-7"></div><div className="dust dust-8"></div><div className="dust dust-9"></div>
                <div className="dust dust-11"></div><div className="dust dust-12"></div>
            </div>

            {/* OVERLAY PARA FECHAR SIDEBAR NO MOBILE */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

            {/* SIDEBAR DE CONVERSAS */}
            <div className={`tenebris-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <button className="new-chat-btn" onClick={handleNewChat}>
                    <span>+</span> Nova Sessão
                </button>
                <div className="chats-list">
                    {chats.map(chat => (
                        <div 
                            key={chat.id} 
                            className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                            onClick={() => {
                                setCurrentChatId(chat.id);
                                setIsSidebarOpen(false);
                            }}
                        >
                            <span className="chat-title">{chat.title || 'Nova Conversa'}</span>
                            <button className="delete-chat-btn" onClick={(e) => handleDeleteChat(chat.id, e)}>
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cabeçalho Fixo Tenebris */}
            <div className="tenebris-fixed-header">
                <div className="tenebris-logo">
                    <button className="menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        ☰
                    </button>
                    <div className="mini-orb"></div>
                    <h2>Tenebris</h2>
                </div>
                <div className="status-indicator">
                    <span className="pulse-dot"></span>
                    <span className="status-text">Conectada</span>
                </div>
            </div>

            {/* Container Principal do Chat */}
            <div className="chat-container">
                <div className="chat-history">
                    {messages.length === 0 && !isLoading && (
                        <div className="message assistant welcome-message">
                            Olá. Eu sou Tenebris. Caminho pela escuridão da mente humana para encontrar a luz. Qual medo assombra os seus pensamentos hoje? Estou aqui para ajudar.
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`message-wrapper ${msg.role}`}>
                            {msg.role === 'assistant' && (
                                <img src="https://img.magnific.com/fotos-gratis/renderizacao-de-icone-de-fantasma-de-desenho-animado-fofo_23-2152026177.jpg?semt=ais_hybrid&w=740&q=80" alt="Avatar Tenebris" className="mini-avatar" />
                            )}
                            <div className={`message ${msg.role}`}>
                                {msg.role === 'assistant' ? formatAIMessage(msg.content) : msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message-wrapper assistant">
                            <img src="https://img.magnific.com/fotos-gratis/renderizacao-de-icone-de-fantasma-de-desenho-animado-fofo_23-2152026177.jpg?semt=ais_hybrid&w=740&q=80" alt="Avatar Tenebris" className="mini-avatar thinking-avatar" />
                            <div className="message assistant thinking-box">
                                <div className="cyber-typing">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input fixado no final da tela */}
            <div className="input-container">
                <div className="input-area">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Descreva o que você está sentindo..."
                        disabled={isLoading}
                        rows="1"
                    />
                    <button
                        className="send-btn"
                        onClick={sendMessage}
                        disabled={isLoading || !prompt.trim()}
                        aria-label="Enviar mensagem"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}