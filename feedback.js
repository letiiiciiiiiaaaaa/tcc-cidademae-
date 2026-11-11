// estrelas
let selectedRating = 0;

document.addEventListener("DOMContentLoaded", () => {
  const estrelas = document.querySelectorAll('.estrela');

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
      if (estrelas[i]) {
        estrelas[i].classList.add('active');
      }
    }
  }

// botao de feedback
  const btnEnviar = document.querySelector('.btn-enviar');

  if (btnEnviar) {
    btnEnviar.addEventListener('click', async (e) => {
      e.preventDefault();

      const textarea = document.querySelector('.feedback-container textarea');
      const mensagem = textarea ? textarea.value.trim() : '';
      const usuarioNome = localStorage.getItem('usuario_nome') || localStorage.getItem('usuarioLogado') || 'Anônimo';

      if (selectedRating === 0) {
        alert('Por favor, selecione quantas estrelas deseja avaliar!');
        return;
      }

      if (!mensagem) {
        alert('Por favor, escreva uma mensagem de feedback antes de enviar!');
        return;
      }

      if (typeof supabaseClient !== 'undefined') {
        const { data, error } = await supabaseClient
          .from('feedbacks')
          .insert([
            {
              usuario_nome: usuarioNome,
              estrelas: selectedRating,
              mensagem: mensagem
            }
          ]);

        if (error) {
          console.error("Erro ao enviar feedback para o Supabase:", error);
          alert('Erro ao enviar feedback: ' + error.message);
          return;
        }

        alert('Muito obrigado! Seu feedback foi enviado com sucesso.');
        
        textarea.value = '';
        selectedRating = 0;
        resetEstrelas();
      } else {
        alert('Feedback registrado localmente! (Conexão Supabase não identificada)');
        textarea.value = '';
        selectedRating = 0;
        resetEstrelas();
      }
    });
  }
});