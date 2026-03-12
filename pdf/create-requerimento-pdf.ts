/**
 * create-requerimento-pdf.ts
 * Geração de PDF vetorial (texto real, pesquisável, alta resolução) via pdfmake.
 * Utilizado pelo componente React (Next.js) — versão TypeScript.
 */

import type { TDocumentDefinitions, Content, StyleDictionary } from "pdfmake/interfaces";

// ── Paleta de cores ───────────────────────────────────────────────────────────
const C = {
  navy:    "#1e3a5f",
  green:   "#70b643",
  dkGreen: "#2D5016",
  text:    "#374151",
  mid:     "#6b7280",
  border:  "#e5e7eb",
  white:   "#ffffff",
} as const;

// ── Estilos pdfmake ───────────────────────────────────────────────────────────
const STYLES: StyleDictionary = {
  headerTitle: {
    fontSize: 13, bold: true, color: C.navy, alignment: "center",
  },
  headerSubtitle: {
    fontSize: 10, color: C.dkGreen, alignment: "center",
  },
  docTitle: {
    fontSize: 13, bold: true, color: C.green, alignment: "center",
  },
  docIntro: {
    fontSize: 10, bold: true, color: C.text,
  },
  sectionTitle: {
    fontSize: 9.5, bold: true, color: C.white,
  },
  fieldLabel: {
    fontSize: 9, bold: true, color: C.navy,
  },
  fieldValue: {
    fontSize: 9, color: C.text,
  },
  fieldEmpty: {
    fontSize: 9, color: C.mid, italics: true,
  },
  checkItem: {
    fontSize: 9, bold: true, color: C.navy,
  },
  termoTitle: {
    fontSize: 8.5, bold: true, color: C.text,
  },
  termoItem: {
    fontSize: 8, color: C.text,
  },
  termoAceite: {
    fontSize: 8.5, bold: true, color: C.navy,
  },
  signatureLabel: {
    fontSize: 8, alignment: "center", color: C.mid,
  },
  signatureNote: {
    fontSize: 7, alignment: "center", color: C.mid, italics: true,
  },
  footerText: {
    fontSize: 7, color: C.mid,
  },
  footerNote: {
    fontSize: 7, color: C.mid, italics: true, alignment: "center",
  },
};

// ── Tipos de entrada ──────────────────────────────────────────────────────────
export interface RequerimentoFormData {
  sistemas: string[];
  requerente: {
    nome: string; cpf: string; cargo: string; funcao?: string;
    lotacao: string; vinculo: string; matricula: string; email: string;
  };
  motivacao: { motivacao: string; outrosEspecificar?: string };
  perfil: {
    tipoPerfil: "existe" | "naoExiste" | "";
    nomeAmbiente: string;
    descricaoFuncoes: string;
  };
  superior: { superiorNome: string; superiorCPF: string; superiorCargo: string };
  dataRequerimento: string; // ISO: "2026-03-11"
}

// ── Helpers internos ──────────────────────────────────────────────────────────

function sectionBlock(title: string, body: Content | Content[]): Content {
  return {
    margin: [0, 0, 0, 8],
    table: {
      widths: ["*"],
      body: [
        [{
          text: title,
          style: "sectionTitle",
          fillColor: C.navy,
          border: [true, true, true, false],
          borderColor: [C.border, C.border, C.border, C.border],
          margin: [8, 5, 8, 5],
        }],
        [{
          stack: Array.isArray(body) ? body : [body],
          border: [true, false, true, true],
          borderColor: [C.border, C.border, C.border, C.border],
          margin: [8, 6, 8, 8],
        }],
      ],
    },
    layout: {
      hLineColor: () => C.border,
      vLineColor: () => C.border,
    },
  } as Content;
}

function field(label: string, value?: string): Content {
  return {
    columns: [
      { text: label + ":", style: "fieldLabel", width: "auto" },
      { text: " " + (value || "—"), style: value ? "fieldValue" : "fieldEmpty" },
    ],
    columnGap: 4,
    margin: [0, 2, 0, 2],
  } as Content;
}

function fieldGrid(pairs: Array<{ label: string; value?: string }>): Content[] {
  const rows: Content[] = [];
  for (let i = 0; i < pairs.length; i += 2) {
    const l = pairs[i];
    const r = pairs[i + 1];
    rows.push({
      columns: [
        { stack: [field(l.label, l.value)], width: "50%" },
        r ? { stack: [field(r.label, r.value)], width: "50%" } : { text: "", width: "50%" },
      ],
      columnGap: 12,
      margin: [0, 1, 0, 1],
    } as Content);
  }
  return rows;
}

function checkItem(label: string): Content {
  return { text: "☑  " + label, style: "checkItem", margin: [0, 2, 0, 2] } as Content;
}

