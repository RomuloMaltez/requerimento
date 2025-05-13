document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const form = document.getElementById('requerimento-form');
    const formContainer = document.getElementById('form-container');
    const errorContainer = document.getElementById('error-container');
    const errorList = document.getElementById('error-list');
    const dataAtual = document.getElementById('dataAtual');
    const btnImprimir = document.getElementById('btnImprimir');
    const logoImage = document.querySelector('.brasao-img');

    // --- Outras declarações de variáveis e listas de ambientes ---
    const outrosRadio = document.getElementById('outros');
    const outrosContainer = document.getElementById('outrosContainer');
    const outrosEspecificarSelect = document.getElementById('outrosEspecificar');
    const perfilExisteCheckbox = document.getElementById('perfilExiste');
    const perfilNaoExisteCheckbox = document.getElementById('perfilNaoExiste');
    const ambienteContainer = document.getElementById('ambienteContainer');
    const descricaoContainer = document.getElementById('descricaoContainer');
    const cpfInput = document.getElementById('cpf');
    const superiorCPFInput = document.getElementById('superiorCPF');
    const gpiTributarioCheckbox = document.getElementById('gpiTributario');
    const semfazonlineNFSeCheckbox = document.getElementById('semfazonlineNFSe');
    const auditorTesouroRadio = document.getElementById('auditorTesouro');
    const procuradorMunicipalRadio = document.getElementById('procuradorMunicipal');
    const servidorSubsecretariaRadio = document.getElementById('servidorSubsecretaria');
    const servidorPGMRadio = document.getElementById('servidorPGM');
    const nomeAmbienteSelect = document.getElementById('nomeAmbiente');
    const hoje = new Date();
    dataAtual.textContent = hoje.toLocaleDateString('pt-BR');
    
    // Listas de ambientes
    const ambientesGPITributarioSEMFAZ = [ { valor: "", label: "Selecione um ambiente" }, { valor: "Alvara/DIAC", label: "Alvara/DIAC" }, { valor: "Atendimento/DIAC", label: "Atendimento/DIAC" }, { valor: "Astec/SEMFAZ", label: "Astec/SEMFAZ" }, { valor: "Apoio/GAB", label: "Apoio/GAB" }, { valor: "Classifica/DEC", label: "Classifica/DEC" }, { valor: "Contabilidade (retenções)", label: "Contabilidade (retenções)" }, { valor: "Comissionado/DCEM", label: "Comissionado/DCEM" }, { valor: "Comissionado/DCIM", label: "Comissionado/DCIM" }, { valor: "Comissionado/DEF", label: "Comissionado/DEF" }, { valor: "Comissionado/DFIT", label: "Comissionado/DFIT" }, { valor: "Comissionado/DGEO", label: "Comissionado/DGEO" }, { valor: "Comissionado/DIAR", label: "Comissionado/DIAR" }, { valor: "Comissionado/DTR", label: "Comissionado/DTR" }, { valor: "Diretor/DCF", label: "Diretor/DCF" }, { valor: "Diretor/DEF", label: "Diretor/DEF" }, { valor: "Diretor/DTR", label: "Diretor/DTR" }, { valor: "Estagiário/CRF", label: "Estagiário/CRF" }, { valor: "Estagiário/DCEM", label: "Estagiário/DCEM" }, { valor: "Estagiário/DCF", label: "Estagiário/DCF" }, { valor: "Estagiário/DCIM", label: "Estagiário/DCIM" }, { valor: "Estagiário/DCOB", label: "Estagiário/DCOB" }, { valor: "Estagiário/DGEO", label: "Estagiário/DGEO" }, { valor: "Estagiário/DIAR", label: "Estagiário/DIAR" }, { valor: "Estagiário/DITC", label: "Estagiário/DITC" }, { valor: "Estatutário/DGEO", label: "Estatutário/DGEO" }, { valor: "Gapt/SEMFAZ", label: "Gapt/SEMFAZ" }, { valor: "Gerente/DCEM", label: "Gerente/DCEM" }, { valor: "Gerente/DCIM", label: "Gerente/DCIM" }, { valor: "Gerente/DCOB", label: "Gerente/DCOB" }, { valor: "Gerente/DCON", label: "Gerente/DCON" }, { valor: "Gerente/DFIT", label: "Gerente/DFIT" }, { valor: "Gerente/DGEO", label: "Gerente/DGEO" }, { valor: "Gerente/DIAR", label: "Gerente/DIAR" }, { valor: "Gerente/DITC", label: "Gerente/DITC" }, { valor: "Gerente/DTIM", label: "Gerente/DTIM" }, { valor: "Secretario/CRF", label: "Secretario/CRF" }, { valor: "Secretario/GAB", label: "Secretario/GAB" }, { valor: "Técnico/DCEM", label: "Técnico/DCEM" }, { valor: "Técnico/DCIM", label: "Técnico/DCIM" }, { valor: "Técnico/DCOB", label: "Técnico/DCOB" }, { valor: "Técnico/DEF", label: "Técnico/DEF" }, { valor: "Técnico/DIAR", label: "Técnico/DIAR" }, { valor: "Técnico/DTIM", label: "Técnico/DTIM" }, { valor: "Técnico/DTR", label: "Técnico/DTR" } ];
    const ambientesGPITributarioPGM = [ { valor: "", label: "Selecione um ambiente" }, { valor: "Assessor/SPDA", label: "Assessor/SPDA" }, { valor: "Atendimento/SPDA", label: "Atendimento/SPDA" }, { valor: "Chefe/SPDA", label: "Chefe/SPDA" }, { valor: "Comcep/PGM", label: "Comcep/PGM" }, { valor: "IRRF/ISS-R/PGM", label: "IRRF/ISS-R/PGM" }, { valor: "SPF/PGM", label: "SPF/PGM" }, { valor: "SPFUN/PGM", label: "SPFUN/PGM" }, { valor: "TJRO/PGM", label: "TJRO/PGM" } ];
    const ambientesPortalSemfazonline = [ { valor: "", label: "Selecione um ambiente" }, { valor: "Retenção ISS", label: "Retenção ISS" }, { valor: "Contabilidade (outras retenções)", label: "Contabilidade (outras retenções)" } ];
    const ambientesSemubs = [ { valor: "", label: "Selecione um ambiente" }, { valor: "Taxa/DPU", label: "Taxa/DPU" }, { valor: "Retenção ISS", label: "Retenção ISS" }, { valor: "Contabilidade (outras retenções)", label: "Contabilidade (outras retenções)" }, { valor: "Ambos (Retenções ISS e Demais)", label: "Ambos (Retenções ISS e Demais)" } ];
    const ambientesSema = [ { valor: "", label: "Selecione um ambiente" }, { valor: "Taxa/SEMA", label: "Taxa/SEMA" }, { valor: "Retenção ISS", label: "Retenção ISS" }, { valor: "Contabilidade (outras retenções)", label: "Contabilidade (outras retenções)" }, { valor: "Ambos (Retenções ISS e Demais)", label: "Ambos (Retenções ISS e Demais)" } ];
    const ambientesSemtran = [ { valor: "", label: "Selecione um ambiente" }, { valor: "Taxa/SEMTRAN", label: "Taxa/SEMTRAN" }, { valor: "Retenção ISS", label: "Retenção ISS" }, { valor: "Contabilidade (outras retenções)", label: "Contabilidade (outras retenções)" }, { valor: "Ambos (Retenções ISS e Demais)", label: "Ambos (Retenções ISS e Demais)" } ];
    const ambientesSemur = [ { valor: "", label: "Selecione um ambiente" }, { valor: "Consulta/SEMUR", label: "Consulta/SEMUR" }, { valor: "Taxa/SEMUR", label: "Taxa/SEMUR" }, { valor: "Inclusao/SEMUR", label: "Inclusão/SEMUR" }, { valor: "Retenção ISS", label: "Retenção ISS" }, { valor: "Contabilidade (outras retenções)", label: "Contabilidade (outras retenções)" }, { valor: "Ambos (Retenções ISS e Demais)", label: "Ambos (Retenções ISS e Demais)" } ];
    const ambientesSempog = [ { valor: "", label: "Selecione um ambiente" }, { valor: "Consulta/SEMPOG", label: "Consulta/SEMPOG" }, { valor: "Retenção ISS", label: "Retenção ISS" }, { valor: "Contabilidade (outras retenções)", label: "Contabilidade (outras retenções)" }, { valor: "Ambos (Retenções ISS e Demais)", label: "Ambos (Retenções ISS e Demais)" } ];
    const ambientesOutrasSecretariasRetencoes = [ { valor: "", label: "Selecione um ambiente" }, { valor: "Retenção ISS", label: "Retenção ISS" }, { valor: "Contabilidade (outras retenções)", label: "Contabilidade (outras retenções)" }, { valor: "Ambos (Retenções ISS e Demais)", label: "Ambos (Retenções ISS e Demais)" } ];
    const ambientesAuditorTesouro = [ { valor: "", label: "Selecione um ambiente" }, { valor: "Auditor/DCON", label: "Auditor/DCON" }, { valor: "Auditor/Julgador/CRF", label: "Auditor/Julgador/CRF" }, { valor: "Auditor/DITC", label: "Auditor/DITC" }, { valor: "Auditor/DTIM", label: "Auditor/DTIM" }, { valor: "Diretor/DEF", label: "Diretor/DEF" }, { valor: "Diretor/DTR", label: "Diretor/DTR" }, { valor: "Diretor/DCF", label: "Diretor/DCF" }, { valor: "Subsecretaria/SUREM", label: "Subsecretaria/SUREM" }, { valor: "Gerente/DCEM", label: "Gerente/DCEM" }, { valor: "Gerente/DCIM", label: "Gerente/DCIM" }, { valor: "Gerente/DCOB", label: "Gerente/DCOB" }, { valor: "Gerente/DCON", label: "Gerente/DCON" }, { valor: "Gerente/DFIT", label: "Gerente/DFIT" }, { valor: "Gerente/DGEO", label: "Gerente/DGEO" }, { valor: "Gerente/DIAR", label: "Gerente/DIAR" }, { valor: "Gerente/DITC", label: "Gerente/DITC" }, { valor: "Gerente/DTIM", label: "Gerente/DTIM" } ];
    const ambientesProcuradorMunicipal = [ { valor: "", label: "Selecione um ambiente" }, { valor: "Chefe/SPDA", label: "Chefe/SPDA" }, { valor: "Comcep/PGM", label: "Comcep/PGM" }, { valor: "SPF/PGM", label: "SPF/PGM" }, { valor: "SPFUN/PGM", label: "SPFUN/PGM" }, { valor: "TJRO/PGM", label: "TJRO/PGM" } ];

    // --- Funções de Lógica do Formulário ---
    function getOpcoesAmbiente() { 
        if (auditorTesouroRadio.checked && perfilExisteCheckbox.checked) { 
            return ambientesAuditorTesouro; 
        } 
        if (procuradorMunicipalRadio.checked && perfilExisteCheckbox.checked) { 
            return ambientesProcuradorMunicipal; 
        } 
        if (outrosRadio.checked && perfilExisteCheckbox.checked) { 
            const secretariaSelecionada = outrosEspecificarSelect.value; 
            switch(secretariaSelecionada) { 
                case "Semusb": return ambientesSemubs; 
                case "Sema": return ambientesSema; 
                case "Semtran": return ambientesSemtran; 
                case "Semur": return ambientesSemur; 
                case "Sempog": return ambientesSempog; 
                case "OutrasSecretarias": return ambientesOutrasSecretariasRetencoes; 
                default: 
                    if (semfazonlineNFSeCheckbox.checked) return ambientesPortalSemfazonline; 
                    return [{ valor: "", label: "Selecione uma secretaria válida ou verifique o sistema." }]; 
            } 
        } 
        if (gpiTributarioCheckbox.checked) { 
            if (servidorSubsecretariaRadio.checked) return ambientesGPITributarioSEMFAZ; 
            if (servidorPGMRadio.checked) return ambientesGPITributarioPGM; 
        } else if (semfazonlineNFSeCheckbox.checked) { 
            if (servidorSubsecretariaRadio.checked || servidorPGMRadio.checked) return ambientesPortalSemfazonline; 
        } 
        return [{ valor: "", label: "Selecione o sistema e a motivação" }]; 
    }
    
    function atualizarOpcoesAmbiente() { 
        const opcoes = getOpcoesAmbiente(); 
        nomeAmbienteSelect.innerHTML = ''; 
        nomeAmbienteSelect.disabled = false; 
        if (opcoes && opcoes.length > 0) { 
            opcoes.forEach(opcao => { 
                const option = document.createElement('option'); 
                option.value = opcao.valor; 
                option.textContent = opcao.label; 
                nomeAmbienteSelect.appendChild(option); 
            }); 
        } else { 
            const option = document.createElement('option'); 
            option.value = ""; 
            option.textContent = "Nenhuma opção disponível"; 
            nomeAmbienteSelect.appendChild(option); 
        } 
    }
    
    function formatarCPF(cpf) { 
        cpf = cpf.replace(/\D/g, ''); 
        if (cpf.length <= 11) { 
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1'); 
        } 
        return cpf; 
    }
    
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
    
    function resetarErros() { 
        errorContainer.classList.add('hidden'); 
        errorList.innerHTML = ''; 
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error')); 
    }
    
    function validarFormulario() { 
        const erros = {}; 
        if (!gpiTributarioCheckbox.checked && !semfazonlineNFSeCheckbox.checked) { 
            erros.sistemas = "Selecione pelo menos um sistema"; 
        } 
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
        const temMotivacao = auditorTesouroRadio.checked || servidorSubsecretariaRadio.checked || procuradorMunicipalRadio.checked || servidorPGMRadio.checked || outrosRadio.checked; 
        if (!temMotivacao) { 
            erros.motivacao = "Selecione uma motivação"; 
        } 
        if (outrosRadio.checked) { 
            const outrosEspecificarValor = outrosEspecificarSelect.value; 
            if (!outrosEspecificarValor) { 
                erros.outrosEspecificar = "Selecione uma secretaria"; 
                outrosEspecificarSelect.classList.add('error'); 
            } 
        } 
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
        const dia = document.getElementById('dia').value.trim(); 
        const mes = document.getElementById('mes').value.trim(); 
        const ano = document.getElementById('ano').value.trim(); 
        if (!dia || !mes || !ano) { 
            erros.data = "Data completa é obrigatória"; 
            if (!dia) document.getElementById('dia').classList.add('error'); 
            if (!mes) document.getElementById('mes').classList.add('error'); 
            if (!ano) document.getElementById('ano').classList.add('error'); 
        } 
        if (!document.getElementById('aceitoTermos').checked) { 
            erros.termo = "Aceite do termo é obrigatório"; 
        } 
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

    // --- Event Listeners ---
    document.querySelectorAll('input[name="motivacao"]').forEach(radio => { 
        radio.addEventListener('change', function() { 
            outrosContainer.classList.toggle('hidden', !outrosRadio.checked); 
            if (perfilExisteCheckbox.checked) { 
                atualizarOpcoesAmbiente(); 
            } 
        }); 
    });
    
    outrosEspecificarSelect.addEventListener('change', function() { 
        if (outrosRadio.checked && perfilExisteCheckbox.checked) { 
            atualizarOpcoesAmbiente(); 
        } 
    });
    
    perfilExisteCheckbox.addEventListener('change', function() { 
        ambienteContainer.classList.toggle('hidden', !this.checked); 
        if (this.checked) { 
            perfilNaoExisteCheckbox.checked = false; 
            descricaoContainer.classList.add('hidden'); 
            atualizarOpcoesAmbiente(); 
        } 
    });
    
    perfilNaoExisteCheckbox.addEventListener('change', function() { 
        descricaoContainer.classList.toggle('hidden', !this.checked); 
        if (this.checked) { 
            perfilExisteCheckbox.checked = false; 
            ambienteContainer.classList.add('hidden'); 
            nomeAmbienteSelect.innerHTML = '<option value="">Selecione primeiro o sistema e a motivação</option>'; 
        } 
    });
    
    cpfInput.addEventListener('input', function() { 
        this.value = formatarCPF(this.value); 
    });
    
    superiorCPFInput.addEventListener('input', function() { 
        this.value = formatarCPF(this.value); 
    });
    
    [gpiTributarioCheckbox, semfazonlineNFSeCheckbox].forEach(checkbox => { 
        checkbox.addEventListener('change', function() { 
            if (perfilExisteCheckbox.checked) { 
                atualizarOpcoesAmbiente(); 
            } 
        }); 
    });

    // Função otimizada para geração do PDF
    async function processImageAndGeneratePdf() {
        const originalSrc = logoImage ? logoImage.src : null;
        let needsRestoration = false;

        // Processamento da imagem para o PDF
        if (logoImage && logoImage.src && !logoImage.src.startsWith('data:')) {
            console.log("Tentando pré-converter a imagem do logo para Data URL...");
            try {
                const dataUrl = await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.onload = () => {
                        console.log("Imagem carregada para pré-conversão.");
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        try {
                            ctx.drawImage(img, 0, 0);
                            const dataURL = canvas.toDataURL('image/png');
                            resolve(dataURL);
                        } catch (e) {
                            console.error('Falha ao executar toDataURL na pré-conversão (Tainted Canvas):', e);
                            reject(e);
                        }
                    };
                    img.onerror = (e) => {
                        console.error('Erro ao carregar a imagem original para pré-conversão em Data URL:', e);
                        reject(new Error('Falha ao carregar a imagem do logo.'));
                    };
                    img.src = logoImage.src;
                });
                if (dataUrl) {
                    logoImage.src = dataUrl;
                    needsRestoration = true;
                    console.log("Imagem do logo substituída por Data URL para o PDF.");
                }
            } catch (error) {
                console.error('A pré-conversão da imagem do logo para Data URL falhou:', error);
                alert('Aviso: Não foi possível processar a imagem do logo. O PDF será gerado, mas o logo pode não aparecer corretamente. Verifique o console (F12).');
            }
        }

        const botaoContainerOriginal = document.querySelector('.botao-container');
        if (botaoContainerOriginal) botaoContainerOriginal.style.display = 'none';

        // Aplicar estilos temporários para compactar o conteúdo
        const originalPadding = formContainer.style.padding;
        formContainer.style.padding = '10px';
        
        // Reduzir temporariamente o tamanho do logo para o PDF
        const originalMaxWidth = logoImage ? logoImage.style.maxWidth : '';
        if (logoImage) {
            logoImage.style.maxWidth = '70px';
        }

        // Configurações otimizadas para o PDF
        const opt = {
            margin: [10, 10, 10, 10], // Margens reduzidas [topo, esquerda, baixo, direita]
            filename: 'requerimento_sistemas_tributarios.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                logging: true,
                useCORS: true,
                scrollX: 0,
                scrollY: 0,
                removeContainer: true,
                ignoreElements: (element) => {
                    return element.id === 'error-container' && !element.classList.contains('hidden');
                }
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true // Ativar compressão
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            enableLinks: true
        };

        console.log("Iniciando a geração do PDF com configurações otimizadas...");
        try {
            await html2pdf().from(formContainer).set(opt).save();
            console.log("PDF gerado e download iniciado.");
        } catch (err) {
            console.error("Erro detalhado durante a execução de html2pdf().save():", err);
            alert("Ocorreu um erro ao gerar o PDF. Por favor, verifique o console do navegador (F12) para mais detalhes técnicos e tente novamente.");
            throw err;
        } finally {
            // Restaurar estilos originais
            formContainer.style.padding = originalPadding;
            if (logoImage) {
                logoImage.style.maxWidth = originalMaxWidth;
            }
            
            btnImprimir.disabled = false;
            btnImprimir.textContent = 'Gerar e Baixar PDF';
            if (botaoContainerOriginal) botaoContainerOriginal.style.display = 'block';
            if (needsRestoration && logoImage && originalSrc) {
                logoImage.src = originalSrc;
                console.log("Imagem do logo restaurada para o src original.");
            }
        }
    }

    // Listener para o evento de submissão do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        resetarErros();
        const erros = validarFormulario();
        if (Object.keys(erros).length > 0) {
            exibirErros(erros);
            return;
        }
        btnImprimir.disabled = true;
        btnImprimir.textContent = 'Gerando PDF...';
        try {
            await processImageAndGeneratePdf();
        } catch (error) {
            console.log("Tratamento final de erro no listener de submit após falha em processImageAndGeneratePdf.");
        }
    });

    // Inicialização das opções de ambiente
    if (perfilExisteCheckbox.checked) {
        atualizarOpcoesAmbiente();
    } else {
        nomeAmbienteSelect.innerHTML = '<option value="">Selecione primeiro o sistema e a motivação</option>';
    }
});
