// jshint node: true
// jshint esversion: 6
// jshint asi: true

'use strict';

const SudokuState = require('./SudokuState.js')
const SudokuSearch = require('./SudokuSearch.js')
let time = new Date()

// let state = new SudokuState('000300800640800050875000001500070206000090000209080005400000769020008013007005000')
// let state = new SudokuState('045327698839654127672918543496185372218473956753296481367542819984761235521839764')
// let state = new SudokuState('045327698039654127670908543496185372218473956750296481367542819984761235521839764')


let state = new SudokuState('805020630470090052200358004047902500001407026026100047030249710104073200750000403')
let search = new SudokuSearch(state)

search.DoSearch()

time = new Date() - time

console.log(time/1000 + 's')

// sciezka stanow do rozwiazania
let result = search.Solutions[0]


// todo:
// heurestyka  -> mozna wywalic buildchild
// wyswietlanie
// zadanie domowe puzzle przesuwne 3x3
// posortowana plansza 1000x mieszanie i dopiero rozwiazanie
// analogiczznie do tego co bylo
// public PuzzleState(PuzzleState parent, ...)

// this.h = compare heuregradfe()
// this.g = parent.g+1 - musi byc zrobione


while(result !== null){
  console.log()
  result.Print()
  result = result.Parent
}

