import React, { Component, useEffect, useState } from "react";
import loadable from "@loadable/component";
const Chart = loadable(() => import("react-apexcharts/src/react-apexcharts"));

let AUDIO      ="0";
let BRAKE_FILL ="0";
let CODECHECK  ="0";
let ECU_SWDL   ="0";
let PCM_SWDL   ="0";
let PREROLLS   ="0";
let ROLLS      ="0";
let STATIC     ="0";
let TPMS_SCAN  ="0";
let AUDIO_E      ="0";
let BRAKE_FILL_E ="0";
let CODECHECK_E  ="0";
let ECU_SWDL_E   ="0";
let PCM_SWDL_E   ="0";
let PREROLLS_E   ="0";
let ROLLS_E      ="0";
let STATIC_E     ="0";
let TPMS_SCAN_E  ="0";





const ColumnBar = (props) => {
  const [state, setState] = useState({
    series: [],
    options: {
    }
  }
  )
  // async componentDidMount (){
  //    await this.datos(this.props.dataChart)
  //   }
  
      // series: [{
      //   name: 'Succeeded',
      //   data: [ECU_SWDL, PCM_SWDL, TPMS_SCAN, AUDIO, STATIC, ROLLS, BRAKE_FILL, PREROLLS, CODECHECK]
      // }, {
      //   name: 'Error',
      //   data: [ECU_SWDL_E, PCM_SWDL_E, TPMS_SCAN_E, AUDIO_E, STATIC_E, ROLLS_E, BRAKE_FILL_E, PREROLLS_E, CODECHECK_E]
              
      // }], 

      useEffect(()=>{
        setState({
          
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
              stackType: props.type,
              toolbar: {
                show: false
              },
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: true,
              enabledOnSeries: props.enabledOnSeries,
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
            colors:props.colors,
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
              categories: props.categories,
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
        
        
        
      }
)
      },[props.dataChart])
     

    //  datos =  (props) =>{
    //       AUDIO      = Math.round((props.AUDIO_Succeeded *100      /props.AUDIO_Arrived))*10/10;         AUDIO_E      = 100-AUDIO;
    //       BRAKE_FILL = Math.round((props.BRAKE_FILL_Succeeded *100 /props.BRAKE_FILL_Arrived))*10/10;    BRAKE_FILL_E = 100-BRAKE_FILL;
    //       CODECHECK  = Math.round((props.CODECHECK_Succeeded *100  /props.CODECHECK_Arrived))*10/10;     CODECHECK_E  = 100-CODECHECK;
    //       ECU_SWDL   = Math.round((props.ECU_SWDL_Succeeded *100   /props.ECU_SWDL_Arrived))*10/10;      ECU_SWDL_E   = 100-ECU_SWDL;
    //       PCM_SWDL   = Math.round((props.PCM_SWDL_Succeeded *100   /props.PCM_SWDL_Arrived))*10/10;      PCM_SWDL_E   = 100-PCM_SWDL;
    //       PREROLLS   = Math.round((props.PREROLLS_Succeeded *100   /props.PREROLLS_Arrived))*10/10;      PREROLLS_E   = 100-PREROLLS;
    //       ROLLS      = Math.round((props.ROLLS_Succeeded *100      /props.ROLLS_Arrived))*10/10;         ROLLS_E      = 100-ROLLS;
    //       STATIC     = Math.round((props.STATIC_Succeeded *100     /props.STATIC_Arrived))*10/10;        STATIC_E     = 100-STATIC;
    //       TPMS_SCAN  = Math.round((props.TPMS_SCAN_Succeeded *100  /props.TPMS_SCAN_Arrived))*10/10;     TPMS_SCAN_E  = 100-TPMS_SCAN;
     
    //       this.setState({
    //         series: [{
    //           name: 'Succeeded',
    //           data: [ECU_SWDL, PCM_SWDL, TPMS_SCAN, AUDIO, STATIC, ROLLS, BRAKE_FILL, PREROLLS, CODECHECK]
    //         }, {
    //           name: 'Error',
    //           data: [ECU_SWDL_E, PCM_SWDL_E, TPMS_SCAN_E, AUDIO_E, STATIC_E, ROLLS_E, BRAKE_FILL_E, PREROLLS_E, CODECHECK_E]
                    
    //         }]
    //       })
    
    //  }

      
        return (
          <div className="text-black h-full">
          <Chart options={state.options} series={state.series} type="bar" height={'90%'} width={'100%'} className="text-black"/>
          </div>
          );
 
}//class ColumnBar

  

export default ColumnBar;