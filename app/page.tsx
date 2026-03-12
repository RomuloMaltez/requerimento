"use client";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SistemaSection from "@/components/SistemaSection";
import DadosRequerenteSection from "@/components/DadosRequerenteSection";
import MotivacaoSection from "@/components/MotivacaoSection";
import PerfilAcessoSection from "@/components/PerfilAcessoSection";
import DataRequerimentoSection from "@/components/DataRequerimentoSection";
import SuperiorImediatoSection from "@/components/SuperiorImediatoSection";
import { RequerimentoPDF } from "@/components/RequerimentoPDF";
import TermoResponsabilidadeSection from "@/components/TermoResponsabilidadeSection";
import { obterOpcoesAmbiente } from "@/utils/ambientes";
import { z } from "zod";

// Atualização da Interface
export type FormErrors = {
    sistema?: string;
    nome?: string;
    cpf?: string;
    cargo?: string;
    lotacao?: string;
    vinculo?: string;
    matricula?: string;
    email?: string;
    motivacao?: string;
    outrosEspecificar?: string;
    tipoPerfil?: string;
    nomeAmbiente?: string;
    descricaoFuncoes?: string;
    dataRequerimento?: string;
    aceitoTermos?: string;
    superiorNome?: string;
    superiorCPF?: string;
    superiorCargo?: string;
};

// Atualização do Schema Zod com validação condicional
const formSchema = z.object({
    sistema: z.array(z.string()).min(1, "Selecione pelo menos um sistema."),
    nome: z.string().min(1, "O nome é obrigatório."),
    cpf: z.string().min(11, "O CPF é obrigatório."),
    cargo: z.string().min(1, "O cargo é obrigatório."),
    funcao: z.string().optional(),
    lotacao: z.string().min(1, "A lotação é obrigatória."),
    vinculo: z.string().min(1, "Selecione um vínculo."),
    matricula: z.string().min(1, "A matrícula é obrigatória."),
    email: z.email("E-mail inválido."),
    motivacao: z.string().min(1, "Selecione uma motivação."), // Exige que o rádio seja marcado
    outrosEspecificar: z.string().optional(),
    tipoPerfil: z.enum(["existe", "naoExiste", ""], {
        message: "Selecione uma opção de perfil de acesso."
    }).refine(val => val !== "", { message: "Selecione uma opção de perfil de acesso." }),
    nomeAmbiente: z.string().optional(),
    descricaoFuncoes: z.string().optional(),
    dataRequerimento: z.string().min(1, "A data do requerimento é obrigatória."),
    aceitoTermos: z.literal(true, {
        message: "Você precisa aceitar os termos de responsabilidade para prosseguir."
    }),
    superiorNome: z.string().min(1, "O nome do superior é obrigatório."),
    superiorCPF: z.string().min(11, "O CPF do superior deve estar completo."),
    superiorCargo: z.string().min(1, "O cargo do superior é obrigatório."),
}).refine(
    (data) => {
        // Se a motivação for "outros", o campo outrosEspecificar NÃO pode estar vazio
        if (data.motivacao === "outros") {
            return data.outrosEspecificar && data.outrosEspecificar.trim() !== "";
        }
        return true; // Se não for "outros", a validação passa automaticamente
    },
    {
        message: "Selecione uma secretaria, já que marcou 'Outros'.",
        path: ["outrosEspecificar"], // Direciona a mensagem de erro para o campo específico
    })
    .refine((data) => { // NOVO REFINE: Valida o Select de Ambiente
        if (data.tipoPerfil === "existe")
            return data.nomeAmbiente && data.nomeAmbiente.trim() !== "";
        return true;
    },
        {
            message: "Selecione o nome do ambiente.", path: ["nomeAmbiente"]
        })
    .refine((data) => { // NOVO REFINE: Valida a Textarea
        if (data.tipoPerfil === "naoExiste")
            return data.descricaoFuncoes && data.descricaoFuncoes.trim() !== "";
        return true;
    },
        {
            message: "Descreva as funções necessárias.", path: ["descricaoFuncoes"]
        });

