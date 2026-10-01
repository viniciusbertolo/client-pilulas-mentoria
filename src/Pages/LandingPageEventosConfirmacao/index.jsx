import React, { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import "./index.css";

const API_URL = "https://backend-pilulas-mentoria.herokuapp.com";

export default function LandingPageEventosConfirmacao() {
  const [status, setStatus] = useState("loading");
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id");
  const paymentStatus = searchParams.get("status") || searchParams.get("collection_status");

  useEffect(() => {
    async function loadPayment() {
      if (!paymentId) {
        setStatus(paymentStatus === "pending" ? "pending" : "error");
        setError("Não encontramos os dados do pagamento nesta URL.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/events/payment/${encodeURIComponent(paymentId)}`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.approved) {
          if (data.status === "pending" || paymentStatus === "pending") {
            setStatus("pending");
            return;
          }

          throw new Error(data.message || "O pagamento ainda não foi aprovado.");
        }

        setTicket(data);
        setStatus("success");
      } catch (err) {
        console.error("Erro ao validar pagamento:", err);
        setError(err.message || "Não foi possível confirmar seu ingresso agora.");
        setStatus("error");
      }
    }

    loadPayment();
  }, [paymentId, paymentStatus]);

  const qrValue = ticket?.qrPayload || "";

  return (
    <main className="event-confirm-page">
      <div className="confirm-orb confirm-orb-one" />
      <div className="confirm-orb confirm-orb-two" />

      <div className="confirm-shell">
        <div className="confirm-brand">PÍLULAS<span>+</span></div>

        {status === "loading" && (
          <section className="confirm-card confirm-loading">
            <div className="confirm-spinner" />
            <span className="confirm-eyebrow">AGUARDE UM MOMENTO</span>
            <h1>Confirmando seu pagamento…</h1>
            <p>Estamos validando o pagamento com o Mercado Pago.</p>
          </section>
        )}

        {status === "success" && ticket && (
          <section className="confirm-card">
            <div className="confirm-success-mark">✓</div>
            <span className="confirm-eyebrow">PAGAMENTO APROVADO</span>
            <h1>Seu ingresso está confirmado.</h1>
            <p>
              Tudo certo. Enviamos uma cópia do seu ingresso para <strong>{ticket.email}</strong>.
            </p>

            <div className="confirm-ticket">
              <div className="confirm-ticket-copy">
                <span>INGRESSO DIGITAL</span>
                <strong>{ticket.eventName || "Evento Pílulas"}</strong>
                <small>Código: {ticket.ticketCode}</small>
                <small>Pagamento: {ticket.paymentId}</small>
              </div>

              <div className="confirm-qr-wrap">
                {qrValue && <QRCodeSVG value={qrValue} size={176} level="M" includeMargin />}
                <span>Apresente este QR Code na entrada.</span>
              </div>
            </div>

            <div className="confirm-actions">
              <Link className="confirm-secondary-button" to="/">
                Voltar para o início
              </Link>
            </div>

            <p className="confirm-note">
              O e-mail é enviado automaticamente após a aprovação. Confira também sua pasta de spam ou promoções.
            </p>
          </section>
        )}

        {status === "pending" && (
          <section className="confirm-card">
            <div className="confirm-pending-mark">…</div>
            <span className="confirm-eyebrow">PAGAMENTO PENDENTE</span>
            <h1>Seu pagamento está sendo processado.</h1>
            <p>
              O Mercado Pago ainda não confirmou a aprovação. Assim que o pagamento for aprovado,
              o ingresso será enviado para o e-mail informado no checkout.
            </p>
            <div className="confirm-actions">
              <button className="confirm-secondary-button" onClick={() => window.location.reload()}>
                Atualizar status
              </button>
            </div>
          </section>
        )}

        {status === "error" && (
          <section className="confirm-card">
            <div className="confirm-error-mark">!</div>
            <span className="confirm-eyebrow">NÃO FOI POSSÍVEL CONFIRMAR</span>
            <h1>Vamos verificar seu pagamento.</h1>
            <p>{error}</p>
            <div className="confirm-actions">
              <button className="confirm-secondary-button" onClick={() => window.location.reload()}>
                Tentar novamente
              </button>
              <Link className="confirm-secondary-button" to="/eventos">
                Voltar para o evento
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
