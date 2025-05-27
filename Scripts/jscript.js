// Variáveis do jogo
var casas = [9, 9, 9, 9, 9, 9, 9, 9, 9];
var vez = 1; // 1 = Pokémon 1, -1 = Pokémon 2
var contaclique = 0;
var iPontosPokemon1 = 0;
var iPontosPokemon2 = 0;
var iPontosVelha = 0;
var sResposta = "Escolha seu Pokémon!";

// IDs dos Pokémon na API (4 = Charmander, 25 = Pikachu)
var pokemon1Id = 4;
var pokemon2Id = 25;

function verifica(casa) {
    if (casas[casa] == 9) {
        casas[casa] = vez;
        
        if (vez == 1) {
            // Charmander com X pontilhado e foguinho
            document.getElementById("casa" + casa).innerHTML = `
                <div class="charmander-x">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon1Id}.png" alt="Charmander">
                </div>`;
            document.getElementById("trainer1").style.borderColor = "#ff3333";
            document.getElementById("trainer2").style.borderColor = "#ffcc00";
        } else {
            // Pikachu como bolinha com mini Pikachu dentro
            document.getElementById("casa" + casa).innerHTML = `
                <div class="pikachu-o">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon2Id}.png" alt="Pikachu">
                </div>`;
            document.getElementById("trainer2").style.borderColor = "#ff3333";
            document.getElementById("trainer1").style.borderColor = "#ffcc00";
        }
        
        vez *= -1;
        contaclique++;
        confere();
    }
}

function confere() {
    var lGanhou = false;
    var lAcabou = true;
    
    for (var i = 0; i < casas.length; i++) {
        if (casas[i] == 9) lAcabou = false;
    }
    
    if (contaclique == 9) lAcabou = true;
    
    var Soma = [];
    Soma[0] = casas[0] + casas[1] + casas[2];
    Soma[1] = casas[3] + casas[4] + casas[5];
    Soma[2] = casas[6] + casas[7] + casas[8];
    Soma[3] = casas[0] + casas[3] + casas[6];
    Soma[4] = casas[1] + casas[4] + casas[7];
    Soma[5] = casas[2] + casas[5] + casas[8];
    Soma[6] = casas[0] + casas[4] + casas[8];
    Soma[7] = casas[2] + casas[4] + casas[6];
    
    for (var i = 0; i < Soma.length; i++) {
        if (Soma[i] == -3) {
            lGanhou = true;
            sResposta = "Pikachu Venceu!";
            iPontosPokemon2++;
            document.getElementById("pokemon2-score").innerHTML = 
                `Pikachu: ${iPontosPokemon2}`;
            break;
        } else if (Soma[i] == 3) {
            lGanhou = true;
            sResposta = "Charmander Venceu!";
            iPontosPokemon1++;
            document.getElementById("pokemon1-score").innerHTML = 
                `Charmander: ${iPontosPokemon1}`;
            break;
        }
    }
    
    if (!lGanhou && lAcabou) {
        sResposta = "Empate!";
        iPontosVelha++;
        document.getElementById("velha").innerHTML = `Empates: ${iPontosVelha}`;
    }
    
    if (lGanhou || lAcabou) {
        for (var i = 0; i < casas.length; i++) {
            document.getElementById("casa" + i).style.pointerEvents = "none";
            casas[i] = 0;
        }
    }
    
    document.getElementById("resposta").innerHTML = sResposta;
}

function reconeca() {
    for (var i = 0; i < casas.length; i++) {
        document.getElementById("casa" + i).innerHTML = "";
        document.getElementById("casa" + i).style.pointerEvents = "auto";
        casas[i] = 9;
    }
    
    document.getElementById("trainer1").style.borderColor = "#ffcc00";
    document.getElementById("trainer2").style.borderColor = "#ffcc00";
    document.getElementById("resposta").innerHTML = "Escolha seu Pokémon!";
    lGanhou = false;
    lAcabou = false;
    contaclique = 0;
    vez = 1;
}

// Função para mudar os Pokémon
function selecionarPokemon(pokemonJogador, idPokemon) {
    if (pokemonJogador === 1) {
        pokemon1Id = idPokemon;
        document.getElementById("pokemon1-score").innerHTML = 
            `${getPokemonName(idPokemon)}: ${iPontosPokemon1}`;
    } else {
        pokemon2Id = idPokemon;
        document.getElementById("pokemon2-score").innerHTML = 
            `${getPokemonName(idPokemon)}: ${iPontosPokemon2}`;
    }
    reconeca();
}

// Função auxiliar para obter nomes de Pokémon
function getPokemonName(id) {
    const pokemonNames = {
        4: 'Charmander',
        25: 'Pikachu',
        1: 'Bulbasaur',
        7: 'Squirtle',
        150: 'Mewtwo'
        // Adicione mais conforme necessário
    };
    return pokemonNames[id] || `Pokémon ${id}`;
}