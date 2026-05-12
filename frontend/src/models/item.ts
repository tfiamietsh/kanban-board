export default class Item {
  private _title: string
  private _description: string
  private _author: string
  private _assignee: string

  constructor(title: string, description: string, author: string, assignee: string) {
    this._title = title
    this._description = description
    this._author = author
    this._assignee = assignee
  }

  public get title(): string {
    return this._title
  }

  public get description(): string {
    return this._description
  }

  public get author(): string {
    return this._author
  }

  public get assignee(): string {
    return this._assignee
  }
}
