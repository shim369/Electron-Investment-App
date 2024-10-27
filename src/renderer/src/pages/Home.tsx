import React, { useEffect, useState } from 'react'
import { Investment } from '@renderer/types/investment'
import 'bootstrap/dist/css/bootstrap.min.css'

interface Props {
  initialInvestments?: Investment[]
}

const Home: React.FC<Props> = ({ initialInvestments = [] }) => {
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments)
  const [newInvestment, setNewInvestment] = useState<Investment>({
    name: '',
    purchasePrice: 0,
    currentPrice: 0,
    amount: 0,
    purchaseDate: new Date()
  })

  useEffect(() => {
    const storedInvestments = localStorage.getItem('investments')
    if (storedInvestments) {
      try {
        const parsedInvestments: Investment[] = JSON.parse(storedInvestments).map((investment) => ({
          ...investment,
          purchaseDate: new Date(investment.purchaseDate)
        }))
        setInvestments(parsedInvestments)
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error)
        localStorage.setItem('investments', JSON.stringify(initialInvestments))
        setInvestments(initialInvestments)
      }
    } else {
      localStorage.setItem('investments', JSON.stringify(initialInvestments))
      setInvestments(initialInvestments)
    }
  }, [initialInvestments])

  const handleAddInvestment = () => {
    const updatedInvestments = [
      ...investments,
      { ...newInvestment, purchaseDate: new Date(newInvestment.purchaseDate) }
    ]
    setInvestments(updatedInvestments)
    localStorage.setItem('investments', JSON.stringify(updatedInvestments))
    setNewInvestment({
      name: '',
      purchasePrice: 0,
      currentPrice: 0,
      amount: 0,
      purchaseDate: new Date()
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewInvestment((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : parseFloat(value)
    }))
  }

  const calculateProfit = (investment: Investment) => {
    const profitPerUnit = investment.currentPrice - investment.purchasePrice
    return profitPerUnit * investment.amount
  }

  const calculateTotalProfit = () => {
    return investments.reduce((total, investment) => total + calculateProfit(investment), 0)
  }

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }
    return date.toLocaleDateString(undefined, options)
  }

  return (
    <div className="container">
      <h1 className="my-4">投資ポートフォリオ</h1>

      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th>銘柄名</th>
            <th>購入時の価格</th>
            <th>現在の価格</th>
            <th>購入量</th>
            <th>購入日</th>
            <th>利益</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment, index) => (
            <tr key={index}>
              <td>{investment.name}</td>
              <td>¥{investment.purchasePrice}</td>
              <td>¥{investment.currentPrice}</td>
              <td>{investment.amount}</td>
              <td>{formatDate(investment.purchaseDate)}</td>
              <td>¥{calculateProfit(investment)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={5} className="text-end fw-bold">
              合計損益
            </td>
            <td>¥{calculateTotalProfit()}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="mb-3">新しい投資を追加</h2>
      <div className="mb-3">
        <input
          type="text"
          name="name"
          placeholder="銘柄名"
          value={newInvestment.name}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="number"
          name="purchasePrice"
          placeholder="購入時の価格"
          value={newInvestment.purchasePrice}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="number"
          name="currentPrice"
          placeholder="現在の価格"
          value={newInvestment.currentPrice}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="number"
          name="amount"
          placeholder="購入量"
          value={newInvestment.amount}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="date"
          name="purchaseDate"
          value={newInvestment.purchaseDate.toISOString().substring(0, 10)}
          onChange={(e) =>
            setNewInvestment({ ...newInvestment, purchaseDate: new Date(e.target.value) })
          }
          className="form-control mb-2"
        />
        <button onClick={handleAddInvestment} className="btn btn-primary">
          追加
        </button>
      </div>
    </div>
  )
}

export default Home
