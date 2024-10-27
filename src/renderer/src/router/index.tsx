import Add from '@renderer/pages/Add'
import Home from '@renderer/pages/Home'
import { Investment } from '@renderer/types/investment'
import { Routes, Route } from 'react-router-dom'

interface MyRouterProps {
  investments: Investment[]
  setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>
}

const MyRouter: React.FC<MyRouterProps> = ({ investments, setInvestments }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/add"
        element={<Add investments={investments} setInvestments={setInvestments} />}
      />
    </Routes>
  )
}

export default MyRouter
