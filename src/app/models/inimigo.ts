import { Posicao } from "./posicao";

export interface Inimigo extends Posicao {
    imgUrl: string;
    emTela?: boolean;
}