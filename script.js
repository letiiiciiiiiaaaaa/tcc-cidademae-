document.addEventListener("DOMContentLoaded", () => {

  // Salva a página atual pra voltar depois do login/cadastro
  const btnUserVoltar = document.getElementById('btn-user');
  if (btnUserVoltar) {
    // Mudamos de 'click' para 'mousedown' para garantir que roda antes do link abrir
    btnUserVoltar.addEventListener('mousedown', () => {
      // Pega apenas o nome da página atual (ex: gastronomia.html)
      const paginaAtual = window.location.pathname.split('/').pop();
      if (paginaAtual) {
        sessionStorage.setItem('voltarPara', paginaAtual);
      }
    });
  }

  // Salva a página atual quando o usuário clica para ir no Perfil
  const linkPerfil = document.querySelector('.usuario a[href="perfil.html"]');
  if (linkPerfil) {
    linkPerfil.addEventListener('mousedown', () => {
      const paginaAtual = window.location.pathname.split('/').pop();
      if (paginaAtual) {
        sessionStorage.setItem('paginaAnteriorPerfil', paginaAtual);
      }
    });
  }

  // Verifica se o usuário está logado e troca o botão "cadastre-se" pelo perfil
  async function verificarUsuarioLogado() {
    const btnUser = document.getElementById('btn-user');
    const perfilLogado = document.getElementById('perfil-logado');
    const fotoUsuario = document.getElementById('foto-usuario');
    const nomeUsuario = document.getElementById('nome-usuario');

    if (!btnUser || !perfilLogado) return;

    const FOTO_PADRAO = 'imagens/usuario.png';
    const usuarioLocal = localStorage.getItem('usuario_nome') || localStorage.getItem('usuarioLogado');

    if (usuarioLocal) {
      if (nomeUsuario) nomeUsuario.textContent = usuarioLocal;
      if (fotoUsuario) fotoUsuario.src = FOTO_PADRAO;
      btnUser.style.display = 'none';
      perfilLogado.style.display = 'flex';
      return;
    }

    if (typeof supabaseClient !== 'undefined') {
      const { data: { session } } = await supabaseClient.auth.getSession();

      if (session && session.user) {
        const usuario = session.user;
        const nome = usuario.user_metadata?.full_name || usuario.user_metadata?.nome || usuario.email.split('@')[0];
        const urlFoto = usuario.user_metadata?.avatar_url || usuario.user_metadata?.foto || FOTO_PADRAO;

        if (fotoUsuario) fotoUsuario.src = urlFoto;
        if (nomeUsuario) nomeUsuario.textContent = nome;
        btnUser.style.display = 'none';
        perfilLogado.style.display = 'flex';
      } else {
        btnUser.style.display = 'inline-block';
        perfilLogado.style.display = 'none';
      }
    } else {
      btnUser.style.display = 'inline-block';
      perfilLogado.style.display = 'none';
    }
  }

  verificarUsuarioLogado();

  if (typeof supabaseClient !== 'undefined') {
    supabaseClient.auth.onAuthStateChange(() => {
      verificarUsuarioLogado();
    });
  }

  // Carrossel da página inicial
  const imgs = document.getElementById("img");
  const imgList = document.querySelectorAll("#img img");
  let idx = 0;

  function carrossel() {
    idx++;
    if (idx > imgList.length - 1) { idx = 0; }
    if (imgs) { imgs.style.transform = `translateX(${-idx * 100}%)`; }
  }

  if (imgs && imgList.length > 0) {
    setInterval(carrossel, 4000);
  }

  // Adiciona classes de animação em elementos que não têm no HTML
  function animar(seletor, classes) {
    document.querySelectorAll(seletor).forEach((el, i) => {
      const jaTem = el.classList.contains('esquerda') ||
        el.classList.contains('direita') ||
        el.classList.contains('surgir');
      if (!jaTem) el.classList.add(classes[i % classes.length]);
    });
  }

  animar('.secao-mapa', ['surgir']);
  animar('.textinho1', ['surgir']);
  animar('.intro1', ['esquerda']);
  animar('.intro2', ['direita']);
  animar('.quadro-mangue', ['esquerda']);
  animar('.quadro-boi', ['direita']);
  animar('.info-quadros', ['surgir']);
  animar('.secao-fandango h2', ['surgir']);
  animar('.box-fandango', ['esquerda']);
  animar('.texto-fandango', ['direita']);
  animar('.lucas img', ['surgir']);
  animar('.ultimo-texto', ['surgir']);
  animar('.intro', ['surgir']);
  animar('.secao-mercado .mercado-info', ['esquerda', 'surgir', 'direita']);
  animar('.linha-do-tempo', ['surgir']);

  // Anima elementos quando entram na tela
  const elementosAnimados = document.querySelectorAll(".esquerda, .direita, .surgir");

  const observador = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("mostrar");
        entry.target.classList.add("visivel");
        observador.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elementosAnimados.forEach((el) => observador.observe(el));

  // Dados da linha do tempo do Mercado
  const epocas = {
    1: {
      titulo: "1871-1872 — O Primeiro Mercado (Mercado do Peixe)",
      imagem: "https://jblitoral.com.br/wp-content/uploads/2024/02/MERCADO-DO-PEIXE-FOTO-BAIXA-2-e1617304912706-1.jpg",
      resumo: "Inauguração do prédio original do Mercado Público à beira da baía, criado para organizar a comercialização de pescados frescos e produtos vindos das comunidades e ilhas da região."
    },
    2: {
      titulo: "1914 — Mercado do Café",
      imagem: "https://jblitoral.com.br/wp-content/uploads/2024/02/IMG_6788-1024x576.jpg.webp",
      resumo: "Construção do prédio do Mercado do Café com arquitetura de inspiração neoclássica, acompanhando a forte expansão econômica provocada pelo ciclo e exportação do café na região do Porto."
    },
    3: {
      titulo: "Anos 1980-1990 — Patrimônio Histórico",
      imagem: "https://www.viagensecaminhos.com/wp-content/uploads/2010/08/o-que-fazer-em-paranagua.jpg",
      resumo: "Reconhecimento oficial e tombamento dos prédios do complexo do Mercado como Patrimônio Histórico do Estado do Paraná, assegurando a preservação de sua estrutura arquitetônica."
    },
    4: {
      titulo: "Anos 2000 — Revitalização e Novos Usos",
      imagem: "https://folhadolitoral.com.br/wp-content/uploads/2020/03/v4skbmp6_1584468665.jpg",
      resumo: "O complexo passa por processos de restauro e modernização interna. O Mercado do Café passa a focar na venda de artesanato tradicional caiçara e souvenir."
    },
    5: {
      titulo: "Dias Atuais — Polo Gastronômico e Turístico",
      imagem: "https://www.paranagua.pr.gov.br/imgbank/big/16474.jpg",
      resumo: "Hoje o conjunto atua como o principal centro gastronômico e cultural do centro histórico de Paranaguá, ponto obrigatório para degustar o tradicional Barreado e comprar frutos do mar."
    }
  };

  // Liga os cliques da linha do tempo
  const container = document.querySelector('.linha-do-tempo');

  if (container) {
    const ponto = container.querySelectorAll('.ponto');
    const titulo = container.querySelector('#tempo-titulo');
    const imagem = container.querySelector('#tempo-imagem');
    const descricao = container.querySelector('#tempo-descricao');

    function selecionarEpoca(id) {
      const dados = epocas[id];
      if (!dados) return;

      if (titulo) titulo.textContent = dados.titulo;
      if (imagem) imagem.src = dados.imagem;
      if (descricao) descricao.textContent = dados.resumo;

      ponto.forEach(ponto => {
        if (ponto.getAttribute('data-id') === id.toString()) {
          ponto.classList.add('ativo');
        } else {
          ponto.classList.remove('ativo');
        }
      });
    }

    ponto.forEach(ponto => {
      ponto.addEventListener('click', () => {
        const id = ponto.getAttribute('data-id');
        selecionarEpoca(id);
      });
    });

    selecionarEpoca(1);
  }

  // Receitas da calculadora de ingredientes
  const receitas = {
    barreado: {
      porcaoBase: 4,
      ingredientes: [
        { nome: "Carne bovina", qtd: 1, unidade: "kg" },
        { nome: "Toucinho defumado", qtd: 200, unidade: "g" },
        { nome: "Cebola", qtd: 2, unidade: "un" },
        { nome: "Alho", qtd: 4, unidade: "dentes" },
        { nome: "Farinha de mandioca", qtd: 500, unidade: "g" },
        { nome: "Banana da terra", qtd: 4, unidade: "un" }
      ]
    },
    caranguejo: {
      porcaoBase: 2,
      ingredientes: [
        { nome: "Caranguejo-uçá", qtd: 12, unidade: "un" },
        { nome: "Limão", qtd: 2, unidade: "un" },
        { nome: "Alho", qtd: 3, unidade: "dentes" },
        { nome: "Coentro", qtd: 1, unidade: "maço" },
        { nome: "Farinha (pirão)", qtd: 200, unidade: "g" }
      ]
    },
    peixe: {
      porcaoBase: 4,
      ingredientes: [
        { nome: "Tainha inteira", qtd: 1, unidade: "un" },
        { nome: "Batata", qtd: 4, unidade: "un" },
        { nome: "Cebola", qtd: 2, unidade: "un" },
        { nome: "Limão", qtd: 2, unidade: "un" },
        { nome: "Azeite", qtd: 3, unidade: "colheres" }
      ]
    },
    arroz: {
      porcaoBase: 4,
      ingredientes: [
        { nome: "Arroz branco", qtd: 2, unidade: "xícaras" },
        { nome: "Mariscos variados", qtd: 500, unidade: "g" },
        { nome: "Cebola", qtd: 1, unidade: "un" },
        { nome: "Alho", qtd: 3, unidade: "dentes" },
        { nome: "Coentro", qtd: 1, unidade: "maço" }
      ]
    }
  };

  // Atualiza a lista de ingredientes conforme o número de porções
  document.querySelectorAll('.calculadora').forEach(calc => {
    const prato = calc.dataset.prato;
    const receita = receitas[prato];
    if (!receita) return;

    const input = calc.querySelector('input');
    const lista = calc.querySelector('.calc-lista');

    function renderizar(porcoes) {
      const fator = porcoes / receita.porcaoBase;
      lista.innerHTML = receita.ingredientes.map(ing => {
        const valor = Math.round(ing.qtd * fator * 10) / 10;
        return `<li><span>${ing.nome}</span><span>${valor} ${ing.unidade}</span></li>`;
      }).join('');
    }

    input.addEventListener('input', () => {
      let porcoes = parseInt(input.value) || 1;
      if (porcoes < 1) porcoes = 1;
      if (porcoes > 20) porcoes = 20;
      renderizar(porcoes);
    });

    renderizar(receita.porcaoBase);
  });

  // Mapa de busca: cada página tem termos e uma âncora
  const mapaBusca = [
    {
      arquivo: 'index.html',
      itens: [
        { termos: ['inicio', 'home', 'paranagua', 'cidade', 'berco'], ancora: '' },
        { termos: ['mapa', 'cultural', 'localizacao', 'pontos historicos'], ancora: 'mapa-cultural' },
        { termos: ['eventos', 'calendario', 'agenda', 'festas', 'rocio', 'tainha'], ancora: 'eventos' },
        { termos: ['jogo', 'memoria', 'quiz', 'caiçara'], ancora: '' }
      ]
    },
    {
      arquivo: 'arte.html',
      itens: [
        { termos: ['arte', 'artes plasticas', 'pintura'], ancora: '' },
        { termos: ['palotino', 'louvre', 'rafael'], ancora: '' },
        { termos: ['quadros', 'aquario', 'obras', 'fandango de paranagua'], ancora: 'quadros' },
        { termos: ['fandango', 'caiçara', 'caicara', 'rabeca', 'adufe', 'batido', 'valsado'], ancora: 'fandango' },
        { termos: ['casa monsenhor', 'casa da cultura', 'monsenhor celso', 'casarão'], ancora: 'casa-monsenhor' },
        { termos: ['paranagua mais cores', 'gio negromonte', 'intervenções'], ancora: 'quadros' }
      ]
    },
    {
      arquivo: 'mercado.html',
      itens: [
        { termos: ['mercado', 'comercio', 'varejo'], ancora: '' },
        { termos: ['porto', 'exportacao', 'logistica', 'graneleiro'], ancora: '' },
        { termos: ['mercado municipal', 'artesanato'], ancora: 'mercados' },
        { termos: ['mercado do cafe', 'cafe', 'pastel', 'banana recheada'], ancora: 'mercados' },
        { termos: ['mercado do peixe', 'pescado', 'peixe fresco'], ancora: 'mercados' },
        { termos: ['linha do tempo', 'historia do mercado', '1871', '1914'], ancora: 'linha-do-tempo' }
      ]
    },
    {
      arquivo: 'gastronomia.html',
      itens: [
        { termos: ['gastronomia', 'comida', 'culinaria', 'pratos tipicos'], ancora: '' },
        { termos: ['barreado', 'panela de barro', 'carne desmanchada'], ancora: 'barreado' },
        { termos: ['caranguejo', 'caranguejada', 'caranguejo-uça', 'uçá'], ancora: 'caranguejo' },
        { termos: ['tainha', 'peixe assado', 'peixe'], ancora: 'peixe' },
        { termos: ['arroz', 'lambe-lambe', 'lambe lambe', 'marisco'], ancora: 'arroz' },
        { termos: ['lucas correia', 'chef', 'chef de alto nivel'], ancora: 'lucas' },
        { termos: ['receita', 'ingredientes', 'porcoes', 'calculadora'], ancora: '' }
      ]
    },
    {
      arquivo: 'feedback.html',
      itens: [
        { termos: ['feedback', 'opiniao', 'avaliar', 'estrela', 'mensagem'], ancora: '' }
      ]
    },
    {
      arquivo: 'jogo-memoria.html',
      itens: [
        { termos: ['jogo da memoria', 'memoria', 'cartas', 'dificuldade'], ancora: '' }
      ]
    },
    {
      arquivo: 'quiz.html',
      itens: [
        { termos: ['quiz', 'teste', 'perguntas', 'caiçara'], ancora: '' }
      ]
    },
    {
      arquivo: 'sobre-nos.html',
      itens: [
        { termos: ['sobre', 'nos', 'equipe', 'tcc', 'projeto'], ancora: '' }
      ]
    }
  ];

  // Busca: acha o termo, guarda na sessão e vai pra página + âncora
  const inputBusca = document.getElementById('searchInput');

  if (inputBusca) {
    inputBusca.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;

      const termo = inputBusca.value.trim();
      if (!termo) return;

      const normalizar = (txt) =>
        txt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

      const termoLimpo = normalizar(termo);

      let encontrado = null;

      for (const pagina of mapaBusca) {
        for (const item of pagina.itens) {
          const bate = item.termos.some(t => {
            const tLimpo = normalizar(t);
            return termoLimpo.length >= 3 && tLimpo.includes(termoLimpo);
          });

          if (bate) {
            encontrado = { arquivo: pagina.arquivo, ancora: item.ancora, termo: termo };
            break;
          }
        }
        if (encontrado) break;
      }

      if (encontrado) {
        sessionStorage.setItem('termoBusca', encontrado.termo);

        const url = encontrado.ancora
          ? `${encontrado.arquivo}#${encontrado.ancora}`
          : encontrado.arquivo;

        window.location.href = url;
      } else {
        alert(`Nada encontrado para "${inputBusca.value}". Tente: barreado, fandango, porto, mapa, caranguejo...`);
      }
    });
  }

  // Depois de redirecionar, pinta a palavra buscada em amarelo
  const termoSalvo = sessionStorage.getItem('termoBusca');

  if (termoSalvo) {
    sessionStorage.removeItem('termoBusca');

    setTimeout(() => {
      const normalizar = (txt) =>
        txt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

      const termoLimpo = normalizar(termoSalvo);

      const main = document.querySelector('main');
      if (!main) return;

      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, null);
      const nosParaDestacar = [];

      let no;
      while ((no = walker.nextNode())) {
        const texto = no.nodeValue;
        if (texto && normalizar(texto).includes(termoLimpo)) {
          nosParaDestacar.push(no);
        }
      }

      nosParaDestacar.forEach((no) => {
        const pai = no.parentNode;
        if (!pai || pai.tagName === 'SCRIPT' || pai.tagName === 'STYLE') return;

        const texto = no.nodeValue;
        const textoNorm = normalizar(texto);
        const posicao = textoNorm.indexOf(termoLimpo);
        if (posicao === -1) return;

        const antes = texto.slice(0, posicao);
        const destaque = texto.slice(posicao, posicao + termoSalvo.length);
        const depois = texto.slice(posicao + termoSalvo.length);

        const frag = document.createDocumentFragment();
        if (antes) frag.appendChild(document.createTextNode(antes));

        const mark = document.createElement('mark');
        mark.className = 'destaque-busca';
        mark.textContent = destaque;
        frag.appendChild(mark);

        if (depois) frag.appendChild(document.createTextNode(depois));

        pai.replaceChild(frag, no);
      });
    }, 300);
  }

});

