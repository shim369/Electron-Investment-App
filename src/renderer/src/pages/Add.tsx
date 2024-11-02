import React, { useState } from 'react'
import { Investment } from '@renderer/types/investment'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface AddProps {
  investments: Investment[]
  setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>
}

const Add: React.FC<AddProps> = ({ investments, setInvestments }) => {
  const [newInvestment, setNewInvestment] = useState<Investment>({
    name: '',
    purchasePrice: 0,
    currentPrice: 0,
    amount: 0,
    purchaseDate: new Date()
  })
  const navigate = useNavigate()

  const fetchCurrentPrice = async () => {
    try {
      const apiKey = import.meta.env.REACT_APP_ALPHA_VANTAGE_API_KEY
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${newInvestment.name}&interval=5min&apikey=${apiKey}`
      )
      const timeSeries = response.data['Time Series (5min)']
      const latestTimestamp = Object.keys(timeSeries)[0]
      const latestPrice = parseFloat(timeSeries[latestTimestamp]['4. close'])

      setNewInvestment((prev) => ({
        ...prev,
        currentPrice: latestPrice
      }))
    } catch (error) {
      console.error('Error fetching current price:', error)
    }
  }

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
    navigate('/')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewInvestment((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : parseFloat(value)
    }))
  }

  return (
    <div className="container">
      <h2 className="my-4">Add New Investment</h2>
      <div className="mb-3">
        <div className="mb-2">
          <label htmlFor="name">Stock Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newInvestment.name}
            onChange={handleChange}
            className="form-control mb-2"
          />
        </div>
        <button onClick={fetchCurrentPrice} className="btn btn-secondary mb-2">
          Fetch Current Price
        </button>
        <div className="mb-2">
          <label htmlFor="purchasePrice">Purchase Price</label>
          <input
            type="number"
            id="purchasePrice"
            name="purchasePrice"
            value={newInvestment.purchasePrice}
            onChange={handleChange}
            className="form-control mb-2"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="currentPrice">Current Price</label>
          <input
            type="number"
            id="currentPrice"
            name="currentPrice"
            value={newInvestment.currentPrice}
            onChange={handleChange}
            className="form-control mb-2"
            readOnly
          />
        </div>
        <div className="mb-2">
          <label htmlFor="amount">Quantity</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={newInvestment.amount}
            onChange={handleChange}
            className="form-control mb-2"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="purchaseDate">Purchase Date</label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={newInvestment.purchaseDate.toISOString().substring(0, 10)}
            onChange={(e) =>
              setNewInvestment((prev) => ({
                ...prev,
                purchaseDate: new Date(e.target.value)
              }))
            }
            className="form-control mb-2"
          />
        </div>
        <button onClick={handleAddInvestment} className="btn btn-primary">
          Add
        </button>
      </div>
    </div>
  )
}

export default Add
