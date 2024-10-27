import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import MyRouter from './router'

function App(): JSX.Element {
  return (
    <>
      <Header />
      <main className="p-4">
        <MyRouter />
      </main>
    </>
  )
}

export default App
