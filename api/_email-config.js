// ===================================================================
// CONFIGURAÇÃO DOS EMAILS · edita aqui o texto sem mexer no template
// ===================================================================
// Tudo o que está aqui é texto livre. Muda à vontade.
// As variáveis {{name}}, {{firstName}}, {{amount}} etc são preenchidas
// automaticamente quando o email é enviado.
// ===================================================================

module.exports = {
  // ─── BRAND / IDENTIDADE ────────────────────────────────────────
  brand: {
    name: "Nano Slim",
    tagline: "Site Oficial · Portugal",
    siteUrl: "https://nanoslimoficial.com",
    supportEmail: "apoio@nanoslimoficial.com",
    refundEmail: "apoio@nanoslimoficial.com",
    color: {
      primary: "#1E88E5",       // azul header
      primaryDark: "#1565C0",   // azul escuro gradient
      accent: "#22C55E",        // verde CTAs/MB Way
      accentDark: "#15803D",
      warn: "#F59E0B",          // amarelo Multibanco
      warnDark: "#92400E",
      bg: "#F7FAFC",
      text: "#0F1F2E",
      textSoft: "#475569",
      footer: "#0A1624"
    }
  },

  // ─── EMAIL 1 · CONFIRMAÇÃO DE ENCOMENDA ────────────────────────
  orderConfirmation: {
    // Assunto do email (aparece na inbox)
    // Variáveis disponíveis: {{txShort}}
    subject: "Encomenda recebida · Nano Slim #{{txShort}}",

    // Texto preview (aparece logo abaixo do assunto na inbox antes de abrir)
    // Variáveis: {{firstName}}, {{productName}}, {{amount}}
    preheader: "Recebemos a tua encomenda de {{productName}} ({{amount}}). Vê os detalhes e os próximos passos.",

    // Saudação personalizada · variáveis: {{firstName}}
    greeting: "Olá {{firstName}}! 👋",

    // Headline principal · variáveis: {{firstName}}
    headline: "Recebemos a tua encomenda",

    // Sub-headline curta
    subheadline: "Obrigado pela confiança. Aqui está o resumo do teu pedido:",

    // Texto MB Way (quando método = mbway)
    mbwayBox: {
      title: "Aprova o pagamento na app MB Way",
      body: "Recebeste uma notificação no telemóvel. Abre a app MB Way e aprova o valor para confirmarmos a tua encomenda."
    },

    // Texto Multibanco (quando método = multibanco)
    multibancoBox: {
      title: "Pagamento Multibanco pendente",
      body: "Usa estes dados no homebanking ou num ATM Multibanco. Válido por 48 horas.",
      validityNote: "Após este prazo, terás de fazer nova encomenda."
    },

    // Próximos passos (lista numerada)
    nextSteps: [
      "Confirma o pagamento via {{methodLabel}}.",
      "Expedimos pelos CTT em <strong>24-48h</strong> (envio grátis para todo Portugal).",
      "Recebes email com código de rastreio CTT.",
      "Toma 1 colher em água ao pequeno-almoço durante 30 dias."
    ],

    // Bloco de Tracking (só aparece se houver tracking_code)
    trackingBox: {
      title: "Acompanha a tua encomenda",
      body: "Usa o código abaixo na nossa página de rastreio para veres o estado em tempo real:",
      buttonLabel: "Acompanhar encomenda",
      trackingPageUrl: "https://fastntrack.lovable.app/embed/track"
    },

    // Garantia (caixa verde)
    guarantee: {
      title: "Garantia 30 dias",
      body: "Se não gostares, basta enviar email para <a href=\"mailto:{{refundEmail}}\" style=\"color:#15803D;font-weight:700;\">{{refundEmail}}</a> e devolvemos 100% do valor pago. Sem perguntas."
    },

    // Suporte (no fim do corpo)
    support: {
      label: "Tens dúvidas?",
      body: "Responde a este email ou escreve para <a href=\"mailto:{{supportEmail}}\" style=\"color:#1E88E5;font-weight:600;\">{{supportEmail}}</a>"
    },

    // Footer (rodapé escuro)
    footer: {
      brandLine: "{{brandName}} · Portugal",
      legalLine: "Suplemento alimentar · Não substitui uma alimentação variada e equilibrada",
      copyright: "© {{year}} {{brandName}} · Todos os direitos reservados"
    }
  },

  // ─── EMAIL 2 · LEMBRETE PAGAMENTO MULTIBANCO (~20h depois) ─────
  paymentReminder1: {
    subject: "Lembrete · {{firstName}}, falta pagar a tua encomenda Nano Slim",
    preheader: "A tua referência Multibanco {{mbRef}} ainda está pendente. Faltam {{hoursLeft}}h para expirar.",
    greeting: "Olá {{firstName}}! 👋",
    headline: "Lembrete amigável",
    subheadline: "Notámos que a tua encomenda Nano Slim ainda não foi paga. Aqui estão os dados outra vez, para o caso de te ter passado:",
    badgeText: "Pagamento ainda pendente",
    multibancoBox: {
      title: "Paga em 1 minuto · Multibanco",
      body: "Abre a tua app do banco ou homebanking e paga referência. A tua encomenda começa a ser preparada assim que confirmar.",
      validityNote: "Restam aproximadamente {{hoursLeft}}h antes da referência expirar."
    },
    helpBox: {
      title: "Não consegues pagar agora?",
      body: "Se preferires <strong>MB Way</strong> (instantâneo), responde a este email com a palavra <strong>MBWAY</strong> e geramos uma nova referência em 1 minuto. Sem custos, sem pressa."
    },
    support: {
      label: "Mudaste de ideias?",
      body: "Tudo bem. Responde a este email a dizer e ficamos por aqui. <a href=\"mailto:{{supportEmail}}\" style=\"color:#1E88E5;font-weight:600;\">{{supportEmail}}</a>"
    }
  },

  // ─── EMAIL 3 · ÚLTIMA CHAMADA (~44h depois, antes de expirar) ──
  paymentReminder2: {
    subject: "⏰ Última chamada · A tua referência expira em poucas horas",
    preheader: "A tua encomenda Nano Slim {{productName}} expira hoje. Não percas a promoção.",
    greeting: "Olá {{firstName}}! 👋",
    headline: "Última chamada",
    subheadline: "A tua referência Multibanco expira em poucas horas. Se ainda queres receber o teu Nano Slim com envio grátis, paga agora:",
    badgeText: "Expira em breve",
    multibancoBox: {
      title: "Pagar agora · Antes de expirar",
      body: "A tua encomenda fica garantida assim que pagares. Expedimos no próprio dia se pagares até às 16h.",
      validityNote: "Após este prazo, terás de fazer nova encomenda (e perdes esta promoção de lançamento)."
    },
    helpBox: {
      title: "Mais fácil com MB Way?",
      body: "Responde <strong>MBWAY</strong> a este email e geramos referência instantânea no teu telemóvel. Pagamento em 30 segundos."
    },
    support: {
      label: "Dúvidas?",
      body: "<a href=\"mailto:{{supportEmail}}\" style=\"color:#1E88E5;font-weight:600;\">{{supportEmail}}</a> · respondemos em minutos."
    }
  }
};
