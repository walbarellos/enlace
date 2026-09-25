export const WebUIHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plataforma Enlace — Encontros Íntimos, Acessíveis e Seguros</title>
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons via CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            sensual: {
              50: '#fff1f2',
              100: '#ffe4e6',
              200: '#fecdd3',
              300: '#fda4af',
              400: '#fb7185',
              500: '#f43f5e',
              600: '#e11d48',
              700: '#be123c',
              800: '#9f1239',
              900: '#881337',
              950: '#4c0519'
            },
            champagne: {
              200: '#fef3c7',
              300: '#fde68a',
              400: '#fcd34d',
              500: '#d4af37',
              600: '#b48c28',
              700: '#854d0e'
            }
          }
        }
      }
    }
  </script>

  <style>
    /* Transições suaves de iluminação */
    body {
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* TEMA LUMINOSO SENSUAL (Padrão: Menos escuro, acolhedor e sedutor) */
    :root {
      --bg-page: #FAF5F7;
      --bg-surface: #FFFFFF;
      --bg-subtle: #FDF2F4;
      --bg-elevated: #FFF9FA;
      --border-main: #F2D5DE;
      --border-accent: #E5B2C2;
      --text-heading: #2D081B;
      --text-body: #5A2E44;
      --text-muted: #8E5A74;
      --card-shadow: 0 10px 25px -5px rgba(190, 18, 60, 0.06), 0 8px 10px -6px rgba(190, 18, 60, 0.04);
    }

    /* TEMA NOTURNO CABERNET (Intimista) */
    .theme-night {
      --bg-page: #10060D;
      --bg-surface: #180B14;
      --bg-subtle: #210F1C;
      --bg-elevated: #2D1426;
      --border-main: #3D1A33;
      --border-accent: #65254D;
      --text-heading: #FFF1F2;
      --text-body: #FBCFE8;
      --text-muted: #B885A1;
      --card-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6);
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

    :focus-visible {
      outline: 2px solid #be123c !important;
      outline-offset: 2px !important;
    }
  </style>
</head>
<body style="background-color: var(--bg-page); color: var(--text-body);" class="font-sans min-h-screen flex flex-col antialiased selection:bg-sensual-600 selection:text-white">

  <!-- ====================================================================== -->
  <!-- TOPO / BARRA LUMINOSA E SELETOR DE AMBIENTE -->
  <!-- ====================================================================== -->
  <header style="background-color: var(--bg-surface); border-color: var(--border-main);" class="border-b backdrop-blur-md sticky top-0 z-40 transition-colors">
    <div class="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
      
      <!-- Logotipo & Proposta de Valor -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sensual-700 via-sensual-500 to-champagne-500 p-[1px] shadow-md shadow-sensual-700/20">
          <div style="background-color: var(--bg-surface);" class="w-full h-full rounded-xl flex items-center justify-center">
            <i data-lucide="flame" class="w-5 h-5 text-sensual-600"></i>
          </div>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 style="color: var(--text-heading);" class="text-xl font-extrabold tracking-tight">
              ENLACE
            </h1>
            <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sensual-100 text-sensual-800 border border-sensual-200">
              Privé & Acessível
            </span>
          </div>
          <p style="color: var(--text-muted);" class="text-[11px] font-medium">Prazer consensual, privacidade absoluta e acolhimento universal</p>
        </div>
      </div>

      <!-- Barra de Ferramentas de Iluminação e Acessibilidade -->
      <div class="flex items-center flex-wrap gap-2.5">
        
        <!-- Alternador de Luminosidade (Claro Sensual / Noturno Sensual) -->
        <button id="btn-theme-toggle" onclick="toggleAtmosphere()" style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-body);" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:border-sensual-400 transition shadow-sm">
          <i id="theme-icon" data-lucide="moon" class="w-3.5 h-3.5 text-sensual-700"></i>
          <span id="theme-text">Ambiente Noturno</span>
        </button>

        <!-- Ferramentas de Acessibilidade -->
        <div style="background-color: var(--bg-subtle); border-color: var(--border-main);" class="flex items-center rounded-lg p-1 border text-xs shadow-sm">
          <button onclick="toggleContrast()" style="color: var(--text-body);" class="inline-flex items-center gap-1 px-2.5 py-1 rounded hover:bg-sensual-100 transition" title="Alternar Alto Contraste">
            <i data-lucide="eye" class="w-3.5 h-3.5 text-champagne-600"></i>
            <span>Contraste</span>
          </button>
          <div style="background-color: var(--border-main);" class="w-px h-4 mx-1"></div>
          <button onclick="changeFontSize(-1)" style="color: var(--text-body);" class="px-2 py-1 rounded hover:bg-sensual-100 font-bold" title="Diminuir Fonte">A-</button>
          <button onclick="changeFontSize(1)" style="color: var(--text-body);" class="px-2 py-1 rounded hover:bg-sensual-100 font-bold" title="Aumentar Fonte">A+</button>
        </div>

        <!-- Identidade Criptográfica do Cliente -->
        <div style="background-color: var(--bg-subtle); border-color: var(--border-accent);" class="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs border shadow-sm">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sensual-500 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-sensual-600"></span>
          </span>
          <span style="color: var(--text-muted);">Sessão:</span>
          <span class="font-mono font-bold text-sensual-800">Cliente_9942</span>
          <span class="inline-flex items-center gap-1 bg-sensual-700 text-white text-[10px] px-2 py-0.5 rounded-md font-semibold">
            <i data-lucide="check-check" class="w-3 h-3"></i>
            +18 Verificado
          </span>
        </div>
      </div>
    </div>
  </header>

  <!-- ====================================================================== -->
  <!-- HERO / PAINEL DE BUSCA COM ILUMINAÇÃO ACOLHEDORA -->
  <!-- ====================================================================== -->
  <main class="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
    <section class="mb-8">
      <div style="background-color: var(--bg-surface); border-color: var(--border-main); box-shadow: var(--card-shadow);" class="p-6 md:p-8 rounded-2xl border relative overflow-hidden transition-colors">
        
        <!-- Glows sutis de atmosfera sensual (Quentes e Luminosos) -->
        <div class="absolute -top-24 -right-24 w-80 h-80 bg-sensual-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-80 h-80 bg-champagne-200/40 rounded-full blur-3xl pointer-events-none"></div>

        <div style="border-color: var(--border-main);" class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b relative z-10">
          <div>
            <h2 style="color: var(--text-heading);" class="text-xl md:text-2xl font-extrabold flex items-center gap-2">
              <i data-lucide="sparkles" class="w-5 h-5 text-champagne-500"></i>
              Encontros Acessíveis, Seguros e Sem Burocracia
            </h2>
            <p style="color: var(--text-muted);" class="text-xs md:text-sm mt-1">
              Filtros para pessoas com deficiência, neurodivergentes e preferências específicas, com total proteção física e discrição civil.
            </p>
          </div>
          <div style="background-color: var(--bg-subtle); border-color: var(--border-main);" class="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border text-sensual-800 self-start md:self-auto shadow-sm">
            <i data-lucide="shield-check" class="w-4 h-4 text-sensual-600"></i>
            <span>Localização Difusa (Raio Seguro 500m+)</span>
          </div>
        </div>

        <form id="search-form" onsubmit="event.preventDefault(); triggerSearch();" class="space-y-5 relative z-10">
          <!-- Filtros de Região -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label style="color: var(--text-heading);" class="block text-xs font-bold mb-1.5">Região / Estado</label>
              <select id="state_uf" style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-heading);" class="w-full rounded-lg px-3 py-2 text-sm border focus:border-sensual-500 focus:ring-1 focus:ring-sensual-500 font-medium">
                <option value="AC" selected>Acre (AC) — Piloto Inicial Ativo</option>
                <option value="SP" disabled>São Paulo (SP) — Em Breve</option>
                <option value="RJ" disabled>Rio de Janeiro (RJ) — Em Breve</option>
              </select>
            </div>
            <div>
              <label style="color: var(--text-heading);" class="block text-xs font-bold mb-1.5">Município</label>
              <select id="city" style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-heading);" class="w-full rounded-lg px-3 py-2 text-sm border focus:border-sensual-500 focus:ring-1 focus:ring-sensual-500 font-medium">
                <option value="Rio Branco" selected>Rio Branco</option>
                <option value="Cruzeiro do Sul">Cruzeiro do Sul</option>
              </select>
            </div>
            <div>
              <label style="color: var(--text-heading);" class="block text-xs font-bold mb-1.5">Bairro ou Região</label>
              <input id="neighborhood" type="text" placeholder="Todos os bairros" style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-heading);" class="w-full rounded-lg px-3 py-2 text-sm border placeholder:text-rose-300 focus:border-sensual-500 focus:ring-1 focus:ring-sensual-500 font-medium">
            </div>
          </div>

          <!-- Filtros de Acessibilidade Especializada -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-sensual-800 mb-2.5 flex items-center gap-1.5">
              <i data-lucide="heart" class="w-3.5 h-3.5 text-sensual-600"></i>
              Adaptações e Recursos de Acessibilidade:
            </label>
            <div class="flex flex-wrap gap-2.5" id="accessibility-pills">
              
              <label class="cursor-pointer">
                <input type="checkbox" name="acc" value="COMM_LIBRAS" class="hidden peer" onchange="triggerSearch()">
                <span style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-body);" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs peer-checked:bg-sensual-700 peer-checked:border-sensual-800 peer-checked:text-white transition font-medium shadow-sm">
                  <i data-lucide="message-square-text" class="w-3.5 h-3.5 text-sensual-600 peer-checked:text-white"></i>
                  Fluência em Libras
                </span>
              </label>

              <label class="cursor-pointer">
                <input type="checkbox" name="acc" value="MOB_RAMP_ELEVATOR" class="hidden peer" onchange="triggerSearch()">
                <span style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-body);" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs peer-checked:bg-sensual-700 peer-checked:border-sensual-800 peer-checked:text-white transition font-medium shadow-sm">
                  <i data-lucide="accessibility" class="w-3.5 h-3.5 text-sensual-600 peer-checked:text-white"></i>
                  Rampa / Elevador Privativo
                </span>
              </label>

              <label class="cursor-pointer">
                <input type="checkbox" name="acc" value="NEURO_LIGHT_CONTROL" class="hidden peer" onchange="triggerSearch()">
                <span style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-body);" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs peer-checked:bg-sensual-700 peer-checked:border-sensual-800 peer-checked:text-white transition font-medium shadow-sm">
                  <i data-lucide="sun-dim" class="w-3.5 h-3.5 text-champagne-600 peer-checked:text-white"></i>
                  Iluminação Suave / Neurodivergente
                </span>
              </label>

              <label class="cursor-pointer">
                <input type="checkbox" name="acc" value="NEURO_SILENT_SPACE" class="hidden peer" onchange="triggerSearch()">
                <span style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-body);" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs peer-checked:bg-sensual-700 peer-checked:border-sensual-800 peer-checked:text-white transition font-medium shadow-sm">
                  <i data-lucide="volume-x" class="w-3.5 h-3.5 text-sensual-600 peer-checked:text-white"></i>
                  Ambiente Silencioso
                </span>
              </label>

              <label class="cursor-pointer">
                <input type="checkbox" name="acc" value="SUPP_GUIDE_DOG" class="hidden peer" onchange="triggerSearch()">
                <span style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-body);" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs peer-checked:bg-sensual-700 peer-checked:border-sensual-800 peer-checked:text-white transition font-medium shadow-sm">
                  <i data-lucide="heart-handshake" class="w-3.5 h-3.5 text-champagne-600 peer-checked:text-white"></i>
                  Aceite de Cão-Guia
                </span>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" onclick="clearFilters()" style="color: var(--text-muted);" class="px-4 py-2 rounded-lg text-xs font-semibold hover:text-sensual-700 transition">
              Redefinir Filtros
            </button>
            <button type="submit" class="px-6 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-sensual-700 via-sensual-600 to-rose-700 hover:from-sensual-600 hover:to-rose-600 text-white shadow-lg shadow-sensual-700/25 transition inline-flex items-center gap-2">
              <i data-lucide="search" class="w-3.5 h-3.5"></i>
              Explorar Perfis
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- ====================================================================== -->
    <!-- VITRINE DE PERFIS -->
    <!-- ====================================================================== -->
    <section>
      <div class="flex items-center justify-between mb-5">
        <h3 style="color: var(--text-heading);" class="text-lg font-bold flex items-center gap-2">
          <span>Acompanhantes Verificados</span>
          <span id="results-count" style="color: var(--text-muted);" class="text-xs font-normal">(pesquisando...)</span>
        </h3>
        <span style="background-color: var(--bg-surface); border-color: var(--border-main); color: var(--text-muted);" class="text-xs inline-flex items-center gap-1.5 px-3 py-1 rounded-md border shadow-sm">
          <i data-lucide="shield-check" class="w-3.5 h-3.5 text-sensual-600"></i>
          Verificação Estrita +18
        </span>
      </div>

      <div id="providers-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Injetado dinamicamente via script -->
      </div>
    </section>
  </main>

  <!-- ====================================================================== -->
  <!-- MODAL: SOLICITAÇÃO DE ATENDIMENTO (WHATSAPP/TELEGRAM) -->
  <!-- ====================================================================== -->
  <div id="modal-request" class="fixed inset-0 bg-sensual-950/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div style="background-color: var(--bg-surface); border-color: var(--border-accent);" class="border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
      <button onclick="closeModal('modal-request')" style="color: var(--text-muted);" class="absolute top-4 right-4 hover:text-sensual-700 p-1 rounded-lg transition">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
      
      <div class="flex items-center gap-2 text-sensual-700 text-xs font-bold uppercase tracking-wider mb-1">
        <i data-lucide="heart-handshake" class="w-3.5 h-3.5 text-champagne-600"></i>
        <span>Solicitação Formal & Baixa Fricção</span>
      </div>
      <h3 style="color: var(--text-heading);" class="text-xl font-extrabold mb-2" id="req-provider-name">Agendar Encontro</h3>
      <p style="color: var(--text-muted);" class="text-xs mb-4 leading-relaxed">
        Não cobramos qualquer taxa sobre encontros presenciais. Este formulário gera um cartão estruturado que formaliza o respeito a limites, horários e adaptações de acessibilidade.
      </p>

      <form id="form-create-request" onsubmit="event.preventDefault(); submitServiceRequest();" class="space-y-3.5">
        <input type="hidden" id="req-provider-id">
        <div>
          <label style="color: var(--text-heading);" class="block text-xs font-bold mb-1">Data e Horário</label>
          <input type="datetime-local" id="req-datetime" required style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-heading);" class="w-full rounded-lg p-2 text-sm border focus:border-sensual-500 font-medium">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label style="color: var(--text-heading);" class="block text-xs font-bold mb-1">Duração Desejada</label>
            <select id="req-duration" style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-heading);" class="w-full rounded-lg p-2 text-sm border font-medium">
              <option value="1">1 hora</option>
              <option value="2" selected>2 horas</option>
              <option value="4">4 horas</option>
              <option value="8">Pernoite (8 horas)</option>
            </select>
          </div>
          <div>
            <label style="color: var(--text-heading);" class="block text-xs font-bold mb-1">Local do Encontro</label>
            <select id="req-location" style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-heading);" class="w-full rounded-lg p-2 text-sm border font-medium">
              <option value="OWN_PLACE" selected>Espaço do Prestador</option>
              <option value="CLIENT_PLACE">Domicílio do Cliente</option>
              <option value="HOTEL_MOTEL">Hotel / Motel</option>
              <option value="VIRTUAL">Virtual</option>
            </select>
          </div>
        </div>

        <div>
          <label style="color: var(--text-heading);" class="block text-xs font-bold mb-1">Canal de Contato Direto</label>
          <select id="req-channel" style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-heading);" class="w-full rounded-lg p-2 text-sm border font-medium">
            <option value="WHATSAPP" selected>WhatsApp (wa.me)</option>
            <option value="TELEGRAM">Telegram (t.me)</option>
          </select>
        </div>

        <!-- Preview do Cartão Sanitizado -->
        <div style="background-color: var(--bg-subtle); border-color: var(--border-main);" class="p-3.5 rounded-xl border text-[11px] font-mono space-y-1">
          <div class="text-sensual-800 font-bold mb-1 flex items-center gap-1.5">
            <i data-lucide="shield-check" class="w-3.5 h-3.5 text-sensual-600"></i>
            Cartão Sanitizado de Segurança:
          </div>
          <div style="color: var(--text-body);">Cliente: <span class="font-bold text-sensual-900">Cliente_9942</span> (Identidade civil protegida)</div>
          <div style="color: var(--text-body);">Adaptações: <span id="req-preview-acc" class="font-bold text-sensual-900">Libras, Rampa NBR 9050</span></div>
          <div style="color: var(--text-muted);">Termos: +18 Consensual • Acordo Livre entre as partes</div>
        </div>

        <div class="flex justify-end gap-2 pt-3">
          <button type="button" onclick="closeModal('modal-request')" style="color: var(--text-muted);" class="px-4 py-2 rounded-lg text-xs font-semibold hover:text-sensual-700">
            Cancelar
          </button>
          <button type="submit" class="px-5 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-sensual-700 to-rose-700 hover:from-sensual-600 hover:to-rose-600 text-white inline-flex items-center gap-2 shadow-lg shadow-sensual-700/25">
            <i data-lucide="message-circle" class="w-4 h-4 text-champagne-300"></i>
            Enviar Solicitação via WhatsApp
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- ====================================================================== -->
  <!-- MODAL: PAYWALL DE MÍDIA DIGITAL & PIX INSTANTÂNEO (SPLIT 85/15) -->
  <!-- ====================================================================== -->
  <div id="modal-paywall" class="fixed inset-0 bg-sensual-950/40 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div style="background-color: var(--bg-surface); border-color: var(--border-accent);" class="border rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
      <button onclick="closeModal('modal-paywall')" style="color: var(--text-muted);" class="absolute top-4 right-4 hover:text-sensual-700 p-1 rounded-lg transition">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div class="text-center mb-4">
        <span class="inline-flex items-center gap-1 text-champagne-600 text-xs font-bold uppercase tracking-wider">
          <i data-lucide="lock" class="w-3.5 h-3.5 text-sensual-600"></i>
          Conteúdo Íntimo Exclusivo
        </span>
        <h3 style="color: var(--text-heading);" class="text-lg font-extrabold mt-1" id="paywall-title">Ensaio Sensual Privado</h3>
        <p style="color: var(--text-muted);" class="text-xs mt-1">
          Acesso perpétuo com marca d'água forense esteganográfica anti-vazamento.
        </p>
      </div>

      <!-- Preview com Blur e Trava -->
      <div style="background-color: var(--bg-subtle); border-color: var(--border-main);" class="relative rounded-xl overflow-hidden border h-52 flex items-center justify-center mb-4">
        <div class="absolute inset-0 bg-cover bg-center filter blur-xl opacity-40" style="background-image: url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')"></div>
        <div class="relative z-10 text-center p-4">
          <div class="w-12 h-12 rounded-full bg-sensual-100 border border-sensual-300 flex items-center justify-center mx-auto mb-2 text-sensual-700 shadow-md">
            <i data-lucide="lock" class="w-6 h-6"></i>
          </div>
          <div style="color: var(--text-heading);" class="font-bold text-sm">Mídia Restrita por Paywall</div>
          <div class="text-xs text-sensual-800 font-bold mt-1">Valor Unitário: R$ 35,00 via Pix</div>
          <div style="color: var(--text-muted);" class="text-[10px] mt-0.5">Split Automático: 85% Prestador (R$ 29,75) / 15% Plataforma</div>
        </div>
      </div>

      <!-- Checkout Pix -->
      <div id="pix-checkout-box" class="hidden space-y-3">
        <div style="background-color: var(--bg-subtle); border-color: var(--border-main);" class="text-center p-4 rounded-xl border">
          <div class="text-xs text-sensual-800 font-bold mb-2 flex items-center justify-center gap-1.5">
            <i data-lucide="qr-code" class="w-4 h-4 text-sensual-600"></i>
            Cobrança Pix Pronta para Pagamento
          </div>
          <img id="pix-qr-img" src="" alt="QR Code Pix" class="w-36 h-36 mx-auto rounded-lg bg-white p-1 mb-2 border border-sensual-200">
          <div style="color: var(--text-muted);" class="text-[11px] mb-1">Copia e Cola Oficial (EMVCo):</div>
          <input id="pix-copia-cola" readonly style="background-color: var(--bg-surface); border-color: var(--border-main); color: var(--text-heading);" class="w-full border rounded p-1.5 text-[10px] font-mono text-center truncate">
        </div>

        <button onclick="simulatePixPayment()" class="w-full py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-sensual-700 to-rose-700 hover:from-sensual-600 hover:to-rose-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-sensual-700/25">
          <i data-lucide="zap" class="w-4 h-4 text-champagne-300"></i>
          Simular Confirmação Pix (Webhook)
        </button>
      </div>

      <!-- Botão Inicial -->
      <div id="pix-initial-actions" class="flex justify-end gap-2">
        <button onclick="closeModal('modal-paywall')" style="color: var(--text-muted);" class="px-4 py-2 rounded-lg text-xs font-semibold hover:text-sensual-700">
          Fechar
        </button>
        <button onclick="startPixCheckout()" class="px-5 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-sensual-700 via-sensual-600 to-rose-700 hover:from-sensual-600 hover:to-rose-600 text-white inline-flex items-center gap-2 shadow-lg shadow-sensual-700/25">
          <i data-lucide="credit-card" class="w-4 h-4"></i>
          Pagar R$ 35,00 via Pix
        </button>
      </div>

      <!-- Confirmação e Desbloqueio com Esteganografia -->
      <div id="pix-unlocked-box" class="hidden text-center space-y-3 py-2">
        <div class="text-sensual-800 font-bold text-sm flex items-center justify-center gap-1.5">
          <i data-lucide="check-circle-2" class="w-5 h-5 text-sensual-600"></i>
          Mídia Desbloqueada com Sucesso
        </div>
        <div style="background-color: var(--bg-subtle); border-color: var(--border-main);" class="p-3.5 rounded-xl border text-xs text-left space-y-1.5">
          <div class="flex items-center gap-1.5 text-sensual-800 font-bold">
            <i data-lucide="fingerprint" class="w-4 h-4 text-sensual-600"></i>
            Marca d'Água Forense Injetada:
          </div>
          <div style="color: var(--text-body);">Pseudônimo Rastreador: <span class="font-mono font-bold text-sensual-900">Cliente_9942</span></div>
          <div style="color: var(--text-muted);">Split Financeiro: R$ 29,75 creditado automaticamente ao prestador</div>
        </div>
        <button onclick="closeModal('modal-paywall')" style="background-color: var(--bg-surface); border-color: var(--border-main); color: var(--text-heading);" class="w-full py-2 rounded-lg text-xs font-bold border hover:bg-sensual-50">
          Fechar Visualizador
        </button>
      </div>
    </div>
  </div>

  <!-- ====================================================================== -->
  <!-- RODAPÉ SOFISTICADO -->
  <!-- ====================================================================== -->
  <footer style="background-color: var(--bg-surface); border-color: var(--border-main);" class="border-t py-8 text-xs mt-12 transition-colors">
    <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <p style="color: var(--text-heading);" class="font-bold mb-1">Plataforma Enlace © 2026 — Relações Consensuais e Conteúdo Privado</p>
        <p style="color: var(--text-muted);" class="text-[11px]">
          Privacidade absoluta do usuário • Conformidade estrita com LGPD (Art. 7/11) e Código Penal Brasileiro (Art. 228-231).
        </p>
      </div>
      <div class="flex items-center gap-4 text-xs font-semibold">
        <a href="/api/v1/health" target="_blank" class="hover:text-sensual-700 transition inline-flex items-center gap-1.5 text-sensual-800">
          <i data-lucide="activity" class="w-3.5 h-3.5 text-sensual-600"></i>
          Sistema Online
        </a>
        <span style="color: var(--border-main);">•</span>
        <span style="color: var(--text-muted);" class="inline-flex items-center gap-1.5">
          <i data-lucide="database" class="w-3.5 h-3.5 text-champagne-600"></i>
          PostGIS Georreferenciado
        </span>
      </div>
    </div>
  </footer>

  <!-- ====================================================================== -->
  <!-- JAVASCRIPT DE CONSUMO E ILUMINAÇÃO -->
  <!-- ====================================================================== -->
  <script>
    let activeOrderId = null;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);
    document.getElementById('req-datetime').value = tomorrow.toISOString().slice(0, 16);

    const taxonomyData = {
      'COMM_LIBRAS': { label: 'Libras', icon: 'message-square-text' },
      'MOB_RAMP_ELEVATOR': { label: 'Rampa / Elevador', icon: 'accessibility' },
      'NEURO_LIGHT_CONTROL': { label: 'Luz Intimista', icon: 'sun-dim' },
      'NEURO_SILENT_SPACE': { label: 'Ambiente Silencioso', icon: 'volume-x' },
      'SUPP_GUIDE_DOG': { label: 'Cão-Guia', icon: 'heart-handshake' },
      'MOB_WIDE_DOORS': { label: 'Portas Largas', icon: 'door-open' },
      'MOB_ADAPTED_BATHROOM': { label: 'Banheiro Adaptado', icon: 'bath' }
    };

    // Alternador de Iluminação (Claro Sensual / Noturno Sensual)
    let isNightMode = false;
    function toggleAtmosphere() {
      isNightMode = !isNightMode;
      document.body.classList.toggle('theme-night', isNightMode);
      
      const icon = document.getElementById('theme-icon');
      const text = document.getElementById('theme-text');
      
      if (isNightMode) {
        icon.setAttribute('data-lucide', 'sun');
        text.innerText = 'Ambiente Luminoso';
      } else {
        icon.setAttribute('data-lucide', 'moon');
        text.innerText = 'Ambiente Noturno';
      }
      if (window.lucide) lucide.createIcons();
    }

    function toggleContrast() {
      document.body.classList.toggle('high-contrast');
    }

    let currentFontSize = 16;
    function changeFontSize(delta) {
      currentFontSize = Math.min(22, Math.max(14, currentFontSize + delta));
      document.documentElement.style.fontSize = currentFontSize + 'px';
    }

    function openModal(id) {
      document.getElementById(id).classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }

    function closeModal(id) {
      document.getElementById(id).classList.add('hidden');
    }

    function clearFilters() {
      document.querySelectorAll('#accessibility-pills input[type="checkbox"]').forEach(c => c.checked = false);
      document.getElementById('neighborhood').value = '';
      triggerSearch();
    }

    async function triggerSearch() {
      const stateUf = document.getElementById('state_uf').value;
      const city = document.getElementById('city').value;
      const neighborhood = document.getElementById('neighborhood').value.trim();

      const selectedAccs = Array.from(
        document.querySelectorAll('#accessibility-pills input[type="checkbox"]:checked')
      ).map(cb => cb.value);

      const params = new URLSearchParams({
        state_uf: stateUf,
        city: city
      });

      if (neighborhood) params.append('neighborhood', neighborhood);
      selectedAccs.forEach(acc => params.append('accommodations', acc));

      const grid = document.getElementById('providers-grid');
      const countEl = document.getElementById('results-count');
      countEl.innerText = '(pesquisando...)';

      try {
        const res = await fetch('/api/v1/providers/search?' + params.toString());
        const data = await res.json();

        countEl.innerText = '(' + (data.count || 0) + ' disponíveis)';
        grid.innerHTML = '';

        if (!data.items || data.items.length === 0) {
          grid.innerHTML = \`
            <div style="background-color: var(--bg-surface); border-color: var(--border-main);" class="col-span-full py-12 text-center rounded-2xl border">
              <i data-lucide="search-x" class="w-8 h-8 text-sensual-500 mx-auto mb-2"></i>
              <div style="color: var(--text-heading);" class="font-bold text-base">Nenhum perfil disponível com estes filtros</div>
              <div style="color: var(--text-muted);" class="text-xs mt-1">Tente desmarcar algumas preferências ou ampliar a busca.</div>
            </div>
          \`;
          if (window.lucide) lucide.createIcons();
          return;
        }

        data.items.forEach(p => {
          let tierBadge = '<span style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-muted);" class="px-2 py-0.5 rounded text-[10px] font-semibold border">Padrão</span>';
          if (p.activePlanTier === 'DIAMANTE') {
            tierBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-champagne-300 via-rose-200 to-sensual-300 text-sensual-950 shadow-sm border border-champagne-400"><i data-lucide="sparkles" class="w-3 h-3 text-sensual-800"></i> DIAMANTE</span>';
          } else if (p.activePlanTier === 'OURO') {
            tierBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-champagne-300 text-champagne-950 shadow-sm border border-champagne-400"><i data-lucide="star" class="w-3 h-3 text-champagne-800"></i> OURO</span>';
          }

          const accPills = (p.accessibilityFeatures || []).map(f => {
            const tax = taxonomyData[f] || { label: f, icon: 'check' };
            return \`<span style="background-color: var(--bg-subtle); border-color: var(--border-main);" class="inline-flex items-center gap-1 border text-sensual-900 text-[10px] px-2 py-0.5 rounded-md font-semibold"><i data-lucide="\${tax.icon}" class="w-3 h-3 text-sensual-700"></i> \${tax.label}</span>\`;
          }).join('');

          const avatarUrl = p.artisticName.includes('Lucas')
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

          const card = document.createElement('div');
          card.style = "background-color: var(--bg-surface); border-color: var(--border-main); box-shadow: var(--card-shadow);";
          card.className = "rounded-2xl border overflow-hidden hover:border-sensual-400 transition-all duration-300 flex flex-col group";
          card.innerHTML = \`
            <div class="relative h-56 bg-sensual-100 overflow-hidden">
              <img src="\${avatarUrl}" alt="\${p.artisticName}" class="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute top-3 left-3 flex gap-1.5 items-center">
                \${tierBadge}
                <span class="inline-flex items-center gap-1 bg-white/95 border border-sensual-200 text-sensual-800 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                  <i data-lucide="badge-check" class="w-3 h-3 text-sensual-600"></i> Verificado
                </span>
              </div>
              <div class="absolute bottom-2 right-2 bg-white/95 backdrop-blur px-2.5 py-1 rounded text-[11px] font-bold text-sensual-950 border border-sensual-200 inline-flex items-center gap-1 shadow-sm">
                <i data-lucide="map-pin" class="w-3 h-3 text-sensual-600"></i>
                ~\${p.distanceMeters || 500}m (Aproximado)
              </div>
            </div>

            <div class="p-5 flex-grow flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <h4 style="color: var(--text-heading);" class="text-lg font-extrabold tracking-tight group-hover:text-sensual-700 transition">\${p.artisticName}</h4>
                  <span class="text-sm font-extrabold text-sensual-700 font-mono">R$ \${(p.minRateCents / 100).toFixed(0)}/h</span>
                </div>
                <p style="color: var(--text-muted);" class="text-xs mb-3 font-medium">\${p.city} • Bairro \${p.neighborhood}</p>

                <div class="mb-4">
                  <div style="color: var(--text-heading);" class="text-[11px] font-bold mb-1.5 flex items-center gap-1">
                    <i data-lucide="sparkles" class="w-3 h-3 text-champagne-600"></i>
                    Acomodações Oferecidas:
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    \${accPills || '<span style="color: var(--text-muted);" class="text-[11px]">Nenhuma acomodação cadastrada</span>'}
                  </div>
                </div>
              </div>

              <div style="border-color: var(--border-main);" class="pt-3 border-t flex gap-2">
                <button onclick="openPaywallModal('\${p.providerId}')" style="background-color: var(--bg-subtle); border-color: var(--border-main); color: var(--text-body);" class="flex-1 py-2.5 px-3 rounded-lg text-xs font-bold border hover:border-sensual-400 transition inline-flex items-center justify-center gap-1.5 shadow-sm">
                  <i data-lucide="lock" class="w-3.5 h-3.5 text-sensual-600"></i>
                  Mídia Privada
                </button>
                <button onclick="openRequestModal('\${p.providerId}', '\${p.artisticName}')" class="flex-1 py-2.5 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-sensual-700 via-sensual-600 to-rose-700 hover:from-sensual-600 hover:to-rose-600 text-white transition inline-flex items-center justify-center gap-1.5 shadow-md shadow-sensual-700/25">
                  <i data-lucide="message-square" class="w-3.5 h-3.5 text-champagne-300"></i>
                  Conectar
                </button>
              </div>
            </div>
          \`;
          grid.appendChild(card);
        });

        if (window.lucide) {
          lucide.createIcons();
        }
      } catch (err) {
        countEl.innerText = '(erro na busca)';
        console.error(err);
      }
    }

    function openRequestModal(providerId, providerName) {
      document.getElementById('req-provider-id').value = providerId;
      document.getElementById('req-provider-name').innerText = 'Agendar com ' + providerName;
      openModal('modal-request');
    }

    async function submitServiceRequest() {
      const providerId = document.getElementById('req-provider-id').value;
      const datetime = new Date(document.getElementById('req-datetime').value).toISOString();
      const duration = parseInt(document.getElementById('req-duration').value, 10);
      const locationMode = document.getElementById('req-location').value;
      const channel = document.getElementById('req-channel').value;

      try {
        const loginRes = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'cliente.demo@enlace.app', password: 'SenhaForte123!' })
        });
        const loginData = await loginRes.json();

        const reqRes = await fetch('/api/v1/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + loginData.token
          },
          body: JSON.stringify({
            provider_id: providerId,
            requested_datetime: datetime,
            duration_hours: duration,
            location_mode: locationMode,
            channel: channel,
            accommodations: ['COMM_LIBRAS', 'MOB_RAMP_ELEVATOR']
          })
        });

        const reqData = await reqRes.json();
        if (reqRes.status === 201) {
          closeModal('modal-request');
          window.open(reqData.deepLinkUrl, '_blank');
        } else {
          alert('Erro ao gerar solicitação: ' + (reqData.detail || 'Falha de validação'));
        }
      } catch (err) {
        alert('Erro de conexão ao gerar solicitação.');
      }
    }

    async function openPaywallModal(providerId) {
      document.getElementById('pix-checkout-box').classList.add('hidden');
      document.getElementById('pix-unlocked-box').classList.add('hidden');
      document.getElementById('pix-initial-actions').classList.remove('hidden');
      openModal('modal-paywall');
    }

    async function startPixCheckout() {
      try {
        const loginRes = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'cliente.demo@enlace.app', password: 'SenhaForte123!' })
        });
        const loginData = await loginRes.json();

        const checkoutRes = await fetch('/api/v1/orders/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + loginData.token
          },
          body: JSON.stringify({
            item_type: 'MEDIA_SINGLE',
            target_id: 'c1b2c3d4-0000-0000-0000-000000000001'
          })
        });

        const orderData = await checkoutRes.json();
        if (checkoutRes.status === 201) {
          activeOrderId = orderData.orderId;
          document.getElementById('pix-qr-img').src = orderData.pixQrCodeUrl;
          document.getElementById('pix-copia-cola').value = orderData.pixCopiaECola;
          document.getElementById('pix-initial-actions').classList.add('hidden');
          document.getElementById('pix-checkout-box').classList.remove('hidden');
        } else {
          activeOrderId = 'demo_order_' + Date.now();
          document.getElementById('pix-qr-img').src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014br.gov.bcb.pix0136enlace-split-85-15';
          document.getElementById('pix-copia-cola').value = '00020126580014br.gov.bcb.pix0136enlace-split-85-15...54035.005802BR';
          document.getElementById('pix-initial-actions').classList.add('hidden');
          document.getElementById('pix-checkout-box').classList.remove('hidden');
        }
        if (window.lucide) lucide.createIcons();
      } catch (err) {
        console.error(err);
      }
    }

    async function simulatePixPayment() {
      document.getElementById('pix-checkout-box').classList.add('hidden');
      document.getElementById('pix-unlocked-box').classList.remove('hidden');
      document.getElementById('paywall-preview-container').innerHTML = \`
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" class="w-full h-full object-cover">
        <div class="absolute bottom-2 left-2 bg-white/95 text-[10px] text-sensual-900 font-mono px-2 py-0.5 rounded border border-sensual-300 inline-flex items-center gap-1 shadow-md font-bold">
          <i data-lucide="fingerprint" class="w-3 h-3 text-sensual-600"></i>
          Watermark: Cliente_9942 • #ENLACE-VERIFIED
        </div>
      \`;
      if (window.lucide) lucide.createIcons();
    }

    window.addEventListener('DOMContentLoaded', () => {
      triggerSearch();
      if (window.lucide) lucide.createIcons();
    });
  </script>
</body>
</html>`;
