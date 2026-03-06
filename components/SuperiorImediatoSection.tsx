"use client";

import { FormErrors } from "../app/page"; // Ajuste o caminho se necessário

type DadosSuperior = {
    superiorNome: string;
    superiorCPF: string;
    superiorCargo: string;
};

type Props = {
    value: DadosSuperior;
    onChange: (value: DadosSuperior) => void;
    errors: FormErrors;
};

export default function SuperiorImediatoSection({ value, onChange, errors }: Props) {

    // Função de máscara do CPF (a mesma que usamos no requerente)
    function formatCPF(cpf: string) {
        return cpf
            .replace(/\D/g, '') 
            .replace(/(\d{3})(\d)/, '$1.$2') 
            .replace(/(\d{3})(\d)/, '$1.$2') 
            .replace(/(\d{3})(\d{1,2})/, '$1-$2') 
            .replace(/(-\d{2})\d+?$/, '$1'); 
    }

    function handleChange(field: keyof DadosSuperior, fieldValue: string) {
        let finalValue = fieldValue;

        // Se o campo for o CPF, aplicamos a máscara
        if (field === "superiorCPF") {
            finalValue = formatCPF(fieldValue);
        }

        onChange({ ...value, [field]: finalValue });
    }

    // Helper para as classes dos inputs
    const inputClasses = (hasError: boolean | undefined) => 
        `w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 focus:border-pv-blue-600 transition ${hasError ? "border-red-500" : "border-gray-200"}`;

    return (
        <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden shadow-lg">
            
            <div className="bg-gray-100 px-4 py-2 rounded-t-md border border-gray-200">
                <h5 className="text-sm md:text-base font-semibold !text-gray-800">
                    DADOS DO SUPERIOR IMEDIATO
                </h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                
                {/* Nome do Superior */}
                <div>
                    <label className="block font-semibold mb-1">Nome: <span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="text"
                        name="superiorNome"
                        value={value.superiorNome}
                        onChange={(e) => handleChange("superiorNome", e.target.value)}
                        className={inputClasses(!!errors.superiorNome)}
                    />
                    {errors.superiorNome && (
                        <p className="text-red-600 text-sm mt-1">{errors.superiorNome}</p>
                    )}
                </div>

                {/* CPF do Superior */}
                <div>
                    <label className="block font-semibold mb-1">CPF: <span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="text"
                        name="superiorCPF"
                        value={value.superiorCPF}
                        onChange={(e) => handleChange("superiorCPF", e.target.value)}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className={inputClasses(!!errors.superiorCPF)}
                    />
                    {errors.superiorCPF && (
                        <p className="text-red-600 text-sm mt-1">{errors.superiorCPF}</p>
                    )}
                </div>

                {/* Cargo do Superior */}
                <div>
                    <label className="block font-semibold mb-1">Cargo: <span className="text-red-500 ml-1">*</span></label>
                    <input
                        type="text"
                        name="superiorCargo"
                        value={value.superiorCargo}
                        onChange={(e) => handleChange("superiorCargo", e.target.value)}
                        className={inputClasses(!!errors.superiorCargo)}
                    />
                    {errors.superiorCargo && (
                        <p className="text-red-600 text-sm mt-1">{errors.superiorCargo}</p>
                    )}
                </div>

            </div>
        </div>
    );
}