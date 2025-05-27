// Lista de Pokémon e suas dicas
const pokemons = [
    {nome: "PIKACHU", dica: "Rato elétrico amarelo"},
    {nome: "CHARIZARD", dica: "Dragão de fogo evolução final"},
    {nome: "BULBASAUR", dica: "Pokémon semente tipo grama"},
    {nome: "SQUIRTLE", dica: "Tartaruga com canhões de água"},
    {nome: "EEVEE", dica: "Pokémon com várias evoluções"},
    {nome: "JIGGLYPUFF", dica: "Pokémon rosa e cantante"},
    {nome: "SNORLAX", dica: "Pokémon dorminhoco gigante"},
    {nome: "GYARADOS", dica: "Pokémon marinho feroz que evolui de Magikarp"},
    {nome: "LUCARIO", dica: "Pokémon tipo lutador/ferro com aura"},
    {nome: "MEWTWO", dica: "Pokémon lendário criado em laboratório"}
];

// Variáveis do jogo
let palavraSecreta;
let dica;
let letrasAcertadas = [];
let letrasErradas = [];
let erros = 0;
const maxErros = 6;

const elementoPalavra = document.getElementById("palavra-secreta");
const elementoDica = document.getElementById("dica");
const elementoMensagem = document.getElementById("mensagem");
const elementoForca = document.getElementById("forca-imagem");
const botaoReiniciar = document.getElementById("reiniciar");

// Teclado
var cLetras1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
var cLetras2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'];
var cLetras3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

// Cria o teclado
function criaTeclado() {
    cria(cLetras1, "tecl1");
    cria(cLetras2, "tecl2");
    cria(cLetras3, "tecl3");
}

function cria(Letra, Tecla) {
    var Linha = document.getElementById(Tecla);
    Linha.innerHTML = ''; // Limpa o teclado antes de recriar
    
    for(var i = 0; i < Letra.length; i++) {
        var btnLetra = document.createElement("input");
        btnLetra.setAttribute("type", "button");
        btnLetra.setAttribute("id", Letra[i]);
        btnLetra.setAttribute("value", Letra[i]);
        btnLetra.style.marginRight = "5px";
        Linha.appendChild(btnLetra);
        
        btnLetra.addEventListener("click", function() {
            let letra = this.value;
            verificaLetra(letra);
            this.disabled = true;
        });
    }
}

// Inicia o jogo
function iniciarJogo() {
    // Escolhe um Pokémon aleatório
    const pokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
    palavraSecreta = pokemon.nome;
    dica = pokemon.dica;
    
    // Reseta variáveis
    letrasAcertadas = [];
    letrasErradas = [];
    erros = 0;
    
    // Inicializa letras acertadas com underscores
    for (let i = 0; i < palavraSecreta.length; i++) {
        letrasAcertadas.push("_");
    }
    
    // Atualiza a interface
    atualizarPalavra();
    elementoDica.textContent = `Dica: ${dica}`;
    elementoMensagem.textContent = "";
    elementoForca.src = "IMGs/forca/0.png"; // Imagem inicial da forca
    criaTeclado(); // Recria o teclado para habilitar todas as teclas
}

// Atualiza a exibição da palavra com traços e letras acertadas
function atualizarPalavra() {
    elementoPalavra.textContent = letrasAcertadas.join(" ");
}

// ve se a letra está na palavra
function verificaLetra(letra) {
    let acertou = false;
    
    // ve se a letra está na palavra secreta
    for (let i = 0; i < palavraSecreta.length; i++) {
        if (palavraSecreta[i] === letra) {
            letrasAcertadas[i] = letra;
            acertou = true;
        }
    }
    
    if (acertou) {
        // ve se o jogador ganhou
        if (!letrasAcertadas.includes("_")) {
            elementoMensagem.textContent = "Parabéns! Você acertou o Pokémon!";
            elementoMensagem.style.color = "#27ae60";
            desabilitarTeclado();
        }
    } else {
        // Adiciona à lista de errados e incrementa erros
        letrasErradas.push(letra);
        erros++;
        atualizarForca();
        
        // ve se o jogador perdeu
        if (erros >= maxErros) {
            elementoMensagem.textContent = `Game Over! O Pokémon era ${palavraSecreta}`;
            elementoMensagem.style.color = "#e74c3c";
            desabilitarTeclado();
        }
    }
    
    atualizarPalavra();
}

// Atualiza a imagem da forca baseado nos erros
function atualizarForca() {
    // Muda a imagem conforme o número de erros
    elementoForca.src = `IMGs/forca/${erros}.png`;
}

// Desabilita o teclado quando o jogo termina
function desabilitarTeclado() {
    document.querySelectorAll('input[type="button"]').forEach(btn => {
        btn.disabled = true;
    });
}

// Evento para reiniciar o jogo
botaoReiniciar.addEventListener("click", iniciarJogo);

// Inicia o jogo quando a página carrega
window.onload = iniciarJogo;