"use client";

import { FormErrors } from "../app/page";

type PerfilAcessoData = {
    tipoPerfil: "existe" | "naoExiste" | ""; // Usamos uma única variável para controlar qual opção está ativa
    nomeAmbiente: string;
    descricaoFuncoes: string;
};

type Props = {
    value: PerfilAcessoData;
    onChange: (value: PerfilAcessoData) => void;
    errors: FormErrors;
    opcoesAmbiente: { valor: string; label: string }[]; // As opções dinâmicas vêm do page.tsx
};

export default function PerfilAcessoSection({ value, onChange, errors, opcoesAmbiente }: Props) {

    // Função para alterar qual checkbox está ativo
    function handleTogglePerfil(tipo: "existe" | "naoExiste") {
        if (value.tipoPerfil === tipo) {
            // Se clicar no que já está marcado, desmarca
            onChange({ ...value, tipoPerfil: "" });
        } else {
            // Se clicar no outro, marca ele e limpa os campos para evitar envio de dados ocultos
            onChange({ 
                ...value, 
                tipoPerfil: tipo,
                nomeAmbiente: tipo === "existe" ? value.nomeAmbiente : "",
                descricaoFuncoes: tipo === "naoExiste" ? value.descricaoFuncoes : ""
            });
        }
    }

    const hasError = Boolean(errors.tipoPerfil);

    return (
        <div className={`mb-8 border rounded-lg overflow-hidden shadow-lg transition ${hasError ? "border-red-500" : "border-gray-200"}`}>
            <div className="bg-gray-100 px-4 py-2 rounded-t-md border border-gray-200">
                <h5 className="text-sm md:text-base font-semibold !text-gray-800">
                    PERFIL DE ACESSO <span className="text-red-500 ml-1">*</span>
                </h5>
            </div>

            <div className="p-4 space-y-4">
                
                {/* Opção: Ambiente Existe */}
                <div>
                    <div className="flex items-start mb-2">
                        {/* Mantive o type checkbox para manter seu design original, 
                            mas o comportamento é de rádio controlado pelo React */}
                        <input
                            type="checkbox"
                            id="perfilExiste"
                            name="tipoPerfil"
                            checked={value.tipoPerfil === "existe"}
                            onChange={() => handleTogglePerfil("existe")}
                            className="mt-1 mr-3"
                        />
                        <label htmlFor="perfilExiste" className="text-pv-gray-700">
                            Perfil de Acesso já existe. Especifique o nome do ambiente:
                        </label>
                    </div>

                    {/* Renderização Condicional do Select */}
                    {value.tipoPerfil === "existe" && (
                        <div className="ml-8 animate-fade-in">
                            <select
                                value={value.nomeAmbiente}
                                name="tipoPerfil"
                                onChange={(e) => onChange({ ...value, nomeAmbiente: e.target.value })}
                                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 transition ${errors.nomeAmbiente ? "border-red-500" : "border-gray-300"}`}
                            >
                                {opcoesAmbiente.map((opcao, index) => (
                                    <option key={index} value={opcao.valor}>
                                        {opcao.label}
                                    </option>
                                ))}
                            </select>
                            {errors.nomeAmbiente && <p className="text-red-600 text-sm mt-1">{errors.nomeAmbiente}</p>}
                        </div>
                    )}
                </div>

                {/* Opção: Ambiente NÃO Existe */}
                <div>
                    <div className="flex items-start mb-2">
                        <input
                            type="checkbox"
                            id="perfilNaoExiste"
                            name="tipoPerfil"
                            checked={value.tipoPerfil === "naoExiste"}
                            onChange={() => handleTogglePerfil("naoExiste")}
                            className="mt-1 mr-3"
                        />
                        <label htmlFor="perfilNaoExiste" className="text-pv-gray-700">
                            Perfil de Acesso não existe. Descreva funções do trabalho e quais módulos e dados necessita acessar:
                        </label>
                    </div>

                    {/* Renderização Condicional da Textarea */}
                    {value.tipoPerfil === "naoExiste" && (
                        <div className="ml-8 animate-fade-in">
                            <textarea
                                value={value.descricaoFuncoes}
                                name="descricaoFuncoes"
                                onChange={(e) => onChange({ ...value, descricaoFuncoes: e.target.value })}
                                rows={4}
                                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 transition ${errors.descricaoFuncoes ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.descricaoFuncoes && <p className="text-red-600 text-sm mt-1">{errors.descricaoFuncoes}</p>}
                        </div>
                    )}
                </div>

                {/* Mensagem de erro geral do Grupo Perfil */}
                {errors.tipoPerfil && (
                    <p className="text-red-600 text-sm mt-2 font-medium">{errors.tipoPerfil}</p>
                )}
            </div>
        </div>
    );
}