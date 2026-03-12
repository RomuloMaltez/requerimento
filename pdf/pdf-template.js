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
      makeSectionBlockBreakable('TERMO DE RESPONSABILIDADE', _makeTermo()),
      { text: '', pageBreak: 'before' },
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
    margin: [0, 0, 0, 10],
    table: {
      widths: ['*'],
      body: [[{
        stack: [
          { text: 'PREFEITURA MUNICIPAL DE PORTO VELHO', style: 'headerTitle' },
          { text: 'SECRETARIA MUNICIPAL DE FAZENDA', style: 'headerSubtitle' },
        ],
        fillColor: PDF_COLORS.white,
        border: [false, false, false, true],
        borderColor: [null, null, null, PDF_COLORS.accentGreen],
        margin: [0, 8, 0, 8],
      }]],
    },
    layout: {
      hLineWidth: (i, node) => (i === node.table.body.length ? 2 : 0),
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
  const itens = [
    { label: 'Sistema de Gestão Integrada – GPI Tributário', checked: sistemas.gpiTributario },
    { label: 'Portal Semfazonline NFS-e Retenção do ISSQN',  checked: sistemas.semfazonlineNFSe },
  ].filter(i => i.checked);

  return itens.map(i => makeCheckItem(i.label, true));
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
  const opcoes = {
    auditorTesouro:        'Auditor do Tesouro Municipal, em exercício regular das suas atribuições legais',
    servidorSubsecretaria: 'Servidor lotado na Subsecretaria de Receita Municipal ou na SEMFAZ',
    procuradorMunicipal:   'Procurador Municipal, em exercício regular das suas atribuições legais',
    servidorPGM:           'Servidor lotado na Procuradoria Geral do Município – PGM',
    outros:                'Outros (especificar)',
  };

  const label = opcoes[motivacao.tipo] || '';
  const items = [makeCheckItem(label, true)];

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

  if (perfil.tipo === 'existe') {
    items.push(makeCheckItem('Perfil de Acesso (Ambiente) já existe. Nome do ambiente:', true));
    if (perfil.nomeAmbiente) {
      items.push(makeField('Ambiente', perfil.nomeAmbiente));
    }
  }

  if (perfil.tipo === 'naoExiste') {
    items.push(makeCheckItem(
      'Perfil de Acesso (Ambiente) não existe. Descrever funções do trabalho e quais módulos e dados necessita acessar:',
      true,
    ));
    if (perfil.descricaoFuncoes) {
      items.push({
        text: perfil.descricaoFuncoes,
        style: 'fieldValue',
        margin: [12, 2, 0, 0],
      });
    }
  }

  return items;
}

// --------------------------------------------------------------------------
// Data do Requerimento
// --------------------------------------------------------------------------
function _makeDataRequerimento(data) {
  data = data || {};
  const dia = data.dia || '___';
  const mes = data.mes || '___________';
  const ano = data.ano || '______';
  return {
    columns: [
      {
        text: [
          { text: 'Dia: ',  style: 'fieldLabel' },
          { text: dia,      style: 'fieldValue' },
        ],
        width: 'auto',
      },
      {
        text: [
          { text: 'Mês: ',  style: 'fieldLabel' },
          { text: mes,      style: 'fieldValue' },
        ],
        width: 'auto',
        margin: [24, 0, 0, 0],
      },
      {
        text: [
          { text: 'Ano: ',  style: 'fieldLabel' },
          { text: ano,      style: 'fieldValue' },
        ],
        width: 'auto',
        margin: [24, 0, 0, 0],
      },
    ],
  };
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
      margin: [10, 0, 0, 4],
    },
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
