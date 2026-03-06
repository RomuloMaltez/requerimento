"use client";

import { FormErrors } from "../app/page";

type DadosRequerente = {
    nome: string;
    cpf: string;
    cargo: string;
    funcao: string;
    lotacao: string;
    vinculo: string;
    matricula: string;
    email: string;
};

type Props = {
    value: DadosRequerente;
    onChange: (value: DadosRequerente) => void;
    errors: FormErrors;
};

export default function DadosRequerenteSection({ value, onChange, errors }: Props) {

    // 1. Função que formata o CPF dinamicamente
    function formatCPF(cpf: string) {
        return cpf
            .replace(/\D/g, '') // Remove tudo o que não é dígito
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o sexto e o sétimo dígitos
            .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um traço entre o nono e o décimo dígitos
            .replace(/(-\d{2})\d+?$/, '$1'); // Impede que o usuário digite mais do que 14 caracteres permitidos
    }

    // 2. Interceptamos o valor antes de enviá-lo para o estado pai
    function handleChange(field: keyof DadosRequerente, fieldValue: string) {
        let finalValue = fieldValue;

        // Se o campo for o CPF, aplicamos a máscara
        if (field === "cpf") {
            finalValue = formatCPF(fieldValue);
        }

        onChange({ ...value, [field]: finalValue });
    }

    return (
        <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gray-100 px-4 py-2 rounded-t-md border border-gray-200">
                <h5 className="text-sm md:text-base font-semibold !text-gray-800">
                    DADOS DO REQUERENTE
                </h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {/* Nome */}
                <div>
                    <label className="block font-semibold mb-1">Nome: <span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="text"
                        name="nome"
                        value={value.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 focus:border-pv-blue-600 transition ${errors.nome ? "border-red-500" : "border-gray-200"}`}
                    />
                    {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
                </div>

                {/* CPF */}
                <div>
                    <label className="block font-semibold mb-1">CPF: <span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="text"
                        name="cpf"
                        value={value.cpf}
                        onChange={(e) => handleChange("cpf", e.target.value)} // Continua igual, a mágica acontece no handleChange!
                        placeholder="000.000.000-00"
                        maxLength={14} // 3. Aumentamos para 14 por causa dos pontos e traço
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 focus:border-pv-blue-600 transition ${errors.cpf ? "border-red-500" : "border-gray-200"}`}
                    />
                    {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf}</p>}
                </div>

                {/* Cargo */}
                <div>
                    <label className="block font-semibold mb-1">Cargo: <span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="text"
                        name="cargo"
                        value={value.cargo}
                        onChange={(e) => handleChange("cargo", e.target.value)}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 focus:border-pv-blue-600 transition ${errors.cargo ? "border-red-500" : "border-gray-200"}`}
                    />
                    {errors.cargo && <p className="text-red-600 text-sm mt-1">{errors.cargo}</p>}
                </div>

                {/* Função */}
                <div>
                    <label className="block font-semibold mb-1">Função:</label>
                    <input
                        type="text"
                        value={value.funcao}
                        onChange={(e) => handleChange("funcao", e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 focus:border-pv-blue-900 transition"
                    />
                </div>

                {/* Lotação */}
                <div className="md:col-span-2">
                    <label className="block font-semibold mb-1">Lotação: <span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="text"
                        name="lotacao"
                        value={value.lotacao}
                        onChange={(e) => handleChange("lotacao", e.target.value)}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 focus:border-pv-blue-600 transition ${errors.lotacao ? "border-red-500" : "border-gray-200"}`}
                    />
                    {errors.lotacao && <p className="text-red-600 text-sm mt-1">{errors.lotacao}</p>}
                </div>

                {/* Vínculo */}
                <div>
                    <label className="block font-semibold mb-1">Vínculo: <span className="text-red-500 ml-1">*</span></label>
                    <select
                        value={value.vinculo}
                        name="vinculo"
                        onChange={(e) => handleChange("vinculo", e.target.value)}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 focus:border-pv-blue-600 transition ${errors.vinculo ? "border-red-500" : "border-gray-200"}`}
                    >
                        <option value="">Selecione um vínculo</option>
                        <option value="Estatutário">Estatutário</option>
                        <option value="Comissionado">Comissionado</option>
                        <option value="Estagiário">Estagiário</option>
                    </select>
                    {errors.vinculo && <p className="text-red-600 text-sm mt-1">{errors.vinculo}</p>}
                </div>

                {/* Matrícula */}
                <div>
                    <label className="block font-semibold mb-1">Matrícula: <span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="text"
                        name="matricula"
                        value={value.matricula}
                        onChange={(e) => handleChange("matricula", e.target.value)}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 focus:border-pv-blue-600 transition ${errors.matricula ? "border-red-500" : "border-gray-200"}`}
                    />
                    {errors.matricula && <p className="text-red-600 text-sm mt-1">{errors.matricula}</p>}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                    <label className="block font-semibold mb-1">E-mail: <span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="email"
                        name="email"
                        value={value.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 focus:border-pv-blue-600 transition ${errors.email ? "border-red-500" : "border-gray-200"}`}
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

            </div>
        </div>
    );
}