export default function RequerimentoPage() {
    const [sistemasSelecionados, setSistemasSelecionados] = useState<string[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});

    const [dadosRequerente, setDadosRequerente] = useState({
        nome: "", cpf: "", cargo: "", funcao: "", lotacao: "", vinculo: "", matricula: "", email: "",
    });

    const [dadosMotivacao, setDadosMotivacao] = useState({
        motivacao: "",
        outrosEspecificar: "",
    });

    const [dadosPerfil, setDadosPerfil] = useState<{
        tipoPerfil: "existe" | "naoExiste" | "";
        nomeAmbiente: string;
        descricaoFuncoes: string;
    }>({
        tipoPerfil: "",
        nomeAmbiente: "",
        descricaoFuncoes: ""
    });

    const [dataRequerimento, setDataRequerimento] = useState<string>(() => {
        const hoje = new Date();
        return hoje.toISOString().split('T')[0]; // Ex: "2026-03-04"
    });

    const [aceitoTermos, setAceitoTermos] = useState<boolean>(false);

    const [dadosSuperior, setDadosSuperior] = useState({
        superiorNome: "",
        superiorCPF: "",
        superiorCargo: "",
    });

    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    // Calcula dinamicamente a lista de opções com base no que foi preenchido antes
    const opcoesAmbienteAtualizadas = obterOpcoesAmbiente(
        sistemasSelecionados,
        dadosMotivacao.motivacao,
        dadosMotivacao.outrosEspecificar
    );

    async function generatePdf() {
        if (!pdfRef.current) {
            alert("Erro ao preparar o conteúdo do PDF.");
            return;
        }

        setIsGeneratingPdf(true);

        try {
            // Pequeno delay para garantir que o React renderizou o componente oculto
            await new Promise<void>((resolve) => setTimeout(resolve, 300));

            const pages = pdfRef.current.querySelectorAll<HTMLElement>(".pdf-page");
            if (!pages.length) throw new Error("Nenhuma página do PDF foi encontrada.");

            const pdf = new jsPDF("p", "mm", "a4");

            for (let i = 0; i < pages.length; i++) {
                if (i > 0) pdf.addPage();

                const canvas = await html2canvas(pages[i], {
                    scale: 2, // Boa resolução
                    useCORS: true,
                    logging: false,
                    backgroundColor: "#ffffff",
                    width: pages[i].scrollWidth,
                    height: pages[i].scrollHeight,
                });

                const imgData = canvas.toDataURL("image/jpeg", 0.95);
                pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
            }

            pdf.save(`requerimento_sistemas_${dadosRequerente.cpf.replace(/\D/g, '')}.pdf`);

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Erro ao gerar PDF. Tente novamente.");
        } finally {
            setIsGeneratingPdf(false);
        }
    }

    function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        // Juntamos todos os dados num único objeto
        const formData = {
            sistema: sistemasSelecionados,
            ...dadosRequerente,
            ...dadosMotivacao,
            ...dadosPerfil,
            ...dadosSuperior,
            dataRequerimento,
            aceitoTermos,
        };

        const result = formSchema.safeParse(formData);

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors(formattedErrors as any);

            // 1. Ordem exata em que os campos aparecem na tela
            const ordemDosCampos: (keyof FormErrors)[] = [
                "sistema", 
                "nome", "cpf", "cargo", "lotacao", "vinculo", "matricula", "email",
                "motivacao", "outrosEspecificar",
                "tipoPerfil", "nomeAmbiente", "descricaoFuncoes",
                "dataRequerimento",
                "aceitoTermos",
                "superiorNome", "superiorCPF", "superiorCargo"
            ];

            // 2. Encontra o primeiro campo da lista que possui um erro
            const primeiroCampoComErro = ordemDosCampos.find(campo => 
                formattedErrors[campo as keyof typeof formattedErrors]
            );

            if (primeiroCampoComErro) {
                // 3. Procura o elemento HTML na tela pelo atributo 'name'
                const elemento = document.querySelector(`[name="${primeiroCampoComErro}"]`) as HTMLElement;

                if (elemento) {
                    // Rola a tela até o campo e tenta focar nele
                    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    elemento.focus();
                } else {
                    // Fallback: se o elemento não for encontrado, rola pro topo
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }

            return;
        }

        console.log("Formulário válido", result.data);
        setErrors({});

        generatePdf();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl relative">

            {/* SOBREPOSIÇÃO DE CARREGAMENTO (LOADING OVERLAY) */}
            {isGeneratingPdf && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                    {/* Spinner animado */}
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Gerando PDF...</h2>
                    <p className="text-gray-200">Aguarde um instante, o download iniciará automaticamente.</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 border border-gray-200">
                <div className="text-center mb-8">
                    <h4 className="text-pv-green-600 font-bold text-xl md:text-2xl mb-2">
                        REQUERIMENTO - USO DE SISTEMAS TRIBUTÁRIOS
                    </h4>
                    <p className="text-gray-500 text-sm">
                        Prefeitura Municipal de Porto Velho - Secretaria Municipal de Fazenda (SEMFAZ)
                    </p>
                </div>

                <div className="border-t border-gray-300 my-8" />

                <form onSubmit={handleSubmit}>
                    <SistemaSection
                        value={sistemasSelecionados}
                        onChange={setSistemasSelecionados}
                        error={errors.sistema?.[0]}
                    />

                    <DadosRequerenteSection
                        value={dadosRequerente}
                        onChange={setDadosRequerente}
                        errors={errors}
                    />

                    <MotivacaoSection
                        value={dadosMotivacao}
                        onChange={setDadosMotivacao}
                        errors={errors}
                    />

                    <PerfilAcessoSection
                        value={dadosPerfil}
                        onChange={setDadosPerfil}
                        errors={errors}
                        opcoesAmbiente={opcoesAmbienteAtualizadas}
                    />

                    <DataRequerimentoSection
                        value={dataRequerimento}
                        onChange={setDataRequerimento}
                        // Zod retorna arrays, então passamos o primeiro erro
                        error={errors.dataRequerimento?.[0] || (errors.dataRequerimento as string | undefined)}
                    />

                    <TermoResponsabilidadeSection
                        value={aceitoTermos}
                        onChange={setAceitoTermos}
                        // Zod retorna arrays, pegamos a primeira string
                        error={errors.aceitoTermos?.[0] || (errors.aceitoTermos as string | undefined)}
                    />

                    <SuperiorImediatoSection
                        value={dadosSuperior}
                        onChange={setDadosSuperior}
                        errors={errors}
                    />

                    {/* SEÇÃO DE ASSINATURAS (Apenas Visual para o PDF) */}
                    <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                        <div className="bg-gray-100 px-4 py-2 rounded-t-md border-b border-gray-200">
                            <h5 className="text-sm md:text-base font-semibold !text-gray-800">
                                ASSINATURAS NECESSÁRIAS
                            </h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 md:px-12 mt-4">
                            {/* Linha Requerente */}
                            <div className="text-center mt-10">
                                <div className="border-b border-black mb-2 w-full max-w-xs mx-auto"></div>
                                <p className="text-sm font-semibold text-gray-700">Assinatura do Requerente</p>
                            </div>

                            {/* Linha Superior */}
                            <div className="text-center mt-10">
                                <div className="border-b border-black mb-2 w-full max-w-xs mx-auto"></div>
                                <p className="text-sm font-semibold text-gray-700">Assinatura do Superior Imediato</p>
                            </div>
                        </div>

                        {/* Aviso de Assinatura Digital */}
                        <div className="bg-blue-50 p-3 mx-4 mb-4 mt-2 rounded-md border border-blue-100 text-center">
                            <p className="text-sm text-blue-800 font-medium">
                                <span className="font-bold">⚠️ Aviso:</span> A assinatura poderá ser feita de forma digital (via GOV.BR, SEI, ou outro meio certificado) diretamente no PDF gerado.
                            </p>
                        </div>
                    </div>

                    {/* BOTÃO SUBMIT ATUALIZADO */}
                    <div className="text-center mt-8">
                        <button
                            type="submit"
                            disabled={isGeneratingPdf}
                            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-md shadow-lg transition flex items-center justify-center gap-2 mx-auto w-full md:w-auto 
                                ${isGeneratingPdf ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {isGeneratingPdf ? "Gerando PDF..." : "Gerar PDF"}
                        </button>
                    </div>

                    <RequerimentoPDF
                        ref={pdfRef}
                        sistemas={sistemasSelecionados}
                        requerente={dadosRequerente}
                        motivacao={dadosMotivacao}
                        perfil={dadosPerfil}
                        superior={dadosSuperior}
                        dataRequerimento={dataRequerimento}
                    />
                </form>
            </div>
        </div>
    );
}