function signatureBlock(): Content {
  const col = (label: string) => ({
    stack: [
      { text: "", margin: [0, 30, 0, 0] },
      {
        canvas: [{
          type: "line", x1: 10, y1: 0, x2: 210, y2: 0,
          lineWidth: 0.8, lineColor: C.text,
        }],
        margin: [0, 0, 0, 4],
      },
      { text: label, style: "signatureLabel", alignment: "center" },
    ],
    width: "50%",
  });
  return {
    columns: [col("Assinatura do Requerente"), col("Assinatura do Superior Imediato")],
    columnGap: 20,
    margin: [0, 20, 0, 4],
  } as Content;
}

function headerInstitucional(): Content {
  return {
    margin: [0, 0, 0, 10],
    table: {
      widths: ["*"],
      body: [[{
        stack: [
          { text: "PREFEITURA MUNICIPAL DE PORTO VELHO", style: "headerTitle" },
          { text: "SECRETARIA MUNICIPAL DE FAZENDA",    style: "headerSubtitle" },
        ],
        border: [false, false, false, true],
        borderColor: [null, null, null, C.green],
        margin: [0, 8, 0, 8],
      }]],
    },
    layout: {
      hLineWidth: (i: number, node: any) => (i === node.table.body.length ? 2 : 0),
      hLineColor: () => C.green,
      vLineColor: () => "transparent",
    },
  } as unknown as Content;
}

function formatarDataFormal(isoDate: string): string {
  if (!isoDate) return "";
  const [ano, mesStr, diaStr] = isoDate.split("-");
  const meses = [
    "janeiro","fevereiro","março","abril","maio","junho",
    "julho","agosto","setembro","outubro","novembro","dezembro",
  ];
  return `Porto Velho - RO, ${parseInt(diaStr, 10)} de ${meses[parseInt(mesStr, 10) - 1]} de ${ano}.`;
}

// ── Função principal ──────────────────────────────────────────────────────────

