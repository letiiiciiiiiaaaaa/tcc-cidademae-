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

// Feedback: funcionamento da avaliação por estrelas

  const estrelas = document.querySelectorAll('.estrela');
      let selectedRating = 0;

      estrelas.forEach(estrela => {
          // Efeito visual ao passar o mouse (Hover)
          estrela.addEventListener('mouseover', () => {
              resetEstrelas();
              const value = parseInt(estrela.getAttribute('data-value'));
              highlightEstrelas(value);
          });

          // Restaura a nota clicada se tirar o mouse
          estrela.addEventListener('mouseleave', () => {
              resetEstrelas();
              highlightEstrelas(selectedRating);
          });

          // Fixa a nota ao clicar
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

 // Lista de Eventos Anuais de Paranaguá (Dia e Mês fixos)
// Mês no JS vai de 0 (Janeiro) a 11 (Dezembro)
    const eventosAnuais = [
      // JANEIRO / FEVEREIRO
      {
        mesInicio: 0, diaInicio: 24, // 24/Jan
        mesFim: 1, diaFim: 2,       // 02/Fev
        titulo: 'Festa de Nossa Senhora dos Navegantes',
        descricao: 'Festa tradicional na Ilha dos Valadares e Ilha do Mel com procissão marítima, novenas, quitutes regionais e Fandango Caiçara.',
        link: 'navegantes.html'
      },
      // FEVEREIRO / MARÇO (CARNAVAL)
      {
        mesInicio: 1, diaInicio: 10,
        mesFim: 1, diaFim: 13,
        titulo: 'Carnaval de Paranaguá',
        descricao: 'Desfile das escolas de samba, blocos carnavalescos e bailes populares no Centro Histórico.',
        link: 'carnaval.html'
      },
      // MARÇO / ABRIL
      {
        mesInicio: 2, diaInicio: 25, // Março
        mesFim: 3, diaFim: 2,        // Abril
        titulo: 'Paixão de Cristo Caiçara (Via Sacra)',
        descricao: 'Encenação ao ar livre que percorre as ruas do Centro Histórico relembrando a Semana Santa com tradição caiçara.',
        link: 'paixao-de-cristo.html'
      },
      // MAIO
      {
        mesInicio: 4, diaInicio: 15,
        mesFim: 4, diaFim: 18,
        titulo: 'Festival de Voo Livre (Ilha do Mel) & ExpoSafra',
        descricao: 'Eventos de maio incluindo o Festival de Voo Livre no Morro do Sabão (Ilha do Mel) e feiras de integração municipal.',
        link: 'eventos-maio.html'
      },
      // JUNHO / JULHO
      {
        mesInicio: 5, diaInicio: 26,
        mesFim: 6, diaFim: 12,
        titulo: 'Festa Nacional da Tainha',
        descricao: 'Um dos maiores eventos gastronômicos do Litoral na Praça de Eventos 29 de Julho, com pratos típicos, feiras e shows.',
        link: 'festa-da-tainha.html'
      },
      // JULHO
      {
        mesInicio: 6, diaInicio: 24,
        mesFim: 6, diaFim: 29,
        titulo: 'Aniversário de Paranaguá (378+ anos)',
        descricao: 'Celebração do aniversário da cidade mãe do Paraná com desfile cívico, shows nacionais e feira cultural.',
        link: 'aniversario-paranagua.html'
      },
      // AGOSTO
      {
        mesInicio: 7, diaInicio: 1,
        mesFim: 7, diaFim: 15,
        titulo: 'Mês do Patrimônio & Festa do Fandango Caiçara',
        descricao: 'Programação voltada para a preservação do patrimônio histórico, rodas de fandango caiçara, oficinas e apresentações na Casa Dacheux.',
        link: 'patrimonio-fandango.html'
      },
      {
        mesInicio: 7, diaInicio: 28,
        mesFim: 7, diaFim: 31,
        titulo: 'Paranaguá Motos',
        descricao: 'Encontro de motociclistas reunindo apaixonados por duas rodas na Praça de Eventos com shows de rock e exposição.',
        link: 'paranagua-motos.html'
      },
      // SETEMBRO
      {
        mesInicio: 8, diaInicio: 25,
        mesFim: 8, diaFim: 29,
        titulo: 'Festa de São Francisco das Chagas',
        descricao: 'Tradição religiosa com novenas e festejos comunitários na Igreja de São Francisco das Chagas.',
        link: 'sao-francisco.html'
      },
      // OUTUBRO
      {
        mesInicio: 9, diaInicio: 1,
        mesFim: 9, diaFim: 7,
        titulo: 'Festa de Nossa Senhora do Rosário',
        descricao: 'Celebração da Padroeira do Município de Paranaguá na Catedral Diocesana, com procissão e quermesse.',
        link: 'nossa-senhora-rosario.html'
      },
      // NOVEMBRO
      {
        mesInicio: 10, diaInicio: 6,
        mesFim: 10, diaFim: 16,
        titulo: 'Festa de Nossa Senhora do Rocio',
        descricao: 'Uma das maiores festas religiosas do Brasil em honra à Padroeira do Paraná (15/11), realizada na Praça da Fé.',
        link: 'festa-do-rocio.html'
      },
      // DEZEMBRO
      {
        mesInicio: 11, diaInicio: 23,
        mesFim: 11, diaFim: 31,
        titulo: 'Festa de São Benedito',
        descricao: 'Tradição natalina com alvoradas festivas, novenas, procissão e apresentações culturais no Centro Histórico.',
        link: 'sao-benedito.html'
      }
    ];

// Controle fixo para rodar apenas nos 12 meses
let mesAtualIndex = 0; // Começa em Janeiro (0)

const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function renderizarCalendario() {
  // Atualiza apenas o nome do Mês (Sem o ano)
  document.getElementById('mes-ano-titulo').innerText = nomesMeses[mesAtualIndex];

  // Consideramos um ano genérico não bissexto para montar os dias da semana
  const anoPadrao = 2026; 

  const primeiroDiaSemana = new Date(anoPadrao, mesAtualIndex, 1).getDay();
  const totalDiasNoMes = new Date(anoPadrao, mesAtualIndex + 1, 0).getDate();

  const diasGrid = document.getElementById('dias-grid');
  diasGrid.innerHTML = '';

  // Dias vazios no início do mês
  for (let i = 0; i < primeiroDiaSemana; i++) {
    const divVazia = document.createElement('div');
    divVazia.classList.add('dia-item', 'dia-vazio');
    diasGrid.appendChild(divVazia);
  }

  // Preenche os dias do mês
  for (let dia = 1; dia <= totalDiasNoMes; dia++) {
    const diaElemento = document.createElement('div');
    diaElemento.classList.add('dia-item');
    diaElemento.innerText = dia;

    // Procura se existe algum evento neste dia específico do mês
    const eventoDoDia = eventosAnuais.find(e => {
      // Evento dentro do mesmo mês
      if (e.mesInicio === e.mesFim && e.mesInicio === mesAtualIndex) {
        return dia >= e.diaInicio && dia <= e.diaFim;
      }
      // Evento que começa neste mês e termina no outro
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

// Navegação apenas entre os meses (0 a 11) de forma contínua
document.getElementById('btn-prev').addEventListener('click', () => {
  mesAtualIndex = (mesAtualIndex === 0) ? 11 : mesAtualIndex - 1; // Se passar de Jan volta pra Dez
  renderizarCalendario();
});

document.getElementById('btn-next').addEventListener('click', () => {
  mesAtualIndex = (mesAtualIndex === 11) ? 0 : mesAtualIndex + 1; // Se passar de Dez volta pra Jan
  renderizarCalendario();
});

// Inicializa o calendário
renderizarCalendario();