/* =============================================
   Printer & Co. — utils.js v4.0
   Funções utilitárias compartilhadas
   ============================================= */

// --- Formatação ---

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

function formatarData(data) {
  if (!data) return '—';
  const d = new Date(data);
  if (isNaN(d)) return data;
  return d.toLocaleDateString('pt-BR');
}

function formatarDataHora(data) {
  if (!data) return '—';
  const d = new Date(data);
  if (isNaN(d)) return data;
  return d.toLocaleString('pt-BR');
}

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

// --- Toast ---

function toast(mensagem, tipo = 'info', duracao = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  el.className = `toast toast-${tipo}`;
  el.textContent = mensagem;
  container.appendChild(el);

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    el.style.transition = 'all 0.3s';
    setTimeout(() => el.remove(), 300);
  }, duracao);
}

// --- Modal ---

function abrirModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('aberto');
}

function fecharModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('aberto');
}

// Fecha modal ao clicar fora
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('aberto');
  }
});

// --- Supabase REST helpers ---

async function supaGet(tabela, filtros = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?${filtros}`, {
    headers: { ...headersAuth(), 'Prefer': 'return=representation' }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function supaPost(tabela, dados) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
    method: 'POST',
    headers: { ...headersAuth(), 'Prefer': 'return=representation' },
    body: JSON.stringify(dados)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function supaPatch(tabela, filtro, dados) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?${filtro}`, {
    method: 'PATCH',
    headers: { ...headersAuth(), 'Prefer': 'return=representation' },
    body: JSON.stringify(dados)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function supaDelete(tabela, filtro) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?${filtro}`, {
    method: 'DELETE',
    headers: headersAuth()
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

// --- Loader ---

function mostrarLoader(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = '<div class="spinner"></div>';
}

function mostrarVazio(containerId, mensagem = 'Nenhum registro encontrado.') {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `
    <div class="estado-vazio">
      <div class="icone-vazio">📭</div>
      <p>${mensagem}</p>
    </div>`;
}

// --- Menu mobile ---

function iniciarMenuMobile() {
  const btnMenu    = document.getElementById('btn-menu-mobile');
  const sidebar    = document.getElementById('sidebar');
  const overlay    = document.getElementById('sidebar-overlay');

  if (btnMenu && sidebar) {
    btnMenu.addEventListener('click', () => {
      sidebar.classList.toggle('aberto');
      if (overlay) overlay.classList.toggle('aberto');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('aberto');
      overlay.classList.remove('aberto');
    });
  }
}
