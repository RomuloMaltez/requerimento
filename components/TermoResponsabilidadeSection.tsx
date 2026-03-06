"use client";

type Props = {
    value: boolean; // O estado agora é um simples booleano (true/false)
    onChange: (value: boolean) => void;
    error?: string; // Mensagem de erro caso ele tente enviar sem marcar
};

export default function TermoResponsabilidadeSection({ value, onChange, error }: Props) {
    const hasError = Boolean(error);

    return (
        <div className={`mb-8 border rounded-lg overflow-hidden bg-pv-gray-100 shadow-lg transition ${hasError ? "border-red-500" : "border-gray-200"}`}>
            
            <div className="bg-gray-200 px-4 py-2 border-b border-gray-300">
                <h5 className="text-sm md:text-base font-semibold !text-gray-800">
                    TERMO DE RESPONSABILIDADE <span className="text-red-500 ml-1">*</span>
                </h5>
            </div>

            <div className="p-4">
                <p className="font-semibold mb-3 text-pv-gray-800">
                    Declaro estar ciente de que:
                </p>
                
                <ol className="list-decimal ml-5 space-y-2 mb-6 text-sm text-pv-gray-700">
                    <li>As informações armazenadas nos sistemas tributários da Secretaria Municipal de Fazenda de Porto Velho são sigilosas, conforme legislação vigente.</li>
                    <li>É vedado o compartilhamento das credenciais de acesso (login e senha) com terceiros, sob pena de responsabilização administrativa, civil e criminal.</li>
                    <li>O acesso aos sistemas tributários é monitorado e deve ser utilizado exclusivamente para fins profissionais legítimos.</li>
                    <li>Ao utilizar os sistemas, devo respeitar o princípio do sigilo fiscal, conforme Art. 198 do Código Tributário Nacional.</li>
                    <li>A senha é pessoal e intransferível, sendo de minha responsabilidade qualquer uso indevido.</li>
                    <li>Devo comunicar imediatamente à SEMFAZ qualquer suspeita de violação de segurança ou acesso indevido.</li>
                    <li>
                        <a 
                            href="https://semfaz.portovelho.ro.gov.br/uploads/arquivos/2019/08/31787/1742560714anexo-ii-modelo-de-termo-de-responsabilidade.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-pv-blue-700 underline font-medium hover:text-pv-blue-900 transition"
                        >
                            Ler o Termo de Responsabilidade completo
                        </a>.
                    </li>
                </ol>

                <div className="flex items-start mt-4 bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                    <input
                        type="checkbox"
                        name="aceitoTermos"
                        id="aceitoTermos"
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        className="mt-1 mr-3 h-4 w-4 text-pv-blue-900 focus:ring-pv-blue-900 border-gray-300 rounded cursor-pointer"
                    />
                    <div className="flex flex-col">
                        <label htmlFor="aceitoTermos" className="font-bold text-pv-blue-900 cursor-pointer text-sm md:text-base">
                            Declaro que li e aceito o termo de responsabilidade de uso de sistema tributário da IN 002/2024/GAB/SEMFAZ
                        </label>
                        
                        {/* Exibição do erro logo abaixo do checkbox */}
                        {hasError && (
                            <p className="text-red-600 text-sm mt-2 font-medium animate-pulse">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}   