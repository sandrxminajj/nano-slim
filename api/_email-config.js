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
      "Recebes email + SMS com código de rastreio CTT.",
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
  }
};
