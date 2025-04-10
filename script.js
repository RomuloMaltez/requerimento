document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const form = document.getElementById('requerimento-form');
    const errorContainer = document.getElementById('error-container');
    const errorList = document.getElementById('error-list');
    const dataAtual = document.getElementById('dataAtual');
    
    // Checkboxes e campos condicionais
    const outrosRadio = document.getElementById('outros');
    const outrosContainer = document.getElementById('outrosContainer');
    const perfilExisteCheckbox = document.getElementById('perfilExiste');
    const perfilNaoExisteCheckbox = document.getElementById('perfilNaoExiste');
    const ambienteContainer = document.getElementById('ambienteContainer');
    const descricaoContainer = document.getElementById('descricaoContainer');
    
    // Campos CPF
    const cpfInput = document.getElementById('cpf');
    const superiorCPFInput = document.getElementById('superiorCPF');
    
    // Checkboxes de sistemas e radio buttons de motivações
    const gpiTributarioCheckbox = document.getElementById('gpiTributario');
    const semfazonlineNFSeCheckbox = document.getElementById('semfazonlineNFSe');
    const auditorTesouroRadio = document.getElementById('auditorTesouro');
    const procuradorMunicipalRadio = document.getElementById('procuradorMunicipal');
    const servidorSubsecretariaRadio = document.getElementById('servidorSubsecretaria');
    const servidorPGMRadio = document.getElementById('servidorPGM');
    
    // Selects
    const nomeAmbienteSelect = document.getElementById('nomeAmbiente');
    
    // Configurar data atual
    const hoje = new Date();
    dataAtual.textContent = hoje.toLocaleDateString('pt-BR');
    
    // Listas de opções para os ambientes
    const ambientesGPITributarioSEMFAZ = [
        { valor: "", label: "Selecione um ambiente" },
        { valor: "Alvara/DIAC", label: "Alvara/DIAC" },
        { valor: "Atendimento/DIAC", label: "Atendimento/DIAC" },
        { valor: "Astec/SEMFAZ", label: "Astec/SEMFAZ" },
        { valor: "Apoio/GAB", label: "Apoio/GAB" },
        { valor: "Classifica/DEC", label: "Classifica/DEC" },
        { valor: "Contabilidade (retenções)", label: "Contabilidade (retenções)" },
        { valor: "Comissionado/DCEM", label: "Comissionado/DCEM" },
        { valor: "Comissionado/DCIM", label: "Comissionado/DCIM" },
        { valor: "Comissionado/DEF", label: "Comissionado/DEF" },
        { valor: "Comissionado/DFIT", label: "Comissionado/DFIT" },
        { valor: "Comissionado/DGEO", label: "Comissionado/DGEO" },
        { valor: "Comissionado/DIAR", label: "Comissionado/DIAR" },
        { valor: "Comissionado/DTR", label: "Comissionado/DTR" },
        { valor: "Diretor/DCF", label: "Diretor/DCF" },
        { valor: "Diretor/DEF", label: "Diretor/DEF" },
        { valor: "Diretor/DTR", label: "Diretor/DTR" },
        { valor: "Estagiário/CRF", label: "Estagiário/CRF" },
        { valor: "Estagiário/DCEM", label: "Estagiário/DCEM" },
        { valor: "Estagiário/DCF", label: "Estagiário/DCF" },
        { valor: "Estagiário/DCIM", label: "Estagiário/DCIM" },
        { valor: "Estagiário/DCOB", label: "Estagiário/DCOB" },
        { valor: "Estagiário/DGEO", label: "Estagiário/DGEO" },
        { valor: "Estagiário/DIAR", label: "Estagiário/DIAR" },
        { valor: "Estagiário/DITC", label: "Estagiário/DITC" },
        { valor: "Estatutário/DGEO", label: "Estatutário/DGEO" },
        { valor: "Gapt/SEMFAZ", label: "Gapt/SEMFAZ" },
        { valor: "Gerente/DCEM", label: "Gerente/DCEM" },
        { valor: "Gerente/DCIM", label: "Gerente/DCIM" },
        { valor: "Gerente/DCOB", label: "Gerente/DCOB" },
        { valor: "Gerente/DCON", label: "Gerente/DCON" },
        { valor: "Gerente/DFIT", label: "Gerente/DFIT" },
        { valor: "Gerente/DGEO", label: "Gerente/DGEO" },
        { valor: "Gerente/DIAR", label: "Gerente/DIAR" },
        { valor: "Gerente/DITC", label: "Gerente/DITC" },
        { valor: "Gerente/DTIM", label: "Gerente/DTIM" },
        { valor: "Secretario/CRF", label: "Secretario/CRF" },
        { valor: "Secretario/GAB", label: "Secretario/GAB" },
        { valor: "Técnico/DCEM", label: "Técnico/DCEM" },
        { valor: "Técnico/DCIM", label: "Técnico/DCIM" },
        { valor: "Técnico/DCOB", label: "Técnico/DCOB" },
        { valor: "Técnico/DEF", label: "Técnico/DEF" },
        { valor: "Técnico/DIAR", label: "Técnico/DIAR" },
        { valor: "Técnico/DTIM", label: "Técnico/DTIM" },
        { valor: "Técnico/DTR", label: "Técnico/DTR" }
    ];

    const ambientesGPITributarioPGM = [
        { valor: "", label: "Selecione um ambiente" },
        { valor: "Assessor/SPDA", label: "Assessor/SPDA" },
        { valor: "Atendimento/SPDA", label: "Atendimento/SPDA" },
        { valor: "Chefe/SPDA", label: "Chefe/SPDA" },
        { valor: "Comcep/PGM", label: "Comcep/PGM" },
        { valor: "IRRF/ISS-R/PGM", label: "IRRF/ISS-R/PGM" },
        { valor: "SPF/PGM", label: "SPF/PGM" },
        { valor: "SPFUN/PGM", label: "SPFUN/PGM" },
        { valor: "TJRO/PGM", label: "TJRO/PGM" }
    ];

    const ambientesGPITributarioOutros = [
        { valor: "", label: "Selecione um ambiente" },
        { valor: "Taxa/SEMA", label: "Taxa/SEMA" },
        { valor: "Taxa/SEMUSA", label: "Taxa/SEMUSA" },
        { valor: "Taxa/SEMTRAN", label: "Taxa/SEMTRAN" },
        { valor: "Taxa/SEMUR", label: "Taxa/SEMUR" },
        { valor: "Taxa/DVISA", label: "Taxa/DVISA" },
        { valor: "Taxa/DPU", label: "Taxa/DPU" },
        { valor: "Consulta/SEMUR", label: "Consulta/SEMUR" },
        { valor: "Inclusão/SEMUR", label: "Inclusão/SEMUR" }
    ];

    const ambientesPortalSemfazonline = [
        { valor: "", label: "Selecione um ambiente" },
        { valor: "Retenção ISS", label: "Retenção ISS" },
        { valor: "Contabilidade (outras retenções)", label: "Contabilidade (outras retenções)" }
    ];
    
    // Nova lista para a opção Semur
    const ambientesSemur = [
        { valor: "", label: "Selecione um ambiente" },
        { valor: "Consulta/SEMUR", label: "Consulta/SEMUR" },
        { valor: "Taxa/SEMUR", label: "Taxa/SEMUR" },
        { valor: "Inclusao/SEMUR", label: "Inclusao/SEMUR" }
    ];
    
    // Lista para Outras Secretarias (Retenções)
    const ambientesOutrasSecretarias = [
        { valor: "", label: "Selecione um ambiente" },
        { valor: "Retenção ISS", label: "Retenção ISS" },
        { valor: "Contabilidade (outras retenções)", label: "Contabilidade (outras retenções)" }
    ];
    
    // Novas listas de ambientes baseados na motivação específica
    const ambientesAuditorTesouro = [
        { valor: "", label: "Selecione um ambiente" },
        { valor: "Auditor/DCON", label: "Auditor/DCON" },
        { valor: "Auditor/Julgador/CRF", label: "Auditor/Julgador/CRF" },
        { valor: "Auditor/DITC", label: "Auditor/DITC" },
        { valor: "Auditor/DTIM", label: "Auditor/DTIM" },
        { valor: "Diretor/DEF", label: "Diretor/DEF" },
        { valor: "Diretor/DTR", label: "Diretor/DTR" },
        { valor: "Diretor/DCF", label: "Diretor/DCF" },
        { valor: "Subsecretaria/SUREM", label: "Subsecretaria/SUREM" },
        { valor: "Gerente/DCEM", label: "Gerente/DCEM" },
        { valor: "Gerente/DCIM", label: "Gerente/DCIM" },
        { valor: "Gerente/DCOB", label: "Gerente/DCOB" },
        { valor: "Gerente/DCON", label: "Gerente/DCON" },
        { valor: "Gerente/DFIT", label: "Gerente/DFIT" },
        { valor: "Gerente/DGEO", label: "Gerente/DGEO" },
        { valor: "Gerente/DIAR", label: "Gerente/DIAR" },
        { valor: "Gerente/DITC", label: "Gerente/DITC" },
        { valor: "Gerente/DTIM", label: "Gerente/DTIM" }
    ];
    
    const ambientesProcuradorMunicipal = [
        { valor: "", label: "Selecione um ambiente" },
        { valor: "Chefe/SPDA", label: "Chefe/SPDA" },
        { valor: "Comcep/PGM", label: "Comcep/PGM" },
        { valor: "SPF/PGM", label: "SPF/PGM" },
        { valor: "SPFUN/PGM", label: "SPFUN/PGM" },
        { valor: "TJRO/PGM", label: "TJRO/PGM" }
    ];
    
    // Função para determinar qual lista de ambientes mostrar
    function getOpcoesAmbiente() {
        // Verificar a motivação selecionada para casos especiais
        if (auditorTesouroRadio.checked && perfilExisteCheckbox.checked) {
            return ambientesAuditorTesouro;
        } else if (procuradorMunicipalRadio.checked && perfilExisteCheckbox.checked) {
            return ambientesProcuradorMunicipal;
        }
        
        // Verificar condições para "Outros" com base na secretaria selecionada
        if (outrosRadio.checked && perfilExisteCheckbox.checked) {
            const secretariaSelecionada = document.getElementById('outrosEspecificar').value;
            
            // Verificar qual secretaria foi selecionada
            switch(secretariaSelecionada) {
                case "Semur":
                    return ambientesSemur;
                case "OutrasSecretarias":
                    return ambientesOutrasSecretarias;
                case "Semusb":
                    // Definir automaticamente "Taxa/DPU" sem mostrar dropdown
                    setTimeout(() => {
                        const option = document.createElement('option');
                        option.value = "Taxa/DPU";
                        option.textContent = "Taxa/DPU";
                        nomeAmbienteSelect.innerHTML = '';
                        nomeAmbienteSelect.appendChild(option);
                        nomeAmbienteSelect.value = "Taxa/DPU";
                        nomeAmbienteSelect.disabled = true;
                    }, 0);
                    return [];
                case "Sema":
                    // Definir automaticamente "Taxa/SEMA" sem mostrar dropdown
                    setTimeout(() => {
                        const option = document.createElement('option');
                        option.value = "Taxa/SEMA";
                        option.textContent = "Taxa/SEMA";
                        nomeAmbienteSelect.innerHTML = '';
                        nomeAmbienteSelect.appendChild(option);
                        nomeAmbienteSelect.value = "Taxa/SEMA";
                        nomeAmbienteSelect.disabled = true;
                    }, 0);
                    return [];
                case "Semtran":
                    // Definir automaticamente "Taxa/SEMTRAN" sem mostrar dropdown
                    setTimeout(() => {
                        const option = document.createElement('option');
                        option.value = "Taxa/SEMTRAN";
                        option.textContent = "Taxa/SEMTRAN";
                        nomeAmbienteSelect.innerHTML = '';
                        nomeAmbienteSelect.appendChild(option);
                        nomeAmbienteSelect.value = "Taxa/SEMTRAN";
                        nomeAmbienteSelect.disabled = true;
                    }, 0);
                    return [];
                case "Sempog":
                    // Definir automaticamente "Consulta/SEMPOG" sem mostrar dropdown
                    setTimeout(() => {
                        const option = document.createElement('option');
                        option.value = "Consulta/SEMPOG";
                        option.textContent = "Consulta/SEMPOG";
                        nomeAmbienteSelect.innerHTML = '';
                        nomeAmbienteSelect.appendChild(option);
                        nomeAmbienteSelect.value = "Consulta/SEMPOG";
                        nomeAmbienteSelect.disabled = true;
                    }, 0);
                    return [];
                default:
                    break;
            }
        }
        
        // Sistema GPI Tributário
        if (gpiTributarioCheckbox.checked) {
            // Servidor SEMFAZ
            if (servidorSubsecretariaRadio.checked) {
                return ambientesGPITributarioSEMFAZ;
            }
            // Servidor PGM
            else if (servidorPGMRadio.checked) {
                return ambientesGPITributarioPGM;
            }
            // Outros
            else if (outrosRadio.checked) {
                return ambientesGPITributarioOutros;
            }
        }
        // Portal Semfazonline
        else if (semfazonlineNFSeCheckbox.checked) {
            if (servidorSubsecretariaRadio.checked || 
                servidorPGMRadio.checked || 
                outrosRadio.checked) {
                return ambientesPortalSemfazonline;
            }
        }
        
        // Caso padrão, retorna lista vazia
        return [{ valor: "", label: "Selecione primeiro o sistema e a motivação" }];
    }
    
    // Função para atualizar o dropdown de ambientes
    function atualizarOpcoesAmbiente() {
        const opcoes = getOpcoesAmbiente();
        nomeAmbienteSelect.innerHTML = '';
        
        opcoes.forEach(opcao => {
            const option = document.createElement('option');
            option.value = opcao.valor;
            option.textContent = opcao.label;
            nomeAmbienteSelect.appendChild(option);
        });
    }
    
    // Função para formatar CPF
    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length <= 11) {
            cpf = cpf
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        }
        return cpf;
    }
    
    // Função para mostrar erros
    function exibirErros(erros) {
        errorList.innerHTML = '';
        
        Object.values(erros).forEach(erro => {
            const li = document.createElement('li');
            li.textContent = erro;
            errorList.appendChild(li);
        });
        
        errorContainer.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
    
    // Função para resetar erros
    function resetarErros() {
        errorContainer.classList.add('hidden');
        errorList.innerHTML = '';
        
        // Remover classes de erro dos campos
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
    }
    
    // Função para validar o formulário
    function validarFormulario() {
        const erros = {};
        
        // Validar sistemas
        if (!gpiTributarioCheckbox.checked && !semfazonlineNFSeCheckbox.checked) {
            erros.sistemas = "Selecione pelo menos um sistema";
        }
        
        // Validar dados do requerente
        const nome = document.getElementById('nome').value.trim();
        if (!nome) {
            erros.nome = "Nome é obrigatório";
            document.getElementById('nome').classList.add('error');
        }
        
        const cpf = cpfInput.value.trim();
        if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
            erros.cpf = "CPF válido é obrigatório";
            cpfInput.classList.add('error');
        }
        
        const cargo = document.getElementById('cargo').value.trim();
        if (!cargo) {
            erros.cargo = "Cargo é obrigatório";
            document.getElementById('cargo').classList.add('error');
        }
        
        const lotacao = document.getElementById('lotacao').value.trim();
        if (!lotacao) {
            erros.lotacao = "Lotação é obrigatória";
            document.getElementById('lotacao').classList.add('error');
        }
        
        const vinculo = document.getElementById('vinculo').value;
        if (!vinculo) {
            erros.vinculo = "Vínculo é obrigatório";
            document.getElementById('vinculo').classList.add('error');
        }
        
        const matricula = document.getElementById('matricula').value.trim();
        if (!matricula) {
            erros.matricula = "Matrícula é obrigatória";
            document.getElementById('matricula').classList.add('error');
        }
        
        const email = document.getElementById('email').value.trim();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            erros.email = "Email válido é obrigatório";
            document.getElementById('email').classList.add('error');
        }
        
        // Validar motivação
        const temMotivacao = 
            document.getElementById('auditorTesouro').checked || 
            servidorSubsecretariaRadio.checked || 
            document.getElementById('procuradorMunicipal').checked || 
            servidorPGMRadio.checked || 
            outrosRadio.checked;
                        
        if (!temMotivacao) {
            erros.motivacao = "Selecione uma motivação";
        }
        
        if (outrosRadio.checked) {
            const outrosEspecificar = document.getElementById('outrosEspecificar').value;
            if (!outrosEspecificar) {
                erros.outrosEspecificar = "Selecione uma secretaria";
                document.getElementById('outrosEspecificar').classList.add('error');
            }
        }
        
        // Validar perfil de acesso
        if (!perfilExisteCheckbox.checked && !perfilNaoExisteCheckbox.checked) {
            erros.perfilAcesso = "Selecione uma opção de perfil de acesso";
        }
        
        if (perfilExisteCheckbox.checked) {
            const nomeAmbiente = nomeAmbienteSelect.value;
            if (!nomeAmbiente) {
                erros.nomeAmbiente = "Nome do ambiente é obrigatório";
                nomeAmbienteSelect.classList.add('error');
            }
        }
        
        if (perfilNaoExisteCheckbox.checked) {
            const descricaoFuncoes = document.getElementById('descricaoFuncoes').value.trim();
            if (!descricaoFuncoes) {
                erros.descricaoFuncoes = "Descrição das funções é obrigatória";
                document.getElementById('descricaoFuncoes').classList.add('error');
            }
        }
        
        // Validar data
        const dia = document.getElementById('dia').value.trim();
        const mes = document.getElementById('mes').value.trim();
        const ano = document.getElementById('ano').value.trim();
        
        if (!dia || !mes || !ano) {
            erros.data = "Data completa é obrigatória";
            if (!dia) document.getElementById('dia').classList.add('error');
            if (!mes) document.getElementById('mes').classList.add('error');
            if (!ano) document.getElementById('ano').classList.add('error');
        }
        
        // Validar termo de responsabilidade
        if (!document.getElementById('aceitoTermos').checked) {
            erros.termo = "Aceite do termo é obrigatório";
        }
        
        // Validar dados do superior
        const superiorNome = document.getElementById('superiorNome').value.trim();
        if (!superiorNome) {
            erros.superiorNome = "Nome do superior é obrigatório";
            document.getElementById('superiorNome').classList.add('error');
        }
        
        const superiorCPF = superiorCPFInput.value.trim();
        if (!superiorCPF || superiorCPF.replace(/\D/g, '').length !== 11) {
            erros.superiorCPF = "CPF válido do superior é obrigatório";
            superiorCPFInput.classList.add('error');
        }
        
        const superiorCargo = document.getElementById('superiorCargo').value.trim();
        if (!superiorCargo) {
            erros.superiorCargo = "Cargo do superior é obrigatório";
            document.getElementById('superiorCargo').classList.add('error');
        }
        
        return erros;
    }
    
    // Event Listeners
    
    // Mostrar/esconder campos condicionais para o radio "outros"
    outrosRadio.addEventListener('change', function() {
        if (this.checked) {
            outrosContainer.classList.remove('hidden');
        } else {
            outrosContainer.classList.add('hidden');
        }
    });
    
    // Event listener para todos os radio buttons de motivação
    document.querySelectorAll('input[name="motivacao"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Esconder o container de "outros" por padrão
            outrosContainer.classList.add('hidden');
            
            // Se "outros" for selecionado, mostrar o container
            if (outrosRadio.checked) {
                outrosContainer.classList.remove('hidden');
            }
            
            // Atualizar opções de ambiente se o perfil existente estiver selecionado
            if (perfilExisteCheckbox.checked) {
                atualizarOpcoesAmbiente();
            }
        });
    });
    
    perfilExisteCheckbox.addEventListener('change', function() {
        if (this.checked) {
            ambienteContainer.classList.remove('hidden');
            if (perfilNaoExisteCheckbox.checked) {
                perfilNaoExisteCheckbox.checked = false;
                descricaoContainer.classList.add('hidden');
            }
            atualizarOpcoesAmbiente();
        } else {
            ambienteContainer.classList.add('hidden');
        }
    });
    
    perfilNaoExisteCheckbox.addEventListener('change', function() {
        if (this.checked) {
            descricaoContainer.classList.remove('hidden');
            if (perfilExisteCheckbox.checked) {
                perfilExisteCheckbox.checked = false;
                ambienteContainer.classList.add('hidden');
            }
        } else {
            descricaoContainer.classList.add('hidden');
        }
    });
    
    // Formatar CPF
    cpfInput.addEventListener('input', function() {
        this.value = formatarCPF(this.value);
    });
    
    superiorCPFInput.addEventListener('input', function() {
        this.value = formatarCPF(this.value);
    });
    
    // Atualizar dropdown de ambientes quando sistema ou motivação mudar
    [gpiTributarioCheckbox, semfazonlineNFSeCheckbox].forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (perfilExisteCheckbox.checked) {
                // Habilitar o select caso tenha sido desabilitado antes
                nomeAmbienteSelect.disabled = false;
                atualizarOpcoesAmbiente();
            }
        });
    });
    
    // Adicionar evento para o dropdown de outros especificar
    document.getElementById('outrosEspecificar').addEventListener('change', function() {
        if (perfilExisteCheckbox.checked) {
            // Habilitar o select caso tenha sido desabilitado antes
            nomeAmbienteSelect.disabled = false;
            atualizarOpcoesAmbiente();
        }
    });
    
    // Submit do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        resetarErros();
        
        const erros = validarFormulario();
        
        if (Object.keys(erros).length > 0) {
            exibirErros(erros);
            return;
        }
        
        // Preparar para impressão
        window.print();
    });
});