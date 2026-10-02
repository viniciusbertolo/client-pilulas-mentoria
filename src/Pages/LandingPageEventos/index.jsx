// import "./index.css";
// import React, {
//   useEffect,
//   useRef,
//   useState
// } from "react";

// const API_URL = "https://backend-pilulas-mentoria.herokuapp.com";

// // Edite somente o conteúdo visual do evento aqui.
// // O preço real deve ser definido/validado no backend.
// const EVENTO = {
//   id: "evento-01",
//   tag: "EVENTO PRESENCIAL",
//   title: "Uma experiência para transformar conhecimento em prática",
//   description:
//     "Garanta seu ingresso para o próximo evento da Pílulas de Mentoria e viva uma experiência pensada para gerar conexão, aprendizado e ação.",
//   date: "15 de novembro de 2026",
//   time: "09h00 às 18h00",
//   location: "São Paulo • Local será enviado aos participantes",
//   seats: "Vagas limitadas",
//   benefits: [
//     "Acesso completo ao evento",
//     "Conteúdos e experiências exclusivas",
//     "Networking com outros participantes",
//     "Ingresso digital com QR Code enviado por e-mail",
//   ],
// };

// export default function LandingPageEventos() {
//   const [showModal, setShowModal] = useState(false);
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const checkoutWindowRef = useRef(null);
//   const pollTimerRef = useRef(null);





//   function openCheckout() {
//     setError("");
//     setShowModal(true);
//   }

//   function closeModal() {
//     if (!loading) {
//       setShowModal(false);
//       setError("");
//     }
//   }

//   // async function createCheckout(event) {
//   //   event.preventDefault();
//   //   setError("");

//   //   const normalizedEmail = email.trim().toLowerCase();

//   //   if (!normalizedEmail) {
//   //     setError("Digite seu e-mail para continuar.");
//   //     return;
//   //   }

//   //   if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
//   //     setError("Digite um e-mail válido.");
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);

//   //     const response = await fetch(`${API_URL}/api/events/create-checkout`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         email: normalizedEmail,
//   //         eventId: EVENTO.id,
//   //       }),
//   //     });

//   //     const data = await response.json().catch(() => ({}));

//   //     if (!response.ok || !data.url) {
//   //       throw new Error(data.message || "Não foi possível iniciar o checkout.");
//   //     }

//   //     const checkoutWindow = window.open(
//   //       data.url,
//   //       "_blank",
//   //       "noopener,noreferrer"
//   //     );

//   //     if (!checkoutWindow) {
//   //       window.location.href = data.url;
//   //     }
//   //   } catch (err) {
//   //     console.error("Erro ao criar checkout:", err);
//   //     setError(err.message || "Ocorreu um erro. Tente novamente.");
//   //     setLoading(false);
//   //   }
//   // }

//   async function createCheckout(event) {
//   event.preventDefault();

//   setError("");

//   const normalizedEmail = email
//     .trim()
//     .toLowerCase();

//   if (!normalizedEmail) {
//     setError("Digite seu e-mail para continuar.");
//     return;
//   }

//   if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
//     setError("Digite um e-mail válido.");
//     return;
//   }

//   // Abre a janela imediatamente, enquanto ainda estamos
//   // dentro do clique/submissão do usuário.
//   const checkoutWindow = window.open(
//     "",
//     "_blank"
//   );

//   if (!checkoutWindow) {
//     setError(
//       "Seu navegador bloqueou a abertura do checkout. Permita pop-ups para continuar."
//     );

//     return;
//   }

//   checkoutWindowRef.current = checkoutWindow;

//   // Mostra algo enquanto o Mercado Pago é preparado
//   checkoutWindow.document.write(`
//     <html>
//       <head>
//         <title>Pagamento</title>
//       </head>
//       <body style="
//         margin:0;
//         height:100vh;
//         display:flex;
//         align-items:center;
//         justify-content:center;
//         font-family:Arial,sans-serif;
//       ">
//         <p>Preparando pagamento...</p>
//       </body>
//     </html>
//   `);

//   try {
//     setLoading(true);

