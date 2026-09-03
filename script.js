document.addEventListener("DOMContentLoaded", () => {

  async function verificarUsuarioLogado() {
    const btnUser = document.getElementById('btn-user');
    const perfilLogado = document.getElementById('perfil-logado');
    const fotoUsuario = document.getElementById('foto-usuario');
    const nomeUsuario = document.getElementById('nome-usuario');

    if (!btnUser || !perfilLogado) return;

    const FOTO_PADRAO = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

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
    }
  }

  verificarUsuarioLogado();

  if (typeof supabaseClient !== 'undefined') {
    supabaseClient.auth.onAuthStateChange(() => {
      verificarUsuarioLogado();
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

  const mapaElement = document.getElementById('mapa');
  if (mapaElement && typeof L !== 'undefined') {
    const mapa = L.map('mapa').setView([-25.5205, -48.5090], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);

    const locais = [
      {
        nome: "Mercado do Café",
        descricao: "Centro da gastronomia caiçara! Famoso pelo tradicional Barreado.",
        coords: [-25.5209, -48.5075],
        link: "gastronomia.html"
      },
      {
        nome: "Mercado do Peixe",
        descricao: "Ponto tradicional de venda do pescado do dia.",
        coords: [-25.5201, -48.5065],
        link: "mercado.html"
      },
      {
        nome: "Rua da Praia",
        descricao: "Orla histórica com os casarios coloniais mais antigos do Paraná.",
        coords: [-25.5218, -48.5060],
        link: "mercado.html"
      },
      {
        nome: "Ilha dos Valadares",
        descricao: "Berço cultural do Fandango Caiçara e artesanato local.",
        coords: [-25.5225, -48.4980],
        link: "arte.html"
      },
      {
        nome: "Museu MAE - UFPR",
        descricao: "Antigo Colégio dos Jesuítas (1755), acervo histórico da região.",
        coords: [-25.5230, -48.5085],
        link: "arte.html"
      }
    ];

    locais.forEach(lugar => {
      L.marker(lugar.coords)
        .addTo(mapa)
        .bindPopup(`
          <div class="popup">
            <h3>${lugar.nome}</h3>
            <p>${lugar.descricao}</p>
            <a href="${lugar.link}">Saber mais</a>
          </div>
        `);
    });
  }

  const epocas = {
    1: {
      titulo: "1871-1872 — O Primeiro Mercado (Mercado do Peixe)",
      imagem: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      resumo: "Inauguração do prédio original do Mercado Público à beira da baía, criado para organizar a comercialização de pescados frescos e produtos vindos das comunidades e ilhas da região."
    },
    2: {
      titulo: "1914 — Mercado do Café",
      imagem: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=800&q=80",
      resumo: "Construção do prédio do Mercado do Café com arquitetura de inspiração neoclássica, acompanhando a forte expansão econômica provocada pelo ciclo e exportação do café na região do Porto."
    },
    3: {
      titulo: "Anos 1980-1990 — Patrimônio Histórico",
      imagem: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      resumo: "Reconhecimento oficial e tombamento dos prédios do complexo do Mercado como Patrimônio Histórico do Estado do Paraná, assegurando a preservação de sua estrutura arquitetônica."
    },
    4: {
      titulo: "Anos 2000 — Revitalização e Novos Usos",
      imagem: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      resumo: "O complexo passa por processos de restauro e modernização interna. O Mercado do Café passa a focar na venda de artesanato tradicional caiçara e souvenir."
    },
    5: {
      titulo: "Dias Atuais — Polo Gastronômico e Turístico",
      imagem: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      resumo: "Hoje o conjunto atua como o principal centro gastronômico e cultural do centro histórico de Paranaguá, ponto obrigatório para degustar o tradicional Barreado e comprar frutos do mar."
    }
  };

  const container = document.querySelector('.timeline-component');

  if (container) {
    const nodes = container.querySelectorAll('.point-node');
    const cardTitle = container.querySelector('#timelineCardTitle');
    const cardImage = container.querySelector('#timelineCardImage');
    const cardDescription = container.querySelector('#timelineCardDescription');

    function selecionarEpoca(id) {
      const dados = epocas[id];
      if (!dados) return;

      if (cardTitle) cardTitle.textContent = dados.titulo;
      if (cardImage) cardImage.src = dados.imagem;
      if (cardDescription) cardDescription.textContent = dados.resumo;

      nodes.forEach(node => {
        if (node.getAttribute('data-id') === id.toString()) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });
    }

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        const id = node.getAttribute('data-id');
        selecionarEpoca(id);
      });
    });

    selecionarEpoca(1);
  }
});