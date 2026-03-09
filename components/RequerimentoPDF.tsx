import React, { CSSProperties } from "react";

// --- ESTILOS FORNECIDOS ---
const pdfPageStyle: CSSProperties = {
    width: "190mm",
    minHeight: "277mm",
    padding: "10mm",
    background: "#ffffff",
    fontFamily: "Arial, sans-serif",
    fontSize: "10.5pt",
    lineHeight: 1.4,
    color: "#000000",
};

const pdfHeaderStyle: CSSProperties = {
    textAlign: "center",
    marginBottom: "18px",
    borderBottom: "2px solid #333",
    paddingBottom: "12px",
};

const pdfTitleStyle: CSSProperties = {
    fontSize: "17pt",
    marginBottom: "6px",
    margin: "20px 0 20px 0",
    color: "#000",
    fontWeight: 700,
    textAlign: "center"
};

const pdfSubTitleStyle: CSSProperties = {
    fontSize: "13pt",
    marginBottom: "4px",
    fontWeight: 400,
    color: "#333",
};

const pdfHeaderTextStyle: CSSProperties = {
    fontSize: "9pt",
    color: "#666",
};

const pdfSectionTitleStyle: CSSProperties = {
    background: "#333",
    color: "#fff",
    padding: "0 0 15px 5px",
    margin: "28px 0 2px 0", 
    fontSize: "11pt",
    fontWeight: 700,
};

const pdfFieldLineStyle: CSSProperties = {
    marginBottom: "6px",
    lineHeight: 1.6,
};

const pdfParagraphStyle: CSSProperties = {
    marginBottom: "10px",
    textAlign: "justify",
};

const pdfCheckboxLineStyle: CSSProperties = {
    margin: "6px 0",
    padding: "4px",
    border: "1px solid #ddd",
};

const pdfTableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "12px 0",
};

const pdfCellStyle: CSSProperties = {
    border: "1px solid #333",
    padding: "6px",
    textAlign: "left",
    fontSize: "9.5pt",
};

const pdfThStyle: CSSProperties = {
    ...pdfCellStyle,
    background: "#f0f0f0",
    fontWeight: 700,
};

const pdfSignatureAreaStyle: CSSProperties = {
    marginTop: "35px",
    textAlign: "center",
};

const pdfSignatureLineStyle: CSSProperties = {
    borderTop: "1px solid #000",
    width: "300px",
    margin: "45px auto 8px",
};

const pdfHrStyle: CSSProperties = {
    border: "none",
    borderTop: "1px solid #333",
    margin: "15px 0",
};

const pdfPaperStyle: CSSProperties = {
    position: "relative",
    width: "210mm",
    minHeight: "297mm",
    height: "297mm",
    background: "#ffffff",
    overflow: "hidden",
};

const pdfTimbradoHeaderStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    pointerEvents: "none",
    zIndex: 1,
};

const pdfTimbradoHeaderImgStyle: CSSProperties = {
    width: "100%",
    display: "block",
};

const pdfTimbradoFooterStyle: CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    pointerEvents: "none",
    zIndex: 1,
};

const pdfTimbradoFooterImgStyle: CSSProperties = {
    width: "100%",
    display: "block",
};

const pdfContentLayerStyle: CSSProperties = {
    position: "relative",
    zIndex: 2,
    width: "190mm",
    minHeight: "277mm",
    padding: "25mm 10mm 28mm 10mm",
    margin: "0 auto",
    background: "transparent",
    fontFamily: "Arial, sans-serif",
    fontSize: "10.5pt",
    lineHeight: 1.4,
    color: "#000000",
};

const TIMBRADO_HEADER_SRC = "/semec-timbrado-cabecalho.png"; // Certifique-se que as imagens estão na pasta public
const TIMBRADO_FOOTER_SRC = "/semec-timbrado-rodape.png";

export function PdfPageFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="pdf-page" style={pdfPaperStyle}>
            <div style={pdfTimbradoHeaderStyle}><img src={TIMBRADO_HEADER_SRC} alt="" style={pdfTimbradoHeaderImgStyle} /></div>
            <div style={pdfTimbradoFooterStyle}><img src={TIMBRADO_FOOTER_SRC} alt="" style={pdfTimbradoFooterImgStyle} /></div>
            <div style={pdfContentLayerStyle}>{children}</div>
        </div>
    );
}

// Props que o PDF vai receber
type PdfProps = {
    sistemas: string[];
    requerente: any;
    motivacao: any;
    perfil: any;
    superior: any;
    dataRequerimento: string;
};

