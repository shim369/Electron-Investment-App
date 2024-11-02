import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Investment } from '@renderer/types/investment'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Line as ChartLine } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import formatDate from '../utils/formatDate'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  initialInvestments?: Investment[]
}

const Home: React.FC<Props> = ({ initialInvestments = [] }) => {
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments)
  const printRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ChartJS<'line'> | null>(null)

  useEffect(() => {
    const storedInvestments = localStorage.getItem('investments')
    if (storedInvestments) {
      try {
        const parsedInvestments: Investment[] = JSON.parse(storedInvestments).map((investment) => ({
          ...investment,
          purchaseDate: new Date(investment.purchaseDate)
        }))
        if (JSON.stringify(parsedInvestments) !== JSON.stringify(investments)) {
          setInvestments(parsedInvestments)
        }
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error)
      }
    } else {
      localStorage.setItem('investments', JSON.stringify(initialInvestments))
      setInvestments(initialInvestments)
    }
  }, [initialInvestments])

  const calculateProfit = (investment: Investment) => {
    const profitPerUnit = investment.currentPrice - investment.purchasePrice
    return profitPerUnit * investment.amount
  }

  const calculateTotalProfit = () => {
    return investments.reduce((total, investment) => total + calculateProfit(investment), 0)
  }

  const monthlyProfits = useMemo(() => {
    const monthlyData: { [key: string]: number } = {}
    investments.forEach((investment) => {
      const monthYear = investment.purchaseDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit'
      })
      const profit = (investment.currentPrice - investment.purchasePrice) * investment.amount
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + profit
    })

    return Object.entries(monthlyData)
      .map(([date, profit]) => ({ date, profit }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [investments])

  const chartData = {
    labels: monthlyProfits.map((entry) => entry.date),
    datasets: [
      {
        label: 'Monthly Profit',
        data: monthlyProfits.map((entry) => entry.profit),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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

  const handlePrint = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    })

    if (printRef.current) {
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true })
      const containerImage = canvas.toDataURL('image/png')

      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      doc.addImage(containerImage, 'PNG', 10, 30, imgWidth, imgHeight)
    } else {
      console.error('Print reference is null')
    }

    doc.save('investment_portfolio.pdf')
  }

  return (
    <div className="container">
      <button className="btn btn-primary mb-3" onClick={handlePrint}>
        Print to PDF
      </button>
      <div ref={printRef}>
        <h2 className="my-4">Investment Portfolio</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered mb-4">
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
                  <td>${investment.purchasePrice}</td>
                  <td>${investment.currentPrice}</td>
                  <td>{investment.amount}</td>
                  <td>{formatDate(investment.purchaseDate)}</td>
                  <td>${calculateProfit(investment)}</td>
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
        </div>
        <h2 className="my-4">Monthly Profit Trend</h2>
        <div className="chart-container mb-4">
          <ChartLine ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default Home