export function buildDocDefinition(data: RequerimentoFormData): TDocumentDefinitions {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const dataFormal = formatarDataFormal(data.dataRequerimento);

  const sistemasMap: Record<string, string> = {
    gpiTributario:    "Sistema de Gestão Integrada – GPI Tributário",
    semfazonlineNFSe: "Portal Semfazonline NFS-e Retenção do ISSQN",
  };

  const motivacaoMap: Record<string, string> = {
    auditorTesouro:        "Auditor do Tesouro Municipal, em exercício regular das suas atribuições legais",
    servidorSubsecretaria: "Servidor lotado na Subsecretaria de Receita Municipal ou na SEMFAZ",
    procuradorMunicipal:   "Procurador Municipal, em exercício regular das suas atribuições legais",
    servidorPGM:           "Servidor lotado na Procuradoria Geral do Município – PGM",
    outros:                `Outros: ${data.motivacao.outrosEspecificar || ""}`,
  };

  // ── Seção: Sistemas ───────────────────────────────────────────────────────
  const sistemasContent: Content[] = data.sistemas.map(s =>
    checkItem(sistemasMap[s] || s)
  );

  // ── Seção: Requerente ─────────────────────────────────────────────────────
  const requerenteContent = fieldGrid([
    { label: "Nome",      value: data.requerente.nome      },
    { label: "CPF",       value: data.requerente.cpf       },
    { label: "Cargo",     value: data.requerente.cargo     },
    { label: "Função",    value: data.requerente.funcao    },
    { label: "Lotação",   value: data.requerente.lotacao   },
    { label: "Vínculo",   value: data.requerente.vinculo   },
    { label: "Matrícula", value: data.requerente.matricula },
    { label: "E-mail",    value: data.requerente.email     },
  ]);

  // ── Seção: Motivação ──────────────────────────────────────────────────────
  const motivacaoContent: Content[] = [
    checkItem(motivacaoMap[data.motivacao.motivacao] || "Não especificada"),
  ];

  // ── Seção: Perfil de Acesso ───────────────────────────────────────────────
  const perfilContent: Content[] = [];
  if (data.perfil.tipoPerfil === "existe") {
    perfilContent.push(checkItem("Perfil de Acesso (Ambiente) já existe. Nome do ambiente:"));
    perfilContent.push(field("Ambiente", data.perfil.nomeAmbiente));
  } else {
    perfilContent.push(checkItem(
      "Perfil de Acesso (Ambiente) não existe. Descrever funções do trabalho e quais módulos e dados necessita acessar:"
    ));
    if (data.perfil.descricaoFuncoes) {
      perfilContent.push({ text: data.perfil.descricaoFuncoes, style: "fieldValue", margin: [12, 2, 0, 0] } as Content);
    }
  }

  // ── Seção: Termo de Responsabilidade ─────────────────────────────────────
  const clausulas = [
    "As informações armazenadas nos sistemas tributários da SEMFAZ de Porto Velho são sigilosas, conforme legislação vigente.",
    "É vedado o compartilhamento das credenciais de acesso (login e senha) com terceiros, sob pena de responsabilização administrativa, civil e criminal.",
    "O acesso aos sistemas tributários é monitorado e deve ser utilizado exclusivamente para fins profissionais legítimos.",
    "Ao utilizar os sistemas, devo respeitar o princípio do sigilo fiscal, conforme Art. 198 do Código Tributário Nacional.",
    "A senha é pessoal e intransferível, sendo de minha responsabilidade qualquer uso indevido.",
    "Devo comunicar imediatamente à SEMFAZ qualquer suspeita de violação de segurança ou acesso indevido.",
  ];

  const termoContent: Content[] = [
    { text: "Declaro estar ciente de que:", style: "termoTitle" } as Content,
    {
      ol: clausulas.map(t => ({ text: t, style: "termoItem" })),
      margin: [10, 2, 0, 4],
    } as Content,
    {
      text: "☑  Declaro que li e aceito o termo de responsabilidade de uso de sistema tributário da IN 002/2024/GAB/SEMFAZ",
      style: "termoAceite",
    } as Content,
  ];

  // ── Seção: Superior Imediato ──────────────────────────────────────────────
  const superiorContent = fieldGrid([
    { label: "Nome",  value: data.superior.superiorNome  },
    { label: "CPF",   value: data.superior.superiorCPF   },
    { label: "Cargo", value: data.superior.superiorCargo },
  ]);

  // ── Documento ─────────────────────────────────────────────────────────────
  return {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 60],

    footer: (currentPage: number, pageCount: number): Content => ({
      margin: [40, 0, 40, 0],
      stack: [
        {
          canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.4, lineColor: C.border }],
          margin: [0, 0, 0, 4],
        },
        {
          columns: [
            { text: "Anexo I – Requerimento de Uso de Sistema", style: "footerText", alignment: "left" },
            { text: `Pág. ${currentPage} / ${pageCount}`,       style: "footerText", alignment: "right" },
          ],
        },
        { text: "Instrução Normativa n.º 002/2024/GAB/SEMFAZ", style: "footerNote", margin: [0, 2, 0, 0] },
        { text: `Documento gerado eletronicamente em ${hoje}`,  style: "footerNote" },
      ],
    } as Content),

    styles: STYLES,
    defaultStyle: { font: "Roboto", fontSize: 9 },

    content: [
      headerInstitucional(),

      { text: "REQUERIMENTO – USO DE SISTEMAS TRIBUTÁRIOS", style: "docTitle", margin: [0, 0, 0, 8] },

      {
        text: "Ilmo. (a) Sr. (a) Secretário (a) Municipal de Fazenda, requeremos o acesso ao seguinte sistema:",
        style: "docIntro",
        margin: [0, 0, 0, 10],
      },

      sectionBlock("SISTEMA SOLICITADO",          sistemasContent),
      sectionBlock("DADOS DO REQUERENTE",          requerenteContent),
      sectionBlock("MOTIVAÇÃO – PARA USO DO SISTEMA", motivacaoContent),
      sectionBlock("PERFIL DE ACESSO",             perfilContent),
      sectionBlock("TERMO DE RESPONSABILIDADE",    termoContent),

      { text: "", pageBreak: "before" },

      headerInstitucional(),

      { text: "REQUERIMENTO – USO DE SISTEMAS TRIBUTÁRIOS", style: "docTitle", margin: [0, 0, 0, 8] },

      sectionBlock("DADOS DO SUPERIOR IMEDIATO",   superiorContent),

      sectionBlock("ASSINATURAS", [
        signatureBlock(),
        {
          text: `${dataFormal}\n\nEste documento pode ser assinado digitalmente pelo GOV.BR, SEI ou por outro meio certificado.`,
          style: "signatureNote",
          margin: [0, 6, 0, 0],
        } as Content,
      ]),
    ],
  };
}

// ── Exporta a função de download ──────────────────────────────────────────────

export async function downloadRequerimentoPdf(
  data: RequerimentoFormData,
  filename?: string
): Promise<void> {
  const pdfMake = (await import("pdfmake/build/pdfmake")).default;
  const pdfFonts = (await import("pdfmake/build/vfs_fonts")).default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pdfMake as any).vfs = (pdfFonts as any).vfs ?? (pdfFonts as any).pdfMake?.vfs;

  const docDef = buildDocDefinition(data);
  const cpf = data.requerente.cpf.replace(/\D/g, "");
  pdfMake.createPdf(docDef).download(filename || `requerimento_sistemas_${cpf}.pdf`);
}
