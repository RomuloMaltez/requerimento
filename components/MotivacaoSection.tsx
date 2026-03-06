"use client";

import { FormErrors } from "../app/page"; // Ajuste o caminho se necessário

type MotivacaoData = {
    motivacao: string;
    outrosEspecificar: string;
};

type Props = {
    value: MotivacaoData;
    onChange: (value: MotivacaoData) => void;
    errors: FormErrors;
};

export default function MotivacaoSection({ value, onChange, errors }: Props) {

    // Função para lidar com a mudança do Radio Button principal
    function handleMotivacaoChange(novaMotivacao: string) {
        const novosDados = { ...value, motivacao: novaMotivacao };
        
        // Se o usuário escolher algo diferente de "outros", 
        // nós limpamos o campo "outrosEspecificar" para não enviar "lixo" pro banco de dados
        if (novaMotivacao !== "outros") {
            novosDados.outrosEspecificar = "";
        }
        
        onChange(novosDados);
    }

    // Função para lidar com a mudança do Select de Outras Secretarias
    function handleEspecificarChange(novoEspecificar: string) {
        onChange({ ...value, outrosEspecificar: novoEspecificar });
    }

    const hasError = Boolean(errors.motivacao);

    return (
        <div className={`mb-8 border rounded-lg overflow-hidden shadow-lg transition ${hasError ? "border-red-500" : "border-gray-200"}`}>
            
            <div className="bg-gray-100 px-4 py-2 rounded-t-md border border-gray-200">
                <h5 className="text-sm md:text-base font-semibold !text-gray-800">
                    MOTIVAÇÃO – Para uso do sistema <span className="text-red-500 ml-1">*</span>
                </h5>
            </div>

            <div className="p-4 space-y-3">
                {/* Opção 1 */}
                <div className="flex items-start">
                    <input
                        type="radio"
                        id="auditorTesouro"
                        name="motivacao"
                        value="auditorTesouro"
                        checked={value.motivacao === "auditorTesouro"}
                        onChange={(e) => handleMotivacaoChange(e.target.value)}
                        className="mt-1 mr-3"
                    />
                    <label htmlFor="auditorTesouro" className="text-pv-gray-700">
                        Auditor do Tesouro Municipal, em exercício regular das suas atribuições legais;
                    </label>
                </div>

                {/* Opção 2 */}
                <div className="flex items-start">
                    <input
                        type="radio"
                        id="servidorSubsecretaria"
                        name="motivacao"
                        value="servidorSubsecretaria"
                        checked={value.motivacao === "servidorSubsecretaria"}
                        onChange={(e) => handleMotivacaoChange(e.target.value)}
                        className="mt-1 mr-3"
                    />
                    <label htmlFor="servidorSubsecretaria" className="text-pv-gray-700">
                        Servidor lotado na Subsecretaria de Receita Municipal ou na SEMFAZ;
                    </label>
                </div>

                {/* Opção 3 */}
                <div className="flex items-start">
                    <input
                        type="radio"
                        id="procuradorMunicipal"
                        name="motivacao"
                        value="procuradorMunicipal"
                        checked={value.motivacao === "procuradorMunicipal"}
                        onChange={(e) => handleMotivacaoChange(e.target.value)}
                        className="mt-1 mr-3"
                    />
                    <label htmlFor="procuradorMunicipal" className="text-pv-gray-700">
                        Procurador Municipal, em exercício regular das suas atribuições legais;
                    </label>
                </div>

                {/* Opção 4 */}
                <div className="flex items-start">
                    <input
                        type="radio"
                        id="servidorPGM"
                        name="motivacao"
                        value="servidorPGM"
                        checked={value.motivacao === "servidorPGM"}
                        onChange={(e) => handleMotivacaoChange(e.target.value)}
                        className="mt-1 mr-3"
                    />
                    <label htmlFor="servidorPGM" className="text-pv-gray-700">
                        Servidor lotado na Procuradoria Geral do Município – PGM;
                    </label>
                </div>

                {/* Opção 5: OUTROS (Com condicional) */}
                <div className="flex items-start">
                    <input
                        type="radio"
                        id="outros"
                        name="motivacao"
                        value="outros"
                        checked={value.motivacao === "outros"}
                        onChange={(e) => handleMotivacaoChange(e.target.value)}
                        className="mt-1 mr-3"
                    />
                    <label htmlFor="outros" className="text-pv-gray-700">
                        Outros (especificar):
                    </label>
                </div>

                {/* Renderização Condicional: Só aparece se "outros" estiver marcado */}
                {value.motivacao === "outros" && (
                    <div className="ml-8 mt-2 animate-fade-in">
                        <select
                            value={value.outrosEspecificar}
                            onChange={(e) => handleEspecificarChange(e.target.value)}
                            className={`w-full max-w-md p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 focus:border-pv-blue-600 transition ${errors.outrosEspecificar ? "border-red-500" : "border-gray-300"}`}
                        >
                            <option value="">Selecione uma secretaria</option>
                            <option value="Semusb">Semusb - Secretaria Municipal de Serviços Básicos</option>
                            <option value="Sema">Sema - Secretaria Municipal de Meio Ambiente</option>
                            <option value="Semtran">Semtran - Secretaria Municipal de Trânsito</option>
                            <option value="Semur">Semur - Secretaria Municipal de Urbanismo</option>
                            <option value="Sempog">Sempog - Secretaria Municipal de Planejamento</option>
                            <option value="OutrasSecretarias">Outras Secretarias (Retenções)</option>
                        </select>
                        {errors.outrosEspecificar && (
                            <p className="text-red-600 text-sm mt-1">{errors.outrosEspecificar}</p>
                        )}
                    </div>
                )}

                {/* Mensagem de erro geral da Motivação (caso não selecione nenhum radio) */}
                {errors.motivacao && (
                    <p className="text-red-600 text-sm mt-2 font-medium">{errors.motivacao}</p>
                )}
            </div>
        </div>
    );
}