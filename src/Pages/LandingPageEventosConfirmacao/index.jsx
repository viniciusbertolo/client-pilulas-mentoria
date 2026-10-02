// import React, { useEffect, useMemo, useState } from "react";
// import { QRCodeSVG } from "qrcode.react";
// import { Link } from "react-router-dom";
// import "./index.css";

// const API_URL = "https://backend-pilulas-mentoria.herokuapp.com";

// export default function LandingPageEventosConfirmacao() {
//   const [status, setStatus] = useState("loading");
//   const [ticket, setTicket] = useState(null);
//   const [error, setError] = useState("");

//   const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
//   const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id");
//   const paymentStatus = searchParams.get("status") || searchParams.get("collection_status");

//   useEffect(() => {
//     async function loadPayment() {
//       if (!paymentId) {
//         setStatus(paymentStatus === "pending" ? "pending" : "error");
//         setError("Não encontramos os dados do pagamento nesta URL.");
//         return;
//       }

//       try {
//         const response = await fetch(`${API_URL}/api/events/payment/${encodeURIComponent(paymentId)}`);
//         const data = await response.json().catch(() => ({}));

//         if (!response.ok || !data.approved) {
//           if (data.status === "pending" || paymentStatus === "pending") {
//             setStatus("pending");
//             return;
//           }

//           throw new Error(data.message || "O pagamento ainda não foi aprovado.");
//         }

//         setTicket(data);
//         setStatus("success");
//       } catch (err) {
//         console.error("Erro ao validar pagamento:", err);
//         setError(err.message || "Não foi possível confirmar seu ingresso agora.");
//         setStatus("error");
//       }
//     }

//     loadPayment();
//   }, [paymentId, paymentStatus]);

//   const qrValue = ticket?.qrPayload || "";

//   return (
//     <main className="event-confirm-page">
//       <div className="confirm-orb confirm-orb-one" />
//       <div className="confirm-orb confirm-orb-two" />

//       <div className="confirm-shell">
//         <div className="confirm-brand">PÍLULAS<span>+</span></div>

//         {status === "loading" && (
//           <section className="confirm-card confirm-loading">
//             <div className="confirm-spinner" />
//             <span className="confirm-eyebrow">AGUARDE UM MOMENTO</span>
//             <h1>Confirmando seu pagamento…</h1>
//             <p>Estamos validando o pagamento com o Mercado Pago.</p>
//           </section>
//         )}

//         {status === "success" && ticket && (
//           <section className="confirm-card">
//             <div className="confirm-success-mark">✓</div>
//             <span className="confirm-eyebrow">PAGAMENTO APROVADO</span>
//             <h1>Seu ingresso está confirmado.</h1>
//             <p>
//               Tudo certo. Enviamos uma cópia do seu ingresso para <strong>{ticket.email}</strong>.
//             </p>

//             <div className="confirm-ticket">
//               <div className="confirm-ticket-copy">
//                 <span>INGRESSO DIGITAL</span>
//                 <strong>{ticket.eventName || "Evento Pílulas"}</strong>
//                 <small>Código: {ticket.ticketCode}</small>
//                 <small>Pagamento: {ticket.paymentId}</small>
//               </div>

//               <div className="confirm-qr-wrap">
//                 {qrValue && <QRCodeSVG value={qrValue} size={176} level="M" includeMargin />}
//                 <span>Apresente este QR Code na entrada.</span>
//               </div>
//             </div>

//             <div className="confirm-actions">
//               <Link className="confirm-secondary-button" to="/">
//                 Voltar para o início
//               </Link>
//             </div>

//             <p className="confirm-note">
//               O e-mail é enviado automaticamente após a aprovação. Confira também sua pasta de spam ou promoções.
//             </p>
//           </section>
//         )}

//         {status === "pending" && (
//           <section className="confirm-card">
//             <div className="confirm-pending-mark">…</div>
//             <span className="confirm-eyebrow">PAGAMENTO PENDENTE</span>
//             <h1>Seu pagamento está sendo processado.</h1>
//             <p>
//               O Mercado Pago ainda não confirmou a aprovação. Assim que o pagamento for aprovado,
//               o ingresso será enviado para o e-mail informado no checkout.
//             </p>
//             <div className="confirm-actions">
//               <button className="confirm-secondary-button" onClick={() => window.location.reload()}>
//                 Atualizar status
//               </button>
//             </div>
//           </section>
//         )}

