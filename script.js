// Grupos de localidades. Cada grupo gera um fieldset com o nome da propriedade, onde são criados os inputs para cada aerodromo

const briefing = {
  "tma-rj": ["SBGL.GIG.principal", "SBRJ.SDU.principal"],
  "tma-sp": ["SBGR.GRU.principal", "SBSP.CGH.principal", "SBKP.VCP.principal"],
  "fir-az": [
    "SBSL.SLZ.principal",
    "SBIZ.IMP.principal",
    "SBBE.BEL.principal",
    "SBSN.STM.principal",
    "SBMA.MAB",
    "SBHT.ATM",
    "SBCJ.CKS",
    "SBMQ.MCP.principal",
    "SBEG.MAO.principal",
    "SBTT.TBT",
    "SBTF.TFF",
    "SBBV.BVB.principal",
    "SBPV.PVH.principal",
    "SBRB.RBR.principal",
    "SBCZ.CZS",
    "SBCY.CGB.principal",
    "SBSI.OPS",
    "SBRD.ROO",
    "SBAT.AFL",
  ],
  "fir-re": [
    "SBVT.VIX.principal",
    "SBPS.BPS",
    "SBIL.IOS",
    "SBTC.UMA",
    "SBVC.VDC",
    "SBSV.SSA.principal",
    "SBAR.AJU.principal",
    "SBMO.MCZ.principal",
    "SBRF.REC.principal",
    "SBFN.FEN",
    "SBPL.PNZ",
    "SBJP.JPA.principal",
    "SBKG.CPV",
    "SBSG.NAT.principal",
    "SBFZ.FOR.principal",
    "SBJU.JDO",
    "SBJE.JJD",
    "SBAC.ARX",
    "SBTE.THE.principal",
    "SBPB.PHB",
  ],
  "fir-bs": [
    "SBBR.BSB.principal",
    "SBGO.GYN.principal",
    "SBPJ.PMW.principal",
    "SBCN.CLV",
    "SBCF.CNF.principal",
    "SBBH.PLU.principal",
    "SBLS.SBLS",
    "SBUL.UDI",
    "SBUR.UBA",
    "SBMK.MOC",
    "SBRP.RAO",
    "SBSR.SJP",
    "SBAE.JTC",
    "SDSC.QSC",
  ],
  "fir-cw": [
    "SBME.MEA",
    "SBDN.PPB",
    "SBZM.IZA",
    "SBPA.POA.principal",
    "SBCX.CXJ",
    "SBCO.QNS.principal", //adicionado durante contingência de POA
    "SBUG.URG",
    "SBBG.BGX",
    "SBPK.PET",
    "SBFL.FLN.principal",
    "SBNF.NVT.principal",
    "SBJV.JOI",
    "SBCH.XAP",
    "SBJA.JJG",
    "SBCT.CWB.principal",
    "SBBI.BFH",
    "SBFI.IGU.principal",
    "SBLO.LDB",
    "SBMG.MGF",
    "SBCA.CAC",
    "SBCG.CGR.principal",
    "SBDB.BYO",
    "SBDO.DOU",
  ],
};
// Cria o array para iteração dos grupos e aeródromos
const GRUPOS = Object.entries(briefing);

// Métodos úteis na exibição dos dados
// Retorna o codigo icao de uma localidade selecionada
const icao = (localidade) => localidade.substring(0, 4);
// Retorna o codigo iata de uma localidade selecionada
const iata = (localidade) => localidade.substring(5, 8);

// Retorna a lista de ICAOs cadastrados
const getAllICAO = () => {
  let icaos = [];
  for (let ads of Object.values(briefing)) {
    let aerodromos = ads.map((item) => icao(item));
    icaos = [...icaos, ...aerodromos];
  }
  return icaos;
};

function getData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        resolve(data);
      });
  });
}

// Edita os TAFS para exibição
const tabulaTAF = (taf) => {
  return taf
    .replace("TN", "<BR>TN")
    .replaceAll("BECMG", "<BR>BECMG")
    .replaceAll("TEMPO", "<BR>TEMPO")
    .replaceAll("PROB", "<BR>PROB")
    .replaceAll("RMK", "<BR>RMK");
};

