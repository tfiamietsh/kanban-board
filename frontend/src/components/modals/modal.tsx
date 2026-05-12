import { type FC, useState } from 'preact/compat'
import { useLocation } from 'preact-iso'

interface IModalProps {
  title: string
  fields: string[]
  types?: string[]
  labels?: string[]
  btnText: string
  onSubmit: (data: Map<string, string>) => Promise<string | null>
}

const Modal: FC<IModalProps> = ({ title, fields, types, labels, btnText, onSubmit }: IModalProps) => {
  const [formData, setFormData] = useState<Map<string, string>>(
    () => new Map(fields.map(field => [field, '']))
  )
  const [error, setError] = useState<string | null>(null)
  const loc = useLocation()

  const updateFormData = (field: string, value: string) => {
    const newFormData = new Map(formData)

    newFormData.set(field, value)
    setFormData(newFormData)
  }

  const onSubmitAsync = async (event: Event) => {
    event.preventDefault()
    setError(null)

    try {
      const error = await onSubmit(formData)

      if (error)
        setError(error)
      else
        loc.route('/boards')
    } catch (_) {
      setError('Server error')
    }
  }

  return (
    <div class="fixed inset-0 place-items-center mt-32 ${}" role="dialog" aria-modal="true">
      <form
        class="flex flex-col gap-1 relative rounded-lg border p-2 backdrop-blur-sm w-64 h-min"
        onSubmit={onSubmitAsync}
      >
        <div class="flex place-content-between">
          <p class="text-lg">{title}</p>
          <p class="cursor-pointer hover:underline">⨉</p>
        </div>
        {
          fields.map((field, i) =>
            <div>
              { labels?.at(i) && <p>{`${labels[i]}:`}</p> }
              <input
                id={field}
                class="rounded-sm border w-full"
                value={formData.get(field)}
                type={types?.at(i) ?? 'text'}
                onInput={(e: any) => updateFormData(field, e.currentTarget.value)}
              />
            </div>
          )
        }
        {error && <div class="text-red-600 font-bolder">{error}</div>}
        <button
          class="rounded-sm mt-2 border border-dashed hover:border-solid text-center cursor-pointer"
          type="submit"
        >
          {btnText}
        </button>
      </form>
    </div>
  )
}

export default Modal