// Componente Principal do PDF
export const RequerimentoPDF = React.forwardRef<HTMLDivElement, PdfProps>(({ sistemas, requerente, motivacao, perfil, superior, dataRequerimento }, ref) => {

    // Mapeamentos para deixar os textos legíveis no PDF
    const sistemasMap: Record<string, string> = {
        gpiTributario: "Sistema de Gestão Integrada – GPI Tributário",
        semfazonlineNFSe: "Portal Semfazonline NFS-e Retenção do ISSQN"
    };

    const motivacaoMap: Record<string, string> = {
        auditorTesouro: "Auditor do Tesouro Municipal",
        servidorSubsecretaria: "Servidor lotado na Subsecretaria de Receita Municipal ou na SEMFAZ",
        procuradorMunicipal: "Procurador Municipal",
        servidorPGM: "Servidor lotado na PGM",
        outros: `Outros: ${motivacao.outrosEspecificar}`
    };

    // Formatar a data (DD/MM/YYYY) baseada no horário atual do sistema para o rodapé
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    // Formatar a data do requerimento para o padrão formal (Ex: Porto Velho - RO, 05 de março de 2026)
    const formatarDataFormal = (data: string) => {
        if (!data) return "";
        const [ano, mesStr, dia] = data.split('-');
        const meses = [
            "janeiro", "fevereiro", "março", "abril", "maio", "junho",
            "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
        ];
        const mesIndex = parseInt(mesStr, 10) - 1;
        const dia2 = parseInt(dia, 10);
        return `Porto Velho - RO, ${dia2} de ${meses[mesIndex]} de ${ano}.`;
    };

    const dataFormal = formatarDataFormal(dataRequerimento);

    return (
        <div ref={ref} style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>

            {/* --- PÁGINA 1 --- */}
            <PdfPageFrame>
                <h1 style={pdfTitleStyle}>REQUERIMENTO - USO DE SISTEMAS TRIBUTÁRIOS</h1>

                <p style={pdfParagraphStyle}>
                    <strong>Ilmo. (a) Sr. (a) Secretário (a) Municipal de Fazenda, requeremos o acesso ao seguinte sistema:</strong>
                </p>

                <div style={pdfSectionTitleStyle}>SISTEMA SOLICITADO</div>
                {sistemas.map(s => (
                    <div key={s} style={pdfFieldLineStyle}>• {sistemasMap[s] || s}</div>
                ))}

                <div style={pdfSectionTitleStyle}>DADOS DO REQUERENTE</div>
                <div style={pdfFieldLineStyle}><strong>Nome:</strong> {requerente.nome}</div>
                <div style={pdfFieldLineStyle}><strong>CPF:</strong> {requerente.cpf}</div>
                <div style={pdfFieldLineStyle}><strong>Cargo:</strong> {requerente.cargo}</div>
                <div style={pdfFieldLineStyle}><strong>Função:</strong> {requerente.funcao || "N/A"}</div>
                <div style={pdfFieldLineStyle}><strong>Lotação:</strong> {requerente.lotacao}</div>
                <div style={pdfFieldLineStyle}><strong>Vínculo:</strong> {requerente.vinculo}</div>
                <div style={pdfFieldLineStyle}><strong>Matrícula:</strong> {requerente.matricula}</div>
                <div style={pdfFieldLineStyle}><strong>E-mail:</strong> {requerente.email}</div>

                <div style={pdfSectionTitleStyle}>MOTIVAÇÃO – PARA USO DO SISTEMA</div>
                <div style={pdfFieldLineStyle}>{motivacaoMap[motivacao.motivacao as string] || "Não especificada"}</div>

                <div style={pdfSectionTitleStyle}>PERFIL DE ACESSO</div>
                {perfil.tipoPerfil === "existe" ? (
                    <div style={pdfFieldLineStyle}><strong>Ambiente Existente:</strong> {perfil.nomeAmbiente}</div>
                ) : (
                    <div>
                        <div style={pdfFieldLineStyle}><strong>Ambiente Não Existe. Funções necessárias:</strong></div>
                        <div style={{ ...pdfParagraphStyle, whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "8px" }}>
                            {perfil.descricaoFuncoes}
                        </div>
                    </div>
                )}
            </PdfPageFrame>

            {/* --- PÁGINA 2 --- */}
            <PdfPageFrame>
                <div style={pdfSectionTitleStyle}>TERMO DE RESPONSABILIDADE</div>
                <p style={pdfParagraphStyle}>
                    O requerente declarou estar ciente e concordou integralmente com as normas de uso, sigilo fiscal, intransferibilidade de credenciais e as responsabilidades civis, penais e administrativas referentes ao uso dos sistemas, conforme Termo de Responsabilidade (Anexo II) da IN 002/2024/GAB/SEMFAZ.
                </p>

                <div style={pdfSectionTitleStyle}>DADOS DO SUPERIOR IMEDIATO</div>
                <div style={pdfFieldLineStyle}><strong>Nome:</strong> {superior.superiorNome}</div>
                <div style={pdfFieldLineStyle}><strong>CPF:</strong> {superior.superiorCPF}</div>
                <div style={pdfFieldLineStyle}><strong>Cargo:</strong> {superior.superiorCargo}</div>

                {/* DATA FORMAL */}
                <div style={{ textAlign: "center", marginTop: "100px", marginBottom: "50px", fontSize: "11pt" }}>
                    {dataFormal}
                </div>

                {/* ASSINATURAS */}
                <div style={{ display: "flex", marginTop: "150px", justifyContent: "space-between", textAlign: "center" }}>
                    <div style={{ width: "45%" }}>
                        <div style={{ borderTop: "1px solid #000", margin: "0 auto 8px", width: "100%" }}></div>
                        <strong>Assinatura do Requerente</strong>
                    </div>
                    <div style={{ width: "45%" }}>
                        <div style={{ borderTop: "1px solid #000", margin: "0 auto 8px", width: "100%" }}></div>
                        <strong>Assinatura do Superior Imediato</strong>
                    </div>
                </div>

                {/* FOOTER ESPECÍFICO DO DOCUMENTO */}
                <div style={{ position: "absolute", bottom: "30mm", left: "10mm", right: "10mm", textAlign: "center", fontSize: "8pt", color: "#666", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
                    Anexo I – Requerimento de Uso de Sistema<br />
                    Instrução Normativa n.º 002/2024/GAB/SEMFAZ<br />
                    Documento gerado eletronicamente em {dataAtual}
                </div>
            </PdfPageFrame>

        </div>
    );
});
RequerimentoPDF.displayName = "RequerimentoPDF";