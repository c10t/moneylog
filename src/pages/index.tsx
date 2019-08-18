import * as React from 'react'
import { graphql } from "gatsby"
import HTMLHead from '../components/html-head'
import StackedBarChart, { StackedBarRecord } from '../components/molecules/charts/bar-chart/am4-stacked'
import { StackedBarHeader, StackedBarProps } from '../components/molecules/charts/bar-chart/am4-stacked'
import '../layouts/index.css'
import { SampleCsvDef, SampleCsvRecord, getRecord } from '../graphql/sample-csv';

interface IndexProps {
  gqlData: SampleCsvDef
}

const Index: React.FC<IndexProps> = ({ gqlData }) => {
  console.log(gqlData)
  const data = getRecord(gqlData)

    return (
      <>
        <HTMLHead></HTMLHead>
        <section className="section">
          <><StackedBarChart head={head} data={mapper(data)} /></>
          <div className="container">
            {/* <LineChart /> */}
            <p>Container</p>
          </div>
        </section>
        {/*
          <article className="message">
            <div className="message-header">
              <p>Hello World</p>
              <button className="delete" aria-label="delete"></button>
            </div>
            <div className="message-body">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque risus mi</strong>, 
    tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. 
    Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>, 
    in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, 
    id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
            </div>
          </article>
        */}
      </>
  )
}

const head: StackedBarHeader = {
  xLabel: 'yyyymm',
  xTitle: 'Month',
  yTitle: 'Expenditure',
  stackedLabels: []
}

const mapper = (csvRecords: SampleCsvRecord[]): StackedBarRecord[] => {

  // todo: refactor the logic

  const keys = csvRecords.reduce((acc, val) => {
    const ym = `${val.y}-${val.m}`
    return acc.filter(x => x === ym).length > 0 ? [...acc] : [...acc, ym]
  }, [] as string[])

  const cats = csvRecords.reduce((acc, val) => {
    const cat = stackLabelMapper(val.category)
    return acc.filter(x => x === cat).length > 0 ? [...acc] : [...acc, cat]
  }, [] as string[])

  let stacked = new Map<string, Map<string, number>>()

  for (let k of keys) {
    let innerMap =  new Map<string, number>()
    for (let c of cats) {
      stacked.set(k, innerMap.set(c, 0))
    }
  }

  for (let r of csvRecords) {
    const { y, m, category, amount } = r
    const mappedCategory = stackLabelMapper(category)
    const ym = `${y}-${m}`

    let inner = stacked.get(ym)
    if (!inner) {
      continue
    }
    
    const current = inner.get(mappedCategory)
    if (!current) {
      continue
    }
    
    inner.set(mappedCategory, current + amount)
  }

  return Object.entries(stacked).map(([key, value]) => ({
    x: key,
    stacked: value
  }))
}

const stackLabelMapper = (category: string): string => {
  switch (category) {
    case 'Amazon':
      return 'amazon'
    default:
      return 'others'
  }
}

export const IndexQuery = graphql`
  query {
    allSampleCsv {
      edges {
        node {
          id
          date
          category
          amount
          y
          m
          d
        }
      }
    }
  }
`

export default Index
