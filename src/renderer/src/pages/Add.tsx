import React, { useState } from 'react'
import { Investment } from '@renderer/types/investment'
import { useNavigate } from 'react-router-dom'

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
        <input
          type="text"
          name="name"
          placeholder="Investment Name"
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
            setNewInvestment((prev) => ({
              ...prev,
              purchaseDate: new Date(e.target.value)
            }))
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

export default Add
