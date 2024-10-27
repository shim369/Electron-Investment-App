import React, { useEffect, useState } from 'react'
import { Investment } from '@renderer/types/investment'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface Props {
  initialInvestments?: Investment[]
}

const Home: React.FC<Props> = ({ initialInvestments = [] }) => {
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments)
  const [monthlyProfits, setMonthlyProfits] = useState<{ date: string; profit: number }[]>([])
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

  useEffect(() => {
    const calculateMonthlyProfits = () => {
      const monthlyData: { [key: string]: number } = {}
      investments.forEach((investment) => {
        const monthYear = investment.purchaseDate.toLocaleDateString(undefined, {
          year: 'numeric',
          month: '2-digit'
        })
        const profit = (investment.currentPrice - investment.purchasePrice) * investment.amount
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + profit
      })

      const sortedMonthlyData = Object.entries(monthlyData).map(([date, profit]) => ({
        date,
        profit
      }))
      sortedMonthlyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      setMonthlyProfits(sortedMonthlyData)
    }

    calculateMonthlyProfits()
  }, [investments])

  const chartData = {
    labels: monthlyProfits.map((entry) => entry.date),
    datasets: [
      {
        label: 'Monthly Profit',
        data: monthlyProfits.map((entry) => entry.profit),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Monthly Profit Trend'
      }
    }
  }

  return (
    <div className="container">
      <h1 className="my-4">Investment Portfolio</h1>

      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th>Stock name</th>
            <th>Purchase Price</th>
            <th>Current Price</th>
            <th>Quantity</th>
            <th>Purchase Date</th>
            <th>Profit/Loss</th>
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
              Total Profit/Loss
            </td>
            <td>¥{calculateTotalProfit()}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="my-4">Monthly Profit Trend</h2>
      <div className="chart-container mb-4">
        <Line data={chartData} options={chartOptions} />
      </div>

      <h2 className="mb-3">Add New Investment</h2>
      <div className="mb-3">
        <input
          type="text"
          name="name"
          placeholder="Stock name"
          value={newInvestment.name}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="number"
          name="purchasePrice"
          placeholder="Purchase Price"
          value={newInvestment.purchasePrice}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="number"
          name="currentPrice"
          placeholder="Current Price"
          value={newInvestment.currentPrice}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="number"
          name="amount"
          placeholder="Quantity"
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
          Add
        </button>
      </div>
    </div>
  )
}

export default Home
