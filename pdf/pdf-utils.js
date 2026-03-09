/**
 * pdf-utils.js
 * Helpers reutilizáveis para composição de documentos pdfmake.
 * Cada função retorna um fragmento de conteúdo pdfmake (objeto ou array).
 * Importe/copie este arquivo em qualquer projeto que use o padrão.
 *
 * Depende de: pdf-styles.js (PDF_COLORS, PDF_STYLES)
 */

// --------------------------------------------------------------------------
// Bloco de seção com faixa de título colorida e corpo (sem quebra de página)
// --------------------------------------------------------------------------
function makeSectionBlock(title, bodyContent) {
  return {
    margin: [0, 0, 0, 10],
    table: {
      widths: ['*'],
      body: [
        // Linha de título
        [{
          text: title,
          style: 'sectionTitle',
          fillColor: PDF_COLORS.primaryBlue,
          border: [true, true, true, false],
          margin: [8, 5, 8, 5],
        }],
        // Corpo da seção
        [{
          stack: Array.isArray(bodyContent) ? bodyContent : [bodyContent],
          border: [true, false, true, true],
          margin: [8, 6, 8, 8],
          borderColor: [PDF_COLORS.borderLight, PDF_COLORS.borderLight, PDF_COLORS.borderLight, PDF_COLORS.borderLight],
        }],
      ],
    },
    layout: {
      hLineColor: () => PDF_COLORS.borderLight,
      vLineColor: () => PDF_COLORS.borderLight,
    },
  };
}

// --------------------------------------------------------------------------
// Bloco de seção que permite quebra de página (para conteúdo longo)
// --------------------------------------------------------------------------
function makeSectionBlockBreakable(title, bodyContent) {
  const items = Array.isArray(bodyContent) ? bodyContent : [bodyContent];
  return {
    margin: [0, 0, 0, 10],
    table: {
      widths: ['*'],
      body: [
        // Linha de título
        [{
          text: title,
          style: 'sectionTitle',
          fillColor: PDF_COLORS.primaryBlue,
          border: [true, true, true, false],
          margin: [8, 5, 8, 5],
        }],
        // Corpo — célula com dontBreakRows: false permite quebra de página
        [{
          stack: items,
          border: [true, false, true, true],
          margin: [8, 6, 8, 8],
        }],
      ],
      dontBreakRows: false,
    },
    layout: {
      hLineColor: () => PDF_COLORS.borderLight,
      vLineColor: () => PDF_COLORS.borderLight,
    },
  };
}

// --------------------------------------------------------------------------
// Campo individual: label + valor em linha
// --------------------------------------------------------------------------
function makeField(label, value) {
  return {
    columns: [
      { text: label + ':', style: 'fieldLabel', width: 'auto' },
      { text: ' ' + (value || ''), style: value ? 'fieldValue' : 'fieldEmpty' },
    ],
    columnGap: 4,
    margin: [0, 2, 0, 2],
  };
}

// --------------------------------------------------------------------------
// Grid de campos (duas colunas)
// --------------------------------------------------------------------------
function makeFieldGrid(fields) {
  const rows = [];
  for (let i = 0; i < fields.length; i += 2) {
    const left  = fields[i];
    const right = fields[i + 1];
    rows.push({
      columns: [
        { stack: [makeField(left.label, left.value)], width: '50%' },
        right
          ? { stack: [makeField(right.label, right.value)], width: '50%' }
          : { text: '', width: '50%' },
      ],
      columnGap: 12,
      margin: [0, 2, 0, 2],
    });
  }
  return rows;
}

// --------------------------------------------------------------------------
// Item de checkbox/radio (marcado ou não)
// --------------------------------------------------------------------------
function makeCheckItem(label, checked) {
  return {
    text: (checked ? '☑ ' : '☐ ') + label,
    style: checked ? 'checkboxSelected' : 'checkboxUnselected',
    margin: [0, 2, 0, 2],
  };
}

// --------------------------------------------------------------------------
// Linha horizontal divisória
// --------------------------------------------------------------------------
function makeDivider(marginTop = 6, marginBottom = 6) {
  return {
    canvas: [{
      type: 'line',
      x1: 0, y1: 0,
      x2: 515, y2: 0,
      lineWidth: 0.5,
      lineColor: PDF_COLORS.borderLight,
    }],
    margin: [0, marginTop, 0, marginBottom],
  };
}

// --------------------------------------------------------------------------
// Bloco de assinaturas (duas colunas)
// --------------------------------------------------------------------------
function makeSignatureBlock() {
  const assinaturaCol = (label) => ({
    stack: [
      // Espaço para assinatura manuscrita
      { text: '', margin: [0, 28, 0, 0] },
      // Linha de assinatura centralizada
      {
        canvas: [{
          type: 'line',
          x1: 10, y1: 0,
          x2: 210, y2: 0,
          lineWidth: 0.8,
          lineColor: PDF_COLORS.textDark,
        }],
        margin: [0, 0, 0, 3],
      },
      { text: label, style: 'signatureLabel', alignment: 'center' },
    ],
    width: '50%',
  });

  return {
    columns: [
      assinaturaCol('Assinatura do Requerente'),
      assinaturaCol('Assinatura do Superior Imediato'),
    ],
    columnGap: 20,
    margin: [0, 6, 0, 4],
  };
}

// --------------------------------------------------------------------------
// Rodapé de página
// --------------------------------------------------------------------------
function makeDocFooter(currentPage, pageCount, dataCriacao) {
  return {
    margin: [40, 0, 40, 0],
    stack: [
      {
        canvas: [{
          type: 'line',
          x1: 0, y1: 0,
          x2: 515, y2: 0,
          lineWidth: 0.4,
          lineColor: PDF_COLORS.borderLight,
        }],
        margin: [0, 0, 0, 4],
      },
      {
        columns: [
          { text: 'Anexo I – Requerimento de Uso de Sistema', style: 'footerText', alignment: 'left' },
          { text: 'Pág. ' + currentPage + ' / ' + pageCount, style: 'footerText', alignment: 'right' },
        ],
      },
      {
        text: 'Instrução Normativa n.º 002/2024/GAB/SEMFAZ',
        style: 'footerNote',
        margin: [0, 2, 0, 0],
      },
      {
        text: 'Documento gerado eletronicamente em ' + dataCriacao,
        style: 'footerNote',
      },
    ],
  };
}

// --------------------------------------------------------------------------
// Exposição
// --------------------------------------------------------------------------
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    makeSectionBlock,
    makeSectionBlockBreakable,
    makeField,
    makeFieldGrid,
    makeCheckItem,
    makeDivider,
    makeSignatureBlock,
    makeDocFooter,
  };
} else {
  window.makeSectionBlock           = makeSectionBlock;
  window.makeSectionBlockBreakable  = makeSectionBlockBreakable;
  window.makeField                  = makeField;
  window.makeFieldGrid              = makeFieldGrid;
  window.makeCheckItem              = makeCheckItem;
  window.makeDivider                = makeDivider;
  window.makeSignatureBlock         = makeSignatureBlock;
  window.makeDocFooter              = makeDocFooter;
}
