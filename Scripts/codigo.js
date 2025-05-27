// Variáveis do jogo
let pokemonAtual = null;
let tentativasRestantes = 3;
let pontuacao = 0;
let geracaoSelecionada = 'all';

// Elementos do DOM
const pokemonImage = document.getElementById('pokemon-image');
const dicaElement = document.getElementById('dica');
const opcoesContainer = document.getElementById('opcoes-container');
const respostaInput = document.getElementById('resposta-input');
const enviarRespostaBtn = document.getElementById('enviar-resposta');
const proximoPokemonBtn = document.getElementById('proximo-pokemon');
const resultadoElement = document.getElementById('resultado');
const pontuacaoElement = document.getElementById('pontuacao');
const tentativasElement = document.getElementById('tentativas');
const geracaoSelector = document.getElementById('geracao');

// Função para carregar um Pokémon aleatório
async function carregarPokemon() {
    try {
        // Resetar estado do jogo
        pokemonImage.classList.remove('revealed');
        pokemonImage.src = '';
        respostaInput.value = '';
        resultadoElement.textContent = '';
        opcoesContainer.innerHTML = '';
        tentativasRestantes = 3;
        tentativasElement.textContent = `Tentativas restantes: ${tentativasRestantes}`;
        proximoPokemonBtn.style.display = 'none';
        
        // Determinar o intervalo de IDs com base na geração selecionada
        let minId = 1;
        let maxId = 1010; // Até a geração 9
        
        if (geracaoSelecionada !== 'all') {
            const geracao = parseInt(geracaoSelecionada);
            // Definir os intervalos de ID para cada geração
            const intervalos = [
                {min: 1, max: 151},    // Geração 1
                {min: 152, max: 251},  // Geração 2
                {min: 252, max: 386},  // Geração 3
                {min: 387, max: 493},  // Geração 4
                {min: 494, max: 649},  // Geração 5
                {min: 650, max: 721},  // Geração 6
                {min: 722, max: 809},  // Geração 7
                {min: 810, max: 905},  // Geração 8
                {min: 906, max: 1010}  // Geração 9
            ];
            
            minId = intervalos[geracao - 1].min;
            maxId = intervalos[geracao - 1].max;
        }
        
        // Gerar um ID aleatório dentro do intervalo
        const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
        
        // Carregar dados do Pokémon da PokeAPI
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();
        
        // Determinar a imagem
        let imagemPokemon = data.sprites.other?.['official-artwork']?.front_default || 
                          data.sprites.other?.dream_world?.front_default || 
                          data.sprites.front_default || 
                          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
        
        pokemonAtual = {
            id: data.id,
            nome: data.name,
            tipos: data.types.map(t => t.type.name),
            imagem: imagemPokemon
        };
        
        // Configurar a imagem
        pokemonImage.src = pokemonAtual.imagem;
        pokemonImage.onerror = function() {
            this.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonAtual.id}.png`;
            this.onerror = function() {
                this.src = 'https://via.placeholder.com/200x200?text=Pokémon';
            };
        };
        
        // Exibir dica
        dicaElement.textContent = `Tipo: ${pokemonAtual.tipos.join(', ')} | Geração: ${determinarGeracao(pokemonAtual.id)}`;
        
        // Gerar opções de múltipla escolha
        await gerarOpcoesMultiplaEscolha();
        
    } catch (error) {
        console.error('Erro ao carregar Pokémon:', error);
        resultadoElement.textContent = 'Erro ao carregar Pokémon. Tente novamente.';
        pokemonImage.src = 'https://via.placeholder.com/200x200?text=Pokémon';
        pokemonImage.classList.add('revealed');
        proximoPokemonBtn.style.display = 'inline-block';
    }
}

// Função para determinar a geração com base no ID
function determinarGeracao(id) {
    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    if (id <= 721) return 6;
    if (id <= 809) return 7;
    if (id <= 905) return 8;
    return 9;
}

// Função para gerar opções de múltipla escolha
async function gerarOpcoesMultiplaEscolha() {
    try {
        // 3 Pokémon erradas
        let opcoes = [pokemonAtual.nome];
        
        // Determinar o intervalo de IDs com base na geração selecionada
        let minId = 1;
        let maxId = 1010;
        
        if (geracaoSelecionada !== 'all') {
            const geracao = parseInt(geracaoSelecionada);
            const intervalos = [
                {min: 1, max: 151},
                {min: 152, max: 251},
                {min: 252, max: 386},
                {min: 387, max: 493},
                {min: 494, max: 649},
                {min: 650, max: 721},
                {min: 722, max: 809},
                {min: 810, max: 905},
                {min: 906, max: 1010}
            ];
            
            minId = intervalos[geracao - 1].min;
            maxId = intervalos[geracao - 1].max;
        }
        
        // Pega 3 Pokémon aleatórios diferentes doq ta
        while (opcoes.length < 4) {
            const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
            if (randomId === pokemonAtual.id) continue;
            
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = await response.json();
            
            const nome = data.name;
            if (!opcoes.includes(nome)) {
                opcoes.push(nome);
            }
        }
        
        // Embaralhar as opções
        opcoes = opcoes.sort(() => Math.random() - 0.5);
        
        // Criar botões para cada opção
        opcoesContainer.innerHTML = '';
        opcoes.forEach(opcao => {
            const button = document.createElement('button');
            button.className = 'opcao-btn';
            button.textContent = opcao;
            button.addEventListener('click', () => verificarResposta(opcao));
            opcoesContainer.appendChild(button);
        });
        
    } catch (error) {
        console.error('Erro ao gerar opções:', error);
        // Se falhar, usar opções genéricas
        opcoesContainer.innerHTML = `
            <button class="opcao-btn" onclick="verificarResposta('${pokemonAtual.nome}')">${pokemonAtual.nome}</button>
            <button class="opcao-btn" onclick="verificarResposta('pikachu')">Pikachu</button>
            <button class="opcao-btn" onclick="verificarResposta('charizard')">Charizard</button>
            <button class="opcao-btn" onclick="verificarResposta('bulbasaur')">Bulbasaur</button>
        `;
    }
}

// Função para verificar a resposta
function verificarResposta(resposta) {
    if (tentativasRestantes <= 0) return;
    
    const respostaFormatada = resposta.toLowerCase().trim();
    const nomePokemonFormatado = pokemonAtual.nome.toLowerCase().trim();
    
    if (respostaFormatada === nomePokemonFormatado) {
        // Resposta correta
        pontuacao += tentativasRestantes * 10; // Mais pontos se acertar com menos tentativas
        pontuacaoElement.textContent = `Pontuação: ${pontuacao}`;
        resultadoElement.textContent = 'Correto! Parabéns!';
        resultadoElement.style.color = 'green';
        pokemonImage.classList.add('revealed');
        proximoPokemonBtn.style.display = 'inline-block';
    } else {
        // Resposta incorreta
        tentativasRestantes--;
        tentativasElement.textContent = `Tentativas restantes: ${tentativasRestantes}`;
        
        if (tentativasRestantes === 0) {
            resultadoElement.textContent = `Incorreto! O Pokémon era ${pokemonAtual.nome}.`;
            resultadoElement.style.color = 'red';
            pokemonImage.classList.add('revealed');
            proximoPokemonBtn.style.display = 'inline-block';
        } else {
            resultadoElement.textContent = 'Incorreto! Tente novamente.';
            resultadoElement.style.color = 'orange';
            
            if (tentativasRestantes === 2) {
                const primeiraLetra = pokemonAtual.nome.charAt(0).toUpperCase();
                dicaElement.textContent += ` | Começa com: ${primeiraLetra}`;
            }
        }
    }
}
enviarRespostaBtn.addEventListener('click', () => {
    verificarResposta(respostaInput.value);
});

respostaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        verificarResposta(respostaInput.value);
    }
});

proximoPokemonBtn.addEventListener('click', carregarPokemon);

geracaoSelector.addEventListener('change', (e) => {
    geracaoSelecionada = e.target.value;
    carregarPokemon();
});

// Iniciar o jogo
carregarPokemon();