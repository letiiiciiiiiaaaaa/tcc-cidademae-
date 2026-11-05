// Variável global para armazenar a nota de 1 a 5 estrelas
let selectedRating = 0;

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Lógica das Estrelas ---
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

  // --- 2. Lógica de Envio do Botão de Feedback ---
  const btnEnviar = document.querySelector('.btn-enviar');

  if (btnEnviar) {
    btnEnviar.addEventListener('click', async (e) => {
      e.preventDefault();

      const textarea = document.querySelector('.feedback-container textarea');
      const mensagem = textarea ? textarea.value.trim() : '';
      const usuarioNome = localStorage.getItem('usuario_nome') || localStorage.getItem('usuarioLogado') || 'Anônimo';

      // Validação das Estrelas
      if (selectedRating === 0) {
        alert('Por favor, selecione quantas estrelas deseja avaliar!');
        return;
      }

      // Validação da Mensagem
      if (!mensagem) {
        alert('Por favor, escreva uma mensagem de feedback antes de enviar!');
        return;
      }

      // Envio para a tabela "feedbacks" no Supabase
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
        
        // Limpa os campos após o envio
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