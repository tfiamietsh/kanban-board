import type { FC } from 'preact/compat'

const NotFound: FC = () => {
  return (
    <div class="mx-1 p-1 rounded-md bg-slate-950/50 text-center content-center">
      <div class="text-xl">
        404
      </div>
      <div>
        Page not found
      </div>
    </div>
  )
}

export default NotFound
