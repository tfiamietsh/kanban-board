import { lazy, LocationProvider, Router, Route } from 'preact-iso'
import Header from './components/header'
import Footer from './components/footer'
import NotFound from './pages/not-found'

const Home = lazy(() => import('./pages/home'))
const Boards = lazy(() => import('./pages/boards'))

export function App() {
  return (
    <div class="min-h-screen bg-linear-[30deg] from-indigo-500 via-purple-400 to-pink-400">
      <div class="flex flex-col max-w-240 mx-auto text-white font-light">
        <Header />
        <main>
          <LocationProvider>
            <Router>
              <Route path="/" component={Home} />
              <Route path="/boards/:selectedBoardIdx?" component={Boards} />
              <NotFound default />
            </Router>
          </LocationProvider>
        </main>
        <Footer />
      </div>
    </div>
  )
}
