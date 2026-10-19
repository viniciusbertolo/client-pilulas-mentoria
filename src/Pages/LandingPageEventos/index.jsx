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
    INVESTIMENTO EM VOCÊ
===================================================== */}

<section className="ndx-investment" id="investimento">
  <div className="ndx-content">

    <div className="ndx-investment-heading">
      <span>INVESTIMENTO EM VOCÊ</span>

      <h2>
        Uma grande imersão. Um investimento acessível em São Carlos.
      </h2>

      <p>
        São Carlos é a única cidade no Brasil onde o projeto é
        totalmente apoiado e patrocinado por parceiros como:
      </p>

      <div
        className="ndx-investment-partners"
        aria-label="Parceiros do projeto"
      >
        <span>ACISC</span>
        <span>Prefeitura Municipal</span>
        <span>Cardinali Imóveis</span>
        <span>SINCOMERCIO</span>
        <span>+ de 10 empresas</span>
      </div>
    </div>

    <div className="ndx-investment-grid">

      <article className="ndx-investment-reference">
        <span className="ndx-investment-eyebrow">
          VALOR DA IMERSÃO EM SÃO PAULO
        </span>

        <strong className="ndx-investment-reference-price">
          R$ 2.747,00
        </strong>

        <p>
          Em São Carlos, você tem a oportunidade de participar
          com o apoio de parceiros locais.
        </p>
      </article>

      <article className="ndx-investment-offer">
        <span className="ndx-investment-offer-label">
          EM SÃO CARLOS
        </span>

        <p className="ndx-investment-offer-copy">
          Você paga apenas a taxa de inscrição
        </p>

        <div
          className="ndx-investment-price"
          aria-label="R$ 176,00"
        >
          <span>R$</span>
          <strong>176</strong>
          <span>,00</span>
        </div>

        <p className="ndx-investment-sim">
          Sim... apenas isso!
        </p>

        <button
          className="ndx-cta ndx-cta-primary ndx-investment-cta"
          onClick={openCheckout}
        >
          Quero garantir minha vaga
          <span>↗</span>
        </button>
      </article>

    </div>

    <div className="ndx-investment-details">

      <article className="ndx-investment-detail">
        <span
          className="ndx-investment-detail-icon"
          aria-hidden="true"
        >
          ⌖
        </span>

        <div>
          <span>LOCAL</span>
          <strong>Auditório da Cardinali Imóveis</strong>
        </div>
      </article>

      <article className="ndx-investment-detail">
        <span
          className="ndx-investment-detail-icon"
          aria-hidden="true"
        >
          ◷
        </span>

        <div>
          <span>QUINTA-FEIRA</span>
          <strong>20h30 às 22h30</strong>
        </div>
      </article>

      <article className="ndx-investment-detail">
        <span
          className="ndx-investment-detail-icon"
          aria-hidden="true"
        >
          ◷
        </span>

        <div>
          <span>SÁBADO</span>
          <strong>8h30 às 17h</strong>
        </div>
      </article>

    </div>

    <div className="ndx-investment-closing">
      <blockquote>
        “Se você não investir em você mesmo, ninguém fará!”
      </blockquote>

      <p>
        É a sua hora de crescer e se tornar mais competitivo e produtivo!
      </p>
    </div>

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
    INVESTIMENTO ACESSÍVEL — RESUMO
===================================================== */}

<section className="ndx-investment-mini">
  <div className="ndx-content ndx-investment-mini-inner">

    <div className="ndx-investment-mini-copy">
      <span className="ndx-investment-mini-label">
        UMA OPORTUNIDADE EXCLUSIVA EM SÃO CARLOS
      </span>

      <h2>
        Invista em você.
        <br />
        <span>Prepare-se para ir mais longe.</span>
      </h2>

      <p>
        Com o apoio da ACISC, Prefeitura Municipal,
        Cardinali Imóveis, SINCOMERCIO e mais de 10 empresas,
        a imersão fica muito mais acessível.
      </p>

      <div className="ndx-investment-mini-location">
        <span>⌖</span>
        Auditório da Cardinali Imóveis
      </div>

      <div className="ndx-investment-mini-schedule">
        <span>Quinta-feira: 20h30 às 22h30</span>
        <span>Sábado: 8h30 às 17h</span>
      </div>
    </div>

    <div className="ndx-investment-mini-price-card">
      <span className="ndx-investment-mini-old-label">
        VALOR DA IMERSÃO EM SÃO PAULO
      </span>

      <del>R$ 2.747,00</del>

      <div className="ndx-investment-mini-price-label">
        EM SÃO CARLOS, APENAS
      </div>

      <div className="ndx-investment-mini-price">
        <span>R$</span>
        <strong>176</strong>
        <span>,00</span>
      </div>

      <p>Sim... apenas isso!</p>

      <button
        className="ndx-cta ndx-cta-primary ndx-investment-mini-button"
        onClick={openCheckout}
      >
        Quero garantir minha vaga
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
              direcionado para profissionais e empresas"
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
    INVESTIMENTO ACESSÍVEL — RESUMO
===================================================== */}

<section className="ndx-investment-mini">
  <div className="ndx-content ndx-investment-mini-inner">

    <div className="ndx-investment-mini-copy">
      <span className="ndx-investment-mini-label">
        UMA OPORTUNIDADE EXCLUSIVA EM SÃO CARLOS
      </span>

      <h2>
        Invista em você.
        <br />
        <span>Prepare-se para ir mais longe.</span>
      </h2>

      <p>
        Com o apoio da ACISC, Prefeitura Municipal,
        Cardinali Imóveis, SINCOMERCIO e mais de 10 empresas,
        a imersão fica muito mais acessível.
      </p>

      <div className="ndx-investment-mini-location">
        <span>⌖</span>
        Auditório da Cardinali Imóveis
      </div>

      <div className="ndx-investment-mini-schedule">
        <span>Quinta-feira: 20h30 às 22h30</span>
        <span>Sábado: 8h30 às 17h</span>
      </div>
    </div>

    <div className="ndx-investment-mini-price-card">
      <span className="ndx-investment-mini-old-label">
        VALOR DA IMERSÃO EM SÃO PAULO
      </span>

      <del>R$ 2.747,00</del>

      <div className="ndx-investment-mini-price-label">
        EM SÃO CARLOS, APENAS
      </div>

      <div className="ndx-investment-mini-price">
        <span>R$</span>
        <strong>176</strong>
        <span>,00</span>
      </div>

      <p>Sim... apenas isso!</p>

      <button
        className="ndx-cta ndx-cta-primary ndx-investment-mini-button"
        onClick={openCheckout}
      >
        Quero garantir minha vaga
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