import React, { CSSProperties } from "react";

// ── Paleta de cores (alinhada com o padrão institucional) ─────────────────────
const NAVY    = "#1e3a5f";
const GREEN   = "#70b643";
const DK_GRN  = "#2D5016";
const GRAY    = "#6b7280";
const BORDER  = "#e5e7eb";

// ── Estilos base ──────────────────────────────────────────────────────────────
const pdfPaperStyle: CSSProperties = {
    position: "relative",
    width: "210mm",
    height: "297mm",
    background: "#ffffff",
    overflow: "hidden",
    boxSizing: "border-box",
};

const pdfTitleStyle: CSSProperties = {
    fontSize: "13pt",
    margin: "6px 0 10px 0",
    color: GREEN,
    fontWeight: 700,
    textAlign: "center",
    textTransform: "uppercase",
};

const pdfSectionTitleStyle: CSSProperties = {
    background: NAVY,
    color: "#fff",
    padding: "5px 8px",
    margin: "12px 0 2px 0",
    fontSize: "10pt",
    fontWeight: 700,
};

const pdfFieldLineStyle: CSSProperties = {
    marginBottom: "5px",
    lineHeight: 1.6,
    fontSize: "9.5pt",
};

const pdfParagraphStyle: CSSProperties = {
    marginBottom: "8px",
    textAlign: "justify",
    fontSize: "9.5pt",
};

// ── Quadro de página (cabeçalho + conteúdo + rodapé) ─────────────────────────
export function PdfPageFrame({ children }: { children: React.ReactNode }) {
    const dataHoje = new Date().toLocaleDateString("pt-BR");

    return (
        <div className="pdf-page" style={pdfPaperStyle}>
            <div style={{
                height: "100%",
                padding: "10mm 20mm 8mm 20mm",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Arial, sans-serif",
                fontSize: "10.5pt",
                lineHeight: 1.4,
                color: "#000000",
            }}>

                {/* ── Cabeçalho institucional ─────────────────────────────── */}
                <div style={{
                    textAlign: "center",
                    borderBottom: `2px solid ${GREEN}`,
                    paddingBottom: "6px",
                    marginBottom: "10px",
                }}>
                    <div style={{ fontSize: "13pt", fontWeight: "bold", color: NAVY }}>
                        PREFEITURA MUNICIPAL DE PORTO VELHO
                    </div>
                    <div style={{ fontSize: "10pt", color: DK_GRN }}>
                        SECRETARIA MUNICIPAL DE FAZENDA
                    </div>
                </div>

                {/* ── Conteúdo da página ──────────────────────────────────── */}
                <div style={{ flex: 1, overflow: "hidden" }}>
                    {children}
                </div>

                {/* ── Rodapé de página ────────────────────────────────────── */}
                <div style={{
                    borderTop: `1px solid ${BORDER}`,
                    paddingTop: "4px",
                    marginTop: "6px",
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "7pt",
                        color: GRAY,
                    }}>
                        <span>Anexo I – Requerimento de Uso de Sistema</span>
                        <span>Instrução Normativa n.º 002/2024/GAB/SEMFAZ</span>
                    </div>
                    <div style={{ textAlign: "center", fontSize: "7pt", color: GRAY, marginTop: "2px" }}>
                        Documento gerado eletronicamente em {dataHoje}
                    </div>
                </div>

            </div>
        </div>
    );
}

// ── Props ─────────────────────────────────────────────────────────────────────
type PdfProps = {
    sistemas: string[];
    requerente: any;
    motivacao: any;
    perfil: any;
    superior: any;
    dataRequerimento: string;
};