//     const response = await fetch(
//       `${API_URL}/api/events/create-checkout`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: normalizedEmail,
//           eventId: EVENTO.id,
//         }),
//       }
//     );

//     const data = await response
//       .json()
//       .catch(() => ({}));

//     if (!response.ok || !data.url) {
//       throw new Error(
//         data.message ||
//           "Não foi possível iniciar o checkout."
//       );
//     }

//     if (!data.externalReference) {
//       throw new Error(
//         "A referência do pagamento não foi criada."
//       );
//     }

//     // Agora envia a aba para o Mercado Pago
//     checkoutWindow.location.href = data.url;

//     // Começa a acompanhar o pagamento
//     startPaymentPolling(
//       data.externalReference
//     );

//     setLoading(false);

//   } catch (err) {
//     console.error(
//       "Erro ao criar checkout:",
//       err
//     );

//     checkoutWindow.close();

//     checkoutWindowRef.current = null;

//     setLoading(false);

//     setError(
//       err.message ||
//         "Ocorreu um erro. Tente novamente."
//     );
//   }
// }


//   function startPaymentPolling(reference) {
//   let attempts = 0;

//   const maxAttempts = 300; // 10 minutos
//   const intervalMs = 2000; // 2 segundos

//   pollTimerRef.current = setInterval(async () => {
//     attempts += 1;

//     try {
//       const response = await fetch(
//         `${API_URL}/api/events/status/${encodeURIComponent(
//           reference
//         )}`
//       );

//       if (!response.ok) {
//         return;
//       }

//       const data = await response.json();

//       console.log("Status do pagamento:", data);

//       // -----------------------------
//       // PAGAMENTO APROVADO
//       // -----------------------------

//       if (data.approved && data.paymentId) {
//         clearInterval(pollTimerRef.current);

//         if (
//           checkoutWindowRef.current &&
//           !checkoutWindowRef.current.closed
//         ) {
//           checkoutWindowRef.current.close();
//         }

//         window.location.href =
//           `/eventos/confirmacao?payment_id=${encodeURIComponent(
//             data.paymentId
//           )}`;

//         return;
//       }

//       // -----------------------------
//       // PAGAMENTO RECUSADO/CANCELADO
//       // -----------------------------

//       if (
//         data.status === "rejected" ||
//         data.status === "cancelled"
//       ) {
//         clearInterval(pollTimerRef.current);

//         if (
//           checkoutWindowRef.current &&
//           !checkoutWindowRef.current.closed
//         ) {
//           checkoutWindowRef.current.close();
//         }

//         window.location.href =
//           "/eventos?checkout=failure";

//         return;
//       }

//       // -----------------------------
//       // TIMEOUT
//       // -----------------------------

//       if (attempts >= maxAttempts) {
//         clearInterval(pollTimerRef.current);

//         checkoutWindowRef.current = null;

//         setLoading(false);

//         setError(
//           "Não conseguimos confirmar o pagamento automaticamente. Verifique seu e-mail ou tente novamente."
//         );
//       }

//     } catch (error) {
//       console.error(
//         "Erro ao verificar pagamento:",
//         error
//       );
//     }
//   }, intervalMs);
// }


// useEffect(() => {
//   return () => {
//     if (pollTimerRef.current) {
//       clearInterval(pollTimerRef.current);
//     }
//   };
// }, []);

//   return (
//     <main className="event-page">
//       <section className="event-hero">
//         <div className="event-glow event-glow-one" />
//         <div className="event-glow event-glow-two" />

//         <header className="event-header event-container">
//           <div className="event-brand">PÍLULAS<span>+</span></div>
//           <div className="event-header-badge">{EVENTO.seats}</div>
//         </header>

//         <div className="event-container event-hero-grid">
//           <div className="event-hero-copy">
//             <span className="event-eyebrow">{EVENTO.tag}</span>
//             <h1>{EVENTO.title}</h1>
//             <p className="event-lead">{EVENTO.description}</p>

//             <div className="event-meta-grid">
//               <div className="event-meta-card">
//                 <span>DATA</span>
//                 <strong>{EVENTO.date}</strong>
//               </div>
//               <div className="event-meta-card">
//                 <span>HORÁRIO</span>
//                 <strong>{EVENTO.time}</strong>
//               </div>
//               <div className="event-meta-card event-meta-card-wide">
//                 <span>LOCAL</span>
//                 <strong>{EVENTO.location}</strong>
//               </div>
//             </div>

