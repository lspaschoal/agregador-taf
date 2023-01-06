// Grupos de localidades. Cada grupo gera um fieldset com o nome da propriedade, onde são criados os inputs para cada aerodromo

const briefing = {
    'tma-rj': [
        'SBGL.GIG',
        'SBRJ.SDU'
    ],
    'tma-sp': [
        'SBGR.GRU',
        'SBSP.CGH',
        'SBKP.VCP'
    ],
    'fir-az': [
        'SBSL.SLZ',
        'SBIZ.IMP',
        'SBBE.BEL',
        'SBSN.STM',
        'SBMA.MAB',
        'SBHT.ATM',
        'SBCJ.CKS',
        'SBMQ.MCP',
        'SBEG.MAO',
        'SBTT.TBT',
        'SBTF.TFF',
        'SBBV.BVB',
        'SBPV.PVH',
        'SBRB.RBR',
        'SBCZ.CZS',
        'SBCY.CGB',
        'SBSI.OPS',
        'SBRD.ROO',
        'SBAT.AFL'
    ],
    'fir-re': [
        'SBVT.VIX',
        'SBPS.BPS',
        'SBIL.IOS',
        'SBTC.UMA',
        'SBVC.VDC',
        'SBSV.SSA',
        'SBAR.AJU',
        'SBMO.MCZ',
        'SBRF.REC',
        'SBFN.FEN',
        'SBPL.PNZ',
        'SBJP.JPA',
        'SBKG.CPV',
        'SBSG.NAT',
        'SBFZ.FOR',
        'SBJU.JDO',
        'SBJE.JJD',
        'SBAC.ARX',
        'SBTE.THE',
        'SBPB.PHB'
    ],
    'fir-bs': [
        'SBBR.BSB',
        'SBGO.GYN',
        'SBPJ.PMW',
        'SBCN.CLV',
        'SBCF.CNF',
        'SBBH.PLU',
        'SBLS.SBLS',
        'SBUL.UDI',
        'SBUR.UBA',
        'SBMK.MOC',
        'SBRP.RAO',
        'SBSR.SJP',
        'SBAE.JTC',
        'SDSC.QSC',
    ],
    'fir-cw': [
        'SBME.MEA',
        'SBDN.PPB',
        'SBZM.IZA',
        'SBPA.POA',
        'SBCX.CXJ',
        'SBUG.URG',
        'SBBG.BGX',
        'SBPK.PET',
        'SBFL.FLN',
        'SBNF.NVT',
        'SBJV.JOI',
        'SBCH.XAP',
        'SBJA.JJG',
        'SBCT.CWB',
        'SBBI.BFH',
        'SBFI.IGU',
        'SBLO.LDB',
        'SBMG.MGF',
        'SBCA.CAC',
        'SBCG.CGR',
        'SBDB.BYO',
        'SBDO.DOU',
    ],
    'argentina': [
        'SAEZ.EZE',
        'SABE.AEP'],
    'uruguai': [
        'SUMU.MVD',
        'SULS.PDP'
    ]
}
// Cria o array para iteração dos grupos e aeródromos
const GRUPOS = Object.entries(briefing);

// Métodos úteis na exibição dos dados
// Retorna o codigo icao de uma localidade selecionada
const icao = localidade => localidade.substring(0, 4);
// Retorna o codigo iata de uma localidade selecionada
const iata = localidade => localidade.substring(5);

// Retorna a lista de ICAOs cadastrados
const getAllICAO = () => {
    let icaos = [];
    for (let ads of Object.values(briefing)) {
        let aerodromos = ads.map(item => icao(item));
        icaos = [...icaos, ...aerodromos];
    }
    return icaos;
}

function getData(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                resolve(data);
            });
    })
}

// Edita os TAFS para exibição
const tabulaTAF = (taf) => {
    return taf.replace('TX',',TX').replaceAll('BECMG',',BECMG').replaceAll('TEMPO',',TEMPO').split(',');
}

// Gera os campos para inserir a informação
const gerarCampos = function () {
    for (let i = 0; i < GRUPOS.length; i++) {
        //Cria os fieldsets com as legendas de cada grupo
        let fs = document.createElement('fieldset');
        let leg = document.createElement('legend');
        leg.textContent = GRUPOS[i][0].toUpperCase();
        fs.appendChild(leg);
        document.getElementById('formulario').appendChild(fs);

        let requisicoes = [];

        // Gerando as urls para as promises
        getAllICAO().forEach(icao => {
            requisicoes.push(getData(`https://api-redemet.decea.mil.br/mensagens/taf/${icao}?api_key=6vmvTQDP1t8thEEAUkCCj4z4TRjrJLcb561p1SRi`));
        });

        // Buscando os TAF no REDEMET
        Promise.all(requisicoes)
            .then(dados => {
                let mensagens = new Map();
                dados.forEach(resposta => {
                    if (resposta.data.data.length > 0) mensagens.set(resposta.data.data[0].id_localidade,resposta.data.data[0].mens);
                });
                // Lendo cada aerodromo do array grupos e criando uma label e um input pra cada um deles
                for (let j = 0; j < GRUPOS[i][1].length; j++) {
                    //Cria uma div pra cada aerodromo
                    let div = document.createElement('div');
                    div.classList.add('div_ad');
                    fs.appendChild(div);
                    // Cria a div com o TAF
                    let div_taf = document.createElement('div');
                    div_taf.classList.add('div_taf');
                    
                    if (mensagens.has(icao(GRUPOS[i][1][j]))) {
                        let msg = tabulaTAF(mensagens.get(icao(GRUPOS[i][1][j])));
                        msg.forEach(segmento => (msg.indexOf(segmento) > 0) ? div_taf.innerHTML += segmento + '<br>' : div_taf.innerHTML += segmento);
                    } else {
                        div_taf.textContent = `Mensagem TAF de ${icao(GRUPOS[i][1][j])} não localizada na base de dados da REDEMET`;
                        div_taf.style.setProperty('color','red');
                    }
                    div.appendChild(div_taf);
                    // Cria a label de cada aerodromo
                    let label = document.createElement('label');
                    label.textContent = icao(GRUPOS[i][1][j]);
                    label.classList.add('label_icao')
                    div.appendChild(label);
                    // Cria o input de cada aerodromo
                    let input = document.createElement('input');
                    input.type = 'text';
                    input.id = GRUPOS[i][1][j];
                    div.appendChild(input);
                }
            });
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
            td2.textContent = 'Sem previsão significativa;';
        } else {
            let condicoes_localidades = Object.entries(briefing[GRUPOS[i][0]]);
            for (let j = 0; j < condicoes_localidades.length; j++) {
                let p = document.createElement('p');
                p.textContent = 'Previsão de ' + condicoes_localidades[j][0] + ' para ';
                for (let k = 0; k < condicoes_localidades[j][1].length; k++) {
                    p.textContent += iata(condicoes_localidades[j][1][k]);
                    if (k < condicoes_localidades[j][1].length - 1) {
                        p.textContent += '/';
                    }
                }
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
