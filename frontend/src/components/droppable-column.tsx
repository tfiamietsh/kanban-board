import type { FC } from 'preact/compat'
import Item from '../models/item'

interface IPayload {
  id: number
  column: string
}

interface IDropAreaColumnProps {
  column: string
  items: Item[]
  onDrop: (payload: IPayload, targetColumn: string) => void
}

interface IDraggableItemProps {
  column: string
  title: string
  id: number
}

class DragAndDropWrapper {
  private static _onDragStart(event: DragEvent, payload: IPayload) {
    if (!event.dataTransfer)
      return

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify(payload))
  }

  private static _onDragOver(event: DragEvent) {
    event.preventDefault()

    if (event.dataTransfer)
      event.dataTransfer.dropEffect = 'move'
  }

  private static _onDrop(event: DragEvent, onDrop: IDropAreaColumnProps['onDrop'], targetColumn: string) {
    event.preventDefault()

    if (!event.dataTransfer)
      return

    const raw = event.dataTransfer.getData('application/json')

    if (!raw)
      return

    try {
      const payload = JSON.parse(raw) as IPayload

      onDrop(payload, targetColumn)
    } catch (e) {
      console.error("Invalid drag data", e)
    }
  }

  private static _DraggableItem: FC<IDraggableItemProps> = ({ column, title, id }: IDraggableItemProps) => {
    const payload = { id, column }

    return (
      <div
        class="rounded-md border-1 p-1 mt-1 min-w-full"
        draggable={true}
        onDragStart={(event) => this._onDragStart(event, payload)}
      >
        {title}
      </div>
    )
  }

  public static DropAreaColumn: FC<IDropAreaColumnProps> = ({ column, items, onDrop }: IDropAreaColumnProps) => {
    return (
      <div
        class="min-w-48 divide-y"
        onDragOver={this._onDragOver}
        onDrop={(event) => this._onDrop(event, onDrop, column)}
      >
        <div>{column}</div>
        <div>
          {
            items.map((item, i) =>
              <DragAndDropWrapper._DraggableItem key={i} column={column} title={item.title} id={i}/>
            )
          }
          <div class="mt-1 min-w-full text-center">
            <div class="rounded-md cursor-pointer hover:border-1 border-dashed">+</div>
          </div>
        </div>
      </div>
    )
  }
}

export default DragAndDropWrapper.DropAreaColumn
