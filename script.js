// Grupos de localidades. Cada grupo gera um fieldset com o nome da propriedade, onde são criados os inputs para cada aerodromo
const briefinglatam = {
    'tma-rj': ['sbgl.gig', 'sbrj.sdu'],
    'tma-sp': ['sbgr.gru', 'sbsp.cgh', 'sbkp.vcp'],
    'fir-az': ['sbsl.slz', 'sbiz.imp', 'sbbe.bel', 'sbsn.stm', 'sbma.mab', 'sbmq.mcp', 'sbeg.mao',
        'sbbv.bvb', 'sbpv.pvh', 'sbrb.rbr', 'sbcy.cgb','sbsi.ops'
    ],
    'fir-re': ['sbvt.vix', 'sbps.bps', 'sbil.ios', 'sbvc.vdc', 'sbsv.ssa', 'sbar.aju', 'sbmo.mcz',
        'sbrf.rec', 'sbpl.pnz', 'sbjp.jpa', 'sbsg.nat', 'sbfz.for', 'sbju.jdo','sbje.jjd','sbte.the'
    ],
    'fir-bs': ['sbpj.pmw', 'sbbr.bsb', 'sbgo.gyn', 'sbcn.clv', 'sbcf.cnf', 'sbul.udi', 'sbrp.rao',
        'sbsr.sjp', 'sbae.bau', 'sdsc.qsc'
    ],
    'fir-cw': ['sbpa.poa', 'sbcx.cxj', 'sbfl.fln', 'sbnf.nvt', 'sbjv.joi', 'sbch.xap', 'sbja.jjg',
        'sbct.cwb', 'sbfi.igu', 'sblo.ldb', 'sbmg.mgf', 'sbcg.cgr'
    ]
}
// Cria o array para iteração dos grupos e aeródromos
const GRUPOS = Object.entries(briefinglatam);

// Métodos úteis na exibição dos dados
// Retorna o codigo icao de uma localidade selecionada
const icao = localidade => localidade.substring(0, 4).toUpperCase();
// Retorna o codigo iata de uma localidade selecionada
const iata = localidade => localidade.substring(5).toUpperCase();

// Gera os campos para inserir a informação
const gerarCampos = function () {
    for (let i = 0; i < GRUPOS.length; i++) {
        //Cria os fieldsets com as legendas de cada grupo
        let fs = document.createElement('fieldset');
        let leg = document.createElement('legend');
        leg.textContent = GRUPOS[i][0].toUpperCase();
        fs.appendChild(leg);
        document.getElementById('coordenacao').appendChild(fs);
        // Lendo cada aerodromo do grupos e criando uma label e um input pra cada um deles
        for (let j = 0; j < GRUPOS[i][1].length; j++) {
            //Cria uma div pra cada aerodromo
            let div = document.createElement('div');
            fs.appendChild(div);
            // Cria a label de cada aerodromo
            let label = document.createElement('label');
            label.textContent = icao(GRUPOS[i][1][j]);
            div.appendChild(label);
            // Cria o input de cada aerodromo
            let input = document.createElement('input');
            input.type = 'text';
            input.id = GRUPOS[i][1][j];
            div.appendChild(input);
        }
    }
}
// Chamada da função ao carregar a página
gerarCampos();

const gerarBriefing = function () {
    let briefing = {};
    // Cria as chaves para os briefings de cada grupo
    for (let i = 0; i < GRUPOS.length; i++) {
        briefing[GRUPOS[i][0]] = {};
        // Lê cada input e se não for nulo insere o briefing pago se não existir, ou se já existir outro adiciona o aerodromo igual
        for (let j = 0; j < GRUPOS[i][1].length; j++) {
            // Se não houver briefing para o aerodromo iterado, o próximo é avaliado
            let input = document.getElementById(GRUPOS[i][1][j]);
            if (!input.value) continue;
            // Verifica se o briefing pago já existe nesse grupo. Se não existir insere o briefing e o areodromo, se existir adiciona o aerodromo
            let condicao = document.getElementById(GRUPOS[i][1][j]).value;
            if (condicao in briefing[GRUPOS[i][0]]) {
                let el = briefing[GRUPOS[i][0]];
                let elCondicao = el[condicao];
                elCondicao.push(GRUPOS[i][1][j]);
            } else {
                let el = briefing[GRUPOS[i][0]];
                el[condicao] = [input.id];
            }
        }
    }
    return briefing;
}

const imprimeBriefing = function () {
    limpaTabela();
    document.getElementById('resultado')
    // Gera o briefing
    let briefing = gerarBriefing();
    // Cria a tabela para exibição
    let tabela = document.createElement('table');
    tabela.style.border = '1px solid';
    // Criar cabeçalho
    let cabecalho = document.createElement('tr');
    let th1 = document.createElement('th');
    th1.textContent = 'TMA/FIR';
    cabecalho.appendChild(th1);
    let th2 = document.createElement('th');
    th2.textContent = 'PREVISÕES';
    cabecalho.appendChild(th2);
    tabela.appendChild(cabecalho);
    // Cria as linhas baseadas em cada grupo
    for (let i = 0; i < GRUPOS.length; i++) {
        // nova linha
        let tr = document.createElement('tr');
        tabela.appendChild(tr);
        // celula com o nome do grupo
        let td1 = document.createElement('td');
        let grupo = GRUPOS[i][0].toUpperCase();
        td1.textContent = grupo;
        tr.appendChild(td1);
        // celula com a condição meteorológica
        let td2 = document.createElement('td');
        if (Object.keys(briefing[GRUPOS[i][0]]).length === 0) {
            td2.textContent = 'Sem previsão significativa';
        } else {
            let condicoes_localidades = Object.entries(briefing[GRUPOS[i][0]]);
            for (let j = 0; j < condicoes_localidades.length; j++) {
                let p = document.createElement('p');
                for (let k = 0; k < condicoes_localidades[j][1].length; k++) {
                    p.textContent += iata(condicoes_localidades[j][1][k]);
                    if (k < condicoes_localidades[j][1].length - 1) {
                        p.textContent += ' / ';
                    }
                }
                p.textContent += ' - ' + condicoes_localidades[j][0];
                td2.appendChild(p);
            }
        }
        tr.appendChild(td2);
    }
    document.getElementById('resultado').appendChild(tabela);
}

// Limpa a tabela para nova exibição
const limpaTabela = function () {
    while (document.getElementById('resultado').firstChild) {
        document.getElementById('resultado').removeChild(document.getElementById('resultado').firstChild);
    }
}
