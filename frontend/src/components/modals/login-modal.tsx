import type { FC } from 'preact/compat'
import { login } from '../../api/auth'
import Modal from './modal'

interface ILoginModalProps {
  isVisible: boolean
}

const LoginModal: FC<ILoginModalProps> = ({ isVisible }: ILoginModalProps) => {
  const parseData = async (data: Map<string, string>) => {
    return login(data.get('email'), data.get('password'))
      .then((result) => console.log('login returned:', result))
      .catch(err => {
        console.error('login error:', err)
        return err
      })
  }

  return (
    isVisible &&
    <Modal
      title="Login"
      fields={['email', 'password']}
      types={['text', 'password']}
      btnText="Login"
      onSubmit={(data: Map<string, string>) => parseData(data)}
    />
  )
}

export default LoginModal
