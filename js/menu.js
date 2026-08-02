/* =============================================
   Printer & Co. — menu.js v4.0
   Sidebar e navegação compartilhados
   ============================================= */

// Logo em base64 pequeno (texto fallback se não carregar)
const LOGO_TEXTO = '<span class="logo-texto">Printer <span>&</span> Co.</span>';

function renderizarMenu(paginaAtiva) {
  const sessao = getSessao();
  if (!sessao) return;

  const itens = [
    { href: 'index.html',      icone: '📋', label: 'Orçamentos' },
    { href: 'clientes.html',   icone: '👥', label: 'Clientes'   },
    { href: 'financeiro.html', icone: '💰', label: 'Financeiro' },
  ];

  if (isAdmin()) {
    itens.push({ href: 'admin.html', icone: '⚙️', label: 'Usuários' });
  }

  const linksHtml = itens.map(item => `
    <a href="${item.href}" class="${paginaAtiva === item.href ? 'ativo' : ''}">
      <span class="icone">${item.icone}</span>
      ${item.label}
    </a>
  `).join('');

  const html = `
    <div id="sidebar-logo">
      ${LOGO_TEXTO}
    </div>
    <nav>
      ${linksHtml}
    </nav>
    <div id="sidebar-rodape">
      <div class="usuario-nome">👤 ${sessao.nome}</div>
      <button class="btn-sair" onclick="sair()">🚪 Sair</button>
    </div>
  `;

  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = html;

  iniciarMenuMobile();
}
