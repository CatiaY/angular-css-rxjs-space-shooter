import { Component } from '@angular/core';
import { fromEvent, interval, Subscription, timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Posicao } from './models/posicao';
import { Inimigo } from './models/inimigo';
import { BORDAS_JOGO, GAME_CONFIG, JOGADOR, TIRO, INIMIGOS, INIMIGO_DEFAULT } from './models/gameConfig';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  fimDeJogo: boolean = true;
  exibirMsgPerdeu: boolean = false;
  pontuacao: number = 0;
    
  estaAtirando: boolean = false;  

  jogador = {... JOGADOR};
  tiro = {... TIRO};
  
  inimigos: Array<Inimigo> = [];
  
  teclaPressionada: Subscription;  
  controladorGameFrames: Subscription;
      
  animacaoPlayer: string = 'animacao-vivo'; 
  
  animacaoExplosao: string = 'paused';
  explosaoLeft: number;
  explosaoBottom: number;
    

  //-------------------------------------------------------------------
  iniciarJogo(): void {    
    this.fimDeJogo = false; 
    this.pontuacao = 0; 
    
    this.animacaoPlayer = 'animacao-vivo';

    if(this.inimigos.length === 0)
      this.criarInimigos();  
  
    this.teclaPressionada = fromEvent(document, 'keydown')    
      .pipe(takeWhile(() => !this.fimDeJogo))
      .subscribe(event => {
        event.preventDefault(); // Previne o comportamento padrão do browser
        this.controlarJogador((event as KeyboardEvent).code);        
    });
     
    const controladorInimigos = interval(GAME_CONFIG.intervaloMinimoEntreInimigos)
      .pipe(takeWhile(() => !this.fimDeJogo))
      .subscribe(i => {
        let indice = i % this.inimigos.length;
        this.inimigos[indice] = {...INIMIGOS[this.obtemNumeroAleatorio(0, GAME_CONFIG.qtdInimigos - 1)]};
        this.inimigos[indice].bottom = this.obtemNumeroAleatorio(BORDAS_JOGO.bottom, BORDAS_JOGO.top);        
        this.inimigos[indice].emTela = true;
      });
    
    this.controladorGameFrames = interval(GAME_CONFIG.frameRateAnimacao)
      .pipe(
        takeWhile(() => !this.fimDeJogo))
      .subscribe(() => {
        this.moverTiro();  
        
        for(let i = 0; i < GAME_CONFIG.qtdInimigos; i++) {
          this.moverInimigo(this.inimigos[i]);
        }
      });
  }


  // //-------------------------------------------------------------------
  gameOver(): void {
    this.fimDeJogo = true;    
    this.exibirMsgPerdeu = true;
    this.removerTiro();
    for(let i = 0; i < GAME_CONFIG.qtdInimigos; i++) {
      this.resetarInimigo(this.inimigos[i]);
    }    

    this.animacaoPlayer = 'animacao-morto';  
  }


  //-------------------------------------------------------------------
  controlarJogador(tecla: string) {
    switch(tecla) {
      case 'ArrowUp':
        this.moverCima();          
        break;
      case 'ArrowDown':
        this.moverBaixo();
        break;
      case "Space":
        this.atirar();
        break;
    }
  }
  

  moverCima(): void {      
    this.jogador.bottom += this.jogador.velocidade;    
    if(this.jogador.bottom > BORDAS_JOGO.top) {
      this.jogador.bottom = BORDAS_JOGO.top;
    }
  }
  

  moverBaixo(): void {
    this.jogador.bottom -= this.jogador.velocidade;    
    if(this.jogador.bottom < BORDAS_JOGO.bottom) {
      this.jogador.bottom = BORDAS_JOGO.bottom;
    }
  }
  
  
  //-------------------------------------------------------------------
  atirar(): void {
    if(this.estaAtirando)
      return;     
    
    this.estaAtirando = true;  
    this.tiro.bottom = this.jogador.bottom + GAME_CONFIG.tiroPosicaoAjuste;
    this.tiro.left = this.jogador.left;
  }

  moverTiro(): void {
    if(!this.estaAtirando)
      return;

    // Saiu da tela
    if (this.tiro.left > BORDAS_JOGO.right) {  
      this.removerTiro();          
    }         
    else {        
      this.tiro.left += this.tiro.velocidade;
    }    
  }

  removerTiro() {        
    this.estaAtirando = false; 
    this.tiro.left = TIRO.left;
  }
  

  //-------------------------------------------------------------------
  criarInimigos(): void {    
    for(let i = 0; i < GAME_CONFIG.qtdInimigos; i++)
    this.inimigos.push({ ...INIMIGO_DEFAULT });    
  }
  
  
  //-------------------------------------------------------------------  
  moverInimigo(inimigo: Inimigo): void {
    if(!inimigo.emTela)
      return;
    
    if (this.estaAtirando && this.checarColisao(inimigo, this.tiro)){ 
      this.pontuacao += GAME_CONFIG.pontos;               
      this.removerTiro();
      this.explodirInimigo(inimigo);      
      this.resetarInimigo(inimigo);      
    }
    // Se o inimigo chegar no lado esquerdo é game over
    else if (inimigo.left < -30) {
      this.gameOver();      
    } 
    else if (this.checarColisao(inimigo, this.jogador)) {
      this.explodirInimigo(inimigo);
      this.gameOver();
    } 
    else {        
      inimigo.left -= inimigo.velocidade;        
    }    
  }

  resetarInimigo(inimigo: Inimigo): void {
    inimigo.left = GAME_CONFIG.inimigoPosicaoLeftInicial;
    inimigo.emTela = false;
  }

  explodirInimigo(inimigo: Inimigo): void {
    this.explosaoBottom = inimigo.bottom;
    this.explosaoLeft = inimigo.left;    
    this.animacaoExplosao = 'running';
    timer(500).subscribe(() => {    
      this.animacaoExplosao = 'paused';
    });
  }


  //-------------------------------------------------------------------  
  checarColisao(obj1: Posicao, obj2: Posicao): boolean {

    if(obj1.left < (obj2.left + obj2.width)
       && (obj1.left + obj1.width) > obj2.left) {

       if(obj1.bottom < (obj2.bottom + obj2.height)
          && (obj1.bottom + obj1.height) > obj2.bottom) {            
            return true;
        } 
        else {          
          return false;
        }
    } 
    else {      
      return false;
    }
  }
  
  
  //-------------------------------------------------------------------
  configurarEstilosPlayer(): any {
    let estilos = {
      'bottom': `${this.jogador.bottom}px`,      
      'left': `${this.jogador.left}px`,      
      'width': `${this.jogador.width}px`,
      'height': `${this.jogador.height}px`
    };
    return estilos;
  }

  configurarEstilosTiro(): any {
    let estilos = {
      'bottom': `${this.tiro.bottom}px`,      
      'left': `${this.tiro.left}px`,
      'width': `${this.tiro.width}px`,
      'height': `${this.tiro.height}px`
    };
    return estilos;
  }

  configurarEstilosInimigo(inimigo: Inimigo): any {        
    let estilos = {
      'bottom': `${inimigo.bottom}px`,      
      'left': `${inimigo.left}px`,
      'width': `${inimigo.width}px`,
      'height': `${inimigo.height}px`,
      'background-image': inimigo.imgUrl,
      'animation': inimigo.animation
    };
    return estilos;
  }


  //-------------------------------------------------------------------
  obtemNumeroAleatorio(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