// Estrelas do feedback
const estrelas = document.querySelectorAll('.estrela');
let selectedRating = 0;

estrelas.forEach(estrela => {
  estrela.addEventListener('mouseover', () => {
    resetEstrelas();
    const value = parseInt(estrela.getAttribute('data-value'));
    highlightEstrelas(value);
  });

  estrela.addEventListener('mouseleave', () => {
    resetEstrelas();
    highlightEstrelas(selectedRating);
  });

  estrela.addEventListener('click', () => {
    selectedRating = parseInt(estrela.getAttribute('data-value'));
    highlightEstrelas(selectedRating);
  });
});

function resetEstrelas() {
  estrelas.forEach(estrela => estrela.classList.remove('active'));
}

function highlightEstrelas(value) {
  for (let i = 0; i < value; i++) {
    estrelas[i].classList.add('active');
  }
}

const eventosAnuais = [
  // JANEIRO / FEVEREIRO
  {
    mesInicio: 0, diaInicio: 24, // 24/Jan
    mesFim: 1, diaFim: 2,       // 02/Fev
    titulo: 'Festa de Nossa Senhora dos Navegantes',
    descricao: 'Festa tradicional na Ilha dos Valadares e Ilha do Mel com procissão marítima, novenas, quitutes regionais e Fandango Caiçara.',
    link: 'https://www.paranagua.pr.gov.br/noticias/noticia3660.html'
  },
  // FEVEREIRO
  {
    mesInicio: 1, diaInicio: 10,
    mesFim: 1, diaFim: 13,
    titulo: 'Carnaval de Paranaguá',
    descricao: 'Desfile das escolas de samba, blocos carnavalescos e bailes populares no Centro Histórico.',
    link: 'https://www.paranagua.pr.gov.br/noticias/noticia5353.html'
  },
  // MARÇO / ABRIL
  {
    mesInicio: 2, diaInicio: 25,
    mesFim: 3, diaFim: 2,
    titulo: 'Paixão de Cristo Caiçara (Via Sacra)',
    descricao: 'Encenação ao ar livre que percorre as ruas do Centro Histórico relembrando a Semana Santa com tradição caiçara.',
    link: 'https://www.paranagua.pr.gov.br/noticias/noticia5507.html'
  },
  // JUNHO / JULHO
  {
    mesInicio: 5, diaInicio: 26,
    mesFim: 6, diaFim: 12,
    titulo: 'Festa Nacional da Tainha',
    descricao: 'Um dos maiores eventos gastronômicos do Litoral na Praça de Eventos 29 de Julho, com pratos típicos, feiras e shows.',
    link: 'https://www.paranagua.pr.gov.br/noticias/noticia5841.html'
  },
  // JULHO
  {
    mesInicio: 6, diaInicio: 24,
    mesFim: 6, diaFim: 29,
    titulo: 'Aniversário de Paranaguá (378+ anos)',
    descricao: 'Celebração do aniversário da cidade mãe do Paraná com desfile cívico, shows nacionais e feira cultural.',
    link: 'https://www.paranagua.pr.gov.br/noticias/noticia5949.html'
  },
  // AGOSTO
  {
    mesInicio: 7, diaInicio: 1,
    mesFim: 7, diaFim: 15,
    titulo: 'Mês do Patrimônio & Festa do Fandango Caiçara',
    descricao: 'Programação voltada para a preservação do patrimônio histórico, rodas de fandango caiçara, oficinas e apresentações na Casa Dacheux.',
    link: 'https://www.paranagua.pr.gov.br/noticias/noticia6325.html'
  },
  {
    mesInicio: 7, diaInicio: 28,
    mesFim: 7, diaFim: 31,
    titulo: 'Paranaguá Motos',
    descricao: 'Encontro de motociclistas reunindo apaixonados por duas rodas na Praça de Eventos com shows de rock e exposição.',
    link: 'https://www.paranagua.pr.gov.br/noticias/noticia5981.html'
  },
  // SETEMBRO
  {
    mesInicio: 8, diaInicio: 25,
    mesFim: 8, diaFim: 29,
    titulo: 'Festa de São Francisco das Chagas',
    descricao: 'Tradição religiosa com novenas e festejos comunitários na Igreja de São Francisco das Chagas.',
    link: 'https://folhadolitoral.com.br/editorias/religiosidade/festa-em-honra-a-sao-francisco-das-chagas-e-iniciada-em-paranagua/'
  },
  // OUTUBRO
  {
    mesInicio: 9, diaInicio: 7,
    mesFim: 9, diaFim: 7,
    titulo: 'Festa de Nossa Senhora do Rosário',
    descricao: 'Celebração da Padroeira do Município de Paranaguá na Catedral Diocesana, com procissão e quermesse.',
    link: 'https://www.paranagua.com.br/eventos-em-paranagua/'
  },
  // NOVEMBRO
  {
    mesInicio: 10, diaInicio: 6,
    mesFim: 10, diaFim: 16,
    titulo: 'Festa de Nossa Senhora do Rocio',
    descricao: 'Uma das maiores festas religiosas do Brasil em honra à Padroeira do Paraná (15/11), realizada na Praça da Fé.',
    link: 'https://www.paranagua.pr.gov.br/noticias/noticia6123.html'
  },
  // DEZEMBRO
  {
    mesInicio: 11, diaInicio: 23,
    mesFim: 11, diaFim: 31,
    titulo: 'Festa de São Benedito',
    descricao: 'Tradição natalina com alvoradas festivas, novenas, procissão e apresentações culturais no Centro Histórico.',
    link: 'https://folhadolitoral.com.br/editorias/religiosidade/festa-de-sao-benedito-chega-a-241a-edicao-em-paranagua-com-novenario-procissao-e-leilao-tradicional/'
  }
];

