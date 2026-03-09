/**
 * pdf-template.js
 * Template do Requerimento de Uso de Sistemas Tributários — SEMFAZ Porto Velho.
 *
 * Exporta: createRequerimentoDoc(data) → docDefinition pdfmake
 *
 * Depende de: pdf-styles.js + pdf-utils.js
 *
 * Para usar em React/Next.js:
 *   import pdfMake from 'pdfmake/build/pdfmake';
 *   import { createRequerimentoDoc } from './pdf/pdf-template';
 *   pdfMake.createPdf(createRequerimentoDoc(formData)).download('requerimento.pdf');
 *
 * Para usar em plain HTML (este projeto):
 *   pdfMake.createPdf(createRequerimentoDoc(formData)).download('requerimento.pdf');
 *   (as dependências são carregadas via <script> antes deste arquivo)
 *
 * Estrutura esperada de `data`:
 * {
 *   sistemas: { gpiTributario: bool, semfazonlineNFSe: bool },
 *   requerente: { nome, cpf, cargo, funcao, lotacao, vinculo, matricula, email },
 *   motivacao: { tipo: 'auditorTesouro'|'servidorSubsecretaria'|'procuradorMunicipal'|'servidorPGM'|'outros', outrosEspecificar: string },
 *   perfilAcesso: { tipo: 'existe'|'naoExiste', nomeAmbiente: string, descricaoFuncoes: string },
 *   dataRequerimento: { dia, mes, ano },
 *   superior: { nome, cpf, cargo },
 *   dataCriacao: string,   // ex: "09/03/2026"
 * }
 */

function createRequerimentoDoc(data) {
  const hoje = data.dataCriacao || new Date().toLocaleDateString('pt-BR');

  return {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 70],

    footer: function(currentPage, pageCount) {
      return makeDocFooter(currentPage, pageCount, hoje);
    },

    styles: PDF_STYLES,

    defaultStyle: {
      font: 'Roboto',
      fontSize: 9,
    },

    content: [
      // ---- Cabeçalho institucional ----
      _makeHeaderInstitucional(),

      // ---- Título do documento ----
      {
        text: 'REQUERIMENTO – USO DE SISTEMAS TRIBUTÁRIOS',
        style: 'docTitle',
        margin: [0, 12, 0, 6],
      },

      // ---- Texto introdutório ----
      {
        text: 'Ilmo. (a) Sr. (a) Secretário (a) Municipal de Fazenda, requeremos o acesso ao seguinte sistema:',
        style: 'docIntro',
        margin: [0, 0, 0, 12],
      },

      // ---- Seções ----
      makeSectionBlock('ESCOLHER O SISTEMA',        _makeSistemas(data.sistemas)),
      makeSectionBlock('DADOS DO REQUERENTE',       _makeDadosRequerente(data.requerente)),
      makeSectionBlock('MOTIVAÇÃO – Para uso do sistema', _makeMotivacao(data.motivacao)),
      makeSectionBlock('PERFIL DE ACESSO',          _makePerfilAcesso(data.perfilAcesso)),
      makeSectionBlock('DATA DO REQUERIMENTO',      _makeDataRequerimento(data.dataRequerimento)),
      makeSectionBlock('TERMO DE RESPONSABILIDADE', _makeTermo()),
      makeSectionBlock('DADOS DO SUPERIOR IMEDIATO', _makeSuperior(data.superior)),

      // ---- Assinaturas ----
      makeSectionBlock('ASSINATURAS', [
        makeSignatureBlock(),
        {
          text: 'Este documento pode ser assinado digitalmente pelo GOV, SEI ou por outro meio',
          style: 'signatureNote',
        },
      ]),
    ],
  };
}

// --------------------------------------------------------------------------
// Cabeçalho institucional
// --------------------------------------------------------------------------
function _makeHeaderInstitucional() {
  return {
    margin: [0, 0, 0, 8],
    table: {
      widths: ['*'],
      body: [[{
        stack: [
          { text: 'PREFEITURA MUNICIPAL DE PORTO VELHO', style: 'headerTitle' },
          { text: 'SECRETARIA MUNICIPAL DE FAZENDA', style: 'headerSubtitle' },
          { text: 'Subsecretaria da Receita Municipal', style: 'headerCaption' },
        ],
        fillColor: PDF_COLORS.backgroundSection,
        border: [false, false, false, true],
        borderColor: [null, null, null, PDF_COLORS.accentGreen],
        margin: [0, 10, 0, 10],
      }]],
    },
    layout: {
      hLineColor: () => PDF_COLORS.accentGreen,
      vLineColor: () => 'transparent',
    },
  };
}

// --------------------------------------------------------------------------
// Sistemas
// --------------------------------------------------------------------------
function _makeSistemas(sistemas) {
  sistemas = sistemas || {};
  return [
    makeCheckItem('Sistema de Gestão Integrada – GPI Tributário', sistemas.gpiTributario),
    makeCheckItem('Portal Semfazonline NFS-e Retenção do ISSQN', sistemas.semfazonlineNFSe),
    {
      text: 'Marcar o sistema solicitado.',
      italics: true,
      fontSize: 8,
      color: PDF_COLORS.textMedium,
      margin: [0, 4, 0, 0],
    },
  ];
}

