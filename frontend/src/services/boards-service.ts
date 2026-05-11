import Board from '../models/board'

export default class BoardsService {
  private static _hoverLiStyle: string = 'hover:underline hover:decoration-dashed'
  private _selectedIdx?: number
  private _boards: Array<Board>

  constructor(selectedIdx: number | null = undefined) {
    this._boards = []

    if (this._isValidIdx(selectedIdx))
      this._selectedIdx = selectedIdx
  }

  public hasSelectedBoard(): boolean {
    return typeof this._selectedIdx == 'number'
  }

  public get selectedBoard(): Board {
    return this._boards[this._selectedIdx]
  }

  public get boardNames(): string[] {
    return this._boards.map((board) => board.name)
  }

  public get liStyles(): string[] {
    const styles: string[] = []

    for (let i = 0; i < this._boards.length; i++)
      styles.push(this._calcLiStyle(i))

    return styles
  }

  private _calcLiStyle(idx: number): string {
    const underlineStyle = idx === this._selectedIdx ? "underline" : BoardsService._hoverLiStyle

    return `w-fit cursor-pointer ${underlineStyle}`
  }

  private _isValidIdx(idx: number | null): boolean {
    return idx !== undefined && idx > -1 && idx < this._boards.length
  }
}
