import { type FC, useState } from 'preact/compat'
import Board from '../models/board'
import Item from '../models/item'
import DropAreaColumn from '../components/droppable-column'

interface IBoardContentProps {
  board: Board
}

const BoardContent: FC<IBoardContentProps> = ({ board }: IBoardContentProps) => {
  const [itemsByColumn, setItemsByColumn] = useState<Map<string, Array<Item>>>(
    () => new Map(board.columns.map(column => [column, board.getItemsByColumn(column)]))
  )

  const moveItem = (itemIdx: number, fromColumn: string, toColumn: string) => {
    board.addItem(toColumn, board.getItemsByColumn(fromColumn)[itemIdx])
    board.getItemsByColumn(fromColumn).splice(itemIdx, 1)
  }

  const onDrop = (itemIdx: number, fromColumn: string, toColumn: string) => {
    const fromList = [...(itemsByColumn.get(fromColumn) ?? [])]
    const toList = [...(itemsByColumn.get(toColumn) ?? [])]
    const [item] = fromList.splice(itemIdx, 1)

    if (!item)
      return
    toList.push(item)

    const next = new Map(itemsByColumn)
    next.set(fromColumn, fromList)
    next.set(toColumn, toList)
    setItemsByColumn(next)
  }

  return (
    <div class="flex flex-col gap-1">
      <div class="overflow-x-auto">
        <div class="flex flex-nowrap cols-5 gap-1 pb-1">
          {
            board.columns.map((column, i) => 
              <DropAreaColumn
                key={i}
                column={column}
                items={itemsByColumn.get(column) ?? []}
                onDrop={({ id, column }, targetColumn) => onDrop(id, column, targetColumn)} />
              )
          }
          <div class="divide-y">
            <div class="px-1 cursor-pointer">+</div>
            <br />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardContent
