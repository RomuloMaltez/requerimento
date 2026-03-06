"use client";

type Props = {
    value: string[];
    onChange: (value: string[]) => void;
    error?: string;
};

export default function SistemaSection({ value, onChange, error }: Props) {

    function toggleSistema(sistema: string) {
        if (value.includes(sistema)) {
            onChange(value.filter(s => s !== sistema));
        } else {
            onChange([...value, sistema]);
        }
    }

    const hasError = Boolean(error);

    return (
        <div
            className={`mb-8 border rounded-lg overflow-hidden shadow-lg 
      ${hasError ? "group-error border-red-400" : "border-gray-200"}`}
        >
            <div className="bg-gray-100 px-4 py-2 rounded-t-md border border-gray-200">
                <h5 className="text-sm md:text-base font-semibold !text-gray-800">
                    ESCOLHA O(S) SISTEMA(S) <span className="text-red-500 ml-1">*</span>
                </h5>
            </div>

            <div className="p-4">

                <div className="flex items-start mb-3">
                    <input
                        type="checkbox"
                        name="sistema"
                        id="gpiTributario"
                        checked={value.includes("gpiTributario")}
                        onChange={() => toggleSistema("gpiTributario")}
                        className="mt-1 mr-3"
                    />
                    <label htmlFor="gpiTributario" className="text-pv-gray-700">
                        1. Sistema de Gestão Integrada – GPI Tributário
                    </label>
                </div>

                <div className="flex items-start mb-3">
                    <input
                        type="checkbox"
                        name="sistema"
                        id="semfazonlineNFSe"
                        checked={value.includes("semfazonlineNFSe")}
                        onChange={() => toggleSistema("semfazonlineNFSe")}
                        className="mt-1 mr-3"
                    />
                    <label htmlFor="semfazonlineNFSe" className="text-pv-gray-700">
                        2. Portal Semfazonline NFS-e Retenção do ISSQN
                    </label>
                </div>

                {hasError && (
                    <p className="text-red-600 text-sm mt-2 font-medium">
                        {error}
                    </p>
                )}

                <p className="text-sm text-pv-gray-500 italic mt-2">
                    Marcar o sistema solicitado.
                </p>

            </div>
        </div>
    );
}