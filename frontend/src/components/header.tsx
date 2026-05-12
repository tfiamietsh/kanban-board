import { useState } from "preact/hooks";
import LoginModal from "./modals/login-modal";
import RegistrationModal from "./modals/registration-modal";
import AuthService from "../services/auth-service";

export default function Header() {
  const authService = new AuthService()

  const [isRegModalVisible, setRegModalVisible] = useState(false)
  const [isLoginModalVisible, setLoginModalVisible] = useState(false)
  const [username, setUsername] = useState<string | null>(authService.username)

  return (
    <>
      <div class="m-1 p-1 rounded-md bg-slate-950/50">
        <div class="flex place-content-between">
          <p class="text-2xl">Kanban Board</p>
          {
            !username &&
            <div class="flex gap-2 place-items-center pr-1">
              <p
                class="rounded-sm h-min px-1 hover:underline cursor-pointer"
                onClick={() => {
                  setLoginModalVisible(true)
                  setRegModalVisible(false)
                }}
              >
                Sign in
              </p>
              <p
                class="rounded-sm border h-min px-1 border-dashed hover:border-solid cursor-pointer"
                onClick={() => {
                  setRegModalVisible(true)
                  setLoginModalVisible(false)
                }}
              >
                Register
              </p>
            </div>
          }
          {
            username &&
            <div class="flex gap-2 place-items-center pr-1">
              <p class="px-1">
                {`Hi, ${username}`}
              </p>
              <p
                class="rounded-sm border h-min px-1 border-dashed hover:border-solid cursor-pointer"
                onClick={() => {
                  authService.reset()
                  setUsername(authService.username)
                }}
              >
                Sign out
              </p>
            </div>
          }
        </div>
      </div>
      <RegistrationModal isVisible={isRegModalVisible} onClose={() => setRegModalVisible(false)} />
      <LoginModal isVisible={isLoginModalVisible} onClose={() => {setLoginModalVisible(false)}} />
    </>
  )
}
