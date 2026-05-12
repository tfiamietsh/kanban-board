import Item from './item'

export default class Board {
  private _name: string
  private _itemsByColumn: Map<string, Item[]> = new Map()

  constructor(name: string) {
    this._name = name
  }

  public get name(): string {
    return this._name
  }

  public addColumn(column: string) {
    this._itemsByColumn.set(column, [])
  }

  public get columns(): string[] {
    return Array.from(this._itemsByColumn.keys())
  }

  public addItem(column: string, item: Item) {
    const items: Item[] = this._itemsByColumn.get(column)

    if (items)
      items.push(item)
  }

  public getItemsByColumn(column: string): Item[] {
    return this._itemsByColumn.get(column)
  }
}
