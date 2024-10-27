declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf'

  interface AutoTableOptions {
    head?: string[][]
    body?: string[][]
    startY?: number
    theme?: 'striped' | 'grid' | 'plain'
    styles?: {
      cellPadding?: number
      fontSize?: number
    }
  }

  export default function autoTable(doc: jsPDF, options: AutoTableOptions): void
}
