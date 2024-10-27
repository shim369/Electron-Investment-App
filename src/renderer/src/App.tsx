import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import MyRouter from './router'
import { useState } from 'react'
import { Investment } from './types/investment'

function App(): JSX.Element {
  const [investments, setInvestments] = useState<Investment[]>([])

  return (
    <>
      <Header />
      <main className="p-4">
        <MyRouter investments={investments} setInvestments={setInvestments} />
      </main>
    </>
  )
}

export default App
