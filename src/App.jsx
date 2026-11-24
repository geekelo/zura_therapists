import { StoreProvider, useStore } from './store'
import Login from './screens/Login'
import Shell from './screens/Shell'

function Frame() {
  const { therapist } = useStore()
  if (!therapist) return <Login />
  return <Shell />
}

export default function App() {
  return (
    <StoreProvider>
      <Frame />
    </StoreProvider>
  )
}
