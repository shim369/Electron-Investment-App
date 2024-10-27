import Home from '@renderer/pages/Home'
import { Investment } from '@renderer/types/investment'
import { Routes, Route } from 'react-router-dom'

const initialInvestments: Investment[] = [
  { name: 'Stock A', purchasePrice: 1000, currentPrice: 1200, amount: 50 },
  { name: 'Stock B', purchasePrice: 2000, currentPrice: 1800, amount: 30 },
  { name: 'Stock C', purchasePrice: 1500, currentPrice: 1600, amount: 40 }
]

const MyRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home initialInvestments={initialInvestments} />} />
    </Routes>
  )
}

export default MyRouter