// --------------------------------------------------------------------------
// Dados do Requerente
// --------------------------------------------------------------------------
function _makeDadosRequerente(r) {
  r = r || {};
  return makeFieldGrid([
    { label: 'Nome',      value: r.nome },
    { label: 'CPF',       value: r.cpf },
    { label: 'Cargo',     value: r.cargo },
    { label: 'Função',    value: r.funcao },
    { label: 'Lotação',   value: r.lotacao },
    { label: 'Vínculo',   value: r.vinculo },
    { label: 'Matrícula', value: r.matricula },
    { label: 'E-mail',    value: r.email },
  ]);
}

// --------------------------------------------------------------------------
// Motivação
// --------------------------------------------------------------------------
function _makeMotivacao(motivacao) {
  motivacao = motivacao || {};
  const opcoes = [
    { id: 'auditorTesouro',         label: 'Auditor do Tesouro Municipal, em exercício regular das suas atribuições legais' },
    { id: 'servidorSubsecretaria',  label: 'Servidor lotado na Subsecretaria de Receita Municipal ou na SEMFAZ' },
    { id: 'procuradorMunicipal',    label: 'Procurador Municipal, em exercício regular das suas atribuições legais' },
    { id: 'servidorPGM',            label: 'Servidor lotado na Procuradoria Geral do Município – PGM' },
    { id: 'outros',                 label: 'Outros (especificar)' },
  ];

  const items = opcoes.map(op => makeCheckItem(op.label, motivacao.tipo === op.id));

  if (motivacao.tipo === 'outros' && motivacao.outrosEspecificar) {
    items.push(makeField('Secretaria', motivacao.outrosEspecificar));
  }

  return items;
}

// --------------------------------------------------------------------------
// Perfil de Acesso
// --------------------------------------------------------------------------
function _makePerfilAcesso(perfil) {
  perfil = perfil || {};
  const items = [];

  const temExiste   = perfil.tipo === 'existe';
  const temNaoExiste = perfil.tipo === 'naoExiste';

  items.push(makeCheckItem('Perfil de Acesso (Ambiente) já existe. Nome do ambiente:', temExiste));
  if (temExiste && perfil.nomeAmbiente) {
    items.push(makeField('Ambiente', perfil.nomeAmbiente));
  }

  items.push(makeCheckItem(
    'Perfil de Acesso (Ambiente) não existe. Descrever funções do trabalho e quais módulos e dados necessita acessar:',
    temNaoExiste,
  ));
  if (temNaoExiste && perfil.descricaoFuncoes) {
    items.push({
      text: perfil.descricaoFuncoes,
      style: 'fieldValue',
      margin: [12, 2, 0, 0],
    });
  }

  return items;
}

// --------------------------------------------------------------------------
// Data do Requerimento
// --------------------------------------------------------------------------
function _makeDataRequerimento(data) {
  data = data || {};
  return makeFieldGrid([
    { label: 'Dia', value: data.dia },
    { label: 'Mês', value: data.mes },
    { label: 'Ano', value: data.ano },
  ]);
}

// --------------------------------------------------------------------------
// Termo de Responsabilidade
// --------------------------------------------------------------------------
function _makeTermo() {
  const clausulas = [
    'As informações armazenadas nos sistemas tributários da SEMFAZ de Porto Velho são sigilosas, conforme legislação vigente.',
    'É vedado o compartilhamento das credenciais de acesso (login e senha) com terceiros, sob pena de responsabilização administrativa, civil e criminal.',
    'O acesso aos sistemas tributários é monitorado e deve ser utilizado exclusivamente para fins profissionais legítimos.',
    'Ao utilizar os sistemas, devo respeitar o princípio do sigilo fiscal, conforme Art. 198 do Código Tributário Nacional.',
    'A senha é pessoal e intransferível, sendo de minha responsabilidade qualquer uso indevido.',
    'Devo comunicar imediatamente à SEMFAZ qualquer suspeita de violação de segurança ou acesso indevido.',
  ];

  return [
    { text: 'Declaro estar ciente de que:', style: 'termoTitle' },
    {
      ol: clausulas.map(t => ({ text: t, style: 'termoItem' })),
      margin: [12, 0, 0, 6],
    },
    makeDivider(4, 4),
    {
      text: '☑  Declaro que li e aceito o termo de responsabilidade de uso de sistema tributário da IN 002/2024/GAB/SEMFAZ',
      style: 'termoAceite',
    },
  ];
}

// --------------------------------------------------------------------------
// Dados do Superior
// --------------------------------------------------------------------------
function _makeSuperior(superior) {
  superior = superior || {};
  return makeFieldGrid([
    { label: 'Nome',  value: superior.nome },
    { label: 'CPF',   value: superior.cpf },
    { label: 'Cargo', value: superior.cargo },
  ]);
}

// --------------------------------------------------------------------------
// Exposição
// --------------------------------------------------------------------------
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createRequerimentoDoc };
} else {
  window.createRequerimentoDoc = createRequerimentoDoc;
}
