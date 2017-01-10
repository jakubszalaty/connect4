'use strict'
const ConnectState = require('./ConnectState.js')
const AlphaBetaSearcher = require('./AlphaBetaSearcher.js')


class ConnectSearcher extends AlphaBetaSearcher {

  constructor(startState, isMaximizingPlayerFirst, maximumDepth){
    super(startState, isMaximizingPlayerFirst, maximumDepth)

  }

  buildChildren(parent, value,isRoot){
    // tu jest zamienione
    // rozpoczynam szukanie potomka od samego dolu
    // jesli znajde zajte pole to ide o jeden w gore
    // jak znajde zero to buduje tam potomka
    for (let i = 0; i < 8; i++) {

      for (let j = 7; j >= 0; j--) {

        if(parent._tab[j][i] === 0){
          // zbuduj potomka
          new ConnectState(parent, j,i, value, isRoot)

          break
        }


      }

    }
  }
  get Solutions (){ return this._startState._children }

}

module.exports = ConnectSearcher
