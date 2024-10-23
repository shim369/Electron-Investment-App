import Home from '@renderer/pages/Home'
import { Routes, Route } from 'react-router-dom'

const MyRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home investments={[]} />} />
    </Routes>
  )
}

export default MyRouter