//         {status === "error" && (
//           <section className="confirm-card">
//             <div className="confirm-error-mark">!</div>
//             <span className="confirm-eyebrow">NÃO FOI POSSÍVEL CONFIRMAR</span>
//             <h1>Vamos verificar seu pagamento.</h1>
//             <p>{error}</p>
//             <div className="confirm-actions">
//               <button className="confirm-secondary-button" onClick={() => window.location.reload()}>
//                 Tentar novamente
//               </button>
//               <Link className="confirm-secondary-button" to="/eventos">
//                 Voltar para o evento
//               </Link>
//             </div>
//           </section>
//         )}
//       </div>
//     </main>
//   );
// }


import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";

import "./index.css";

const API_URL =
  "https://backend-pilulas-mentoria.herokuapp.com";

export default function LandingPageEventosConfirmacao() {
  const [status, setStatus] = useState("loading");
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  const searchParams = useMemo(
    () =>
      new URLSearchParams(
        window.location.search
      ),
    []
  );

  const paymentId =
    searchParams.get("payment_id") ||
    searchParams.get("collection_id");

  const paymentStatus =
    searchParams.get("status") ||
    searchParams.get("collection_status");

  useEffect(() => {
    async function loadPayment() {
      if (!paymentId) {
        setStatus(
          paymentStatus === "pending"
            ? "pending"
            : "error"
        );

        setError(
          "Não encontramos os dados do pagamento nesta URL."
        );

        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/events/payment/${encodeURIComponent(
            paymentId
          )}`
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok || !data.approved) {
          if (
            data.status === "pending" ||
            paymentStatus === "pending"
          ) {
            setStatus("pending");
            return;
          }

          throw new Error(
            data.message ||
              "O pagamento ainda não foi aprovado."
          );
        }

        setTicket(data);
        setStatus("success");
      } catch (err) {
        console.error(
          "Erro ao validar pagamento:",
          err
        );

        setError(
          err.message ||
            "Não foi possível confirmar seu ingresso agora."
        );

        setStatus("error");
      }
    }

    loadPayment();
  }, [paymentId, paymentStatus]);

  const qrValue =
    ticket?.qrPayload || "";

  return (
    <main className="ndx-confirm-page">

      {/* =====================================================
          HERO — MESMA LINGUAGEM DA LANDING
      ===================================================== */}

      <section className="ndx-hero-conf">

        <div className="ndx-hero-top-conf">

          <div className="ndx-hero-glow ndx-hero-glow-left" />
          <div className="ndx-hero-glow ndx-hero-glow-right" />

          <div className="ndx-logo-wrap-conf">

            <div className="ndx-logo-small-conf">
              imersão
            </div>

            <div className="ndx-logo-main-conf">
              NDX
            </div>

            <div className="ndx-logo-sub-conf">
              + a Nova PNL
            </div>

          </div>
        </div>

       

        
      </section>


      {/* =====================================================
          CONTEÚDO DA CONFIRMAÇÃO
      ===================================================== */}

      <section className="ndx-confirm-section">

        {/* ===================================================
            LOADING
        =================================================== */}

        {status === "loading" && (
          <div className="ndx-confirm-state-card">

            <div className="ndx-state-icon ndx-loading-icon">
              <div className="ndx-spinner" />
            </div>

            <span className="ndx-state-label">
              AGUARDE UM MOMENTO
            </span>

            <h1>
              Confirmando seu pagamento…
            </h1>

            <p>
              Estamos validando o pagamento com o Mercado Pago.
            </p>

          </div>
        )}


        {/* ===================================================
            SUCCESS
        =================================================== */}

        {status === "success" && ticket && (
          <div className="ndx-confirm-success">

            {/* HEADER DA CONFIRMAÇÃO */}

            <div className="ndx-confirm-success-header">

              <div className="ndx-success-icon">
                ✓
              </div>

              <div>

                <span className="ndx-state-label">
                  PAGAMENTO APROVADO
                </span>

                <h1>
                  Seu ingresso está confirmado.
                </h1>

                <p>
                  Tudo certo. Enviamos uma cópia do seu
                  ingresso para{" "}
                  <strong>
                    {ticket.email}
                  </strong>
                  .
                </p>

              </div>

            </div>


            {/* =================================================
                RESUMO DO EVENTO
            ================================================= */}

            <div className="ndx-event-summary">

              <div>
                <span>
                  SEU EVENTO
                </span>

                <strong>
                  {ticket.eventName ||
                    "Evento Pílulas"}
                </strong>
              </div>

              <div>
                <span>
                  STATUS
                </span>

                <strong className="ndx-status-approved">
                  PAGAMENTO APROVADO
                </strong>
              </div>

            </div>


            {/* =================================================
                INGRESSO
            ================================================= */}

            <div className="ndx-ticket">

              <div className="ndx-ticket-information">

                <span className="ndx-ticket-eyebrow">
                  INGRESSO DIGITAL
                </span>

                <h2>
                  {ticket.eventName ||
                    "Evento Pílulas"}
                </h2>

                <div className="ndx-ticket-divider" />

                <div className="ndx-ticket-meta">

                  <div>
                    <span>
                      DATA
                    </span>

                    <strong>
                      {ticket.date ||
                        "Confira seu ingresso"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      HORÁRIO
                    </span>

                    <strong>
                      {ticket.time ||
                        "Confira seu ingresso"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      LOCAL
                    </span>

                    <strong>
                      {ticket.location ||
                        "Confira seu ingresso"}
                    </strong>
                  </div>

                </div>

                <div className="ndx-ticket-code">

                  <span>
                    CÓDIGO DO INGRESSO
                  </span>

                  <strong>
                    {ticket.ticketCode}
                  </strong>

                </div>

                <div className="ndx-ticket-payment">

                  <span>
                    PAGAMENTO
                  </span>

                  <strong>
                    {ticket.paymentId}
                  </strong>

                </div>

              </div>


              {/* =================================================
                  QR
              ================================================= */}

              <div className="ndx-ticket-qr">

                <div className="ndx-qr-box">

                  {qrValue && (
                    <QRCodeSVG
                      value={qrValue}
                      size={220}
                      level="M"
                      includeMargin
                    />
                  )}

                </div>

                <strong>
                  Apresente este QR Code na entrada.
                </strong>

                <span>
                  Seu ingresso digital também foi enviado
                  para o seu e-mail.
                </span>

              </div>

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="ndx-email-confirmation">

              <div className="ndx-email-check">
                ✓
              </div>

              <div>

                <span>
                  INGRESSO ENVIADO PARA
                </span>

                <strong>
                  {ticket.email}
                </strong>

                <p>
                  Confira também sua pasta de spam ou promoções.
                </p>

              </div>

            </div>


            {/* =================================================
                AÇÕES
            ================================================= */}

            <div className="ndx-confirm-actions">

              <Link
                className="ndx-main-button"
                to="/"
              >
                Voltar para o início
                <span>↗</span>
              </Link>

            </div>


            <div className="ndx-confirm-bottom-note">
              <span>
                INGRESSO DIGITAL • PAGAMENTO SEGURO • CONFIRMAÇÃO AUTOMÁTICA
              </span>
            </div>

          </div>
        )}


        {/* ===================================================
            PENDING
        =================================================== */}

        {status === "pending" && (
          <div className="ndx-confirm-state-card">

            <div className="ndx-state-icon ndx-pending-icon">
              …
            </div>

            <span className="ndx-state-label ndx-pending-label">
              PAGAMENTO PENDENTE
            </span>

            <h1>
              Seu pagamento está sendo processado.
            </h1>

            <p>
              O Mercado Pago ainda não confirmou a aprovação.
              Assim que o pagamento for aprovado, o ingresso
              será enviado para o e-mail informado no checkout.
            </p>

            <div className="ndx-confirm-actions">

              <button
                className="ndx-secondary-button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Atualizar status
              </button>

            </div>

          </div>
        )}


        {/* ===================================================
            ERROR
        =================================================== */}

        {status === "error" && (
          <div className="ndx-confirm-state-card">

            <div className="ndx-state-icon ndx-error-icon">
              !
            </div>

            <span className="ndx-state-label ndx-error-label">
              NÃO FOI POSSÍVEL CONFIRMAR
            </span>

            <h1>
              Vamos verificar seu pagamento.
            </h1>

            <p>
              {error}
            </p>

            <div className="ndx-confirm-actions">

              <button
                className="ndx-secondary-button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Tentar novamente
              </button>

              <Link
                className="ndx-secondary-button"
                to="/eventos"
              >
                Voltar para o evento
              </Link>

            </div>

          </div>
        )}

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="ndx-confirm-footer">

        <span>
          PÍLULAS DE MENTORIA
        </span>

        <span>
          Ingresso digital • Pagamento seguro • Confirmação automática
        </span>

      </footer>

    </main>
  );
}