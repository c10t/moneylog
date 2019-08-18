export interface SampleCsvDef {
  allSampleCsv: {
    edges: [{
      node: SampleCsvRecord
    }]
  }
}

export interface SampleCsvRecord {
  id: number
  date: Date
  category: string
  amount: number
  y: string
  m: string
  d: string
}

export const getRecord = (gql: SampleCsvDef): SampleCsvRecord[] => gql.allSampleCsv.edges.map(n => ({ ...n.node }))
