/* =============================================
   Printer & Co. — config.js v4.0
   Configuração central do Supabase
   ============================================= */

const SUPABASE_URL  = 'https://cxgpuwqihdojisishmzv.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Z3B1d3FpaGRvamlzaXNobXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMzgzNzksImV4cCI6MjA5OTgxNDM3OX0.nAjSIB4fMbC99JEtfkaDLd8LHbnwmx5QNxUPty88C2w';
const EDGE_URL      = 'https://cxgpuwqihdojisishmzv.supabase.co/functions/v1';
const DOMINIO       = '@printer.interno';
const SESSAO_KEY    = 'printerCo_session';
const DURACAO_SESSAO = 60 * 60 * 1000; // 1 hora em ms