// Gera os campos para inserir a informação
const gerarCampos = function () {
  for (let i = 0; i < GRUPOS.length; i++) {
    //Cria os fieldsets com as legendas de cada grupo
    let fs = document.createElement("fieldset");
    let leg = document.createElement("legend");
    leg.textContent = GRUPOS[i][0].toUpperCase();
    fs.appendChild(leg);
    document.getElementById("formulario").appendChild(fs);

    // Cria os campos para preenchimento
    for (let j = 0; j < GRUPOS[i][1].length; j++) {
      //Cria uma div pra cada aerodromo
      let div = document.createElement("div");
      div.classList.add("div_ad");
      fs.appendChild(div);
      // Cria a para o TAF
      let div_taf = document.createElement("div");
      div_taf.classList.add("div_taf");
      div_taf.id = `taf${icao(GRUPOS[i][1][j])}`;
      div.appendChild(div_taf);
      // Cria a label de cada aerodromo
      let label = document.createElement("label");
      label.textContent = icao(GRUPOS[i][1][j]);
      label.classList.add("label_icao");
      div.appendChild(label);
      // Cria o input de cada aerodromo
      let input = document.createElement("input");
      input.type = "text";
      input.id = GRUPOS[i][1][j];
      div.appendChild(input);
    }

    let requisicoes = [];

    // Gerando as urls para as promises
    getAllICAO().forEach((icao) => {
      requisicoes.push(
        getData(
          `https://api-redemet.decea.mil.br/mensagens/taf/${icao}?api_key=6vmvTQDP1t8thEEAUkCCj4z4TRjrJLcb561p1SRi`
        )
      );
    });

    // Buscando os TAF no REDEMET
    Promise.all(requisicoes).then((dados) => {
      // Inserindo os TAF nos  campos
      dados.forEach((resposta) => {
        if (resposta.data.data[0]) {
          let div_taf = document.getElementById(
            `taf${resposta.data.data[0].id_localidade}`
          );
          const msg = tabulaTAF(resposta.data.data[0].mens);
          div_taf.innerHTML = msg;
        }
      });
      // inserindo os campos dos TAF não dinponíveis
      getAllICAO().forEach((icao) => {
        let div_taf = document.getElementById(`taf${icao}`);
        if (div_taf.textContent === "") {
          div_taf.textContent = `Mensagem TAF de ${icao} não localizada na base de dados da REDEMET`;
          div_taf.style.setProperty("color", "red");
        }
      });
    });
  }
};

// Chamada da função ao carregar a página
gerarCampos();

const gerarBriefingComHorarios = function () {
  let briefing = {};
  // Cria as chaves para os briefings de cada grupo
  for (let i = 0; i < GRUPOS.length; i++) {
    briefing[GRUPOS[i][0]] = {
      nao_significativa: [],
    };
    // Lê cada input e se não for nulo insere o briefing pago se não existir, ou se já existir outro adiciona o aerodromo igual
    for (let j = 0; j < GRUPOS[i][1].length; j++) {
      // Se não houver briefing para o aerodromo iterado, o próximo é avaliado
      let input = document.getElementById(GRUPOS[i][1][j]);
      //if (!input.value) continue
      if (!input.value) {
        if (GRUPOS[i][1][j].indexOf("principal") > -1)
          briefing[GRUPOS[i][0]]["nao_significativa"].push(input.id);
        continue;
      }
      // Verifica se o briefing pago já existe nesse grupo. Se não existir insere o briefing e o areodromo, se existir adiciona o aerodromo
      let condicao = input.value.toLowerCase();
      let horarios_de_ate = [...condicao.matchAll(/\d+-\d+/g)];
      horarios_de_ate.forEach((item) => {
        condicao = condicao.replaceAll(
          item[0],
          `(${
            item[0].split("-")[0].length < 2
              ? "0" + item[0].split("-")[0]
              : item[0].split("-")[0]
          }:00 UTC às ${
            item[0].split("-")[1].length < 2
              ? "0" + item[0].split("-")[1]
              : item[0].split("-")[1]
          }:00 UTC)`
        );
      });
      let horarios_a_partir = [...condicao.matchAll(/\d+-/g)];
      horarios_a_partir.forEach((item) => {
        condicao = condicao.replaceAll(
          item[0],
          `(a partir de ${
            item[0].split("-")[0].length < 2
              ? "0" + item[0].split("-")[0]
              : item[0].split("-")[0]
          }:00 UTC)`
        );
      });
      let horarios_ate = [...condicao.matchAll(/-\d+/g)];
      horarios_ate.forEach((item) => {
        condicao = condicao.replaceAll(
          item[0],
          `(até ${
            item[0].split("-")[1].length < 2
              ? "0" + item[0].split("-")[1]
              : item[0].split("-")[1]
          }:00 UTC)`
        );
      });
      //atalhos de condição
      condicao = condicao.replaceAll("ztsra", "trovoadas com chuva");
      condicao = condicao.replaceAll(
        "zrtv",
        "restrição de teto e visibilidade"
      );
      condicao = condicao.replaceAll(
        "zrvt",
        "restrição de teto e visibilidade"
      );
      condicao = condicao.replaceAll("zrt", "restrição de teto");
      condicao = condicao.replaceAll("zrv", "restrição de visibilidade");
      condicao = condicao.replaceAll("zbr", "névoa úmida");
      condicao = condicao.replaceAll("zfg", "nevoeiro");
      condicao = condicao.replaceAll("zbcfg", "nevoeiro de superfície");
      condicao = condicao.replaceAll("zhz", "névoa seca");
      condicao = condicao.replaceAll("zra", "chuva moderada");
      condicao = condicao.replaceAll("z+ra", "chuva forte");
      condicao = condicao.replaceAll("z-ra", "chuva leve");
      condicao = condicao.replaceAll("zdz", "chuvisco");
      condicao = condicao.replaceAll("z+sh", "pancadas de chuva forte");
      condicao = condicao.replaceAll("zsh", "pancadas de chuva");
      condicao = condicao.replaceAll("zg", "rajadas de vento");
      condicao = condicao.replaceAll("cb", "nuvens convectivas (CB)");
      condicao = condicao.replaceAll("zcb", "formação de nuvens convectivas (CB)");
      if (condicao in briefing[GRUPOS[i][0]]) {
        let el = briefing[GRUPOS[i][0]];
        let elCondicao = el[condicao];
        elCondicao.push(input.id);
      } else {
        let el = briefing[GRUPOS[i][0]];
        el[condicao] = [input.id];
      }
    }
  }
  return briefing;
};

