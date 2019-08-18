import * as React from 'react'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from '@amcharts/amcharts4/themes/kelly'

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_kelly);

export interface StackedBarRecord {
  x: string
  stacked: { [label: string]: number }
}

export interface StackedBarHeader {
  xLabel: string
  xTitle: string
  yTitle: string
  stackedLabels: Array<{label: string, title: string}>
}

export interface StackedBarProps {
  head: StackedBarHeader
  data: StackedBarRecord[]
}

class Am4StackedBar extends React.Component<StackedBarProps> {
  private chart?: am4charts.XYChart

  componentDidMount() {
    const { head, data } = this.props
    this.chart = createChart(head, data)
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    );
  }
}

const createChart = (head: StackedBarHeader, data: StackedBarRecord[]): am4charts.XYChart => {
  let chart = am4core.create("chartdiv", am4charts.XYChart)

  chart.data = data.map(record => ({
      [head.xLabel]: record.x, ...record.stacked
  }))

  const { xLabel, xTitle, yTitle, stackedLabels } = head

  let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
  categoryAxis.dataFields.category = xLabel
  categoryAxis.title.text = xTitle
  categoryAxis.renderer.grid.template.location = 0
  categoryAxis.renderer.minGridDistance = 20

  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
  valueAxis.title.text = yTitle

  stackedLabels.forEach(({label, title}) => {
    let series = {
      [label]: chart.series.push(new am4charts.ColumnSeries())
    }
    series[label].dataFields.valueY = label
    series[label].dataFields.categoryX = xLabel
    series[label].name = title
    series[label].tooltipText = '{name}: [bold]{valueY}[/]'
    series[label].stacked = true
  })

  chart.cursor = new am4charts.XYCursor()

  return chart
}

export default Am4StackedBar
