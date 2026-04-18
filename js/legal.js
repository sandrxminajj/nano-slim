/* ============================================================
   LEGAL MODALS — Template genérico Portugal
   Placeholders substituídos pelo api-configurator-pt por oferta.
   Uso: <script src="js/legal.js" defer></script>
   Depois: <a href="#" onclick="openLegal('privacidade'); return false;">Privacidade</a>
   ============================================================ */
(function(){
  const NOME_PRODUTO   = 'Nano Slim';
  const EMAIL          = 'contacto@nano-slim.pt';
  const EMAIL_PRIV     = 'privacidade@nano-slim.pt';
  const EMAIL_REEMB    = 'reembolso@nano-slim.pt';
  const DATA           = '18 de abril de 2026';
  const ANO            = '2026';
  const OBJETO         = 'venda online de suplementos alimentares à base de BHB e extratos vegetais para apoio à gestão de peso e ao processo de cetose';

  // ── CONTEÚDOS ───────────────────────────────────────────────
  const contents = {
    privacidade: {
      title: 'Política de Privacidade',
      html: `
        <p class="lgl-sub">Última atualização: ${DATA}</p>
        <div class="lgl-box"><strong>Resumo:</strong> Recolhemos apenas os dados necessários para processar a tua encomenda. Não vendemos dados. Cumprimos o RGPD (UE).</div>
        <h3>1. Responsável pelo tratamento</h3>
        <p>${NOME_PRODUTO}. Contacto: <strong>${EMAIL}</strong></p>
        <h3>2. Dados que recolhemos</h3>
        <ul>
          <li>Identificação: nome, NIF (opcional).</li>
          <li>Contacto: email, telemóvel.</li>
          <li>Morada de entrega.</li>
          <li>Método de pagamento escolhido. <em>Nunca armazenamos dados de cartões.</em></li>
          <li>Dados técnicos: IP, dispositivo, cookies, UTMs.</li>
        </ul>
        <h3>3. Finalidades</h3>
        <ul>
          <li>Processar e entregar a encomenda.</li>
          <li>Faturação e obrigações fiscais.</li>
          <li>Comunicação de suporte e estado da encomenda.</li>
          <li>Prevenção de fraude.</li>
          <li>Analítica e melhoria do site.</li>
        </ul>
        <h3>4. Base legal</h3>
        <p>Execução de contrato, obrigação legal, interesse legítimo e consentimento (cookies).</p>
        <h3>5. Partilha com terceiros</h3>
        <ul>
          <li>Processadores de pagamento (MB WAY, Multibanco).</li>
          <li>Transportadoras.</li>
          <li>Plataformas de analítica/marketing (Google, Meta, TikTok).</li>
          <li>Autoridades quando exigido por lei.</li>
        </ul>
        <p>Não vendemos dados a terceiros.</p>
        <h3>6. Cookies</h3>
        <p>Usamos cookies essenciais, analíticos e de marketing. Podes gerir preferências no teu navegador.</p>
        <h3>7. Prazo de conservação</h3>
        <ul>
          <li>Dados de encomendas: 10 anos (obrigação fiscal).</li>
          <li>Dados de marketing: até retirares o consentimento.</li>
        </ul>
        <h3>8. Os teus direitos</h3>
        <p>Acesso, correção, eliminação, portabilidade, oposição, retirada de consentimento, reclamação à CNPD. Contacta: <strong>${EMAIL_PRIV}</strong></p>
        <h3>9. Segurança</h3>
        <p>Encriptação SSL/TLS. Dados de pagamento nunca são armazenados nos nossos servidores.</p>
      `
    },

    termos: {
      title: 'Termos e Condições',
      html: `
        <p class="lgl-sub">Última atualização: ${DATA}</p>
        <div class="lgl-box"><strong>Ao comprar aceitas integralmente estes Termos.</strong></div>
        <h3>1. Identificação</h3>
        <p>${NOME_PRODUTO}. Contacto: <strong>${EMAIL}</strong></p>
        <h3>2. Objeto</h3>
        <p>${OBJETO}</p>
        <h3>3. Capacidade</h3>
        <p>Deves ter 18+ anos. Menores precisam de autorização do representante legal.</p>
        <h3>4. Preços e produtos</h3>
        <ul>
          <li>Preços em Euros (€), impostos incluídos.</li>
          <li>Imagens meramente ilustrativas.</li>
          <li>Em caso de erro manifesto de preço, podemos cancelar e reembolsar.</li>
        </ul>
        <h3>5. Processo de compra</h3>
        <p>Seleciona produto → preenche dados → escolhe pagamento (MB WAY/Multibanco) → confirma → recebes email. O contrato forma-se na confirmação do pagamento.</p>
        <h3>6. Pagamento</h3>
        <p>MB WAY (instantâneo) ou Multibanco (referência). Processado por parceiros certificados. Não armazenamos dados bancários.</p>
        <h3>7. Direito de livre resolução</h3>
        <p>14 dias para desistir sem justificação. Ver <a href="javascript:void(0)" data-legal="reembolso" class="lgl-link">Política de Reembolso</a>.</p>
        <h3>8. Garantia legal</h3>
        <p>3 anos conforme Decreto-Lei 84/2021 (Portugal).</p>
        <h3>9. Limitação de responsabilidade</h3>
        <p>Na máxima extensão legal, não nos responsabilizamos por danos indiretos, salvo dolo ou culpa grave.</p>
        <h3>10. Resolução de litígios</h3>
        <p>Plataforma UE: <a href="https://ec.europa.eu/consumers/odr" target="_blank" class="lgl-link">ec.europa.eu/consumers/odr</a>.</p>
        <h3>11. Lei aplicável</h3>
        <p>Legislação portuguesa e normas do país de residência do consumidor aplicáveis em matéria de consumo na UE.</p>
      `
    },

    reembolso: {
      title: 'Política de Reembolso',
      html: `
        <p class="lgl-sub">Última atualização: ${DATA}</p>
        <div class="lgl-box"><strong>Tens 14 dias para desistir da compra sem necessidade de justificação (art. 10.º DL 24/2014 — Portugal).</strong></div>
        <h3>1. Direito de livre resolução</h3>
        <p>Podes devolver o produto no prazo de <strong>14 dias corridos</strong> após a receção. Basta comunicares a intenção por email para <strong>${EMAIL_REEMB}</strong> com: nome, nº da encomenda e motivo (opcional).</p>
        <h3>2. Estado do produto</h3>
        <ul>
          <li>Deve estar em condições originais, sem sinais de uso além da verificação razoável.</li>
          <li>Embalagem original preservada sempre que possível.</li>
          <li>Acompanhado de todos os acessórios e documentação.</li>
        </ul>
        <h3>3. Como devolver</h3>
        <ol style="margin-left: 20px;">
          <li>Envia email para <strong>${EMAIL_REEMB}</strong> dentro dos 14 dias.</li>
          <li>Recebes instruções e endereço de devolução.</li>
          <li>Envias o produto (custo de devolução por tua conta, salvo defeito).</li>
          <li>Processamos o reembolso em <strong>até 14 dias</strong> após receção.</li>
        </ol>
        <h3>4. Reembolso</h3>
        <ul>
          <li>Valor total pago (produto + envio original).</li>
          <li>Mesma forma de pagamento utilizada na compra.</li>
          <li>Prazo bancário habitual: 3-10 dias úteis.</li>
        </ul>
        <h3>5. Produtos com defeito</h3>
        <p>Se recebeste produto defeituoso ou em desacordo com o anunciado: 3 anos de garantia legal em Portugal (DL 84/2021). Reparação, substituição, redução de preço ou reembolso integral, conforme aplicável. Custo de devolução por nossa conta.</p>
        <h3>6. Exceções ao direito de livre resolução</h3>
        <p>Produtos personalizados por encomenda específica do consumidor não estão sujeitos ao direito de desistência, salvo defeito.</p>
        <h3>7. Cancelamento antes do envio</h3>
        <p>Podes cancelar a qualquer momento antes do envio — reembolso integral em 5 dias úteis.</p>
      `
    },

    envios: {
      title: 'Política de Envios',
      html: `
        <p class="lgl-sub">Última atualização: ${DATA}</p>
        <div class="lgl-box"><strong>Enviamos para todo Portugal continental, ilhas e países da UE.</strong></div>
        <h3>1. Prazos de entrega</h3>
        <ul>
          <li><strong>Portugal continental:</strong> 3 a 7 dias úteis.</li>
          <li><strong>Ilhas (Açores/Madeira):</strong> 5 a 10 dias úteis.</li>
          <li><strong>Espanha:</strong> 5 a 8 dias úteis.</li>
          <li><strong>Restante UE:</strong> 7 a 14 dias úteis.</li>
        </ul>
        <p>Os prazos começam a contar após confirmação do pagamento.</p>
        <h3>2. Custos de envio</h3>
        <p>Calculados automaticamente no checkout com base na morada. Envio gratuito acima de €75 para Portugal continental.</p>
        <h3>3. Transportadoras</h3>
        <p>CTT Expresso, DPD ou equivalente. Todos os envios com número de rastreio enviado por email.</p>
        <h3>4. Confirmação e rastreamento</h3>
        <p>Assim que a encomenda é despachada, recebes email com o código de rastreio. Podes acompanhar a entrega em tempo real.</p>
        <h3>5. Encomenda não entregue</h3>
        <ul>
          <li>Se a transportadora não consegue entregar (ausente, morada incorreta), tenta novamente.</li>
          <li>Após 3 tentativas sem sucesso, a encomenda volta à origem — contactar-te-emos para reagendar.</li>
          <li>Custos de reexpedição por morada incorreta podem ser cobrados.</li>
        </ul>
        <h3>6. Encomenda danificada na entrega</h3>
        <p>Se receberes encomenda com sinais de danificação, recusa a entrega ou documenta com fotos e contacta-nos em <strong>24 horas</strong> para <strong>${EMAIL_REEMB}</strong>.</p>
        <h3>7. Alfândega</h3>
        <p>Envios para fora da UE podem estar sujeitos a taxas alfandegárias, que são da responsabilidade do destinatário.</p>
        <h3>8. Não recebeste a encomenda?</h3>
        <p>Se após o prazo máximo ainda não recebeste, contacta-nos em <strong>${EMAIL}</strong> — abrimos um processo de investigação com a transportadora.</p>
      `
    },

    contacto: {
      title: 'Contacto',
      html: `
        <div class="lgl-box"><strong>Estamos cá para ajudar!</strong> Respondemos em até 48h úteis.</div>
        <h3>📧 Email</h3>
        <p><strong>Suporte geral:</strong> <a href="mailto:${EMAIL}" class="lgl-link">${EMAIL}</a></p>
        <p><strong>Privacidade:</strong> <a href="mailto:${EMAIL_PRIV}" class="lgl-link">${EMAIL_PRIV}</a></p>
        <p><strong>Reembolsos:</strong> <a href="mailto:${EMAIL_REEMB}" class="lgl-link">${EMAIL_REEMB}</a></p>
        <h3>🕒 Horário de atendimento</h3>
        <p>Segunda a sexta-feira — 9h às 18h (horário de Lisboa / GMT+0).<br>Sábado — 10h às 14h.<br>Domingo e feriados — fechado.</p>
        <h3>❓ Perguntas frequentes</h3>
        <p><strong>Posso alterar a minha encomenda depois de pagar?</strong><br>Contacta-nos o quanto antes. Alterações só possíveis antes do envio.</p>
        <p><strong>Qual é o prazo de entrega?</strong><br>Ver <a href="javascript:void(0)" data-legal="envios" class="lgl-link">Política de Envios</a>.</p>
        <p><strong>Como devolvo um produto?</strong><br>Ver <a href="javascript:void(0)" data-legal="reembolso" class="lgl-link">Política de Reembolso</a>.</p>
      `
    }
  };

  // ── INJECTA CSS ─────────────────────────────────────────────
  const css = `
    .lgl-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.65); display: none; align-items: center; justify-content: center; z-index: 99999; padding: 20px; backdrop-filter: blur(4px); }
    .lgl-overlay.open { display: flex; animation: lglFade .25s ease; }
    @keyframes lglFade { from { opacity: 0; } to { opacity: 1; } }
    .lgl-modal { background: #fff; border-radius: 16px; max-width: 720px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,.3); animation: lglSlide .3s ease; }
    @keyframes lglSlide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .lgl-header { padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #2BB3E8; border-radius: 16px 16px 0 0; }
    .lgl-header h2 { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.35rem; color: #ffffff; margin: 0; }
    .lgl-close { background: #1a1d26; color: #fff; border: none; width: 34px; height: 34px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s; }
    .lgl-close:hover { background: #374151; }
    .lgl-body { padding: 24px 28px 32px; overflow-y: auto; color: #374151; font-family: 'Nunito', sans-serif, Arial; line-height: 1.6; }
    .lgl-body { font-family: 'Inter', sans-serif; }
    .lgl-body h3 { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.05rem; color: #1a1d26; margin: 20px 0 8px; }
    .lgl-body p { margin-bottom: 10px; font-size: .94rem; }
    .lgl-body ul, .lgl-body ol { margin: 8px 0 14px 24px; }
    .lgl-body li { margin-bottom: 6px; font-size: .94rem; }
    .lgl-sub { color: #6b664f; font-size: .88rem; margin-bottom: 20px !important; }
    .lgl-box { background: #E3F6FD; border: 2px solid #2BB3E8; border-radius: 10px; padding: 12px 16px; margin: 0 0 20px; font-size: .92rem; }
    .lgl-box strong { color: #0c4a6e; }
    .lgl-link { color: #1E88E5; font-weight: 700; text-decoration: none; }
    .lgl-link:hover { text-decoration: underline; }
    html { height: 100%; }
    body { min-height: 130vh; display: flex; flex-direction: column; align-items: stretch; }
    body > * { width: 100%; }
    .lgl-footer-links { background: transparent; color: #9ca3af; padding: 18px 12px 22px; font-size: .7rem; text-align: center; font-family: 'Nunito', sans-serif, Arial; line-height: 1.6; border-top: 1px solid rgba(0,0,0,.06); margin-top: auto !important; flex-shrink: 0; width: 100%; }
    .lgl-footer-links strong { color: #6b7280; font-weight: 600; }
    .lgl-footer-links a { color: #6b7280; text-decoration: none; margin: 0 4px; font-weight: 500; cursor: pointer; font-size: .7rem; }
    .lgl-footer-links a:hover { color: #1a1d26; text-decoration: underline; }
    .lgl-footer-links .small { font-size: .65rem; margin-top: 6px; color: #9ca3af; opacity: .7; }
    @media (max-width: 640px) { .lgl-modal { max-height: 95vh; } .lgl-body { padding: 18px 18px 24px; } .lgl-header h2 { font-size: 1.15rem; } }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ── INJECTA MODAL E FOOTER ──────────────────────────────────
  function injectDOM(){
    if (document.getElementById('lgl-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'lgl-overlay';
    overlay.className = 'lgl-overlay';
    overlay.innerHTML = `
      <div class="lgl-modal" role="dialog" aria-modal="true">
        <div class="lgl-header">
          <h2 id="lgl-title">—</h2>
          <button class="lgl-close" aria-label="Fechar" onclick="closeLegal()">✕</button>
        </div>
        <div class="lgl-body" id="lgl-body"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLegal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLegal();
    });

    // Injecta footer se ainda não existir
    if (!document.querySelector('.lgl-footer-links')) {
      const footer = document.createElement('div');
      footer.className = 'lgl-footer-links';
      footer.innerHTML = `
        <p>
          <a href="javascript:void(0)" data-legal="privacidade">Privacidade</a> ·
          <a href="javascript:void(0)" data-legal="termos">Termos</a> ·
          <a href="javascript:void(0)" data-legal="reembolso">Reembolso</a> ·
          <a href="javascript:void(0)" data-legal="envios">Envios</a> ·
          <a href="javascript:void(0)" data-legal="contacto">Contacto</a>
        </p>
        <p class="small">© ${ANO} ${NOME_PRODUTO} · Todos os direitos reservados</p>
      `;
      document.body.appendChild(footer);

      footer.addEventListener('click', function(e) {
        const target = e.target.closest('[data-legal]');
        if (!target) return;
        e.preventDefault();
        e.stopPropagation();
        const key = target.getAttribute('data-legal');
        if (key && window.openLegal) window.openLegal(key);
      });
    }
  }

  // ── API GLOBAL ──────────────────────────────────────────────
  window.openLegal = function(key){
    const data = contents[key];
    if (!data) return;
    document.getElementById('lgl-title').textContent = data.title;
    document.getElementById('lgl-body').innerHTML = data.html;
    document.getElementById('lgl-body').scrollTop = 0;
    document.getElementById('lgl-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLegal = function(){
    document.getElementById('lgl-overlay').classList.remove('open');
    document.body.style.overflow = '';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectDOM);
  } else {
    injectDOM();
  }

  document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-legal]');
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    const key = target.getAttribute('data-legal');
    if (key && window.openLegal) window.openLegal(key);
  });
})();