//             <div className="event-actions">
//               <button className="event-primary-button" onClick={openCheckout}>
//                 Comprar ingresso
//                 <span aria-hidden="true">↗</span>
//               </button>
//               <span className="event-secure-note">Pagamento processado pelo Mercado Pago</span>
//             </div>
//           </div>

//           <aside className="event-ticket-card">
//             <div className="event-ticket-top">
//               <span>INGRESSO DIGITAL</span>
//               <span className="event-ticket-dot" />
//             </div>

//             <div className="event-ticket-line" />

//             <div className="event-ticket-content">
//               <span className="event-ticket-small">VOCÊ ESTÁ CONVIDADO</span>
//               <h2>{EVENTO.title}</h2>
//               <div className="event-ticket-info">
//                 <div>
//                   <span>DATA</span>
//                   <strong>{EVENTO.date}</strong>
//                 </div>
//                 <div>
//                   <span>LOCAL</span>
//                   <strong>{EVENTO.location}</strong>
//                 </div>
//               </div>
//             </div>

//             <div className="event-ticket-footer">
//               <span>Seu QR Code será enviado após a aprovação.</span>
//               <div className="event-ticket-squiggle" aria-hidden="true" />
//             </div>
//           </aside>
//         </div>
//       </section>

//       <section className="event-benefits">
//         <div className="event-container event-benefits-grid">
//           <div>
//             <span className="event-section-label">O QUE VOCÊ RECEBE</span>
//             <h2>Mais do que um ingresso.</h2>
//             <p>
//               Uma jornada completa, do pagamento à entrada. Depois da confirmação,
//               você recebe automaticamente seu ingresso digital por e-mail.
//             </p>
//           </div>

//           <div className="event-benefits-list">
//             {EVENTO.benefits.map((item, index) => (
//               <div className="event-benefit-item" key={item}>
//                 <span>{String(index + 1).padStart(2, "0")}</span>
//                 <p>{item}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="event-how">
//         <div className="event-container">
//           <div className="event-how-title">
//             <span className="event-section-label">COMO FUNCIONA</span>
//             <h2>Do clique ao ingresso.</h2>
//           </div>

//           <div className="event-steps">
//             <article>
//               <span>01</span>
//               <h3>Informe seu e-mail</h3>
//               <p>Use o e-mail que deverá receber o ingresso.</p>
//             </article>
//             <article>
//               <span>02</span>
//               <h3>Faça o pagamento</h3>
//               <p>O checkout abre no ambiente seguro do Mercado Pago.</p>
//             </article>
//             <article>
//               <span>03</span>
//               <h3>Receba o ingresso</h3>
//               <p>Após a aprovação, o ingresso com QR Code é enviado automaticamente.</p>
//             </article>
//           </div>
//         </div>
//       </section>

//       <footer className="event-footer">
//         <div className="event-container">
//           <span>PÍLULAS DE MENTORIA</span>
//           <p>Ingresso digital • Pagamento seguro • Confirmação automática</p>
//         </div>
//       </footer>

//       {showModal && (
//         <div className="event-modal-backdrop" onMouseDown={closeModal}>
//           <div className="event-modal" onMouseDown={(e) => e.stopPropagation()}>
//             <button className="event-modal-close" onClick={closeModal} disabled={loading} aria-label="Fechar">
//               ×
//             </button>

//             <span className="event-section-label">QUASE LÁ</span>
//             <h2>Onde devemos enviar seu ingresso?</h2>
//             <p>
//               Depois que o pagamento for aprovado, enviaremos automaticamente seu ingresso
//               e QR Code para este e-mail.
//             </p>

//             <form onSubmit={createCheckout}>
//               <label htmlFor="event-email">E-mail</label>
//               <input
//                 id="event-email"
//                 type="email"
//                 autoComplete="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="voce@email.com"
//                 disabled={loading}
//                 autoFocus
//               />

//               {error && <div className="event-form-error">{error}</div>}

