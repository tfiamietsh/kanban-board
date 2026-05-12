import type { FC } from 'preact/compat'
import { login } from '../../api/auth'
import Modal from './modal'

interface ILoginModalProps {
  isVisible: boolean
  onClose: () => void
}

const LoginModal: FC<ILoginModalProps> = ({ isVisible, onClose }: ILoginModalProps) => {
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
      labels={['Email', 'Password']}
      btnText="Login"
      onSubmit={(data: Map<string, string>) => parseData(data)}
      onClose={onClose}
    />
  )
}

export default LoginModal