const gerarBriefingSemHorarios = function () {
  let briefing = {};
  // Cria as chaves para os briefings de cada grupo
  for (let i = 0; i < GRUPOS.length; i++) {
    briefing[GRUPOS[i][0]] = {
      nao_significativa: [],
    };
    // Lê cada input e se não for nulo insere o briefing pago se não existir, ou se já existir outro adiciona o aerodromo igual
    for (let j = 0; j < GRUPOS[i][1].length; j++) {
      // Se não houver briefing para o aerodromo iterado, o próximo é avaliado
      let input = document.getElementById(GRUPOS[i][1][j]);
      //if (!input.value) continue
      if (!input.value) {
        if (GRUPOS[i][1][j].indexOf("principal") > -1)
          briefing[GRUPOS[i][0]]["nao_significativa"].push(input.id);
        continue;
      }
      // Verifica se o briefing pago já existe nesse grupo. Se não existir insere o briefing e o areodromo, se existir adiciona o aerodromo
      let condicao = input.value.toLowerCase();
      let horarios_de_ate = [...condicao.matchAll(/\d+-\d+/g)];
      horarios_de_ate.forEach((item) => {
        condicao = condicao.replaceAll(item[0], ``);
      });
      let horarios_a_partir = [...condicao.matchAll(/\d+-/g)];
      horarios_a_partir.forEach((item) => {
        condicao = condicao.replaceAll(item[0], ``);
      });
      let horarios_ate = [...condicao.matchAll(/-\d+/g)];
      horarios_ate.forEach((item) => {
        condicao = condicao.replaceAll(item[0], ``);
      });
      //atalhos de condição
      condicao = condicao.replaceAll("ztsra", "trovoadas com chuva");
      condicao = condicao.replaceAll(
        "zrtv",
        "restrição de teto e visibilidade"
      );
      condicao = condicao.replaceAll("zrt", "restrição de teto");
      condicao = condicao.replaceAll("zrv", "restrição de visibilidade");
      condicao = condicao.replaceAll("zbr", "névoa úmida");
      condicao = condicao.replaceAll("zfg", "nevoeiro");
      condicao = condicao.replaceAll("zhz", "névoa seca");
      condicao = condicao.replaceAll("zra", "chuva moderada");
      condicao = condicao.replaceAll("z+ra", "chuva forte");
      condicao = condicao.replaceAll("z-ra", "chuva leve");
      condicao = condicao.replaceAll("zdz", "chuvisco");
      condicao = condicao.replaceAll("z+sh", "pancadas de chuva forte");
      condicao = condicao.replaceAll("zsh", "pancadas de chuva");
      if (condicao in briefing[GRUPOS[i][0]]) {
        let el = briefing[GRUPOS[i][0]];
        let elCondicao = el[condicao];
        elCondicao.push(input.id);
      } else {
        let el = briefing[GRUPOS[i][0]];
        el[condicao] = [input.id];
      }
    }
  }
  return briefing;
};

