import React, { Component, useEffect, useState } from "react";
import loadable from "@loadable/component";
const Chart = loadable(() => import("react-apexcharts/src/react-apexcharts"));
const DonutChart = (props) => {
  const [total, setTotal] = useState(props.dataChart.total)
  const [state, setState] = useState({
    series: [],
    options: {
    }
  }
  )
  useEffect(() => {
    setState({
      series: props.dataChart.data,
      options: {
        colors: props.dataChart && props.dataChart.colors ? props.dataChart.colors : ['#009488', '#B58F2E', '#3987b8', '#CC6618'],
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            donut: {
              size: '87%',
              dataLabels: {
                enabled: false
              },
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '22px',
                  label: 'total',
                  fontFamily: 'Rubik',
                  color: '#BCC1C8',
                  offsetY: -5
                },
                labels: [
                ],
                total: {
                  color: '#BCC1C8',
                  fontWeight: 100,
                  show: true,
                  label: 'total',
                  formatter: () => `${props.dataChart.total} ${props.unitMeasure ? props.unitMeasure : props.label}`
                },
                value: {
                  color: "white",
                },
                // value: {
                //   color: "white",
                // },
              }
            }
          }
        },
        labels: props.dataChart && props.dataChart.categories ? props.dataChart.categories : ['Manual'],
        legend: {
          show: false
        },
        fill: {
          type: 'solid',
          colors: props.dataChart && props.dataChart.colors ? props.dataChart.colors : ['#009488', '#B58F2E', '#3987b8', '#CC6618']
        },
        stroke: {
          width: 0
        },
        tooltip: {
          fillSeriesColor: false,
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            return (

              '<div class="arrow_box text-right ">' +

              "<span >" +

              w.globals.labels[seriesIndex] + " </span><br>" +

              "<span >" +

              (props.tooltip == "percentage" ? (
                "<div class='text-right'>" +
                "<p>" + `${w.globals.series[seriesIndex]} ${props.unitMeasure ? props.unitMeasure : props.label}` + " " + "</p>" +
                (parseFloat(((w.globals.series[seriesIndex]) * 100) / props.dataChart.total).toFixed(2)) + "%" + "</span><br>"
                + "</div>")
                : "")

              +

              (props.tooltip == "compare"
                ? JSON.stringify(JSON.parse(w.globals.series[seriesIndex])) + " / " + props.dataChart.total
                : "")
              +
              (props.tooltip == "value"
              ? JSON.stringify(JSON.parse(w.globals.series[seriesIndex]))
              : "")

              + " </span>" +

              "</div>"

            );

          }

        },
        chart: {
          toolbar: {
            show: false
          },
          type: 'donut',
          width: '100%',
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
    });

  }, [props.dataChart])

  return (
    <>
    {!props.loader?
    <> 
      {props.dataChart.data.length > 0 ? <Chart options={state.options} series={state.series} type="donut" height='260px' className="pt-10" /> : <div className="flex items-center text-center h-full justify-center pb-24"><div>No data available for selected parameters</div></div>}</> :<div className="w-full h-full flex pt-24 justify-center"><svg role="status" class="w-8 h-[75%] mr-2 text-[#C6C6C605] animate-spin dark:text-[#C6C6C605] fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg></div> }
    </>
  )
}

export default DonutChart;