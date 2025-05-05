// script.js: Lógica de navegação, menu mobile, destaque ativo e animações

// Atualiza o ano no rodapé automaticamente
const yearSpan = document.getElementById('year'); // Seleciona o elemento do ano
if (yearSpan) yearSpan.textContent = new Date().getFullYear(); // Define o ano atual

// Menu mobile: abre/fecha ao clicar no botão
const toggleBtn = document.getElementById('navbar-toggle'); // Botão hamburguer
const navLinks = document.getElementById('navbar-links'); // Menu de links
if (toggleBtn && navLinks) {
  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open'); // Mostra ou esconde menu mobile
  });
}

// Fecha menu mobile ao clicar em um link
if (navLinks) {
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open'); // Fecha menu após clique
    });
  });
}

// Destaca o link ativo conforme o hash da URL
function updateActiveLink() {
  const hash = window.location.hash || '#home'; // Hash atual
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === hash) {
      link.classList.add('active'); // Ativa link
    } else {
      link.classList.remove('active'); // Desativa outros
    }
  });
}
window.addEventListener('hashchange', updateActiveLink); // Atualiza ao mudar hash
window.addEventListener('DOMContentLoaded', updateActiveLink); // Atualiza ao carregar

// Animação fade-in ao rolar a página
function fadeInOnScroll() {
  document.querySelectorAll('.fade-in-element').forEach(el => {
    const rect = el.getBoundingClientRect(); // Posição do elemento
    if (rect.top < window.innerHeight * 0.85) {
      el.classList.add('appear'); // Aparece ao rolar
    }
  });
}
window.addEventListener('scroll', fadeInOnScroll); // Ao rolar
window.addEventListener('DOMContentLoaded', fadeInOnScroll); // Ao carregar

// Scroll suave ajustando para navbar fixa
function scrollWithOffset(targetId) {
  const target = document.querySelector(targetId); // Elemento alvo
  const navbar = document.querySelector('.navbar'); // Navbar fixa
  if (target && navbar) {
    const yOffset = -navbar.offsetHeight; // Altura da navbar
    const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset; // Posição ajustada
    window.scrollTo({ top: y, behavior: 'smooth' }); // Scroll suave
  }
}
document.querySelectorAll('a.nav-link[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href'); // Hash do link
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href); // Elemento alvo
      if (target) {
        e.preventDefault(); // Previne comportamento padrão
        scrollWithOffset(href); // Scroll suave
        history.replaceState(null, '', href); // Atualiza hash
        updateActiveLink(); // Atualiza destaque
      }
    }
  });
});

// === ANIMAÇÃO DE FOLHAS VERDES NO SITE ===
// Exibe frutas animadas SOMENTE no fundo da seção #planos

function createSectionParticles() {
  const section = document.getElementById('planos');
  const frutaBg = document.getElementById('fruta-bg');
  if (!section || !frutaBg) return;

  let canvas = document.getElementById('leaf-particles-bg');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'leaf-particles-bg';
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    frutaBg.appendChild(canvas);
  }
  const ctx = canvas.getContext('2d');
  function getW() { return frutaBg.offsetWidth; }
  function getH() { return frutaBg.offsetHeight; }

  const fruitImagesSrc = [
    'frutas/abacaxi.png',
    'frutas/banana.png',
    'frutas/kiwi.png',
    'frutas/maca.png'
  ];
  const fruitImages = fruitImagesSrc.map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });

  let particles = Array.from({length: 20}, () => ({
    x: Math.random() * getW(),
    y: Math.random() * getH(),
    r: 32 + Math.random() * 32,
    dx: (Math.random() - 0.5) * 0.7,
    dy: (Math.random() - 0.5) * 0.7,
    angle: Math.random() * Math.PI * 2,
    dAngle: (Math.random() - 0.5) * 0.01,
    imgIdx: Math.floor(Math.random() * fruitImages.length)
  }));

  function drawFruit(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    const img = fruitImages[p.imgIdx];
    if (img.complete && img.naturalWidth > 0) {
      ctx.globalAlpha = 0.85;
      ctx.drawImage(img, -p.r/2, -p.r/2, p.r, p.r);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      drawFruit(p);
      p.x += p.dx;
      p.y += p.dy;
      p.angle += p.dAngle;
      if (p.x < 0) p.x = getW();
      if (p.x > getW()) p.x = 0;
      if (p.y < 0) p.y = getH();
      if (p.y > getH()) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  function resize() {
    canvas.width = getW();
    canvas.height = getH();
    // Reposiciona partículas dentro do novo tamanho
    particles.forEach(p => {
      p.x = Math.max(0, Math.min(p.x, getW()));
      p.y = Math.max(0, Math.min(p.y, getH()));
    });
  }
  window.addEventListener('resize', resize);
  resize();
  draw();
}

// Substitui a animação global por animação apenas na seção #planos
window.addEventListener('DOMContentLoaded', createSectionParticles);

// Adiciona scroll suave com offset ao clicar na seta para baixo
window.addEventListener('DOMContentLoaded', function() {
  const heroArrow = document.querySelector('.hero-arrow a.arrow-link');
  if (heroArrow) {
    heroArrow.addEventListener('click', function(e) {
      e.preventDefault();
      scrollWithOffset('#planos');
      history.replaceState(null, '', '#planos');
      updateActiveLink();
    });
  }
});

// Scroll suave para o logo da navbar
window.addEventListener('DOMContentLoaded', function() {
  const logoLink = document.querySelector('.navbar-brand[href="#home"]');
  if (logoLink) {
    logoLink.addEventListener('click', function(e) {
      e.preventDefault();
      scrollWithOffset('#home');
      history.replaceState(null, '', '#home');
      updateActiveLink();
    });
  }
});

// === Carrossel dos cards dos planos ===
document.addEventListener('DOMContentLoaded', function() {
  const cards = Array.from(document.querySelectorAll('.plan-carousel-item'));
  const leftBtn = document.querySelector('.plans-arrow.left');
  const rightBtn = document.querySelector('.plans-arrow.right');
  let current = 0;
  function updateCarousel() {
    cards.forEach((card, idx) => {
      card.classList.remove('active', 'inactive');
      if (idx === current) {
        card.classList.add('active');
      } else {
        card.classList.add('inactive');
      }
    });
  }
  function prevCard() {
    current = (current - 1 + cards.length) % cards.length;
    updateCarousel();
  }
  function nextCard() {
    current = (current + 1) % cards.length;
    updateCarousel();
  }
  leftBtn.addEventListener('click', prevCard);
  rightBtn.addEventListener('click', nextCard);
  updateCarousel();
});
