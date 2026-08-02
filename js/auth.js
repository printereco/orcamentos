/* =============================================
   Printer & Co. — auth.js v4.0
   Autenticação e controle de sessão
   ============================================= */

// Verifica sessão e redireciona para login se inválida
function verificarSessao() {
  const raw = localStorage.getItem(SESSAO_KEY);
  if (!raw) { window.location.href = 'login.html'; return null; }

  try {
    const sessao = JSON.parse(raw);
    if (Date.now() > sessao.expira) {
      localStorage.removeItem(SESSAO_KEY);
      window.location.href = 'login.html';
      return null;
    }
    return sessao;
  } catch {
    localStorage.removeItem(SESSAO_KEY);
    window.location.href = 'login.html';
    return null;
  }
}

// Retorna dados da sessão sem redirecionar
function getSessao() {
  const raw = localStorage.getItem(SESSAO_KEY);
  if (!raw) return null;
  try {
    const sessao = JSON.parse(raw);
    if (Date.now() > sessao.expira) { localStorage.removeItem(SESSAO_KEY); return null; }
    return sessao;
  } catch { return null; }
}

// Verifica se usuário é admin
function isAdmin() {
  const s = getSessao();
  return s && s.perfil === 'admin';
}

// Faz logout
function sair() {
  localStorage.removeItem(SESSAO_KEY);
  window.location.href = 'login.html';
}

// Salva sessão após login
function salvarSessao(usuario, token) {
  const sessao = {
    token,
    usuario: usuario.email,
    nome: usuario.user_metadata?.nome || usuario.email.split('@')[0],
    perfil: usuario.user_metadata?.perfil || 'usuario',
    expira: Date.now() + DURACAO_SESSAO
  };
  localStorage.setItem(SESSAO_KEY, JSON.stringify(sessao));
  return sessao;
}

// Recupera o token de acesso — tenta sessão própria, depois formato nativo do Supabase
function getToken() {
  const s = getSessao();
  if (s && s.token) return s.token;

  // Fallback: formato nativo que o Supabase salva no localStorage
  try {
    const chave = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (chave) {
      const dados = JSON.parse(localStorage.getItem(chave));
      return dados?.access_token || SUPABASE_ANON;
    }
  } catch {}
  return SUPABASE_ANON;
}

// Cabeçalhos para requisições autenticadas
function headersAuth() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON,
    'Authorization': `Bearer ${getToken()}`
  };
}

// Cabeçalhos apenas com anon key (para edge functions)
function headersAnon() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON}`
  };
}
