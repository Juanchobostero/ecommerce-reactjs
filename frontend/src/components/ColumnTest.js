import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";

const ColumnTest = ({ type, enabledOnSeries, colors, categories  }) => {

    const [chart, setChart] = useState({
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: [2020, 2021, 2022]
          }
        },
        series: [
          {
            name: "series-1",
            data: [30, 40, 45, 50, 49, 60, 70, 91]
          }
        ]
    });

    useEffect(() => {
      setChart({
        series: [{
            name: 'PRODUCT A',
            data: [44, 55, 41, 67, 22, 43, 21, 49, 50]
          }, {
            name: 'PRODUCT B',
            data: [36, 25, 39, 13, 58, 37, 59, 31, 30]
          }],
          options: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              stackType: type,
              toolbar: {
                show: false
              },
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: true,
              enabledOnSeries: enabledOnSeries,
              offsetY: -20,
              style: {
                fontSize: '12px',
                colors: ['#ffffff'],
              },
            },
            tooltip: {
              enabled: false,},
            grid: {
              borderColor:"#444152"
            },
            plotOptions: {
              bar:{
                columnWidth: '50%', }},
            colors: colors,
            responsive: [{
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }],
            xaxis: {
              trim:true,
              show:true,
              axisTicks:{show:false},
              axisBorder:{show:false},
              tooltip: {
                  enabled: false
              },
              categories: categories,
              labels: {
                style: {
                    colors: '#e5e5e5',
                    fontSize: '11px'
                  }},
            },
            yaxis:{
              tickAmount:5,
              min:0,
              labels: {
                  style: {
                      colors: '#e5e5e5',
                      fontSize: '10px'
                    },}
            },
            fill: {
              opacity: 1
            },
            legend: {
              position: 'bottom',
              offsetX: 0,
              offsetY: 50
            },
          },
      })
    }, [chart, type, categories, colors, enabledOnSeries]);
    

    return (
        <>
            <h1>Chart TEST</h1>
            <hr></hr>
            <Chart 
                options={chart.options} 
                series={chart.series} 
                type='bar'
                height={'90%'} 
                width={'100%'} 
                className='text-black'
            />
        </>

    )
}

export default ColumnTest