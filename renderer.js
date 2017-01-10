'use strict'
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ConnectState = require('./classes/ConnectState.js')
const ConnectSearch = require('./classes/ConnectSearcher.js')
const _ = require('lodash')


// rysowanie connect
let gameStop = false
let bw = 405
let bh = 405
let p = 0
let size = 50.625
let baseTxtX = 6
let baseTxtY = 45

const canvas = document.getElementById('connect')

let context = canvas.getContext('2d')


let connectResults
let index = 0

let computerSign = 1
let playerSign = 2

function findSolutionConnect(string){
  if(!string)
    alert('You have to pass string!')

  if(gameStop)
    return

  let time = new Date()
  let state = new ConnectState(string)
  // false bo kompute minimalizuje bo ma 1
  let search = new ConnectSearch(state,true,3)
  search.DoSearch()

  time = new Date() - time

  document.getElementById('time').textContent = `${time/1000}s`

  // sciezka stanow do rozwiazania
  // let result = search.Solutions[0]
  if(search.Solutions && search.Solutions.length){
    const result = {}
    let max = -Infinity
    let min = Infinity
    for(let key in search.MovesMiniMaxes){
      let value = search.MovesMiniMaxes[key]
      if(!result[value])
        result[value]=[]
      result[value].push(key)
      if(value > max)
        max = value
      if(value < min)
        min = value
    }

    let tmpResult
    if(computerSign == 1){
      // jesli komputer jest graczem minimalizujacym
      let select = parseInt(Math.random()*10 % result[min].length)
      tmpResult = result[min][select]
    }else{
      let select = parseInt(Math.random()*10 % result[max].length)
      tmpResult = result[max][select]
      // jesli komputer jest graczem maksymalizujcym

    }

    for(let  i = 0; i < 8; ++i){
      connectResults[i] = []
      for(let j = 0; j < 8; ++j){

        connectResults[i][j] = parseInt(tmpResult[i*8+j])

      }
    }

  }
  drawConnect()

}

function drawConnect(){
  // document.getElementById('step').textContent = `${connectResults.length-index}/${connectResults.length}`
  // czyszczenie widoku
  context.clearRect(0, 0, canvas.width, canvas.height)

  // grid
  context.beginPath()
  for (let x = 0; x <= bw; x += size) {
    context.moveTo(0.5 + x + p, p)
    context.lineTo(0.5 + x + p, bh + p)
  }


  for (let x = 0; x <= bh; x += size) {
    context.moveTo(p, 0.5 + x + p)
    context.lineTo(bw + p, 0.5 + x + p)
  }
  context.lineWidth=1
  context.strokeStyle = 'black'
  context.stroke()


  context.font = '50px Arial'

  // uzupelnianie wartoscami array
  // connectArray = []

  // for (var i = 0; i < rows.length; i++) {
  //   connectArray.push(rows[i].querySelector('input').value.split(','))
  // }
  let connectArray = connectResults

  for (let i = 0; i < connectArray.length; i++) {
    let posX =  baseTxtX + size * i

    for (let j = 0; j < connectArray[i].length; j++) {
      if (connectArray[j][i] && connectArray[j][i] !== 0){
        let posY = baseTxtY + size * j
        let sign = connectArray[j][i] === 1 ? 'X' : 'O'
        context.fillText(sign,posX,posY)
      }
    }
  }

  isWinner()
}

// 1 to X - minimalizuje
// 2 to O - maksymalizauje
connectResults = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
]

drawConnect()

const play = document.getElementById('play')


play.addEventListener('click',function(event){
  // let string = data.value
  // findSolutionConnect(string)
  gameStop=false
  drawConnect()
})

canvas.addEventListener('click',function(event){
  if(gameStop)
    return alert('Game over. Press start')

  const posX = event.x - event.currentTarget.offsetLeft
  const posY = event.y - event.currentTarget.offsetTop

  const x = parseInt(posX / (size-0.5))
  const y = parseInt(posY / (size-0.5))

  if(connectResults[y][x] !== 0){
    return alert('You can not choose this spot')
  }

  // const canPlace = hasNeighbours(y,x,playerSign)
  // if(!canPlace)
  //   return alert('You can not choose this spot')

  connectResults[y][x] = playerSign


  drawConnect()
  setTimeout(()=>{
    findSolutionConnect(connectResults.join(',').replace(/,/g,''))
  },200)

})

function isWinner(){
  let sign, tmpValue,
    value = 0,
    end = false

  for (let i = 0; i < 8; ++i) {

    for (let j = 0; j < 8; ++j) {

      if(connectResults[i][j] !== 0){

        tmpValue = checkNeighbours(i,j,connectResults[i][j])
        if(connectResults[i][j] === 2)
          value += tmpValue
        else
          value -= tmpValue

      }
    }
  }

  if(value == Infinity){
    end = true
    sign = 'O'
  }else if(value == -Infinity){
    end = true
    sign = 'X'
  }

  if(end){
    setTimeout(()=>{
      alert(`The winner is : ${sign}`)
    },200)
    connectResults = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]
    gameStop = true
    // drawConnect()
  }
}

function checkNeighbours(x,y,value){
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

      if(connectResults[dX] && connectResults[dX][dY] === value){
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

function hasNeighbours(x,y,value){
  let h = 0,
    directions = [ [0,1],[0,-1],[1,0],[-1,0], [1,1],[1,-1],[1,-1],[-1,-1] ],
    direct

  for (let i = 0; i < 8; i++) {
    direct = directions[i]
    let j = 1
    let dX = x + direct[0]*j,
      dY = y + direct[1]*j

    if(connectResults[dX] && connectResults[dX][dY] === value){
      h++
    }
  }
  return h

}



