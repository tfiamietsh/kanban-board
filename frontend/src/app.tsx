import { Router } from 'preact-router'
import Header from './components/header'
import Footer from './components/footer'
import Home from './pages/home'
import NotFound from './pages/not-found'

export function App() {
  return (
    <div class="min-h-screen bg-linear-[30deg] from-indigo-500 via-purple-400 to-pink-400">
      <div class="flex flex-col max-w-240 mx-auto text-white font-light">
        <Header />
        <main>
          <Router>
            <Home path="/" />
            <NotFound default />
          </Router>
        </main>
        <Footer />
      </div>
    </div>
  )
}
