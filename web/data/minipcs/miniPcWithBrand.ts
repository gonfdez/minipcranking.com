import MiniPcExtractedData from './miniPcExtractedData'

type MiniPcWithBrand = {
  brand: string
  variants: {
    ram: {
      capacityGB: number
      type: string
    }
    storage: {
      type: string
      capacityGB: number
    }
    oferts: {
      url: string
      priceUsd?: number
      warrantyYears?: number
      provider: string // Nuevo campo
    }[]
  }[]
} & MiniPcExtractedData
export default MiniPcWithBrand