// ── Componente principal ──────────────────────────────────────────────────────
export const RequerimentoPDF = React.forwardRef<HTMLDivElement, PdfProps>(
    ({ sistemas, requerente, motivacao, perfil, superior, dataRequerimento }, ref) => {

        const sistemasMap: Record<string, string> = {
            gpiTributario:    "Sistema de Gestão Integrada – GPI Tributário",
            semfazonlineNFSe: "Portal Semfazonline NFS-e Retenção do ISSQN",
        };

        const motivacaoMap: Record<string, string> = {
            auditorTesouro:        "Auditor do Tesouro Municipal",
            servidorSubsecretaria: "Servidor lotado na Subsecretaria de Receita Municipal ou na SEMFAZ",
            procuradorMunicipal:   "Procurador Municipal",
            servidorPGM:           "Servidor lotado na PGM",
            outros:                `Outros: ${motivacao.outrosEspecificar}`,
        };

        const formatarDataFormal = (data: string) => {
            if (!data) return "";
            const [ano, mesStr, dia] = data.split("-");
            const meses = [
                "janeiro", "fevereiro", "março", "abril", "maio", "junho",
                "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
            ];
            return `Porto Velho - RO, ${parseInt(dia, 10)} de ${meses[parseInt(mesStr, 10) - 1]} de ${ano}.`;
        };

        const dataFormal = formatarDataFormal(dataRequerimento);

        return (
            <div ref={ref} style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>

                {/* ════════════════════ PÁGINA 1 ════════════════════ */}
                <PdfPageFrame>
                    <h1 style={pdfTitleStyle}>REQUERIMENTO – USO DE SISTEMAS TRIBUTÁRIOS</h1>

                    <p style={pdfParagraphStyle}>
                        <strong>
                            Ilmo. (a) Sr. (a) Secretário (a) Municipal de Fazenda, requeremos o acesso
                            ao seguinte sistema:
                        </strong>
                    </p>

                    {/* Sistema */}
                    <div style={pdfSectionTitleStyle}>SISTEMA SOLICITADO</div>
                    {sistemas.map(s => (
                        <div key={s} style={pdfFieldLineStyle}>
                            ☑&nbsp; {sistemasMap[s] || s}
                        </div>
                    ))}

                    {/* Dados do Requerente */}
                    <div style={pdfSectionTitleStyle}>DADOS DO REQUERENTE</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                        {[
                            ["Nome",      requerente.nome],
                            ["CPF",       requerente.cpf],
                            ["Cargo",     requerente.cargo],
                            ["Função",    requerente.funcao || "N/A"],
                            ["Lotação",   requerente.lotacao],
                            ["Vínculo",   requerente.vinculo],
                            ["Matrícula", requerente.matricula],
                            ["E-mail",    requerente.email],
                        ].map(([label, value]) => (
                            <div key={label as string} style={pdfFieldLineStyle}>
                                <strong style={{ color: NAVY }}>{label}:</strong>{" "}
                                <span style={{ color: "#374151" }}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Motivação */}
                    <div style={pdfSectionTitleStyle}>MOTIVAÇÃO – PARA USO DO SISTEMA</div>
                    <div style={pdfFieldLineStyle}>
                        ☑&nbsp; {motivacaoMap[motivacao.motivacao as string] || "Não especificada"}
                    </div>

                    {/* Perfil de Acesso */}
                    <div style={pdfSectionTitleStyle}>PERFIL DE ACESSO</div>
                    {perfil.tipoPerfil === "existe" ? (
                        <div style={pdfFieldLineStyle}>
                            ☑&nbsp; <strong>Perfil de Acesso (Ambiente) já existe.</strong>{" "}
                            <strong style={{ color: NAVY }}>Ambiente:</strong>{" "}
                            <span style={{ color: "#374151" }}>{perfil.nomeAmbiente}</span>
                        </div>
                    ) : (
                        <div>
                            <div style={pdfFieldLineStyle}>
                                ☑&nbsp; <strong>
                                    Perfil de Acesso (Ambiente) não existe.
                                    Descrever funções do trabalho e quais módulos e dados necessita acessar:
                                </strong>
                            </div>
                            <div style={{
                                ...pdfParagraphStyle,
                                whiteSpace: "pre-wrap",
                                border: `1px solid ${BORDER}`,
                                padding: "6px 8px",
                                marginLeft: "12px",
                                color: "#374151",
                            }}>
                                {perfil.descricaoFuncoes}
                            </div>
                        </div>
                    )}
                </PdfPageFrame>

                {/* ════════════════════ PÁGINA 2 ════════════════════ */}
                <PdfPageFrame>
                    {/* Termo de Responsabilidade */}
                    <div style={pdfSectionTitleStyle}>TERMO DE RESPONSABILIDADE</div>
                    <p style={{ ...pdfParagraphStyle, marginTop: "4px" }}>
                        <strong>Declaro estar ciente de que:</strong>
                    </p>
                    <ol style={{ paddingLeft: "18px", margin: "0 0 8px 0" }}>
                        {[
                            "As informações armazenadas nos sistemas tributários da SEMFAZ de Porto Velho são sigilosas, conforme legislação vigente.",
                            "É vedado o compartilhamento das credenciais de acesso (login e senha) com terceiros, sob pena de responsabilização administrativa, civil e criminal.",
                            "O acesso aos sistemas tributários é monitorado e deve ser utilizado exclusivamente para fins profissionais legítimos.",
                            "Ao utilizar os sistemas, devo respeitar o princípio do sigilo fiscal, conforme Art. 198 do Código Tributário Nacional.",
                            "A senha é pessoal e intransferível, sendo de minha responsabilidade qualquer uso indevido.",
                            "Devo comunicar imediatamente à SEMFAZ qualquer suspeita de violação de segurança ou acesso indevido.",
                        ].map((item, i) => (
                            <li key={i} style={{ fontSize: "8.5pt", color: "#374151", marginBottom: "3px" }}>
                                {item}
                            </li>
                        ))}
                    </ol>
                    <div style={{
                        fontSize: "8.5pt",
                        fontWeight: "bold",
                        color: NAVY,
                        marginBottom: "10px",
                    }}>
                        ☑&nbsp; Declaro que li e aceito o termo de responsabilidade de uso de sistema
                        tributário da IN 002/2024/GAB/SEMFAZ
                    </div>

                    {/* Dados do Superior Imediato */}
                    <div style={pdfSectionTitleStyle}>DADOS DO SUPERIOR IMEDIATO</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                        {[
                            ["Nome",  superior.superiorNome],
                            ["CPF",   superior.superiorCPF],
                            ["Cargo", superior.superiorCargo],
                        ].map(([label, value]) => (
                            <div key={label as string} style={pdfFieldLineStyle}>
                                <strong style={{ color: NAVY }}>{label}:</strong>{" "}
                                <span style={{ color: "#374151" }}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Data formal */}
                    <div style={{
                        textAlign: "center",
                        marginTop: "60px",
                        marginBottom: "40px",
                        fontSize: "10pt",
                    }}>
                        {dataFormal}
                    </div>

                    {/* Assinaturas */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "60px",
                        textAlign: "center",
                    }}>
                        {[
                            "Assinatura do Requerente",
                            "Assinatura do Superior Imediato",
                        ].map((label) => (
                            <div key={label} style={{ width: "45%" }}>
                                <div style={{
                                    borderTop: "1px solid #000",
                                    marginBottom: "6px",
                                }} />
                                <strong style={{ fontSize: "9pt" }}>{label}</strong>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        textAlign: "center",
                        fontSize: "7.5pt",
                        color: GRAY,
                        marginTop: "8px",
                        fontStyle: "italic",
                    }}>
                        Este documento pode ser assinado digitalmente pelo GOV.BR, SEI ou por outro meio certificado.
                    </div>
                </PdfPageFrame>

            </div>
        );
    }
);

RequerimentoPDF.displayName = "RequerimentoPDF";
