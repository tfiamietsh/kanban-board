import type { FC } from 'preact/compat'
import { register } from '../../api/auth'
import Modal from './modal'

interface IRegistrationModalProps {
  isVisible: boolean
  onClose: () => void
}

const RegistrationModal: FC<IRegistrationModalProps> = ({ isVisible, onClose }: IRegistrationModalProps) => {
  const parseData = async (data: Map<string, string>) => {
    return register(data.get('email'), data.get('password'))
      .then((result) => console.log('reg returned:', result))
      .catch(err => {
        console.error('reg error:', err)
        return err
      })
  }

  return (
    isVisible &&
    <Modal
      title="Registration"
      fields={['email', 'password']}
      types={['text', 'password']}
      labels={['Email', 'Password']}
      btnText="Register"
      onSubmit={(data: Map<string, string>) => parseData(data)}
      onClose={onClose}
    />
  )
}

export default RegistrationModal
