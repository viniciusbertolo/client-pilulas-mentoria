import "./index.css";
import React, {
  useEffect,
  useRef,
  useState
} from "react";

const API_URL = "https://backend-pilulas-mentoria.herokuapp.com";

// Edite somente o conteúdo visual do evento aqui.
// O preço real deve ser definido/validado no backend.
const EVENTO = {
  id: "evento-01",
  tag: "EVENTO PRESENCIAL",
  title: "Uma experiência para transformar conhecimento em prática",
  description:
    "Garanta seu ingresso para o próximo evento da Pílulas de Mentoria e viva uma experiência pensada para gerar conexão, aprendizado e ação.",
  date: "15 de novembro de 2026",
  time: "09h00 às 18h00",
  location: "São Paulo • Local será enviado aos participantes",
  seats: "Vagas limitadas",
  benefits: [
    "Acesso completo ao evento",
    "Conteúdos e experiências exclusivas",
    "Networking com outros participantes",
    "Ingresso digital com QR Code enviado por e-mail",
  ],
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

  // async function createCheckout(event) {
  //   event.preventDefault();
  //   setError("");

  //   const normalizedEmail = email.trim().toLowerCase();

  //   if (!normalizedEmail) {
  //     setError("Digite seu e-mail para continuar.");
  //     return;
  //   }

  //   if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
  //     setError("Digite um e-mail válido.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const response = await fetch(`${API_URL}/api/events/create-checkout`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: normalizedEmail,
  //         eventId: EVENTO.id,
  //       }),
  //     });

  //     const data = await response.json().catch(() => ({}));

  //     if (!response.ok || !data.url) {
  //       throw new Error(data.message || "Não foi possível iniciar o checkout.");
  //     }

  //     const checkoutWindow = window.open(
  //       data.url,
  //       "_blank",
  //       "noopener,noreferrer"
  //     );

  //     if (!checkoutWindow) {
  //       window.location.href = data.url;
  //     }
  //   } catch (err) {
  //     console.error("Erro ao criar checkout:", err);
  //     setError(err.message || "Ocorreu um erro. Tente novamente.");
  //     setLoading(false);
  //   }
  // }

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

  // Abre a janela imediatamente, enquanto ainda estamos
  // dentro do clique/submissão do usuário.
  const checkoutWindow = window.open(
    "",
    "_blank"
  );

  if (!checkoutWindow) {
    setError(
      "Seu navegador bloqueou a abertura do checkout. Permita pop-ups para continuar."
    );

    return;
  }

  checkoutWindowRef.current = checkoutWindow;

  // Mostra algo enquanto o Mercado Pago é preparado
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

    // Agora envia a aba para o Mercado Pago
    checkoutWindow.location.href = data.url;

    // Começa a acompanhar o pagamento
    startPaymentPolling(
      data.externalReference
    );

    setLoading(false);

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

  const maxAttempts = 300; // 10 minutos
  const intervalMs = 2000; // 2 segundos

  pollTimerRef.current = setInterval(async () => {
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

      console.log("Status do pagamento:", data);

      // -----------------------------
      // PAGAMENTO APROVADO
      // -----------------------------

      if (data.approved && data.paymentId) {
        clearInterval(pollTimerRef.current);

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

      // -----------------------------
      // PAGAMENTO RECUSADO/CANCELADO
      // -----------------------------

      if (
        data.status === "rejected" ||
        data.status === "cancelled"
      ) {
        clearInterval(pollTimerRef.current);

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

      // -----------------------------
      // TIMEOUT
      // -----------------------------

      if (attempts >= maxAttempts) {
        clearInterval(pollTimerRef.current);

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
  }, intervalMs);
}


useEffect(() => {
  return () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
    }
  };
}, []);

  return (
    <main className="event-page">
      <section className="event-hero">
        <div className="event-glow event-glow-one" />
        <div className="event-glow event-glow-two" />

        <header className="event-header event-container">
          <div className="event-brand">PÍLULAS<span>+</span></div>
          <div className="event-header-badge">{EVENTO.seats}</div>
        </header>

        <div className="event-container event-hero-grid">
          <div className="event-hero-copy">
            <span className="event-eyebrow">{EVENTO.tag}</span>
            <h1>{EVENTO.title}</h1>
            <p className="event-lead">{EVENTO.description}</p>

            <div className="event-meta-grid">
              <div className="event-meta-card">
                <span>DATA</span>
                <strong>{EVENTO.date}</strong>
              </div>
              <div className="event-meta-card">
                <span>HORÁRIO</span>
                <strong>{EVENTO.time}</strong>
              </div>
              <div className="event-meta-card event-meta-card-wide">
                <span>LOCAL</span>
                <strong>{EVENTO.location}</strong>
              </div>
            </div>

            <div className="event-actions">
              <button className="event-primary-button" onClick={openCheckout}>
                Comprar ingresso
                <span aria-hidden="true">↗</span>
              </button>
              <span className="event-secure-note">Pagamento processado pelo Mercado Pago</span>
            </div>
          </div>

          <aside className="event-ticket-card">
            <div className="event-ticket-top">
              <span>INGRESSO DIGITAL</span>
              <span className="event-ticket-dot" />
            </div>

            <div className="event-ticket-line" />

            <div className="event-ticket-content">
              <span className="event-ticket-small">VOCÊ ESTÁ CONVIDADO</span>
              <h2>{EVENTO.title}</h2>
              <div className="event-ticket-info">
                <div>
                  <span>DATA</span>
                  <strong>{EVENTO.date}</strong>
                </div>
                <div>
                  <span>LOCAL</span>
                  <strong>{EVENTO.location}</strong>
                </div>
              </div>
            </div>

            <div className="event-ticket-footer">
              <span>Seu QR Code será enviado após a aprovação.</span>
              <div className="event-ticket-squiggle" aria-hidden="true" />
            </div>
          </aside>
        </div>
      </section>

      <section className="event-benefits">
        <div className="event-container event-benefits-grid">
          <div>
            <span className="event-section-label">O QUE VOCÊ RECEBE</span>
            <h2>Mais do que um ingresso.</h2>
            <p>
              Uma jornada completa, do pagamento à entrada. Depois da confirmação,
              você recebe automaticamente seu ingresso digital por e-mail.
            </p>
          </div>

          <div className="event-benefits-list">
            {EVENTO.benefits.map((item, index) => (
              <div className="event-benefit-item" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="event-how">
        <div className="event-container">
          <div className="event-how-title">
            <span className="event-section-label">COMO FUNCIONA</span>
            <h2>Do clique ao ingresso.</h2>
          </div>

          <div className="event-steps">
            <article>
              <span>01</span>
              <h3>Informe seu e-mail</h3>
              <p>Use o e-mail que deverá receber o ingresso.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Faça o pagamento</h3>
              <p>O checkout abre no ambiente seguro do Mercado Pago.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Receba o ingresso</h3>
              <p>Após a aprovação, o ingresso com QR Code é enviado automaticamente.</p>
            </article>
          </div>
        </div>
      </section>

      <footer className="event-footer">
        <div className="event-container">
          <span>PÍLULAS DE MENTORIA</span>
          <p>Ingresso digital • Pagamento seguro • Confirmação automática</p>
        </div>
      </footer>

      {showModal && (
        <div className="event-modal-backdrop" onMouseDown={closeModal}>
          <div className="event-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="event-modal-close" onClick={closeModal} disabled={loading} aria-label="Fechar">
              ×
            </button>

            <span className="event-section-label">QUASE LÁ</span>
            <h2>Onde devemos enviar seu ingresso?</h2>
            <p>
              Depois que o pagamento for aprovado, enviaremos automaticamente seu ingresso
              e QR Code para este e-mail.
            </p>

            <form onSubmit={createCheckout}>
              <label htmlFor="event-email">E-mail</label>
              <input
                id="event-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                disabled={loading}
                autoFocus
              />

              {error && <div className="event-form-error">{error}</div>}

              <button className="event-primary-button event-modal-button" type="submit" disabled={loading}>
                {loading ? "Abrindo checkout…" : "Continuar para pagamento"}
                {!loading && <span aria-hidden="true">↗</span>}
              </button>
            </form>

            <span className="event-modal-security">
              Seu e-mail é usado apenas para criar o pagamento e enviar o ingresso.
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
