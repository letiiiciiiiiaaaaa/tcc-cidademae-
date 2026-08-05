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

  const elementosAnimados = document.querySelectorAll(".esquerda, .direita");

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
