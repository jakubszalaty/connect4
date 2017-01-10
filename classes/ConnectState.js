'use strict'

const State = require('./State.js')

class ConnectState extends State {

  constructor(...theArgs){
    super()
    this._tab = []

    if(theArgs.length === 1){
      // I konstruktor
      let str   = theArgs[0]

      if( str.length !== 64)
        throw new Error('Wrong string. Must have 64 digits')

      this._id  = str


      for(let  i = 0; i < 8; ++i){
        this._tab[i] = []
        for(let j = 0; j < 8; ++j){

          this._tab[i][j] = parseInt(str[i*8+j])

        }
      }

      this._h = this.ComputeHeuristicGrade()
    }
    else if(theArgs.length === 5){
      // II konstruktor - stworz potomka
      let parent  = theArgs[0]
      let x       = theArgs[1]
      let y       = theArgs[2]
      let val     = theArgs[3]
      let isRoot  = theArgs[4]

      for (let i = 0; i < 8; i++) {
        this._tab[i] = parent._tab[i].slice()
      }

      // jesli istnieje juz jakas wartosc w polu to zwroc ze null
      if(this._tab[x][y]){
        this._isAdmissible = false
        return

      }

      this._tab[x][y] = val

      this._id = parent._id.slice(0,x*8+y) + val + parent._id.slice(x*8+y+1)
      // sami napisac heurestyke
      this._h = this.ComputeHeuristicGrade()
      parent._children.push(this)
      if(!isRoot){
        this._parent = parent
        this._rootMove = parent._parent ? parent._parent.ID : parent.ID
      }else{
        this._parent = null
        this._rootMove = this.ID
      }


    }
    else{
      throw new Error('Wrong params')
    }


  }

  get Tab (){ return this._tab }
  set Tab (value){ this._tab = value }

  // buildChildren(state){}

  Print(){
    console.log(this._tab)
  }

  ComputeHeuristicGrade(){
    let value = 0,
      tmpValue

    // i - rzedy
    // j - kolumny
    // 1 - minimalizuje
    // 2 - maksymalizuje

    for (let i = 0; i < 8; ++i) {

      for (let j = 0; j < 8; ++j) {

        if(this._tab[i][j] !== 0){

          tmpValue = this.checkNeighbours(i,j,this._tab[i][j])
          if(this._tab[i][j] === 2)
            value += tmpValue
          else
            value -= tmpValue

        }
      }
    }
    return value


  }
  checkNeighbours(x,y,value){
    let h = 0,
      directions = [ [0,1],[0,-1],[1,0],[-1,0], [1,1],[1,-1],[1,-1],[-1,-1] ],
      direct,
      way

    for (let i = 0; i < 8; i++) {
      direct = directions[i]
      way = 1
      for (let j = 1; j < 4; j++) {
        let dX = x + direct[0]*j,
          dY = y + direct[1]*j

        if(this._tab[dX] && this._tab[dX][dY] === value){
          way++
        }
        else{
          break
        }
      }
      if(way===1)
        h += 1
      else if(way===2)
        h += 2
      else if(way===3)
        h += 4
      else if(way > 3)
        h = Infinity

    }
    return h

  }
}

module.exports = ConnectState
