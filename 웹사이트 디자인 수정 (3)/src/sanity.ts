import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'ga5mnhcg',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
})
