const API_URL = 'https://charadas-five.vercel.app/charadas';

const card_charada = document.getElementById('card_charada');
const charada_pergunta = document.getElementById('charada_pergunta');
const resposta = document.getElementById('resposta');
const ver_resposta = document.getElementById('ver_res');
const ver_charada = document.getElementById('ver_charada');
const nova_charada = document.getElementById('nova_charada');
const resposta_user = document.getElementById('resposta_user');

let charada_atual = null;

async function buscarCharada() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar charada:', error);
    return null;
  }
}

async function novaCharada() {
  const charada = await buscarCharada();
  if (charada) {
    charada_atual = charada;
    charada_pergunta.textContent = charada.charada;
    resposta.textContent = charada.resposta;

    card_charada.classList.remove('flipped');
    resposta.classList.remove('text-gray-700');
    resposta_user.value = '';
    resposta_user.style.display = 'block'; // mostrar input
    
  } else {
    charada_pergunta.textContent = 'Erro ao carregar a charada. Tente novamente.';
    resposta.textContent = 'Erro ao carregar a resposta.';
  }
}



function normalizarTexto(texto) {
  return texto
    .normalize('NFD') // separa letras de acentos
    .replace(/[\u0300-\u036f]/g, '') // remove os acentos
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // remove pontuação
    .trim();
}
ver_resposta.addEventListener('click', () => {
  const resposta_digitada = normalizarTexto(resposta_user.value);
  const resposta_correta = normalizarTexto(charada_atual?.resposta);

  if (resposta_digitada === '') {
    alert('Digite uma resposta antes de ver a resposta!');
    return;
  }

  // separa a resposta correta em palavras e checa se alguma está na resposta digitada
  const palavras_chave = resposta_correta.split(' ').filter(p => p.length > 3); // ignora palavras muito curtas tipo "um", "de", etc.
  const acertou = palavras_chave.some(palavra => resposta_digitada.includes(palavra));

  if (acertou) {
    resposta.classList.remove('text-red-500');
    resposta.classList.add('text-green-500');
  } else {
    resposta.classList.remove('text-green-500');
    resposta.classList.add('text-red-500');
  }

  // Mostrar a resposta e esconder o input
  card_charada.classList.add('flipped');
  resposta_user.style.display = 'none';
});

ver_charada.addEventListener('click', () => {
  card_charada.classList.remove('flipped');
});

nova_charada.addEventListener('click', novaCharada);

// Carrega uma charada ao iniciar
novaCharada();
