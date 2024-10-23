import { Investment } from '@renderer/types/investment'
import React from 'react'

interface Props {
  investments: Investment[]
}

const Home: React.FC<Props> = ({ investments }) => {
  return (
    <>
      <ul>
        {investments.map((investment, index) => (
          <li key={index}>
            {investment.name} - 購入時の価格: {investment.purchasePrice}, 現在の価格:{' '}
            {investment.currentPrice}, 購入量: {investment.amount}
          </li>
        ))}
      </ul>
    </>
  )
}

export default Home
