document.addEventListener("DOMContentLoaded", () => {

  async function verificarUsuarioLogado() {
    const btnUser = document.getElementById('btn-user');
    const perfilLogado = document.getElementById('perfil-logado');
    const fotoUsuario = document.getElementById('foto-usuario');
    const nomeUsuario = document.getElementById('nome-usuario');

    if (!btnUser || !perfilLogado) return;

    const FOTO_PADRAO = 'imagens/usuario.png';

    const usuarioLocal = localStorage.getItem('usuario_nome');

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
});