const imprimeBriefingSemHorarios = function () {
  limpaTabela();
  document.getElementById("resultado");
  // Gera o briefing
  let briefing = gerarBriefingSemHorarios();
  // Cria a tabela para exibição
  let tabela = document.createElement("table");
  tabela.classList.add("coordenacao");
  // Criar cabeçalho
  let cabecalho = document.createElement("tr");
  let th1 = document.createElement("th");
  th1.textContent = "TMA/FIR";
  cabecalho.appendChild(th1);
  let th2 = document.createElement("th");
  th2.textContent = "PREVISÕES";
  cabecalho.appendChild(th2);
  tabela.appendChild(cabecalho);
  // Cria as linhas baseadas em cada grupo. O índice começa em 1 pois pula a chave 'nao_significativa' para gerar a string de
  // "Sem previsão significativa" corretamente
  for (let i = 0; i < GRUPOS.length; i++) {
    // nova linha
    let tr = document.createElement("tr");
    tabela.appendChild(tr);
    // celula com o nome do grupo
    let td1 = document.createElement("td");
    td1.classList.add("coluna_fir");
    let grupo = GRUPOS[i][0].toUpperCase();
    td1.textContent = grupo;
    tr.appendChild(td1);
    // celula com a condição meteorológica
    let td2 = document.createElement("td");
    let condicoes_localidades = Object.entries(briefing[GRUPOS[i][0]]);
    for (let j = 0; j < condicoes_localidades.length; j++) {
      if (
        condicoes_localidades[j][0] === "nao_significativa" &&
        condicoes_localidades[j][1].length === 0
      )
        continue;
      let p = document.createElement("p");
      condicoes_localidades[j][0] === "nao_significativa"
        ? (p.textContent = "Sem previsão significativa para ")
        : (p.textContent =
            "Previsão de " + condicoes_localidades[j][0] + " para ");
      for (let k = 0; k < condicoes_localidades[j][1].length; k++) {
        p.textContent += iata(condicoes_localidades[j][1][k]);
        if (k < condicoes_localidades[j][1].length - 1) {
          p.textContent += "/";
        }
      }
      td2.appendChild(p);
      tr.appendChild(td2);
    }
  }
  document.getElementById("resultado").appendChild(tabela);
};

const imprimeBriefingComHorarios = function () {
  limpaTabela();
  document.getElementById("resultado");
  // Gera o briefing
  let briefing = gerarBriefingComHorarios();
  // Cria a tabela para exibição
  let tabela = document.createElement("table");
  tabela.classList.add("coordenacao");
  // Criar cabeçalho
  let cabecalho = document.createElement("tr");
  let th1 = document.createElement("th");
  th1.textContent = "TMA/FIR";
  cabecalho.appendChild(th1);
  let th2 = document.createElement("th");
  th2.textContent = "PREVISÕES";
  cabecalho.appendChild(th2);
  tabela.appendChild(cabecalho);
  // Cria as linhas baseadas em cada grupo. O índice começa em 1 pois pula a chave 'nao_significativa' para gerar a string de
  // "Sem previsão significativa" corretamente
  for (let i = 0; i < GRUPOS.length; i++) {
    // nova linha
    let tr = document.createElement("tr");
    tabela.appendChild(tr);
    // celula com o nome do grupo
    let td1 = document.createElement("td");
    td1.classList.add("coluna_fir");
    let grupo = GRUPOS[i][0].toUpperCase();
    td1.textContent = grupo;
    tr.appendChild(td1);
    // celula com a condição meteorológica
    let td2 = document.createElement("td");
    let condicoes_localidades = Object.entries(briefing[GRUPOS[i][0]]);
    console.log(condicoes_localidades);
    for (let j = 0; j < condicoes_localidades.length; j++) {
      if (
        condicoes_localidades.length === 1 &&
        condicoes_localidades[j][0] === "nao_significativa"
      ) {
        let p = document.createElement("p");
        p.textContent = "Sem previsão significativa";
        td2.appendChild(p);
        tr.appendChild(td2);
      } else {
        if (
          condicoes_localidades[j][0] === "nao_significativa" &&
          condicoes_localidades[j][1].length === 0
        )
          continue;
        let p = document.createElement("p");
        if (condicoes_localidades[j][0] !== "nao_significativa") {
          p.textContent =
            "Previsão de " + condicoes_localidades[j][0] + " para ";
          for (let k = 0; k < condicoes_localidades[j][1].length; k++) {
            p.textContent += iata(condicoes_localidades[j][1][k]);
            if (k < condicoes_localidades[j][1].length - 1) {
              p.textContent += "/";
            }
          }
        }
        td2.appendChild(p);
        tr.appendChild(td2);
      }
    }
  }
  document.getElementById("resultado").appendChild(tabela);
};

// Limpa a tabela para nova exibição
const limpaTabela = function () {
  while (document.getElementById("resultado").firstChild) {
    document
      .getElementById("resultado")
      .removeChild(document.getElementById("resultado").firstChild);
  }
};

// Escolha de estilo da tabela
document
  .getElementById("btnImprimeBriefingCompleto")
  .addEventListener("click", () => {
    const tabela = document.querySelector("table");
    tabela.setAttribute("class", "abr");
  });
document
  .getElementById("btnImprimeBriefingSignificativo")
  .addEventListener("click", () => {
    const tabela = document.querySelector("table");
    tabela.setAttribute("class", "coordenacao");
  });
