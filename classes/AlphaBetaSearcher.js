'use strict'


class AlphaBetaSearcher {

  constructor(startState, isMaximizingPlayerFirst, maximumDepth){
    /// <summary>
    /// Decyduje cze gracz maksymalizujący ma pierwszy ruch.
    /// </summary>
    this._isMaximizingPlayerFirst = isMaximizingPlayerFirst
    /// <summary>
    /// Przetrzymuje oceny (mini-max) aktualnie analizowanego ruchu.
    /// String reprezentuje ruch.
    /// </summary>
    this._movesMiniMaxes = {}

    /// <summary>
    /// Makzymalna głębokość.
    /// </summary>
    this._maximumDepth = maximumDepth

    /// <summary>
    /// Stan startowy.
    /// </summary>
    this._startState = startState

    /// <summary>
    /// Ponowne użycie stanów już raz odwiedzonych.
    /// </summary>
    this.useOfVisited = 0

    /// <summary>
    /// Przechowuje odwiedzone stany.
    /// </summary>
    this._visited = {}


  }
  // get Alpha (){ return this._alpha }
  // set Alpha (value){ this._alpha = value }

  get MaximumDepth (){ return this._maximumDepth }
  get MovesMiniMaxes (){ return this._movesMiniMaxes }
  get Visited (){ return this._visited }

  evaluateMaxState(state,alpha, beta,depth) {
    const startAlpha = alpha
    const startBeta = beta

    const grade = state.ComputeHeuristicGrade()
    let key

    if (!isFinite(grade) || depth >= this._maximumDepth) {
      state.Alpha = grade
      state.Beta = grade

      key = state.ID + ';' + startAlpha + ';' + startBeta + ';' + state.Depth

      this._visited[key] = state
      return grade
    }

    let tempAlpha = -Infinity

    this.buildChildren(state, 2, depth == 0)

    const children = state.Children

    for (let i = 0; i < children.length; i++) {
      const child = children[i]

      key = child.ID + ';' + alpha + ';' + beta + ';' + child.Depth

      //depth is a part of the hashCode
      if (key in this._visited) {
        tempAlpha = this._visited[key].Beta
        this._useOfVisited++
      }
      else {
        tempAlpha = this.evaluateMinState(child, alpha, beta, depth + 0.5)
      }


      if (tempAlpha > alpha) {
        alpha = tempAlpha
        //we are at the top of the tree
        if (state.Parent == null) {
          this.MovesMiniMaxes[child.RootMove] = tempAlpha
        }
      }

      //pruning condition
      if (alpha >= beta) {
        break
      }
    }
    state.Alpha = alpha
    state.Beta = beta

    key = state.ID + ';' + startAlpha + ';' + startBeta + ';' + state.Depth
    this._visited[key] = state

    return alpha
  }

  evaluateMinState(state, alpha, beta, depth) {
    const startAlpha = alpha
    const startBeta = beta
    const grade = state.ComputeHeuristicGrade()
    let key
    if (!isFinite(grade) || depth >= this._maximumDepth) {
      state.Alpha = grade
      state.Beta = grade

      key = state.ID + ';' + startAlpha + ';' + startBeta + ';' + state.Depth

      this._visited[key] = state

      return grade
    }

    let tempBeta = Infinity

    this.buildChildren(state,1, depth == 0)

    let children = state.Children

    for (let i = 0; i < children.length; i++) {
      let child = children[i]

      key = child.ID + ';' + alpha + ';' + beta + ';' + child.Depth

      //depth is a part of the hashCode
      if (key in this._visited) {
        tempBeta = this._visited[key].Alpha
        this.useOfVisited++
      }
      else {
        tempBeta = this.evaluateMaxState(child, alpha, beta, depth + 0.5)
      }

      if (tempBeta < beta) {
        beta = tempBeta
        //we are at the top of the tree
        if (state.Parent == null) {
          this.MovesMiniMaxes[child.RootMove] = tempBeta
        }
      }

      //pruning condition
      if (alpha >= beta) {
        break
      }
    }
    state.Alpha = alpha
    state.Beta = beta

    key = state.ID + ';' + startAlpha + ';' + startBeta + ';' + state.Depth
    this._visited[key] = state

    return beta
  }

  DoSearch() {
    if (this._isMaximizingPlayerFirst) {
      this.evaluateMinState(this._startState, -Infinity, Infinity, 0)
    }
    else {
      this.evaluateMaxState(this._startState, -Infinity, Infinity, 0)
    }
  }


}

module.exports = AlphaBetaSearcher
