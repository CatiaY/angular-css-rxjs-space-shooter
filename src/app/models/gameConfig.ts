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
    tiroPosicaoLeftInicial: 0
}

export const JOGADOR: Posicao = {
    bottom: 250,
    left: 20,
    width: 70,
    height: 100,
    velocidade: 20
};

export const TIRO: Posicao = {
    bottom: JOGADOR.bottom,
    left: GAME_CONFIG.tiroPosicaoLeftInicial,
    width: 40,
    height: 30,
    velocidade: 20
};

export const INIMIGOS: Array<Inimigo> = [
    {   
        left: GAME_CONFIG.inimigoPosicaoLeftInicial,        
        width: 40,
        height: 100,
        velocidade: 5,
        imgUrl: 'temp'        
    },
    {     
        left: GAME_CONFIG.inimigoPosicaoLeftInicial,        
        width: 100,
        height: 100,
        velocidade: 7,
        imgUrl: 'temp'        
    },
    {     
        left: GAME_CONFIG.inimigoPosicaoLeftInicial,        
        width: 100,
        height: 50,
        velocidade: 9,
        imgUrl: 'temp'
    }
];

export const INIMIGO_DEFAULT: Inimigo = {
    left: GAME_CONFIG.inimigoPosicaoLeftInicial,
    bottom: 250,
    width: 60,
    height: 100,
    velocidade: 7,
    imgUrl: 'temp',
    emTela: false
}