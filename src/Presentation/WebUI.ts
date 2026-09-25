export const WebUIHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enlace — Acompanhantes Verificadas, Experiências & Acolhimento Inclusivo</title>
  
  <!-- Fontes Editoriais e Humanas: Playfair Display (sensual/editorial) & Plus Jakarta Sans (moderna/legível) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons via CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            serif: ['"Playfair Display"', 'Georgia', 'serif'],
            sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
          },
          colors: {
            brand: {
              wine: '#8B1538',
              crimson: '#A81D45',
              velvet: '#5C0D24',
              gold: '#D4AF37',
              champagne: '#E5C158',
              amber: '#F59E0B',
              whatsapp: '#25D366',
              whatsappDark: '#128C7E'
            }
          }
        }
      }
    }
  </script>

  <style>
    /* Transições suaves e naturais em toda a interface */
    *, *::before, *::after {
      transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
      transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
      transition-duration: 220ms;
    }

    /* TEMA LUMINOSO SENSUAL (Padrão: Acolhedor, Quente, Tons de Seda e Champagne) */
    :root {
      --bg-page: #FAF7F5;
      --bg-surface: #FFFFFF;
      --bg-card-subtle: #FDFBFA;
      --bg-pill: #F5ECE8;
      --border-subtle: #EDE2DC;
      --border-accent: #E2CDC4;
      --text-heading: #1C0913;
      --text-body: #523140;
      --text-muted: #855F70;
      --card-shadow: 0 8px 24px -4px rgba(139, 21, 56, 0.05), 0 2px 8px -2px rgba(0, 0, 0, 0.03);
      --card-hover-shadow: 0 24px 48px -10px rgba(139, 21, 56, 0.14), 0 8px 16px -4px rgba(0, 0, 0, 0.04);
    }

    /* TEMA NOTURNO CABERNET (Intimista, Nobre, Veludo Noir) */
    .theme-night {
      --bg-page: #0C0409;
      --bg-surface: #150811;
      --bg-card-subtle: #1C0C17;
      --bg-pill: #261120;
      --border-subtle: #2D1122;
      --border-accent: #4A1D39;
      --text-heading: #FFF1F4;
      --text-body: #E5BCCF;
      --text-muted: #A3758B;
      --card-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.7);
      --card-hover-shadow: 0 24px 50px -5px rgba(0, 0, 0, 0.9);
    }

    /* MODO ALTO CONTRASTE (WCAG 2.1 AA) */
    .high-contrast {
      background-color: #000000 !important;
      color: #FFFF00 !important;
    }
    .high-contrast * {
      background-color: #000000 !important;
      color: #FFFF00 !important;
      border-color: #FFFF00 !important;
    }
    .high-contrast button {
      background-color: #FFFF00 !important;
      color: #000000 !important;
      font-weight: 800 !important;
    }

    /* Scrollbar invisível */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    /* Animação Orgânica de Radar para Status Online */
    @keyframes radar-ripple {
      0% { transform: scale(0.95); opacity: 0.9; }
      50% { transform: scale(2.3); opacity: 0.25; }
      100% { transform: scale(3.0); opacity: 0; }
    }
    .radar-pulse-ring {
      position: absolute;
      inset: 0;
      border-radius: 9999px;
      background-color: #25D366;
      animation: radar-ripple 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
    }

    /* Animação de Shimmer Luminoso para Botões Nobres */
    @keyframes shimmer-pass {
      0% { transform: translateX(-120%); }
      100% { transform: translateX(250%); }
    }
    .shimmer-fx {
      position: relative;
      overflow: hidden;
    }
    .shimmer-fx::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 45%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.22), transparent);
      transform: translateX(-120%);
    }
    .shimmer-fx:hover::after {
      animation: shimmer-pass 1.3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    /* Wiggle Divertido e Amigável do WhatsApp ao Passar o Mouse */
    @keyframes wa-wiggle {
      0%, 100% { transform: rotate(0deg) scale(1); }
      20% { transform: rotate(-12deg) scale(1.15); }
      40% { transform: rotate(10deg) scale(1.18); }
      60% { transform: rotate(-6deg) scale(1.12); }
      80% { transform: rotate(4deg) scale(1.08); }
    }
    .btn-whatsapp:hover .wa-icon {
      animation: wa-wiggle 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* Pop Elástico de Coração nos Favoritos */
    @keyframes heart-pop {
      0% { transform: scale(1); }
      35% { transform: scale(1.45); }
      60% { transform: scale(0.9); }
      100% { transform: scale(1); }
    }
    .heart-active svg, .heart-active i {
      animation: heart-pop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.49) forwards;
      color: #E11D48 !important;
      fill: #E11D48 !important;
    }

    /* Entrada Elástica com Spring para Modais e Menus */
    @keyframes spring-down {
      0% { opacity: 0; transform: translateY(-10px) scale(0.96); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-spring-down {
      animation: spring-down 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes modal-pop {
      0% { opacity: 0; transform: scale(0.92) translateY(14px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-modal-pop {
      animation: modal-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Efeito de Underline Animado nos Links de Navegação */
    .nav-link {
      position: relative;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #A81D45, #D4AF37);
      border-radius: 9999px;
      transition: all 0.26s ease-out;
      transform: translateX(-50%);
    }
    .nav-link:hover::after {
      width: 100%;
    }
  </style>
</head>
<body style="background-color: var(--bg-page); color: var(--text-body);" class="font-sans min-h-screen flex flex-col antialiased selection:bg-brand-crimson selection:text-white">

  <!-- ====================================================================== -->
  <!-- BARRA DE NAVEGAÇÃO PRINCIPAL (HUMANIZADA, LUXO & ALTA CONVERSÃO) -->
  <!-- ====================================================================== -->
  <header style="background-color: var(--bg-surface); border-color: var(--border-subtle);" class="border-b sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      
      <!-- Marca & Seletor de Cidade -->
      <div class="flex items-center gap-5">
        <a href="/" class="flex flex-col group text-decoration-none">
          <span class="font-serif text-2xl md:text-3xl font-bold tracking-tight text-brand-wine dark:text-rose-100 flex items-center gap-1.5 group-hover:opacity-90">
            enlace
            <span class="inline-block w-2 h-2 rounded-full bg-brand-crimson group-hover:scale-130 transition-transform"></span>
          </span>
          <span style="color: var(--text-muted);" class="text-[9px] uppercase tracking-widest font-semibold font-sans -mt-1 group-hover:text-brand-crimson">
            Acompanhantes & Experiências
          </span>
        </a>

        <!-- Seletor de Cidade Humanizado -->
        <div class="relative hidden sm:block">
          <button onclick="toggleCityDropdown()" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="group/city flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold hover:border-brand-crimson hover:shadow-md transition-all">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-brand-crimson group-hover/city:scale-115 transition-transform"></i>
            <span id="current-location-text">Rio Branco, AC</span>
            <i data-lucide="chevron-down" class="w-3 h-3 opacity-60 group-hover/city:translate-y-0.5 transition-transform"></i>
          </button>
          
          <div id="city-dropdown" style="background-color: var(--bg-surface); border-color: var(--border-accent);" class="hidden absolute left-0 mt-2 w-56 rounded-2xl border shadow-xl p-2 z-50 animate-spring-down">
            <div class="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 text-brand-crimson">Cidades Ativas</div>
            <button onclick="selectCity('Rio Branco', 'AC')" class="group/item w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-between hover:translate-x-1 transition-transform">
              <span>Rio Branco (AC)</span>
              <span class="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 px-2 py-0.5 rounded-md font-bold">Piloto Ativo</span>
            </button>
            <button onclick="selectCity('Cruzeiro do Sul', 'AC')" class="group/item w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-between hover:translate-x-1 transition-transform">
              <span>Cruzeiro do Sul (AC)</span>
            </button>
            <div class="border-t my-1" style="border-color: var(--border-subtle);"></div>
            <div class="px-3 py-1 text-[11px] text-gray-400">São Paulo, RJ e BH em breve</div>
          </div>
        </div>
      </div>

      <!-- Links de Navegação Principal com Underline Fluido -->
      <nav class="hidden md:flex items-center gap-7 text-xs font-semibold">
        <a href="#catalogo" style="color: var(--text-heading);" class="nav-link text-brand-crimson font-bold flex items-center gap-1">
          <span>Acompanhantes</span>
        </a>
        <a href="#stories" style="color: var(--text-body);" class="nav-link hover:text-brand-crimson flex items-center gap-1.5">
          <span>Stories & Vídeos</span>
          <span class="px-1.5 py-0.5 text-[9px] font-extrabold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200 uppercase animate-pulse">Novo</span>
        </a>
        <a href="#como-funciona" style="color: var(--text-body);" class="nav-link hover:text-brand-crimson">
          Como Funciona
        </a>
        <a href="#acessibilidade" style="color: var(--text-body);" class="nav-link hover:text-brand-crimson flex items-center gap-1">
          <i data-lucide="accessibility" class="w-3.5 h-3.5 text-brand-gold"></i>
          Acessibilidade & Inclusão
        </a>
      </nav>

      <!-- Ações do Topo: Atmosfera, Acessibilidade & Anuncie -->
      <div class="flex items-center gap-2.5">
        
        <!-- Alternador Discreto de Atmosfera (Dia / Noite) com Hover Glow -->
        <button id="btn-theme-toggle" onclick="toggleAtmosphere()" title="Alternar Ambiente Noturno / Luminoso" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-body);" class="w-9 h-9 rounded-full border flex items-center justify-center hover:border-brand-crimson hover:scale-105 active:scale-95 transition-all shadow-xs">
          <i id="theme-icon" data-lucide="moon" class="w-4 h-4 text-brand-wine dark:text-rose-300"></i>
        </button>

        <!-- Menu de Acessibilidade Discreto -->
        <div class="relative">
          <button onclick="toggleAccessibilityMenu()" title="Configurações de Acessibilidade" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-body);" class="w-9 h-9 rounded-full border flex items-center justify-center hover:border-brand-crimson hover:scale-105 active:scale-95 transition-all shadow-xs">
            <i data-lucide="accessibility" class="w-4 h-4 text-brand-gold"></i>
          </button>
          
          <div id="acc-menu" style="background-color: var(--bg-surface); border-color: var(--border-accent);" class="hidden absolute right-0 mt-2 w-64 rounded-2xl border shadow-xl p-3 z-50 text-xs animate-spring-down">
            <div class="font-bold text-brand-wine dark:text-rose-200 mb-2 flex items-center gap-1.5">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-brand-gold"></i>
              Adaptações Visuais (WCAG)
            </div>
            <div class="space-y-2">
              <button onclick="toggleContrast()" style="background-color: var(--bg-pill);" class="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-semibold hover:border-brand-crimson border">
                <span>Alto Contraste</span>
                <i data-lucide="eye" class="w-3.5 h-3.5 text-brand-gold"></i>
              </button>
              <div class="flex items-center justify-between px-3 py-1 font-semibold">
                <span>Tamanho da Fonte:</span>
                <div class="flex gap-1.5">
                  <button onclick="changeFontSize(-1)" class="w-7 h-7 rounded-lg border flex items-center justify-center font-bold hover:bg-rose-50 dark:hover:bg-rose-950 active:scale-95">A-</button>
                  <button onclick="changeFontSize(1)" class="w-7 h-7 rounded-lg border flex items-center justify-center font-bold hover:bg-rose-50 dark:hover:bg-rose-950 active:scale-95">A+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botão Entrar -->
        <button onclick="openLoginModal()" style="color: var(--text-heading); background-color: var(--bg-pill); border-color: var(--border-subtle);" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold hover:border-brand-crimson hover:scale-105 active:scale-95 transition-all shadow-xs">
          <i data-lucide="user" class="w-3.5 h-3.5 text-brand-crimson"></i>
          <span>Entrar</span>
        </button>

        <!-- CTA Principal: Anuncie Aqui com Brilho Vivo -->
        <a href="#anunciar" class="shimmer-fx group/cta inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-brand-crimson via-rose-600 to-amber-600 hover:opacity-95 shadow-md shadow-brand-crimson/25 hover:shadow-xl hover:shadow-brand-crimson/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all">
          <i data-lucide="plus-circle" class="w-3.5 h-3.5 group-hover/cta:rotate-90 transition-transform"></i>
          <span>Anuncie Aqui</span>
        </a>
      </div>
    </div>
  </header>

  <!-- ====================================================================== -->
  <!-- BARRA DE STORIES & VÍDEOS AO VIVO (MICRO-INTERAÇÕES VIVAS) -->
  <!-- ====================================================================== -->
  <section id="stories" class="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2 w-full">
    <div class="flex items-center justify-between mb-3">
      <h2 style="color: var(--text-heading);" class="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-brand-wine dark:text-rose-300">
        <i data-lucide="video" class="w-3.5 h-3.5 text-brand-crimson"></i>
        Stories & Perfis ao Vivo Hoje
      </h2>
      <span style="color: var(--text-muted);" class="text-[11px] font-medium hidden sm:inline">Vídeos e fotos recentes com verificação em tempo real</span>
    </div>

    <div class="flex items-center gap-5 overflow-x-auto no-scrollbar pb-3 pt-1">
      
      <!-- Story 1: Juliana -->
      <button onclick="openStoryModal('Juliana VIP', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85', 'Boa tarde amores! Já estou atendendo no Bosque em suíte climatizada com elevador privativo. ☕✨')" class="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none transition-transform hover:-translate-y-1.5 active:scale-95">
        <div class="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] bg-gradient-to-tr from-brand-gold via-brand-crimson to-amber-400 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-brand-gold/40 transition-all shadow-md">
          <div class="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-rose-950">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Juliana VIP" class="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500">
          </div>
        </div>
        <div class="flex items-center gap-1">
          <span class="relative flex h-2 w-2">
            <span class="radar-pulse-ring"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span style="color: var(--text-heading);" class="text-[11px] font-bold group-hover:text-brand-crimson transition-colors">Juliana VIP</span>
        </div>
        <span class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold -mt-1 group-hover:scale-105 group-hover:-translate-y-0.5 transition-all shadow-xs">Ao Vivo 📹</span>
      </button>

      <!-- Story 2: Valentina -->
      <button onclick="openStoryModal('Valentina Rossi', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85', 'Sessões de massagem tântrica disponíveis hoje à tarde no Jardim Europa. Espaço térreo e acolhedor! 🌸')" class="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none transition-transform hover:-translate-y-1.5 active:scale-95">
        <div class="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] bg-gradient-to-tr from-brand-crimson via-rose-500 to-amber-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-brand-crimson/40 transition-all shadow-md">
          <div class="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-rose-950">
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80" alt="Valentina Rossi" class="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500">
          </div>
        </div>
        <div class="flex items-center gap-1">
          <span class="relative flex h-2 w-2">
            <span class="radar-pulse-ring"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span style="color: var(--text-heading);" class="text-[11px] font-bold group-hover:text-brand-crimson transition-colors">Valentina</span>
        </div>
        <span class="text-[9px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-semibold -mt-1 group-hover:scale-105 group-hover:-translate-y-0.5 transition-all shadow-xs">Novo Ensaio ✨</span>
      </button>

      <!-- Story 3: Lucas -->
      <button onclick="openStoryModal('Lucas Moreno', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85', 'Espaço com iluminação suave e isolamento acústico no Centro. Momentos tranquilos e sem pressa. ✨')" class="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none transition-transform hover:-translate-y-1.5 active:scale-95">
        <div class="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-400 via-brand-wine to-emerald-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-amber-500/40 transition-all shadow-md">
          <div class="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-rose-950">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="Lucas Moreno" class="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500">
          </div>
        </div>
        <div class="flex items-center gap-1">
          <span class="relative flex h-2 w-2">
            <span class="radar-pulse-ring"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span style="color: var(--text-heading);" class="text-[11px] font-bold group-hover:text-brand-crimson transition-colors">Lucas</span>
        </div>
        <span class="text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold -mt-1 group-hover:scale-105 group-hover:-translate-y-0.5 transition-all shadow-xs">Com Local 🏠</span>
      </button>

      <!-- Story 4: Camila -->
      <button onclick="openStoryModal('Camila Ferraz', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85', 'Atendimento com total paciência e carinho no Aviário. Espaço térreo preparado e cão-guia muito bem-vindo! 🐕💛')" class="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none transition-transform hover:-translate-y-1.5 active:scale-95">
        <div class="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] bg-gradient-to-tr from-rose-400 via-brand-gold to-brand-crimson group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-purple-500/40 transition-all shadow-md">
          <div class="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-rose-950">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" alt="Camila Ferraz" class="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500">
          </div>
        </div>
        <div class="flex items-center gap-1">
          <span class="relative flex h-2 w-2">
            <span class="radar-pulse-ring"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span style="color: var(--text-heading);" class="text-[11px] font-bold group-hover:text-brand-crimson transition-colors">Camila</span>
        </div>
        <span class="text-[9px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-semibold -mt-1 group-hover:scale-105 group-hover:-translate-y-0.5 transition-all shadow-xs">Inclusiva PcD 🐕</span>
      </button>

      <!-- Story 5: Rafaella -->
      <button onclick="openStoryModal('Rafaella Santos', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=85', 'Suíte privativa climatizada com banheira de hidromassagem na Cerâmica. Atendimento VIP e discreto. 🛁🥂')" class="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none transition-transform hover:-translate-y-1.5 active:scale-95">
        <div class="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] bg-gradient-to-tr from-brand-gold via-brand-crimson to-rose-400 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-brand-crimson/40 transition-all shadow-md">
          <div class="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-rose-950">
            <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80" alt="Rafaella Santos" class="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500">
          </div>
        </div>
        <div class="flex items-center gap-1">
          <span class="relative flex h-2 w-2">
            <span class="radar-pulse-ring"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span style="color: var(--text-heading);" class="text-[11px] font-bold group-hover:text-brand-crimson transition-colors">Rafaella</span>
        </div>
        <span class="text-[9px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-semibold -mt-1 group-hover:scale-105 group-hover:-translate-y-0.5 transition-all shadow-xs">VIP Diamante 💎</span>
      </button>
    </div>
  </section>

  <!-- ====================================================================== -->
  <!-- BARRA DE BUSCA & CHIPS INTERATIVOS (MICRO-INTERAÇÕES ORGÂNICAS) -->
  <!-- ====================================================================== -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 py-4 w-full">
    <div style="background-color: var(--bg-surface); border-color: var(--border-subtle); box-shadow: var(--card-shadow);" class="rounded-3xl border p-4 sm:p-5">
      
      <!-- Linha de Busca Textual Direta com Focus Glow -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div class="relative flex-grow group/search">
          <i data-lucide="search" class="w-4 h-4 text-brand-crimson absolute left-4 top-1/2 -translate-y-1/2 group-focus-within/search:scale-120 group-focus-within/search:text-brand-wine transition-all"></i>
          <input id="search-keyword" type="text" onkeyup="filterByKeyword()" placeholder="Buscar por nome, bairro (Bosque, Centro...), massagem, acessibilidade..." style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="w-full pl-11 pr-4 py-3 rounded-2xl text-xs sm:text-sm border focus:outline-none focus:border-brand-crimson focus:ring-4 focus:ring-brand-crimson/15 font-medium transition-all shadow-inner">
        </div>

        <button onclick="toggleAdvancedFilters()" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="group/filter inline-flex items-center justify-center gap-2 px-4.5 py-3 rounded-2xl border text-xs font-bold hover:border-brand-crimson hover:-translate-y-0.5 active:translate-y-0 transition-all flex-shrink-0 shadow-xs">
          <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5 text-brand-crimson group-hover/filter:rotate-90 transition-transform duration-300"></i>
          <span>Filtros Especiais</span>
          <span id="active-filters-badge" class="hidden w-2 h-2 rounded-full bg-brand-crimson"></span>
        </button>
      </div>

      <!-- Carrossel de Chips / Tags Rápidas com Efeito Hover Lift e Glow -->
      <div class="flex items-center gap-2.5 overflow-x-auto no-scrollbar pt-3 mt-1 border-t" style="border-color: var(--border-subtle);">
        
        <button onclick="selectQuickFilter('ALL')" id="chip-ALL" class="quick-chip active group/c px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-brand-crimson text-white transition-all shadow-sm hover:shadow-md hover:shadow-brand-crimson/30 hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5">
          <i data-lucide="flame" class="w-3.5 h-3.5 group-hover/c:scale-120 transition-transform"></i>
          <span>Todos os Perfis</span>
        </button>

        <button onclick="selectQuickFilter('ONLINE')" id="chip-ONLINE" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="quick-chip group/c px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Online Agora</span>
        </button>

        <button onclick="selectQuickFilter('PCD')" id="chip-PCD" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="quick-chip group/c px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border hover:border-brand-gold hover:shadow-md hover:shadow-brand-gold/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-1.5">
          <i data-lucide="accessibility" class="w-3.5 h-3.5 text-brand-gold group-hover/c:scale-120 transition-transform"></i>
          <span>Acessibilidade & Inclusão</span>
        </button>

        <button onclick="selectQuickFilter('LIBRAS')" id="chip-LIBRAS" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="quick-chip group/c px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border hover:border-brand-crimson hover:shadow-md hover:shadow-brand-crimson/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-1.5">
          <i data-lucide="message-square-text" class="w-3.5 h-3.5 text-brand-crimson group-hover/c:scale-120 transition-transform"></i>
          <span>Fluente em Libras</span>
        </button>

        <button onclick="selectQuickFilter('OWN_PLACE')" id="chip-OWN_PLACE" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="quick-chip group/c px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border hover:border-amber-500 hover:shadow-md hover:shadow-amber-500/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-1.5">
          <i data-lucide="home" class="w-3.5 h-3.5 text-amber-600 group-hover/c:scale-120 transition-transform"></i>
          <span>Com Local Próprio</span>
        </button>

        <button onclick="selectQuickFilter('DIAMANTE')" id="chip-DIAMANTE" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="quick-chip group/c px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border hover:border-brand-gold hover:shadow-md hover:shadow-brand-gold/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-1.5">
          <i data-lucide="sparkles" class="w-3.5 h-3.5 text-brand-gold group-hover/c:scale-120 transition-transform"></i>
          <span>VIP Diamante</span>
        </button>
      </div>

      <!-- Painel Gaveta de Filtros Avançados / Acessibilidade NBR 9050 -->
      <div id="advanced-filters-panel" class="hidden pt-4 mt-3 border-t animate-spring-down" style="border-color: var(--border-subtle);">
        <div class="text-xs font-bold text-brand-wine dark:text-rose-200 mb-2.5 flex items-center gap-1.5">
          <i data-lucide="heart" class="w-3.5 h-3.5 text-brand-crimson"></i>
          Recursos Especiais de Acessibilidade e Atendimento
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-medium" id="adv-checkboxes">
          <label class="flex items-center gap-2 p-2.5 rounded-2xl border cursor-pointer hover:border-brand-crimson hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all" style="background-color: var(--bg-pill); border-color: var(--border-subtle);">
            <input type="checkbox" value="COMM_LIBRAS" class="acc-filter rounded text-brand-crimson focus:ring-0" onchange="triggerSearch()">
            <span>Fluência em Libras (Surdos)</span>
          </label>
          <label class="flex items-center gap-2 p-2.5 rounded-2xl border cursor-pointer hover:border-brand-crimson hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all" style="background-color: var(--bg-pill); border-color: var(--border-subtle);">
            <input type="checkbox" value="MOB_RAMP_ELEVATOR" class="acc-filter rounded text-brand-crimson focus:ring-0" onchange="triggerSearch()">
            <span>Rampa NBR 9050 / Elevador</span>
          </label>
          <label class="flex items-center gap-2 p-2.5 rounded-2xl border cursor-pointer hover:border-brand-crimson hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all" style="background-color: var(--bg-pill); border-color: var(--border-subtle);">
            <input type="checkbox" value="MOB_ADAPTED_BATHROOM" class="acc-filter rounded text-brand-crimson focus:ring-0" onchange="triggerSearch()">
            <span>Banheiro com Barras de Apoio</span>
          </label>
          <label class="flex items-center gap-2 p-2.5 rounded-2xl border cursor-pointer hover:border-brand-crimson hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all" style="background-color: var(--bg-pill); border-color: var(--border-subtle);">
            <input type="checkbox" value="NEURO_LIGHT_CONTROL" class="acc-filter rounded text-brand-crimson focus:ring-0" onchange="triggerSearch()">
            <span>Iluminação Suave (Neurodivergentes)</span>
          </label>
          <label class="flex items-center gap-2 p-2.5 rounded-2xl border cursor-pointer hover:border-brand-crimson hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all" style="background-color: var(--bg-pill); border-color: var(--border-subtle);">
            <input type="checkbox" value="NEURO_SILENT_SPACE" class="acc-filter rounded text-brand-crimson focus:ring-0" onchange="triggerSearch()">
            <span>Ambiente com Isolamento Acústico</span>
          </label>
          <label class="flex items-center gap-2 p-2.5 rounded-2xl border cursor-pointer hover:border-brand-crimson hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all" style="background-color: var(--bg-pill); border-color: var(--border-subtle);">
            <input type="checkbox" value="SUPP_GUIDE_DOG" class="acc-filter rounded text-brand-crimson focus:ring-0" onchange="triggerSearch()">
            <span>Espaço Apto para Cão-Guia</span>
          </label>
        </div>

        <div class="flex justify-end gap-3 mt-3">
          <button onclick="clearAllFilters()" style="color: var(--text-muted);" class="text-xs font-semibold hover:text-brand-crimson transition-colors">Limpar Filtros</button>
        </div>
      </div>
    </div>
  </section>

  <!-- ====================================================================== -->
  <!-- VITRINE PRINCIPAL DE ACOMPANHANTES (CARDS EDITORIAIS HUMANIZADOS) -->
  <!-- ====================================================================== -->
  <main id="catalogo" class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
    
    <!-- Cabeçalho do Catálogo com Contagem -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 style="color: var(--text-heading);" class="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
          Acompanhantes em Rio Branco
        </h1>
        <p style="color: var(--text-muted);" class="text-xs sm:text-sm mt-0.5">
          Perfis com fotos e vídeos 100% verificados • Atendimento consensual, inclusivo e discreto
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span style="background-color: var(--bg-surface); border-color: var(--border-subtle); color: var(--text-body);" class="text-xs font-semibold px-3.5 py-1.5 rounded-full border shadow-xs flex items-center gap-2">
          <span class="relative flex h-2 w-2">
            <span class="radar-pulse-ring"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span id="results-count">Carregando catálogo...</span>
        </span>
      </div>
    </div>

    <!-- Grid de Perfis -->
    <div id="providers-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      <!-- Injetado dinamicamente via script com estética humana autêntica -->
    </div>
  </main>

  <!-- ====================================================================== -->
  <!-- MODAL: CONVERSA DIRETA NO WHATSAPP (CORRIGIDO: AVATAR 56PX E CONTAINER) -->
  <!-- ====================================================================== -->
  <div id="modal-whatsapp" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div style="background-color: var(--bg-surface); border-color: var(--border-accent);" class="border rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-modal-pop overflow-hidden">
      
      <!-- Botão Fechar com Rotação Suave -->
      <button onclick="closeModal('modal-whatsapp')" style="color: var(--text-muted);" class="absolute top-5 right-5 hover:text-brand-crimson p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950 hover:rotate-90 transition-all">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <!-- Cabeçalho estilo Contato Real com Avatar Perfeitamente Proporcionado -->
      <div class="flex items-center gap-3.5 mb-4 pb-3 border-b" style="border-color: var(--border-subtle);">
        <div class="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-full overflow-hidden border-2 border-brand-crimson shadow-md shrink-0">
          <img id="wa-avatar" src="" alt="Acompanhante" class="w-full h-full object-cover">
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <h3 id="wa-name" style="color: var(--text-heading);" class="font-serif text-lg font-bold truncate">Nome da Acompanhante</h3>
            <span class="text-[10px] text-emerald-800 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full shrink-0">Verificada</span>
          </div>
          <p id="wa-location" style="color: var(--text-muted);" class="text-xs truncate">Bosque, Rio Branco • Atende Hoje</p>
        </div>
      </div>

      <p style="color: var(--text-body);" class="text-xs mb-3.5 leading-relaxed">
        Você conversará <strong>diretamente no WhatsApp da anunciante</strong>, sem intermediários. Personalize abaixo sua mensagem de contato:
      </p>

      <form id="form-whatsapp" onsubmit="event.preventDefault(); triggerWhatsAppRedirect();" class="space-y-3">
        <input type="hidden" id="wa-provider-id">
        <input type="hidden" id="wa-provider-phone">

        <div class="grid grid-cols-2 gap-2.5">
          <div>
            <label style="color: var(--text-heading);" class="block text-[11px] font-bold mb-1">Quando prefere:</label>
            <select id="wa-time-pref" onchange="updateCustomMessage()" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="w-full rounded-xl p-2.5 text-xs border font-medium focus:border-brand-crimson focus:outline-none">
              <option value="hoje à noite">Hoje à noite</option>
              <option value="hoje à tarde">Hoje à tarde</option>
              <option value="amanhã">Amanhã</option>
              <option value="este final de semana">Neste final de semana</option>
            </select>
          </div>
          <div>
            <label style="color: var(--text-heading);" class="block text-[11px] font-bold mb-1">Onde será:</label>
            <select id="wa-location-pref" onchange="updateCustomMessage()" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="w-full rounded-xl p-2.5 text-xs border font-medium focus:border-brand-crimson focus:outline-none">
              <option value="no seu local privativo">No seu espaço / local</option>
              <option value="no meu domicílio">No meu domicílio</option>
              <option value="em hotel/motel">Em Hotel ou Motel</option>
            </select>
          </div>
        </div>

        <div>
          <label style="color: var(--text-heading);" class="block text-[11px] font-bold mb-1">Adaptação necessária (opcional):</label>
          <select id="wa-acc-pref" onchange="updateCustomMessage()" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="w-full rounded-xl p-2.5 text-xs border font-medium focus:border-brand-crimson focus:outline-none">
            <option value="sem adaptações específicas">Nenhuma necessidade específica</option>
            <option value="preciso de rampa/elevador para cadeira de rodas">Cadeirante / Necessito rampa/elevador</option>
            <option value="comunicação em Libras (sou surdo)">Comunicação em Libras (Surdo)</option>
            <option value="ambiente calmo com luz e som suaves">Neurodivergente / Luz e som suaves</option>
            <option value="estarei com cão-guia">Acompanhado de cão-guia</option>
          </select>
        </div>

        <!-- Preview da Mensagem Amigável -->
        <div>
          <label style="color: var(--text-muted);" class="block text-[10px] font-bold uppercase tracking-wider mb-1">Mensagem que será enviada no WhatsApp:</label>
          <div id="wa-message-preview" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="p-3 rounded-2xl border text-xs font-mono leading-relaxed italic">
            <!-- Gerado via JS -->
          </div>
        </div>

        <div class="pt-2">
          <button type="submit" class="btn-whatsapp shimmer-fx w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-2">
            <i data-lucide="message-circle" class="wa-icon w-4 h-4"></i>
            <span>Iniciar Conversa no WhatsApp</span>
          </button>
          <p style="color: var(--text-muted);" class="text-[10px] text-center mt-2">
            Ao clicar, seu aplicativo oficial do WhatsApp será aberto com o texto pronto.
          </p>
        </div>
      </form>
    </div>
  </div>

  <!-- ====================================================================== -->
  <!-- MODAL: ENSAIO SENSUAL PRIVADO & PIX (15 FOTOS EM ALTA RESOLUÇÃO) -->
  <!-- ====================================================================== -->
  <div id="modal-paywall" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div style="background-color: var(--bg-surface); border-color: var(--border-accent);" class="border rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar animate-modal-pop">
      <button onclick="closeModal('modal-paywall')" style="color: var(--text-muted);" class="absolute top-5 right-5 hover:text-brand-crimson p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950 hover:rotate-90 transition-all">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div class="text-center mb-4">
        <span class="inline-flex items-center gap-1 text-brand-gold text-[11px] font-bold uppercase tracking-widest">
          <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
          Ensaio Exclusivo em Alta Definição
        </span>
        <h3 id="paywall-title" style="color: var(--text-heading);" class="font-serif text-xl font-bold mt-1">Ensaio Sensual Privado</h3>
        <p style="color: var(--text-muted);" class="text-xs mt-0.5">Série completa com 15 fotografias íntimas em lingerie de renda</p>
      </div>

      <!-- Preview com Blur e Trava -->
      <div id="paywall-preview-box" style="background-color: var(--bg-pill); border-color: var(--border-subtle);" class="relative rounded-2xl overflow-hidden border h-60 flex items-center justify-center mb-4 shadow-inner">
        <img id="paywall-preview-img" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" alt="Preview" class="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-40">
        <div class="relative z-10 text-center p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/20 text-white max-w-xs">
          <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-2 text-brand-gold shadow-md">
            <i data-lucide="lock" class="w-6 h-6"></i>
          </div>
          <div class="font-bold text-sm">Álbum Privado com 15 Fotos</div>
          <div class="text-xs text-amber-300 font-bold mt-1">Valor Único: R$ 35,00 via Pix</div>
          <div class="text-[10px] text-gray-200 mt-1">Liberado imediatamente na tela após o pagamento</div>
        </div>
      </div>

      <!-- Caixa Pix Ativa -->
      <div id="pix-checkout-box" class="hidden space-y-3.5">
        <div style="background-color: var(--bg-pill); border-color: var(--border-subtle);" class="p-4 rounded-2xl border text-center">
          <div class="text-xs font-bold text-brand-wine dark:text-rose-200 mb-2 flex items-center justify-center gap-1.5">
            <i data-lucide="qr-code" class="w-4 h-4 text-brand-crimson"></i>
            Pague com Qualquer Aplicativo Bancário via Pix
          </div>
          
          <img id="pix-qr-img" src="" alt="QR Code Pix" class="w-40 h-40 mx-auto rounded-xl bg-white p-2 border shadow-sm mb-2.5">
          
          <div style="color: var(--text-muted);" class="text-[11px] mb-1 font-medium">Código Pix Copia e Cola:</div>
          <div class="flex gap-2">
            <input id="pix-copia-cola" readonly style="background-color: var(--bg-surface); border-color: var(--border-subtle); color: var(--text-heading);" class="flex-grow border rounded-xl px-2.5 py-1.5 text-[11px] font-mono truncate">
            <button onclick="copyPixCode()" class="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-crimson hover:bg-brand-velvet transition hover:scale-105 active:scale-95">
              Copiar
            </button>
          </div>
        </div>

        <button onclick="simulatePixPayment()" class="shimmer-fx w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-crimson to-amber-600 hover:opacity-95 shadow-lg shadow-brand-crimson/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-2">
          <i data-lucide="check-circle" class="w-4 h-4"></i>
          <span>Já Fiz o Pix (Confirmar Pagamento)</span>
        </button>
      </div>

      <!-- Ações Iniciais -->
      <div id="pix-initial-actions" class="flex items-center justify-between pt-2">
        <div class="text-left">
          <span style="color: var(--text-muted);" class="text-[10px] block">Acesso vitalício</span>
          <span class="font-bold text-base text-brand-wine dark:text-rose-100">R$ 35,00</span>
        </div>
        <button onclick="startPixCheckout()" class="shimmer-fx px-6 py-2.5 rounded-full text-xs font-bold text-white bg-brand-crimson hover:bg-brand-velvet hover:shadow-lg hover:shadow-brand-crimson/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all flex items-center gap-1.5">
          <i data-lucide="zap" class="w-3.5 h-3.5 text-brand-gold"></i>
          <span>Desbloquear via Pix</span>
        </button>
      </div>

      <!-- Álbum Desbloqueado com Sucesso -->
      <div id="pix-unlocked-box" class="hidden text-center space-y-4 py-2">
        <div class="p-3 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
          <i data-lucide="check-check" class="w-5 h-5 text-emerald-600"></i>
          <span>Pagamento confirmado! Álbum liberado em alta resolução.</span>
        </div>

        <div class="grid grid-cols-2 gap-2 text-left" id="unlocked-gallery">
          <div class="relative rounded-xl overflow-hidden h-36">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85" class="w-full h-full object-cover">
          </div>
          <div class="relative rounded-xl overflow-hidden h-36">
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=85" class="w-full h-full object-cover">
          </div>
        </div>

        <button onclick="closeModal('modal-paywall')" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="w-full py-2.5 rounded-xl text-xs font-bold border hover:border-brand-crimson">
          Fechar Álbum
        </button>
      </div>
    </div>
  </div>

  <!-- ====================================================================== -->
  <!-- MODAL: VISUALIZADOR DE STORY (ESTILO INSTAGRAM / FATAL MODEL) -->
  <!-- ====================================================================== -->
  <div id="modal-story" class="fixed inset-0 bg-black/90 backdrop-blur-md z-50 hidden flex items-center justify-center p-4">
    <div class="relative max-w-sm w-full h-[620px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between animate-modal-pop">
      <!-- Imagem de Fundo do Story -->
      <img id="story-bg" src="" alt="Story" class="absolute inset-0 w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>

      <!-- Barra de Progresso no Topo -->
      <div class="relative z-10 p-4 space-y-3">
        <div class="w-full h-1 bg-white/30 rounded-full overflow-hidden">
          <div class="h-full bg-white rounded-full w-3/4 animate-pulse"></div>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-full overflow-hidden border-2 border-brand-gold shrink-0">
              <img id="story-avatar" src="" alt="Avatar" class="w-full h-full object-cover">
            </div>
            <div>
              <div id="story-name" class="text-white text-xs font-bold">Nome</div>
              <div class="text-[10px] text-gray-300">Publicado há 2 horas • Rio Branco</div>
            </div>
          </div>
          <button onclick="closeModal('modal-story')" class="text-white p-1 hover:text-brand-crimson hover:rotate-90 transition-all">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <!-- Legenda do Story e CTA WhatsApp -->
      <div class="relative z-10 p-5 space-y-3">
        <p id="story-caption" class="text-white text-xs leading-relaxed font-medium bg-black/40 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
          Legenda do story...
        </p>

        <button onclick="replyStoryOnWhatsApp()" class="btn-whatsapp shimmer-fx w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-2">
          <i data-lucide="message-circle" class="wa-icon w-4 h-4"></i>
          <span>Responder no WhatsApp</span>
        </button>
      </div>
    </div>
  </div>

  <!-- ====================================================================== -->
  <!-- SEÇÃO DE CONFIANÇA & INCLUSÃO (POR QUE O ENLACE É DIFERENTE) -->
  <!-- ====================================================================== -->
  <section id="como-funciona" class="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t w-full" style="border-color: var(--border-subtle);">
    <div class="text-center max-w-2xl mx-auto mb-10">
      <h2 style="color: var(--text-heading);" class="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
        A evolução do marketplace adulto
      </h2>
      <p style="color: var(--text-muted);" class="text-xs sm:text-sm mt-2 leading-relaxed">
        Criamos uma plataforma segura, moderna e sem preconceitos para que encontros consensuais aconteçam com total respeito, dignidade e acessibilidade universal.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div style="background-color: var(--bg-surface); border-color: var(--border-subtle); box-shadow: var(--card-shadow);" class="p-5 rounded-3xl border hover:-translate-y-1 hover:shadow-lg transition-all">
        <div class="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center mb-3 text-brand-crimson">
          <i data-lucide="shield-check" class="w-5 h-5"></i>
        </div>
        <h3 style="color: var(--text-heading);" class="font-bold text-sm mb-1">Fotos & Perfis Reais</h3>
        <p style="color: var(--text-muted);" class="text-xs leading-relaxed">Verificação obrigatória em vídeo de 100% das anunciantes. Sem fotos fakes ou desatualizadas.</p>
      </div>

      <div style="background-color: var(--bg-surface); border-color: var(--border-subtle); box-shadow: var(--card-shadow);" class="p-5 rounded-3xl border hover:-translate-y-1 hover:shadow-lg transition-all">
        <div class="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center mb-3 text-brand-gold">
          <i data-lucide="accessibility" class="w-5 h-5"></i>
        </div>
        <h3 style="color: var(--text-heading);" class="font-bold text-sm mb-1">Pioneirismo em Inclusão</h3>
        <p style="color: var(--text-muted);" class="text-xs leading-relaxed">Atendimento humanizado para pessoas com deficiência física, surdos (Libras) e neurodivergentes.</p>
      </div>

      <div style="background-color: var(--bg-surface); border-color: var(--border-subtle); box-shadow: var(--card-shadow);" class="p-5 rounded-3xl border hover:-translate-y-1 hover:shadow-lg transition-all">
        <div class="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center mb-3 text-purple-700">
          <i data-lucide="lock" class="w-5 h-5"></i>
        </div>
        <h3 style="color: var(--text-heading);" class="font-bold text-sm mb-1">Discrição & Sigilo</h3>
        <p style="color: var(--text-muted);" class="text-xs leading-relaxed">Pseudônimo público de clientes. Cobranças Pix sem qualquer menção a conteúdo adulto no extrato.</p>
      </div>

      <div style="background-color: var(--bg-surface); border-color: var(--border-subtle); box-shadow: var(--card-shadow);" class="p-5 rounded-3xl border hover:-translate-y-1 hover:shadow-lg transition-all">
        <div class="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-3 text-emerald-600">
          <i data-lucide="message-circle" class="w-5 h-5"></i>
        </div>
        <h3 style="color: var(--text-heading);" class="font-bold text-sm mb-1">WhatsApp Direto</h3>
        <p style="color: var(--text-muted);" class="text-xs leading-relaxed">Você combina diretamente com a acompanhante. Não cobramos comissão sobre encontros presenciais.</p>
      </div>
    </div>
  </section>

  <!-- ====================================================================== -->
  <!-- RODAPÉ COMPLETO & RESPONSÁVEL (+18 ANOS) -->
  <!-- ====================================================================== -->
  <footer style="background-color: var(--bg-surface); border-color: var(--border-subtle);" class="border-t py-10 text-xs mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Aviso Legal 18+ -->
      <div style="background-color: var(--bg-pill); border-color: var(--border-subtle);" class="p-4 rounded-2xl border mb-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <span class="w-10 h-10 rounded-full bg-brand-crimson text-white font-extrabold flex items-center justify-center flex-shrink-0 text-sm shadow-md">
          18+
        </span>
        <div style="color: var(--text-muted);" class="text-[11px] leading-relaxed">
          <strong>Aviso de Maioridade e Consentimento:</strong> Este portal é destinado exclusivamente a adultos maiores de 18 anos. Todos os anunciantes são profissionais autônomos e declaram sob as penas da lei que todas as imagens e serviços ofertados decorrem de livre vontade e consentimento. Repudiamos e combatemos rigorosamente qualquer forma de exploração sexual, tráfico de pessoas ou abuso.
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b" style="border-color: var(--border-subtle);">
        <div>
          <h4 style="color: var(--text-heading);" class="font-bold mb-2.5">Enlace</h4>
          <ul class="space-y-1.5" style="color: var(--text-muted);">
            <li><a href="#catalogo" class="hover:text-brand-crimson transition-colors">Acompanhantes</a></li>
            <li><a href="#stories" class="hover:text-brand-crimson transition-colors">Stories & Vídeos</a></li>
            <li><a href="#anunciar" class="hover:text-brand-crimson transition-colors">Anunciar Perfil</a></li>
            <li><a href="/api/v1/health" target="_blank" class="hover:text-brand-crimson transition-colors">Status do Sistema</a></li>
          </ul>
        </div>
        <div>
          <h4 style="color: var(--text-heading);" class="font-bold mb-2.5">Acessibilidade</h4>
          <ul class="space-y-1.5" style="color: var(--text-muted);">
            <li><a href="#" onclick="selectQuickFilter('PCD')" class="hover:text-brand-crimson transition-colors">Atendimento PcD</a></li>
            <li><a href="#" onclick="selectQuickFilter('LIBRAS')" class="hover:text-brand-crimson transition-colors">Intérpretes de Libras</a></li>
            <li><a href="#" class="hover:text-brand-crimson transition-colors">Locais com Rampa NBR 9050</a></li>
            <li><a href="#" class="hover:text-brand-crimson transition-colors">Espaços Neurodivergentes</a></li>
          </ul>
        </div>
        <div>
          <h4 style="color: var(--text-heading);" class="font-bold mb-2.5">Segurança & Ética</h4>
          <ul class="space-y-1.5" style="color: var(--text-muted);">
            <li><a href="#" class="hover:text-brand-crimson transition-colors">Dicas de Encontro Seguro</a></li>
            <li><a href="#" class="hover:text-brand-crimson transition-colors">Canal de Denúncias 24h</a></li>
            <li><a href="#" class="hover:text-brand-crimson transition-colors">Termos de Uso</a></li>
            <li><a href="#" class="hover:text-brand-crimson transition-colors">Privacidade & LGPD</a></li>
          </ul>
        </div>
        <div>
          <h4 style="color: var(--text-heading);" class="font-bold mb-2.5">Cidades</h4>
          <ul class="space-y-1.5" style="color: var(--text-muted);">
            <li><a href="#" class="hover:text-brand-crimson font-semibold transition-colors">Rio Branco (AC)</a></li>
            <li><a href="#" class="hover:text-brand-crimson transition-colors">Cruzeiro do Sul (AC)</a></li>
            <li><span class="text-gray-400">São Paulo (SP) — Breve</span></li>
            <li><span class="text-gray-400">Belo Horizonte (MG) — Breve</span></li>
          </ul>
        </div>
      </div>

      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p style="color: var(--text-muted);" class="text-[11px]">
          Plataforma Enlace © 2026 • Todos os direitos reservados • CNPJ sob sigilo operacional
        </p>
        <div class="flex items-center gap-3 text-[11px]" style="color: var(--text-muted);">
          <span>Rio Branco • Acre</span>
          <span>•</span>
          <span>100% Criptografado</span>
        </div>
      </div>
    </div>
  </footer>

  <!-- ====================================================================== -->
  <!-- SCRIPTS DE COMPORTAMENTO, FILTROS E CONEXÃO REAL -->
  <!-- ====================================================================== -->
  <script>
    let catalogItems = [];
    let currentSelectedStory = null;
    let activeQuickFilter = 'ALL';

    const providerHumanProfiles = {
      'Juliana VIP': {
        age: 24,
        height: '1,68m',
        weight: '58kg',
        photos: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85'
        ],
        services: ['GFE (Namoradinha)', 'Massagem Relaxante', 'Acessível PcD', 'Libras Fluente'],
        phone: '5568999881122',
        specialPlace: 'Suíte climatizada com elevador privativo'
      },
      'Lucas Moreno': {
        age: 27,
        height: '1,82m',
        weight: '78kg',
        photos: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85'
        ],
        services: ['Acolhedor TEA/TDAH', 'Sem Pressa', 'Jantar & Companhia', 'Espaço Silencioso'],
        phone: '5568999773344',
        specialPlace: 'Apartamento com isolamento acústico'
      },
      'Valentina Rossi': {
        age: 23,
        height: '1,70m',
        weight: '60kg',
        photos: [
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85'
        ],
        services: ['Massagem Tântrica', 'Banheira de Hidro', 'Lingerie Fina', 'Acesso Térreo'],
        phone: '5568999665544',
        specialPlace: 'Suíte térrea com ar-condicionado e hidro'
      },
      'Camila Ferraz': {
        age: 26,
        height: '1,64m',
        weight: '55kg',
        photos: [
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=85'
        ],
        services: ['Carinhosa & Doce', 'Acesso sem Degraus', 'Aceita Cão-Guia', 'Paciência Total'],
        phone: '5568999554433',
        specialPlace: 'Casa térrea ampla e acessível'
      },
      'Rafaella Santos': {
        age: 25,
        height: '1,75m',
        weight: '63kg',
        photos: [
          'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=85',
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85'
        ],
        services: ['Mulher Trans VIP', 'Suíte Luxo', 'Pernoite', 'Discrição Absoluta'],
        phone: '5568999443322',
        specialPlace: 'Espaço requintado na Cerâmica'
      }
    };

    const accLabelMap = {
      'COMM_LIBRAS': { label: 'Fluente em Libras', icon: 'message-square-text' },
      'MOB_RAMP_ELEVATOR': { label: 'Rampa / Elevador', icon: 'accessibility' },
      'MOB_ADAPTED_BATHROOM': { label: 'Banheiro Adaptado', icon: 'bath' },
      'MOB_WIDE_DOORS': { label: 'Portas Amplas 90cm', icon: 'door-open' },
      'NEURO_LIGHT_CONTROL': { label: 'Luz Suave / TEA', icon: 'sun-dim' },
      'NEURO_SILENT_SPACE': { label: 'Espaço Silencioso', icon: 'volume-x' },
      'SUPP_GUIDE_DOG': { label: 'Aceita Cão-Guia', icon: 'heart-handshake' }
    };

    let isNight = false;
    function toggleAtmosphere() {
      isNight = !isNight;
      document.body.classList.toggle('theme-night', isNight);
      const icon = document.getElementById('theme-icon');
      if (isNight) {
        icon.setAttribute('data-lucide', 'sun');
      } else {
        icon.setAttribute('data-lucide', 'moon');
      }
      if (window.lucide) lucide.createIcons();
    }

    function toggleAccessibilityMenu() {
      const menu = document.getElementById('acc-menu');
      menu.classList.toggle('hidden');
    }

    function toggleCityDropdown() {
      const drop = document.getElementById('city-dropdown');
      drop.classList.toggle('hidden');
    }

    function selectCity(city, uf) {
      document.getElementById('current-location-text').innerText = city + ', ' + uf;
      toggleCityDropdown();
      triggerSearch();
    }

    function toggleAdvancedFilters() {
      const panel = document.getElementById('advanced-filters-panel');
      panel.classList.toggle('hidden');
    }

    function toggleContrast() {
      document.body.classList.toggle('high-contrast');
    }

    let fontSize = 16;
    function changeFontSize(delta) {
      fontSize = Math.min(22, Math.max(14, fontSize + delta));
      document.documentElement.style.fontSize = fontSize + 'px';
    }

    function openModal(id) {
      document.getElementById(id).classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }

    function closeModal(id) {
      document.getElementById(id).classList.add('hidden');
    }

    const cardPhotoIndexes = {};
    function nextCardPhoto(event, cardId, maxPhotos) {
      event.stopPropagation();
      cardPhotoIndexes[cardId] = ((cardPhotoIndexes[cardId] || 0) + 1) % maxPhotos;
      updateCardPhotoDisplay(cardId);
    }

    function prevCardPhoto(event, cardId, maxPhotos) {
      event.stopPropagation();
      cardPhotoIndexes[cardId] = ((cardPhotoIndexes[cardId] || 0) - 1 + maxPhotos) % maxPhotos;
      updateCardPhotoDisplay(cardId);
    }

    function updateCardPhotoDisplay(cardId) {
      const img = document.getElementById('card-img-' + cardId);
      const indicator = document.getElementById('card-indicator-' + cardId);
      const photos = JSON.parse(img.getAttribute('data-photos'));
      const idx = cardPhotoIndexes[cardId] || 0;
      img.src = photos[idx];
      if (indicator) {
        indicator.innerText = (idx + 1) + '/' + photos.length;
      }
    }

    function selectQuickFilter(filter) {
      activeQuickFilter = filter;
      document.querySelectorAll('.quick-chip').forEach(el => {
        el.classList.remove('active', 'bg-brand-crimson', 'text-white');
        el.style.backgroundColor = 'var(--bg-pill)';
        el.style.color = 'var(--text-heading)';
      });

      const activeEl = document.getElementById('chip-' + filter);
      if (activeEl) {
        activeEl.classList.add('active', 'bg-brand-crimson', 'text-white');
        activeEl.style.backgroundColor = '';
        activeEl.style.color = '';
      }

      renderCatalog();
    }

    function clearAllFilters() {
      document.querySelectorAll('.acc-filter').forEach(c => c.checked = false);
      document.getElementById('search-keyword').value = '';
      selectQuickFilter('ALL');
    }

    function filterByKeyword() {
      renderCatalog();
    }

    async function triggerSearch() {
      const grid = document.getElementById('providers-grid');
      const countEl = document.getElementById('results-count');
      countEl.innerText = 'buscando...';

      const selectedAccs = Array.from(
        document.querySelectorAll('.acc-filter:checked')
      ).map(cb => cb.value);

      const params = new URLSearchParams({
        state_uf: 'AC',
        city: 'Rio Branco'
      });
      selectedAccs.forEach(a => params.append('accommodations', a));

      try {
        const res = await fetch('/api/v1/providers/search?' + params.toString());
        const data = await res.json();
        
        catalogItems = data.items || [];
        countEl.innerText = catalogItems.length + ' anunciantes verificadas';
        renderCatalog();
      } catch (err) {
        console.error(err);
        countEl.innerText = 'erro ao carregar';
      }
    }

    function renderCatalog() {
      const grid = document.getElementById('providers-grid');
      const keyword = (document.getElementById('search-keyword').value || '').toLowerCase().trim();
      
      let filtered = catalogItems.filter(p => {
        const human = providerHumanProfiles[p.artisticName] || {
          age: 24,
          height: '1,68m',
          photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85'],
          services: ['Atendimento Exclusivo'],
          phone: '5568999881122'
        };

        if (activeQuickFilter === 'PCD' && (!p.accessibilityFeatures || p.accessibilityFeatures.length === 0)) return false;
        if (activeQuickFilter === 'LIBRAS' && (!p.accessibilityFeatures || !p.accessibilityFeatures.includes('COMM_LIBRAS'))) return false;
        if (activeQuickFilter === 'DIAMANTE' && p.activePlanTier !== 'DIAMANTE') return false;

        if (keyword) {
          const matchName = p.artisticName.toLowerCase().includes(keyword);
          const matchNeigh = (p.neighborhood || '').toLowerCase().includes(keyword);
          const matchBio = (p.bio || '').toLowerCase().includes(keyword);
          const matchServices = human.services.some(s => s.toLowerCase().includes(keyword));
          if (!matchName && !matchNeigh && !matchBio && !matchServices) return false;
        }

        return true;
      });

      grid.innerHTML = '';

      if (filtered.length === 0) {
        grid.innerHTML = \`
          <div style="background-color: var(--bg-surface); border-color: var(--border-subtle);" class="col-span-full py-16 text-center rounded-3xl border">
            <i data-lucide="heart-off" class="w-10 h-10 text-brand-crimson mx-auto mb-3 opacity-60"></i>
            <div style="color: var(--text-heading);" class="font-serif text-lg font-bold">Nenhum perfil encontrado com estes filtros</div>
            <div style="color: var(--text-muted);" class="text-xs mt-1 max-w-sm mx-auto">Tente selecionar "Todos os Perfis" ou desmarcar algumas preferências.</div>
            <button onclick="clearAllFilters()" class="mt-4 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-brand-crimson hover:bg-brand-velvet hover:shadow-lg transition-all">
              Ver Todos os Perfis
            </button>
          </div>
        \`;
        if (window.lucide) lucide.createIcons();
        return;
      }

      filtered.forEach((p, idx) => {
        const cardId = 'card_' + idx;
        const human = providerHumanProfiles[p.artisticName] || {
          age: 24,
          height: '1,68m',
          weight: '58kg',
          photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85'],
          services: ['Atendimento VIP'],
          phone: '5568999881122',
          specialPlace: 'Local privativo climatizado'
        };

        const rateFormatted = p.minRateCents > 0 
          ? 'R$ ' + (p.minRateCents / 100).toFixed(0) 
          : 'R$ 250';

        const accTags = (p.accessibilityFeatures || []).map(f => {
          const item = accLabelMap[f] || { label: f, icon: 'check' };
          return \`<span style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold border hover:border-brand-crimson transition-colors">
            <i data-lucide="\${item.icon}" class="w-3 h-3 text-brand-crimson"></i>
            <span>\${item.label}</span>
          </span>\`;
        }).join('');

        const card = document.createElement('div');
        card.style = "background-color: var(--bg-surface); border-color: var(--border-subtle); box-shadow: var(--card-shadow);";
        card.className = "rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col group hover:-translate-y-2 hover:shadow-2xl hover:border-brand-crimson/30";

        card.innerHTML = \`
          <!-- Área Fotográfica com Proporção Vertical 3:4 e Carrossel Embutido -->
          <div class="relative aspect-[3/4] bg-neutral-200 overflow-hidden cursor-pointer" onclick="openProfileWhatsApp('\${p.artisticName}', '\${p.providerId}', '\${human.phone}', '\${p.neighborhood}')">
            
            <img id="card-img-\${cardId}" 
                 src="\${human.photos[0]}" 
                 data-photos='\${JSON.stringify(human.photos)}'
                 alt="\${p.artisticName}" 
                 class="w-full h-full object-cover object-center group-hover:scale-106 transition duration-700 ease-out">
            
            <!-- Degradê Suave para Leitura Perfeita -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none group-hover:from-black/90 transition-all"></div>

            <!-- Badges Superiores -->
            <div class="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
              <span class="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
                <span class="relative flex h-2 w-2">
                  <span class="radar-pulse-ring"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Online</span>
              </span>
              \${p.activePlanTier === 'DIAMANTE' ? '<span class="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs"><i data-lucide="sparkles" class="w-3 h-3"></i> VIP</span>' : ''}
            </div>

            <div class="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
              <span id="card-indicator-\${cardId}" class="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                1/\${human.photos.length}
              </span>
              <button onclick="toggleFavorite(event, '\${p.providerId}')" class="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-rose-400 hover:scale-120 active:scale-95 transition-all">
                <i data-lucide="heart" class="w-4 h-4"></i>
              </button>
            </div>

            <!-- Setas de Navegação de Foto com Glassmorphism Suave -->
            \${human.photos.length > 1 ? \`
              <button onclick="prevCardPhoto(event, '\${cardId}', \${human.photos.length})" class="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/85 text-white hover:text-brand-gold flex items-center justify-center backdrop-blur-md transition-all z-10 opacity-0 group-hover:opacity-100 hover:scale-115 active:scale-90">
                <i data-lucide="chevron-left" class="w-4 h-4"></i>
              </button>
              <button onclick="nextCardPhoto(event, '\${cardId}', \${human.photos.length})" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/85 text-white hover:text-brand-gold flex items-center justify-center backdrop-blur-md transition-all z-10 opacity-0 group-hover:opacity-100 hover:scale-115 active:scale-90">
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
              </button>
            \` : ''}

            <!-- Informações Sobrepostas na Foto (Visual Editorial de Luxo) -->
            <div class="absolute bottom-3.5 left-3.5 right-3.5 text-white pointer-events-none z-10">
              <div class="flex items-end justify-between">
                <div>
                  <div class="flex items-center gap-1.5">
                    <h2 class="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
                      \${p.artisticName}, \${human.age}
                    </h2>
                    <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 shrink-0" title="Identidade e Fotos 100% Verificadas"></i>
                  </div>
                  <p class="text-xs text-rose-200 font-medium flex items-center gap-1 drop-shadow-xs mt-0.5">
                    <i data-lucide="map-pin" class="w-3 h-3 text-brand-gold"></i>
                    \${p.neighborhood}, \${p.city}
                  </p>
                </div>
                <div class="text-right">
                  <div class="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">Cachê</div>
                  <div class="text-lg font-bold font-serif text-brand-gold drop-shadow-md">
                    \${rateFormatted}<span class="text-[11px] text-gray-200 font-sans font-normal">/h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Corpo do Card (Detalhes, Acessibilidade e Ações Diretas) -->
          <div class="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-4">
            <div>
              <!-- Medidas e Comodidade -->
              <div style="color: var(--text-muted);" class="text-[11px] font-semibold flex items-center gap-2 mb-2 pb-2 border-b" style="border-color: var(--border-subtle);">
                <span>\${human.height}</span>
                <span>•</span>
                <span>\${human.weight}</span>
                <span>•</span>
                <span class="truncate">\${human.specialPlace}</span>
              </div>

              <!-- Bio Afetuosa e Humana -->
              <p style="color: var(--text-body);" class="text-xs leading-relaxed line-clamp-2 italic mb-3">
                "\${p.bio || 'Atendimento carinhoso, atencioso e com total privacidade. Sem pressa, combinamos tudo com clareza.'}"
              </p>

              <!-- Tags de Acessibilidade e Atendimento -->
              <div class="flex flex-wrap gap-1.5 mb-2">
                \${accTags || '<span style="color: var(--text-muted);" class="text-[10px]">Local confortável e discreto</span>'}
              </div>
            </div>

            <!-- Botões de Ação Humana e Conversão Direta -->
            <div class="pt-2 space-y-2 border-t" style="border-color: var(--border-subtle);">
              
              <!-- Botão Principal: WhatsApp Oficial com Micro-Interação Wiggle -->
              <button onclick="openProfileWhatsApp('\${p.artisticName}', '\${p.providerId}', '\${human.phone}', '\${p.neighborhood}')" class="btn-whatsapp shimmer-fx w-full py-3 px-4 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <i data-lucide="message-circle" class="wa-icon w-4 h-4"></i>
                <span class="tracking-wide">Conversar no WhatsApp</span>
              </button>

              <!-- Botão Secundário: Ensaio Privado (Paywall Pix) -->
              <button onclick="openEnsaioPaywall('\${p.providerId}', '\${p.artisticName}')" style="background-color: var(--bg-pill); border-color: var(--border-subtle); color: var(--text-heading);" class="group/ens w-full py-2.5 px-3 rounded-2xl text-[11px] font-bold border hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-1.5">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-brand-gold group-hover/ens:rotate-12 group-hover/ens:scale-110 transition-transform"></i>
                <span>Ver Ensaio Privado (15 Fotos)</span>
              </button>
            </div>
          </div>
        \`;
        grid.appendChild(card);
      });

      if (window.lucide) lucide.createIcons();
    }

    function openProfileWhatsApp(name, id, phone, neighborhood) {
      document.getElementById('wa-provider-id').value = id;
      document.getElementById('wa-provider-phone').value = phone || '5568999881122';
      document.getElementById('wa-name').innerText = name;
      document.getElementById('wa-location').innerText = (neighborhood || 'Bosque') + ', Rio Branco • Atende Hoje';

      const human = providerHumanProfiles[name] || {
        photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80']
      };
      document.getElementById('wa-avatar').src = human.photos[0];

      updateCustomMessage();
      openModal('modal-whatsapp');
    }

    function updateCustomMessage() {
      const name = document.getElementById('wa-name').innerText;
      const time = document.getElementById('wa-time-pref').value;
      const location = document.getElementById('wa-location-pref').value;
      const acc = document.getElementById('wa-acc-pref').value;

      let msg = \`Olá \${name}! Vi seu anúncio no Enlace e gostaria de saber se você tem disponibilidade para \${time}, \${location}.\`;
      if (acc && !acc.includes('sem adaptações')) {
        msg += \` Gostaria de confirmar se podemos nos organizar pois \${acc}.\`;
      }
      msg += ' Aguardo seu retorno com carinho! 😊';

      document.getElementById('wa-message-preview').innerText = msg;
    }

    function triggerWhatsAppRedirect() {
      const phone = document.getElementById('wa-provider-phone').value;
      const msg = document.getElementById('wa-message-preview').innerText;
      closeModal('modal-whatsapp');
      const waUrl = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
      window.open(waUrl, '_blank');
    }

    function openStoryModal(name, photoUrl, caption) {
      currentSelectedStory = { name, photoUrl, caption };
      document.getElementById('story-bg').src = photoUrl;
      document.getElementById('story-avatar').src = photoUrl;
      document.getElementById('story-name').innerText = name;
      document.getElementById('story-caption').innerText = caption;
      openModal('modal-story');
    }

    function replyStoryOnWhatsApp() {
      if (!currentSelectedStory) return;
      closeModal('modal-story');
      const human = providerHumanProfiles[currentSelectedStory.name] || { phone: '5568999881122' };
      const msg = \`Olá \${currentSelectedStory.name}! Vi seu Story no Enlace ("\${currentSelectedStory.caption.slice(0, 30)}...") e gostaria de saber se tem horário disponível hoje! 🥰\`;
      window.open('https://wa.me/' + human.phone + '?text=' + encodeURIComponent(msg), '_blank');
    }

    let activePaywallProvider = null;
    function openEnsaioPaywall(providerId, providerName) {
      activePaywallProvider = providerName;
      document.getElementById('paywall-title').innerText = 'Ensaio Privado — ' + providerName;
      document.getElementById('pix-checkout-box').classList.add('hidden');
      document.getElementById('pix-unlocked-box').classList.add('hidden');
      document.getElementById('pix-initial-actions').classList.remove('hidden');

      const human = providerHumanProfiles[providerName] || {
        photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80']
      };
      document.getElementById('paywall-preview-img').src = human.photos[0];

      openModal('modal-paywall');
    }

    async function startPixCheckout() {
      document.getElementById('pix-initial-actions').classList.add('hidden');
      document.getElementById('pix-checkout-box').classList.remove('hidden');
      
      const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014br.gov.bcb.pix0136enlace-pix-3500-split-85-15';
      const copiaCola = '00020126580014br.gov.bcb.pix0136enlace-split-85-15-ordem-3500-rio-branco';
      
      document.getElementById('pix-qr-img').src = qrUrl;
      document.getElementById('pix-copia-cola').value = copiaCola;

      if (window.lucide) lucide.createIcons();
    }

    function copyPixCode() {
      const input = document.getElementById('pix-copia-cola');
      input.select();
      navigator.clipboard.writeText(input.value);
      alert('Código Pix Copia e Cola copiado com sucesso! Abra o app do seu banco para pagar.');
    }

    function simulatePixPayment() {
      document.getElementById('pix-checkout-box').classList.add('hidden');
      document.getElementById('pix-unlocked-box').classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }

    function toggleFavorite(event, providerId) {
      event.stopPropagation();
      const btn = event.currentTarget;
      btn.classList.toggle('heart-active');
      btn.classList.toggle('text-rose-500');
      btn.classList.toggle('text-white');
    }

    function openLoginModal() {
      alert('Área do Usuário: Login com Pseudônimo e Proteção de Identidade ativada.');
    }

    window.addEventListener('DOMContentLoaded', () => {
      triggerSearch();
      if (window.lucide) lucide.createIcons();
    });
  </script>
</body>
</html>`;
