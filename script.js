document.addEventListener("DOMContentLoaded", () => {

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

  setInterval(carrossel, 4000);

  const elementosAnimados = document.querySelectorAll(".esquerda, .direita, .surgir");

  const observador = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("mostrar");
      }
    });
  }, {
    threshold: 0.15
  });

  elementosAnimados.forEach((el) => observador.observe(el));

});

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