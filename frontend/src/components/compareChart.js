import React, { Component, useEffect, useState } from "react";
import loadable from "@loadable/component";
const Chart = loadable(() => import("react-apexcharts/src/react-apexcharts"));

const CompareChart = (props) => {
  const [state, setState] = useState({
    series: [{
      name: 'Peak',
      type: 'area',
      data: [40, 40, 40, 40, 40, 40, 40],
    }, {
      name: 'Defective pieces',
      type: 'line',
      data: [37, 37, 61, 50, 61, 36, 40],
    }],
    options: {
      grid: {
        borderColor: '#444152',
      },
      legend: {
        show: false,
      },
      chart: {
        zoom: {
          enabled: false,
        },
        height: 300,
        type: 'line',

        toolbar: {
          show: false,
          tools: {
            download: false
          }
        }
      },
      subtitle: {
        text: 'flow in m³',
        colors: '#FFFFFF',
        align: 'left',
        margin: 0,
        offsetX: 0,
        offsetY: 10,
        style: {
          color: '#e5e5e5'
        }
      },
      stroke: {
        curve: 'smooth'
      },
      fill: {
        type: 'solid',
        opacity: [0.35, 2],
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      tooltip: {
        marker: {
          show: false,
        },
        x: {
          show: false,
        },
        theme: false
      },
      xaxis: {
        tooltip: {
          enabled: false
        },
        axisBorder:{
          show:false
        },
        axisTicks: {
          show: false,
        },
        categories: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        labels:{
          style:{
            colors: '#FFFFFF',
          }
        }
      },

      colors: ['#DB5263', '#B58F2E'],

      markers: {
        size: 0,
      },
      yaxis: [
        {
          min: 0,
          max: 80,
          tickAmount: 4,
          labels: {
            style: {
              colors: '#FFFFFF'
            }
          },
        }
      ],
    },


  }
  )

  return (
    <div id="chart" className="h-full">
      <div id="chart-timeline" className="h-full">
        <Chart
          options={state.options}
          series={state.series}
          type="line"
          height={"78%"}
        />

      </div>
    </div>
  );
}


export default CompareChart;
