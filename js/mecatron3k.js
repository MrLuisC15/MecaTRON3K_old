/**
  @file Controlador principal del Juego MecaTRON-3000
  @author Miguel Jaque <mjaque@fundacionloyola.es>
  @license GPL v3 2021
**/

'use strict'

/**
  Controlador principal del juego.
**/
class Juego{
  /**
    Constructor de la clase Juego
  **/
  constructor(){
    this.vista = new Vista()
    this.modelo = new Modelo()
    this.generadorPalabras = null
    this.animador = null
    this.divPrincipal = null
    this.esPausa = false
    window.onload = this.iniciar.bind(this)
  }
  /**
    Pone en marcha el juego.
  **/
  iniciar(){
    console.log('Iniciando...')
    this.divPrincipal = document.getElementById('divPrincipal')
    this.vista.div = this.divPrincipal
    this.generadorPalabras = window.setInterval(this.generarPalabra.bind(this), 3000)
    this.animador = window.setInterval(this.vista.moverPalabras.bind(this.vista), 300)
    window.onkeypress = this.pulsar.bind(this)
  }

  generarPalabra(){
    let nuevaPalabra = this.modelo.crearPalabra()
    this.vista.dibujar(nuevaPalabra)
  }

  /**
    Evento de atención a la pulsación del teclado.

    Busca las palabras que tienen la letra pulsada y cambia su estado.
    Cambiando el estilo y moviendo las letras de un sitio a otro.
    @param {KeyboardEvent} evento Evento de pulsación del teclado.
  **/
  pulsar(evento){
    let letraPulsada = evento.key
    if(this.esPausa==false) {

      //Busco todas las palabras
      let palabras = this.divPrincipal.querySelectorAll('.palabra')
      for(let palabra of palabras){
        let span = palabra.children.item(0)
        let nodoTexto = palabra.childNodes[1]
        let textoRestante = nodoTexto.nodeValue
        let primeraLetraTextoRestante = textoRestante.charAt(0)
        if (letraPulsada == primeraLetraTextoRestante){
          span.textContent += letraPulsada
          nodoTexto.nodeValue = textoRestante.substring(1)

          //Si ha completado la palabra, la elimino y sumo puntos
          if (nodoTexto.nodeValue.length == 0){
            this.modelo.sumarPunto(palabra)
            palabra.remove()
            this.vista.puntuacion.puntos = this.modelo.puntuacion
            this.vista.puntuacion.mostrar()
          }
        }
        else{
          //Ha fallado, repongo el texto de la palabra
          nodoTexto.nodeValue = span.textContent + nodoTexto.nodeValue
          span.textContent = ''
        }
      }
    }

    if(letraPulsada== ' ') {
      this.pausa()
    }

  }

  /**
   * Función que pausa/reanuda el juego
   */
  pausa(){
    
    if(this.esPausa == false){
      this.esPausa = true
      window.clearInterval(this.generadorPalabras)
      window.clearInterval(this.animador)
      console.log('Juego Pausado');
    }
    else {
      this.esPausa = false
      this.generadorPalabras = window.setInterval(this.generarPalabra.bind(this), 3000)
      this.animador = window.setInterval(this.vista.moverPalabras.bind(this.vista), 300)
      console.log('Juego Reanudado');
    }
  }

}

/**
  Clase Vista que muestra el juego.
**/
class Vista{
  constructor(){
    this.div = null   //Div donde se desarrolla el juego
    this.puntuacion = new Puntuacion(0)
  }
  /**
    Dibuja el área de juego.
    @param palabra {String} La nueva palabra.
  */
  dibujar(palabra){
    // <div class=palabra>Meca</div>
    let div = document.createElement('div')
    this.div.appendChild(div)
    let span = document.createElement('span')
    div.appendChild(span)
    div.appendChild(document.createTextNode(palabra))
    div.classList.add('palabra')
    div.style.top = '0px'
    div.style.left = Math.floor(Math.random() * 85) + '%'
  }
  /**
    Mueve las palabras del Juego
  **/
  moverPalabras(){
    //Busco todas las palabras del div
    let palabras = this.div.querySelectorAll('.palabra')

    //Para cada palabra, aumento su atributo top.
    for(let palabra of palabras){
      let top = parseInt(palabra.style.top)
      top += 5
      palabra.style.top = `${top}px`
      //Si ha llegado al final
      if (top >= 760)
        palabra.remove()
    }
  }
}

/**
  Modelo de datos del juego.
**/
class Modelo{
  constructor(){
    this.puntuacion = 0
    this.palabras = []
    this.palabras[0] = ['En', 'un', 'lugar', 'de', 'La', 'Mancha']
    this.palabras[1] = ['ju', 'fr', 'fv', 'jm', 'fu', 'jr', 'jv', 'fm']
    this.palabras[2] = ['fre', 'jui', 'fui', 'vie', 'mi', 'mery', 'huy']
    this.palabras[3] = ['juan', 'remo', 'foca', 'dedo', 'cate']
    this.nivel = 0
  }
  /**
    Devuelve una nueva palabra.
    Devuelve aleatoriamente unn elemento del array de palabras.
    @return {String} Palabra generada
  **/
  crearPalabra(){
    return this.palabras[this.nivel][Math.floor(Math.random() * this.palabras.length)]
  }

  /**
   * Suma la puntuación y sube nivel cada 10 puntos
   * @param {*} palabra Introduce el elemento para contar la longitud y dar los puntos según su longitud
   */
  sumarPunto(palabra){
    for(let i=0;i<palabra.childNodes[0].innerHTML.length;i++){
      this.puntuacion++
    };
    
    if (this.puntuacion>=10 && this.nivel <3) {
      this.subirNivel()
      
    }
    
  }

  /**
   * Función para subir nivel y resetear la puntuación a 0
   */
  subirNivel(){
    if(this.nivel!=3){
      this.nivel++
      this.puntuacion=0
    }
  }

  /**
   * Función para bajar nivel
   */
  bajarNivel(){
    if(this.nivel!=0){
      this.nivel--
    }
  }
}

/**
 * Clase puntuación del juego
 */
class Puntuacion{
  constructor(puntos){
    this.puntos = puntos
  }

  /**
   * Envía la puntuación al span de puntuación
   */
  mostrar(){
    let spanPuntuacion = document.getElementById('puntuacion')
    spanPuntuacion.innerHTML = this.puntos
    spanPuntuacion.style.color = 'green'

    setTimeout(() => {
      spanPuntuacion.style.color='black'
    }, 1500);
  }

}

var app = new Juego()