//               <button className="event-primary-button event-modal-button" type="submit" disabled={loading}>
//                 {loading ? "Abrindo checkout…" : "Continuar para pagamento"}
//                 {!loading && <span aria-hidden="true">↗</span>}
//               </button>
//             </form>

//             <span className="event-modal-security">
//               Seu e-mail é usado apenas para criar o pagamento e enviar o ingresso.
//             </span>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }






import "./index.css";
import alexImage from "../../Assets/imgs/alex.webp";
import prova1Image from "../../Assets/imgs/prova_1.jpeg";
import prova2Image from "../../Assets/imgs/prova_2.jpeg";
import prova3Image from "../../Assets/imgs/prova_3.jpeg";
import prova4Image from "../../Assets/imgs/prova_4.jpeg";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

const API_URL =
  "https://backend-pilulas-mentoria.herokuapp.com";


const EVENTO = {
  id: "evento-01",
};



export default function LandingPageEventos() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkoutWindowRef = useRef(null);
  const pollTimerRef = useRef(null);

  function openCheckout() {
    setError("");
    setShowModal(true);
  }

  function closeModal() {
    if (!loading) {
      setShowModal(false);
      setError("");
    }
  }

  async function createCheckout(event) {
    event.preventDefault();

    setError("");

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      setError("Digite seu e-mail para continuar.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Digite um e-mail válido.");
      return;
    }

    const checkoutWindow = window.open("", "_blank");

    if (!checkoutWindow) {
      setError(
        "Seu navegador bloqueou a abertura do checkout. Permita pop-ups para continuar."
      );
      return;
    }

    checkoutWindowRef.current = checkoutWindow;

    checkoutWindow.document.write(`
      <html>
        <head>
          <title>Pagamento</title>
        </head>
        <body style="
          margin:0;
          height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          font-family:Arial,sans-serif;
          background:#031c28;
          color:#fff;
        ">
          <p>Preparando pagamento...</p>
        </body>
      </html>
    `);

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/events/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            eventId: EVENTO.id,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !data.url) {
        throw new Error(
          data.message ||
          "Não foi possível iniciar o checkout."
        );
      }

      if (!data.externalReference) {
        throw new Error(
          "A referência do pagamento não foi criada."
        );
      }

      checkoutWindow.location.href = data.url;

      startPaymentPolling(
        data.externalReference
      );

      setLoading(false);
      setShowModal(false);
    } catch (err) {
      console.error(
        "Erro ao criar checkout:",
        err
      );

      checkoutWindow.close();
      checkoutWindowRef.current = null;

      setLoading(false);

      setError(
        err.message ||
        "Ocorreu um erro. Tente novamente."
      );
    }
  }

  function startPaymentPolling(reference) {
    let attempts = 0;

    const maxAttempts = 300;
    const intervalMs = 2000;

    pollTimerRef.current = setInterval(
      async () => {
        attempts += 1;

        try {
          const response = await fetch(
            `${API_URL}/api/events/status/${encodeURIComponent(
              reference
            )}`
          );

          if (!response.ok) {
            return;
          }

          const data = await response.json();

          console.log(
            "Status do pagamento:",
            data
          );

          if (
            data.approved &&
            data.paymentId
          ) {
            clearInterval(
              pollTimerRef.current
            );

            if (
              checkoutWindowRef.current &&
              !checkoutWindowRef.current.closed
            ) {
              checkoutWindowRef.current.close();
            }

            window.location.href =
              `/eventos/confirmacao?payment_id=${encodeURIComponent(
                data.paymentId
              )}`;

            return;
          }

          if (
            data.status === "rejected" ||
            data.status === "cancelled"
          ) {
            clearInterval(
              pollTimerRef.current
            );

            if (
              checkoutWindowRef.current &&
              !checkoutWindowRef.current.closed
            ) {
              checkoutWindowRef.current.close();
            }

            window.location.href =
              "/eventos?checkout=failure";

            return;
          }

          if (attempts >= maxAttempts) {
            clearInterval(
              pollTimerRef.current
            );

            checkoutWindowRef.current = null;

            setLoading(false);

            setError(
              "Não conseguimos confirmar o pagamento automaticamente. Verifique seu e-mail ou tente novamente."
            );
          }
        } catch (error) {
          console.error(
            "Erro ao verificar pagamento:",
            error
          );
        }
      },
      intervalMs
    );
  }

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(
          pollTimerRef.current
        );
      }
    };
  }, []);

  return (
    <main className="ndx-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="ndx-hero">

        <div className="ndx-hero-top">

          <div className="ndx-hero-glow ndx-hero-glow-left" />
          <div className="ndx-hero-glow ndx-hero-glow-right" />

          <div className="ndx-logo-wrap">

            <div className="ndx-logo-small">
              imersão
            </div>

            <div className="ndx-logo-main">
              NDX
            </div>

            <div className="ndx-logo-sub">
              + a Nova PNL
            </div>

          </div>
        </div>

        <div className="ndx-title-strip">
          Neuromarketing Digital Experience
        </div>

        <div className="ndx-hero-message">

          <div className="ndx-content">

            <span className="ndx-overline">
              IMERSÃO PRESENCIAL
            </span>

            <h1>
              A maior imersão do Brasil sobre vendas,
              marketing, comunicação estratégica e
              comportamento dos clientes!
            </h1>

            <p>
              Uma experiência para quem quer compreender
              o novo comportamento do consumidor e
              transformar conhecimento em estratégias de
              resultados e muito sucesso!
            </p>

            <button
              className="ndx-cta ndx-cta-primary"
              onClick={openCheckout}
            >
              Quero meu ingresso
              <span>↗</span>
            </button>

          </div>

        </div>
      </section>


      {/* =====================================================
          URGENCY
      ===================================================== */}

      <section className="ndx-urgency">

        <div className="ndx-content ndx-urgency-inner">

          <div>
            <span>
              UMA EXPERIÊNCIA DIFERENTE
            </span>

            <strong>
              12 horas de imersão, prática e estratégia
            </strong>
          </div>

          <button
            className="ndx-cta ndx-cta-small"
            onClick={openCheckout}
          >
            Garantir ingresso
            <span>↗</span>
          </button>

        </div>
      </section>


      {/* =====================================================
          QUESTIONS
      ===================================================== */}

      <section className="ndx-white-section ndx-questions">

        <div className="ndx-content">

          <div className="ndx-section-intro">

            <span>
              VOCÊ ESTÁ PREPARADO?
            </span>

            <h2>
              O mercado mudou.
              <br />
              E você precisa mudar com ele.
            </h2>

          </div>

          <div className="ndx-question-grid">

            <article className="ndx-question-card">

              <div className="ndx-question-number">
                01
              </div>

              <p>
                Você está{" "}
                <strong>preparado</strong> para os{" "}
                <strong>desafios</strong> dos próximos anos?
              </p>

              <span>
                96% dos profissionais e empresas afirmam
                que <strong>não!</strong>
              </span>

            </article>

            <article className="ndx-question-card">

              <div className="ndx-question-number">
                02
              </div>

              <p>
                Você consegue{" "}
                <strong>entender</strong> perfeitamente
                os <strong>movimentos</strong>, tendências,
                a mentalidade e os comportamentos dos
                clientes?
              </p>

              <span>
                87% dizem estar{" "}
                <strong>confusos</strong> e não saber como agir.
              </span>

            </article>

            <article className="ndx-question-card">

              <div className="ndx-question-number">
                03
              </div>

              <p>
                Você sabe como criar{" "}
                <strong>estratégias eficazes</strong> de
                comunicação, marketing e vendas através da
                Inteligência Empática e direcionada para
                aumentar a <strong>atração</strong> de clientes?
              </p>

              <span>
                97% dizem que utilizam velhas{" "}
                <strong>fórmulas</strong> ou apelam para a IA.
              </span>

            </article>

            <article className="ndx-question-card">

              <div className="ndx-question-number">
                04
              </div>

              <p>
                Quantos profissionais e empresas estão se{" "}
                <strong>preparando</strong> mais e melhor do
                que você... <strong>agora</strong>, neste exato
                momento e se tornando mais competitivos?
              </p>

              <span>
                91% dizem que não estudam algo,
                <strong> realmente</strong>, inovador e têm
                dificuldades para colocar em{" "}
                <strong>prática</strong> suas estratégias.
              </span>

            </article>

          </div>

          <div className="ndx-section-cta">

            <p>
              O mercado já mudou.
              <strong>
                {" "}A pergunta é se você está pronto.
              </strong>
            </p>

            <button
              className="ndx-cta"
              onClick={openCheckout}
            >
              Eu quero estar à frente
              <span>↗</span>
            </button>

          </div>

        </div>
      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="ndx-dark-section ndx-intro">

        <div className="ndx-content ndx-intro-grid">

          <div className="ndx-intro-copy">

            <span className="ndx-dark-label">
              IMERSÃO NDX + PNL
            </span>

            <h2>
              A Neurociência por trás das
              estratégias de sucesso!
            </h2>

            <p>
              O mercado mudou! A mentalidade e os
              comportamentos mudaram! Os clientes mudaram
              e irão mudar ainda mais! Suas decisões mudaram!
            </p>

            <p className="ndx-intro-highlight">
              Você não pode mais esperar!
            </p>

            <p>
              Não basta entender técnicas de vendas ou
              criar estratégias, se você não entende como
              as pessoas pensam, decidem e compram.
            </p>

            <button
              className="ndx-cta ndx-cta-primary"
              onClick={openCheckout}
            >
              Quero participar da imersão
              <span>↗</span>
            </button>

          </div>

          {/* <div className="ndx-intro-card">

            <div className="ndx-intro-card-top">
              NEUROMARKETING DIGITAL EXPERIENCE
            </div>

            <div className="ndx-intro-card-big">
              NDX
            </div>

            <div className="ndx-intro-card-bottom">
              + a Nova PNL
            </div>

          </div> */}

        </div>
      </section>


      {/* =====================================================
          EVENT DESCRIPTION
      ===================================================== */}

      <section className="ndx-white-section ndx-event-description">

        <div className="ndx-content">

          <div className="ndx-section-heading centered">

            <span>
              O QUE VOCÊ VAI VIVER
            </span>

            <h2>
              Uma experiência completa,
              prática e transformadora.
            </h2>

          </div>

          <div className="ndx-description-lead">

            <p>
              A{" "}
              <strong>
                Imersão NDX + PNL: A Neurociência por trás
                das estratégias de sucesso!
              </strong>{" "}
              foi criada para profissionais que querem
              compreender os mecanismos por trás das
              decisões e desenvolver a Inteligência Empática,
              conectando neurociência, Neuromarketing e PNL
              às armas da persuasão que geram as estratégias
              por trás das tendências, da mentalidade e do
              comportamento que atraem os clientes, em uma
              imersão completa, com experiências
              diferenciadas, prática e transformadora.
            </p>

            <p>
              Durante as 12 horas de evento, com o
              pesquisador neurocientista e um dos
              precursores do tema no mundo, Alex Born,
              você vai descobrir ferramentas, técnicas e
              abordagens que ampliam a visão sobre como os
              clientes tomam decisões e irá aprender o que há
              de mais novo e consolidado em estratégias que
              utilizam:
            </p>

          </div>

          <div className="ndx-topic-grid">

            <article>
              <span>01</span>
              <strong>
                Arquéti​pos e Gatilhos Mentais
              </strong>
            </article>

            <article>
              <span>02</span>
              <strong>
                Marketing e Prospecção com Ganchos de Atenção
              </strong>
            </article>

            <article>
              <span>03</span>
              <strong>
                Abordagens Concatenadas com Atração de Impacto
              </strong>
            </article>

            <article>
              <span>04</span>
              <strong>
                Negociação com PITCH DE VENDAS
              </strong>
            </article>

            <article>
              <span>05</span>
              <strong>
                Fechamentos com CTAs e LTPs
              </strong>
            </article>

            <article>
              <span>06</span>
              <strong>
                Neuromarketing, PNL (Neurolinguística),
                a ciência do Medo e seus impactos nas decisões,
                Neurovendas e psicologia do consumo.
              </strong>
            </article>

          </div>

          <div className="ndx-practice">

            <div>

              <span>
                EXPERIÊNCIA PRÁTICA
              </span>

              <h3>
                E muitas atividades práticas,
                com testes, dinâmicas e simulações.
              </h3>

            </div>

            <button
              className="ndx-cta"
              onClick={openCheckout}
            >
              Garantir minha vaga
              <span>↗</span>
            </button>

          </div>

        </div>
      </section>


      {/* =====================================================
          PALESTRANTE
      ===================================================== */}

      <section className="ndx-speaker">

        <div className="ndx-speaker-card">

          <div className="ndx-speaker-copy">

            <div className="ndx-speaker-label">
              <span />
              LIDERANÇA
            </div>

            <h2>
              Alex Born
            </h2>

            <h3>
              Presidente do Instituto Agrogestor
            </h3>

            <div className="ndx-speaker-text">

              <p>
                Professor, pesquisador neurocientista,
                escritor, consultor e palestrante. Referência
                global em Neuromarketing e comportamento
                humano, Alex Born é considerado{" "}
                <strong>
                  um dos cinco maiores especialistas do mundo
                </strong>{" "}
                no tema, com atuação consolidada em 23 países.
              </p>

              <p>
                Com{" "}
                <strong>
                  mais de 1.2 milhão de espectadores
                </strong>{" "}
                e{" "}
                <strong>
                  600 empresas atendidas
                </strong>{" "}
                (incluindo gigantes como BASF, Bayer e
                Siemens), sua trajetória é marcada por
                resultados extraordinários e uma aprovação
                média de 9,92 ao longo de 20 anos.
              </p>

              <p>
                Autor de 11 livros, ele unifica ciência e
                mercado para transformar mentalidades e
                potencializar liderança, vendas e negociação.
                Sua credibilidade é chancelada por formações
                em instituições de elite como{" "}
                <strong>
                  Harvard, Yale e Princeton
                </strong>
                , além de ter sido um dos estrategistas por
                trás de eventos globais como a Copa do Mundo
                de 2014 e Olimpíadas 2016.
              </p>

            </div>

            <blockquote>
              "Entrega métodos validados que convertem
              conhecimento técnico em comportamento do
              consumidor e alto desempenho corporativo,
              voltados diretamente para profissionais do
              agronegócio."
            </blockquote>

            {/* <button
              className="ndx-cta ndx-cta-primary"
              onClick={openCheckout}
            >
              Quero participar com Alex Born
              <span>↗</span>
            </button> */}

          </div>


          <div className="ndx-speaker-image">

            <img
              src={alexImage}
              alt="Alex Born"
            />

            <div className="ndx-speaker-image-overlay" />

          </div>

        </div>

      </section>


      {/* =====================================================
          FRONT
      ===================================================== */}

      <section className="ndx-front">

        <div className="ndx-content">

          <div className="ndx-front-heading">

            <span>
              VOCÊ À FRENTE...
            </span>

            <h2>
              A arte da estratégia é você
              estar à frente.
            </h2>

          </div>

          <div className="ndx-front-grid">

            <div>

              <p>
                Não é apenas mais um curso ou um treinamento,
                mas uma imersão completa e impactante, que lhe
                apresenta a oportunidade de se diferenciar no
                mercado, se fortalecer para os desafios e sair
                do evento com estratégias altamente eficazes
                e direcionadas para o sucesso da sua empresa
                e vida profissional.
              </p>

              <p>
                A arte da estratégia é você estar à frente,
                chegar antes e ser referência quando todos
                começarem a chegar!
              </p>

              <p className="ndx-front-highlight">
                O mundo mudou e não espera!
                <br />
                <strong>
                  Você também não!
                </strong>
              </p>

            </div>

            <aside className="ndx-front-quote">

              <span>
                IMERSÃO NDX + PNL
              </span>

              <strong>
                Você à frente do mundo!
              </strong>

              <button
                className="ndx-cta ndx-cta-primary"
                onClick={openCheckout}
              >
                Quero meu ingresso
                <span>↗</span>
              </button>

            </aside>

          </div>

        </div>
      </section>


      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <section className="ndx-testimonials">

        <div className="ndx-content">

          <div className="ndx-social-proof-header">
            <span>
              APROVAÇÃO NOTA MÁXIMA
            </span>

            <h2>
              Os nossos clientes aprovam
            </h2>

            <p>
              Uma experiência que transforma conhecimento
              em novas formas de pensar, decidir e agir.
            </p>
          </div>

          <div className="ndx-social-proof-grid">

            <div className="ndx-social-proof-item">
              <img
                src={prova1Image}
                alt="Depoimento de cliente"
              />
            </div>

            <div className="ndx-social-proof-item">
              <img
                src={prova2Image}
                alt="Depoimento de cliente"
              />
            </div>

            <div className="ndx-social-proof-item">
              <img
                src={prova3Image}
                alt="Depoimento de cliente"
              />
            </div>

            <div className="ndx-social-proof-item">
              <img
                src={prova4Image}
                alt="Depoimento de cliente"
              />
            </div>

          </div>

          <div className="ndx-social-proof-cta">

            <button
              className="ndx-cta ndx-cta-primary"
              onClick={openCheckout}
            >
              Quero viver essa experiência
              <span>↗</span>
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          CLOSING
      ===================================================== */}

      <section className="ndx-hero">

        <div className="ndx-hero-top">

          <div className="ndx-hero-glow ndx-hero-glow-left" />
          <div className="ndx-hero-glow ndx-hero-glow-right" />

          <div className="ndx-logo-wrap">

            <div className="ndx-logo-small">
              imersão
            </div>

            <div className="ndx-logo-main">
              NDX
            </div>

            <div className="ndx-logo-sub">
              + a Nova PNL
            </div>

          </div>
        </div>

        <div className="ndx-title-strip">
          Neuromarketing Digital Experience
        </div>

        <div className="ndx-hero-message">

          <div className="ndx-content">

            <span className="ndx-overline">
              IMERSÃO PRESENCIAL
            </span>

            <h1>
              A maior imersão do Brasil sobre vendas,
              marketing, comunicação estratégica e
              comportamento dos clientes!
            </h1>

            <p>
              Uma experiência para quem quer compreender
              o novo comportamento do consumidor e
              transformar conhecimento em estratégias de
              resultados e muito sucesso!
            </p>

            <button
              className="ndx-cta ndx-cta-primary"
              onClick={openCheckout}
            >
              Quero meu ingresso
              <span>↗</span>
            </button>

          </div>

        </div>
      </section>


      {/* =====================================================
          FLOATING CTA
      ===================================================== */}

      <div className="ndx-floating-cta">

        <div>

          <span>
            IMERSÃO NDX + PNL
          </span>

          <strong>
            Garanta sua experiência
          </strong>

        </div>

        <button
          className="ndx-cta ndx-cta-small"
          onClick={openCheckout}
        >
          Comprar ingresso
          <span>↗</span>
        </button>

      </div>


      {/* =====================================================
          MODAL
      ===================================================== */}

      {showModal && (
        <div
          className="ndx-modal-backdrop"
          onMouseDown={closeModal}
        >

          <div
            className="ndx-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="ndx-modal-close"
              onClick={closeModal}
              disabled={loading}
              aria-label="Fechar"
            >
              ×
            </button>

            <span className="ndx-modal-label">
              QUASE LÁ
            </span>

            <h2>
              Onde devemos enviar
              seu ingresso?
            </h2>

            <p>
              Depois que o pagamento for aprovado,
              enviaremos automaticamente seu ingresso e
              QR Code para este e-mail.
            </p>

            <form onSubmit={createCheckout}>

              <label htmlFor="event-email">
                E-mail
              </label>

              <input
                id="event-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="voce@email.com"
                disabled={loading}
                autoFocus
              />

              {error && (
                <div className="ndx-form-error">
                  {error}
                </div>
              )}

              <button
                className="ndx-modal-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Abrindo checkout…"
                  : "Continuar para pagamento"}

                {!loading && (
                  <span>
                    ↗
                  </span>
                )}
              </button>

            </form>

            <span className="ndx-modal-security">
              Seu e-mail é usado apenas para criar o
              pagamento e enviar o ingresso.
            </span>

          </div>

        </div>
      )}

    </main>
  );
}