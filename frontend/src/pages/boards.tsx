import { useState, type FC } from 'preact/compat'
import TextWithIconButton from '../components/text-with-icon-button'
import BoardContent from './board-content'
import BoardsService from '../services/boards-service'

interface IBoardsProps {
  selectedBoardIdx?: number
}

const Boards: FC<IBoardsProps> = ({ selectedBoardIdx }: IBoardsProps) => {
  const boardsService = new BoardsService(+selectedBoardIdx)
  const [boardNames, setBoardNames] = useState<string[]>(boardsService.boardNames)

  const addBoard = () => {
    // add new board
    setBoardNames([...boardsService.boardNames])
  }

  return (
    <div class="flex flex-row">
      <aside class="flex gap-1 flex-col min-w-48">
        <div class="mx-1 p-1 rounded-md bg-slate-950/50">
          <TextWithIconButton text="Boards" icon="+" onClick={addBoard}/>
        </div>
        <div class="mx-1 p-1 rounded-md bg-slate-950/50 h-full">
          <ul>
            {
              boardNames.map((boardName, i) =>
                <li key={i} class={boardsService.liStyles[i]}>
                  <a href={`/boards/${i}`}>{boardName}</a>
                </li>
              )
            }
          </ul>
        </div>
      </aside>
      <div class="mr-1 p-1 rounded-md bg-slate-950/50 max-w-191">
        {
          boardsService.hasSelectedBoard() ?
          <BoardContent board={boardsService.selectedBoard} /> :
          <div class="min-w-full min-h-full pl-53 text-left content-center pl-4">
            Create or select board
          </div>
        }
      </div>
    </div>
  )
}

export default Boards
