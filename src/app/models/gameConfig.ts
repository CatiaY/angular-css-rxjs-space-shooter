import { Inimigo } from "./inimigo";
import { Posicao } from "./posicao";

// CONFIGURAÇÕES
export const BORDAS_JOGO: any = {
    top: 440,
    bottom: 20,
    left: -70,
    right: 900
};

export const GAME_CONFIG: any = {
    pontos: 10,
    frameRateAnimacao: 30,    
    intervaloMinimoEntreInimigos: 1300,
    qtdInimigos: 5,
    inimigoPosicaoLeftInicial: 900,
    tiroPosicaoLeftInicial: 0,
    tiroPosicaoAjuste: 20
}

export const JOGADOR: Posicao = {
    bottom: 250,
    left: 20,
    width: 96,
    height: 75,
    velocidade: 20
};

export const TIRO: Posicao = {
    bottom: JOGADOR.bottom,
    left: GAME_CONFIG.tiroPosicaoLeftInicial,
    width: 90,
    height: 20,
    velocidade: 20
};

export const INIMIGO_DEFAULT: Inimigo = {
    left: GAME_CONFIG.inimigoPosicaoLeftInicial,
    bottom: 250,
    width: 84,
    height: 60,
    velocidade: 7,
    imgUrl: 'url("/assets/img/inimigo1.png")',
    animation: 'animacao-inimigo-1 1s steps(3) infinite',    
    emTela: false
}

export const INIMIGOS: Array<Inimigo> = [
    INIMIGO_DEFAULT,
    {     
        left: GAME_CONFIG.inimigoPosicaoLeftInicial,        
        width: 74,
        height: 95,
        velocidade: 5,
        imgUrl: 'url("/assets/img/inimigo2.png")',
        animation: 'animacao-inimigo-2 1s steps(4) infinite'
    },
    {     
        left: GAME_CONFIG.inimigoPosicaoLeftInicial,        
        width: 176,
        height: 70,
        velocidade: 9,
        imgUrl: 'url("/assets/img/inimigo3.png")',
        animation: 'animacao-inimigo-3 1s steps(6) infinite' 
    }
];