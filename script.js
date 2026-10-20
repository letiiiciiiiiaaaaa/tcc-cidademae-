document.addEventListener("DOMContentLoaded", () => {

  const btnUserVoltar = document.getElementById('btn-user');
  if (btnUserVoltar) {
    btnUserVoltar.addEventListener('click', () => {
      sessionStorage.setItem('voltarPara', window.location.pathname.split('/').pop() || 'index.html');
    });
  }

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

  const perfilLogado = document.getElementById('perfil-logado');
  const menuUsuario = document.getElementById('menu-usuario');
  const btnSair = document.getElementById('btn-sair');

  if (perfilLogado && menuUsuario) {
    perfilLogado.addEventListener('click', (e) => {
      e.stopPropagation();
      menuUsuario.classList.toggle('ativo');
    });

    document.addEventListener('click', () => {
      menuUsuario.classList.remove('ativo');
    });
  }

  if (btnSair) {
    btnSair.addEventListener('click', async (e) => {
      e.preventDefault();
      localStorage.removeItem('usuario_nome');
      localStorage.removeItem('usuarioLogado');
      localStorage.removeItem('usuario_id');

      if (typeof supabaseClient !== 'undefined') {
        await supabaseClient.auth.signOut();
      }

      window.location.reload();
    });
  }

  const imgs = document.getElementById("img");
  const imgList = document.querySelectorAll("#img img");
  let idx = 0;

  function carrossel() {
    idx++;

    if (idx > imgList.length - 1) {
      idx = 0;
    }

    if (imgs) {
      imgs.style.transform = `translateX(${-idx * 100}%)`;
    }
  }

  if (imgs && imgList.length > 0) {
    setInterval(carrossel, 4000);
  }

  // animação scroll
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

  const elementosAnimados = document.querySelectorAll(".esquerda, .direita, .surgir");

  const observador = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("mostrar");
        entry.target.classList.add("visivel");
        observador.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  elementosAnimados.forEach((el) => observador.observe(el));

  // linha do tempo mercado
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

  // calculadora
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

  // barra pesquisa
  const paginas = [
    {
      arquivo: 'index.html',
      titulo: 'Início',
      palavras: ['inicio', 'home', 'paranagua', 'cidade', 'mapa', 'eventos', 'carrossel', 'cultura', 'historia']
    },
    {
      arquivo: 'arte.html',
      titulo: 'Arte',
      palavras: ['arte', 'pintura', 'fandango', 'caiçara', 'caicara', 'rabeca', 'danca', 'dança', 'musica', 'música', 'aquarela', 'palotino', 'quadro', 'casa monsenhor']
    },
    {
      arquivo: 'mercado.html',
      titulo: 'Mercado',
      palavras: ['mercado', 'porto', 'cafe', 'café', 'peixe', 'artesanato', 'municipal', 'comercio', 'comércio', 'linha do tempo', 'historia', 'história']
    },
    {
      arquivo: 'gastronomia.html',
      titulo: 'Gastronomia',
      palavras: ['gastronomia', 'comida', 'barreado', 'caranguejo', 'tainha', 'peixe', 'arroz', 'lambe', 'receita', 'prato', 'culinaria', 'culinária', 'chef', 'lucas correia']
    },
    {
      arquivo: 'feedback.html',
      titulo: 'Feedback',
      palavras: ['feedback', 'opiniao', 'opinião', 'avaliar', 'estrela', 'mensagem', 'contato']
    },
    {
      arquivo: 'jogo-memoria.html',
      titulo: 'Jogo da Memória',
      palavras: ['jogo', 'memoria', 'memória', 'cartas', 'dificuldade', 'pontuacao', 'pontuação']
    },
    {
      arquivo: 'jogo.html',
      titulo: 'Quiz Caiçara',
      palavras: ['jogo', 'quiz', 'caiçara', 'caicara', 'perguntas', 'teste']
    },
    {
      arquivo: 'sobre-nos.html',
      titulo: 'Sobre Nós',
      palavras: ['sobre', 'nos', 'nós', 'equipe', 'tcc', 'projeto', 'quem somos']
    }
  ];

  const inputBusca = document.getElementById('searchInput');

  if (inputBusca) {
    inputBusca.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;

      const termo = inputBusca.value.trim();
      if (!termo) return;

      const normalizar = (txt) =>
        txt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

      const termoLimpo = normalizar(termo);

      const resultado = paginas.find(p =>
        p.palavras.some(palavra => {
          const pLimpa = normalizar(palavra);
          return pLimpa.includes(termoLimpo) || termoLimpo.includes(pLimpa);
        }) ||
        normalizar(p.titulo).includes(termoLimpo)
      );

      if (resultado) {
        window.location.href = resultado.arquivo;
      } else {
        alert(`Nada encontrado para "${inputBusca.value}". Tente: arte, mercado, comida, jogo...`);
      }
    });
  }

});

// Feedback: avaliação por estrelas
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
};