let mesAtualIndex = 0;

const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function renderizarCalendario() {
  const mesTituloEl = document.getElementById('mes-ano-titulo');
  const diasGrid = document.getElementById('dias-grid');

  if (!mesTituloEl || !diasGrid) return;

  // Atualiza apenas o nome do Mês
  mesTituloEl.innerText = nomesMeses[mesAtualIndex];

  // Ano fixo genérico para manter o fluxo correto de dias da semana
  const anoPadrao = 2026;

  const primeiroDiaSemana = new Date(anoPadrao, mesAtualIndex, 1).getDay();
  const totalDiasNoMes = new Date(anoPadrao, mesAtualIndex + 1, 0).getDate();

  diasGrid.innerHTML = '';

  // Espaços vazios no início do mês
  for (let i = 0; i < primeiroDiaSemana; i++) {
    const divVazia = document.createElement('div');
    divVazia.classList.add('dia-item', 'dia-vazio');
    diasGrid.appendChild(divVazia);
  }

  // Renderiza cada dia do mês
  for (let dia = 1; dia <= totalDiasNoMes; dia++) {
    const diaElemento = document.createElement('div');
    diaElemento.classList.add('dia-item');
    diaElemento.innerText = dia;

    // Procura evento correspondente
    const eventoDoDia = eventosAnuais.find(e => {
      if (e.mesInicio === e.mesFim && e.mesInicio === mesAtualIndex) {
        return dia >= e.diaInicio && dia <= e.diaFim;
      }
      if (e.mesInicio === mesAtualIndex && dia >= e.diaInicio) return true;
      if (e.mesFim === mesAtualIndex && dia <= e.diaFim) return true;

      return false;
    });

    if (eventoDoDia) {
      diaElemento.classList.add('tem-evento');
      diaElemento.addEventListener('click', () => {
        document.querySelectorAll('.dia-item').forEach(el => el.classList.remove('selecionado'));
        diaElemento.classList.add('selecionado');

        mostrarDetalhesEvento(eventoDoDia, dia, nomesMeses[mesAtualIndex]);
      });
    }

    diasGrid.appendChild(diaElemento);
  }
}

function mostrarDetalhesEvento(evento, dia, nomeMes) {
  document.getElementById('evento-titulo').innerText = evento.titulo;
  document.getElementById('evento-data-texto').innerText = `Ocorre em: ${dia} de ${nomeMes}`;
  document.getElementById('evento-descricao').innerText = evento.descricao;

  const linkBtn = document.getElementById('evento-link');
  linkBtn.href = evento.link;
  linkBtn.style.display = 'inline-block';
}

// Eventos de clique para prev / next
document.addEventListener('DOMContentLoaded', () => {
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      mesAtualIndex = (mesAtualIndex === 0) ? 11 : mesAtualIndex - 1;
      renderizarCalendario();
    });

    btnNext.addEventListener('click', () => {
      mesAtualIndex = (mesAtualIndex === 11) ? 0 : mesAtualIndex + 1;
      renderizarCalendario();
    });
  }

  // Executa ao carregar a página
  renderizarCalendario();
});