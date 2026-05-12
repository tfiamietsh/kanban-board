import type { FC } from 'preact/compat';

interface ITextWithIconButton {
  text: string,
  icon: string,
  onClick: () => void
}

const TextWithIconButton: FC<ITextWithIconButton> = ({text, icon, onClick}: ITextWithIconButton) => {
  return (
    <div class="flex flex-row place-content-between">
      <p>{text}</p>
      <div class="text-center align-middle w-5 cursor-pointer hover:underline" onClick={onClick}>{icon}</div>
    </div>
  )
}

export default TextWithIconButton
