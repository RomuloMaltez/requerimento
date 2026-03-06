"use client";

import { FormErrors } from "../app/page"; // Ajuste o caminho conforme sua estrutura

type Props = {
    value: string; // O HTML5 salva datas no formato "YYYY-MM-DD"
    onChange: (value: string) => void;
    error?: string; // Recebe o erro especificamente da data
};

export default function DataRequerimentoSection({ value, onChange, error }: Props) {
    const hasError = Boolean(error);

    return (
        <div className={`mb-8 border rounded-lg overflow-hidden shadow-lg transition ${hasError ? "border-red-500" : "border-gray-200"}`}>
            
            <div className="bg-gray-100 px-4 py-2 rounded-t-md border border-gray-200">
                <h5 className="text-sm md:text-base font-semibold !text-gray-800">
                    DATA DO REQUERIMENTO
                </h5>
            </div>

            <div className="p-4">
                <div className="w-full md:w-1/3">
                    <label htmlFor="dataRequerimento" className="block font-semibold mb-1">
                        Selecione a data: <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="date"
                        name="dataRequerimento"
                        id="dataRequerimento"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 focus:border-pv-blue-600 transition cursor-pointer ${hasError ? "border-red-500" : "border-gray-300"}`}
                    />
                    {hasError && (
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    )}
                </div>
                
                <p className="text-sm text-pv-gray-500 italic mt-2">
                    Clique no ícone de calendário para selecionar a data de hoje ou preencha manualmente.
                </p>
            </div>
        </div>
    );
}