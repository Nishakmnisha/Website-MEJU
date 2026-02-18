export const siteConfig = {
  'mejuvante.ai': { theme: 'ai', logo: 'MEJUVANTE AI' },
  'products.mejuvante.ai': { theme: 'ai', logo: 'MEJUVANTE AI PRODUCTS' },
  'mejuvante.com': { theme: 'germany', logo: 'MEJUVANTE GMBH' },
  'mejuvante.co.in': { theme: 'india', logo: 'MEJUVANTE INDIA' }
}

export type Domain = keyof typeof siteConfig
