/**
 * ALVES INSTALADORA - JAVASCRIPT PRINCIPAL
 * Funcionalidades interativas, integração WhatsApp, simulador de orçamento,
 * filtro de serviços, accordion de FAQ e otimizações de performance.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. CARREGAMENTO DAS CONFIGURAÇÕES
  const config = window.SITE_CONFIG || {
    whatsappNumber: "5551991962040",
    defaultMessage: "Olá! Gostaria de solicitar um orçamento com a Alves Instaladora.",
    urgentMessage: "Olá! Preciso de atendimento urgente para minha residência."
  };

  // 2. CONSTRUTOR DE LINKS DO WHATSAPP
  function createWhatsAppLink(message) {
    const cleanNumber = config.whatsappNumber.replace(/\D/g, '');
    const encoded = encodeURIComponent(message || config.defaultMessage);
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  }

  // Inicializa botões padrão de WhatsApp com link dinâmico
  const whatsappButtons = document.querySelectorAll('.js-whatsapp-link');
  whatsappButtons.forEach(btn => {
    const customMsg = btn.getAttribute('data-msg') || config.defaultMessage;
    btn.href = createWhatsAppLink(customMsg);
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
  });

  // 3. HEADER SCROLL EFFECT & NAVBAR
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 4. MOBILE MENU DRAWER
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const desktopNav = document.querySelector('.desktop-nav');
  if (mobileToggle && desktopNav) {
    mobileToggle.addEventListener('click', () => {
      desktopNav.classList.toggle('mobile-open');
      const isOpen = desktopNav.classList.contains('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fechar ao clicar em um link
    desktopNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        desktopNav.classList.remove('mobile-open');
      });
    });
  }

  // 5. FILTRAGEM DINÂMICA DE SERVIÇOS
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. SIMULADOR INTERATIVO DE ORÇAMENTO (CRO LEAD MAGNET)
  const simCards = document.querySelectorAll('.sim-radio-card');
  const simOutputText = document.getElementById('sim-output-text');
  const simCtaBtn = document.getElementById('sim-whatsapp-btn');

  function updateSimulator() {
    const selectedService = document.querySelector('input[name="sim-service"]:checked')?.value || "Combo Elétrica & Climatização";
    const selectedSize = document.querySelector('input[name="sim-size"]:checked')?.value || "Apartamento Padrão";
    const selectedUrgency = document.querySelector('input[name="sim-urgency"]:checked')?.value || "Nos próximos dias";

    if (simOutputText) {
      simOutputText.textContent = `${selectedService} | ${selectedSize} | Prazo: ${selectedUrgency}`;
    }

    if (simCtaBtn) {
      const formattedMessage = `⚡ *SOLICITAÇÃO DE ORÇAMENTO (Via Site Alves Instaladora)*\n\n` +
        `• *Serviço de Interesse:* ${selectedService}\n` +
        `• *Tipo de Imóvel:* ${selectedSize}\n` +
        `• *Previsão de Início:* ${selectedUrgency}\n\n` +
        `Olá! Gostaria de receber uma estimativa prévia de valores e disponibilidade técnica para atendimento. Obrigado!`;

      simCtaBtn.href = createWhatsAppLink(formattedMessage);
      simCtaBtn.target = "_blank";
      simCtaBtn.rel = "noopener noreferrer";
    }
  }

  // Event listeners para o simulador
  simCards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (!radio) return;

    card.addEventListener('click', () => {
      // Remover active dos radios do mesmo grupo
      const groupName = radio.getAttribute('name');
      document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
        input.closest('.sim-radio-card')?.classList.remove('active');
      });

      radio.checked = true;
      card.classList.add('active');
      updateSimulator();
    });
  });

  // Executa uma vez para inicializar
  updateSimulator();

  // 7. FAQ ACCORDION INTERATIVO
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPanel = item.querySelector('.faq-answer-panel');

    if (questionBtn && answerPanel) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Fecha todos os outros
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherPanel = otherItem.querySelector('.faq-answer-panel');
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });

        // Alterna o atual
        if (!isActive) {
          item.classList.add('active');
          answerPanel.style.maxHeight = answerPanel.scrollHeight + "px";
        } else {
          item.classList.remove('active');
          answerPanel.style.maxHeight = null;
        }
      });
    }
  });

  // Abre o primeiro item do FAQ por padrão para facilitar a leitura
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstPanel = firstItem.querySelector('.faq-answer-panel');
    firstItem.classList.add('active');
    if (firstPanel) firstPanel.style.maxHeight = firstPanel.scrollHeight + "px";
  }

  // 8. INTERSECTION OBSERVER PARA NAVEGAÇÃO ATIVA
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    threshold: 0.3,
    rootMargin: "-80px 0px 0px 0px"
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));
});
