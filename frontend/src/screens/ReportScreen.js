import React, { useEffect } from 'react';
import { notification } from 'antd';
import { ResponsiveBar } from '@nivo/bar'

const ReportScreen = () => {

    const openNotificationWithIcon = (type) => {
        notification[type]({
          message: 'Welcome admin !',
          description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        });
      };

    useEffect(() => {
      openNotificationWithIcon('info');
    }, []);

    const data = [
      {
        "country": "AD",
        "hot dog": 66,
        "hot dogColor": "hsl(141, 70%, 50%)",
        "burger": 184,
        "burgerColor": "hsl(130, 70%, 50%)",
        "sandwich": 12,
        "sandwichColor": "hsl(291, 70%, 50%)",
        "kebab": 75,
        "kebabColor": "hsl(136, 70%, 50%)",
        "fries": 68,
        "friesColor": "hsl(266, 70%, 50%)",
        "donut": 158,
        "donutColor": "hsl(170, 70%, 50%)"
      },
      {
        "country": "AE",
        "hot dog": 25,
        "hot dogColor": "hsl(333, 70%, 50%)",
        "burger": 187,
        "burgerColor": "hsl(318, 70%, 50%)",
        "sandwich": 186,
        "sandwichColor": "hsl(78, 70%, 50%)",
        "kebab": 85,
        "kebabColor": "hsl(274, 70%, 50%)",
        "fries": 119,
        "friesColor": "hsl(29, 70%, 50%)",
        "donut": 137,
        "donutColor": "hsl(179, 70%, 50%)"
      },
      {
        "country": "AF",
        "hot dog": 7,
        "hot dogColor": "hsl(167, 70%, 50%)",
        "burger": 173,
        "burgerColor": "hsl(185, 70%, 50%)",
        "sandwich": 190,
        "sandwichColor": "hsl(70, 70%, 50%)",
        "kebab": 190,
        "kebabColor": "hsl(324, 70%, 50%)",
        "fries": 168,
        "friesColor": "hsl(311, 70%, 50%)",
        "donut": 55,
        "donutColor": "hsl(196, 70%, 50%)"
      },
      {
        "country": "AG",
        "hot dog": 46,
        "hot dogColor": "hsl(298, 70%, 50%)",
        "burger": 174,
        "burgerColor": "hsl(72, 70%, 50%)",
        "sandwich": 101,
        "sandwichColor": "hsl(219, 70%, 50%)",
        "kebab": 122,
        "kebabColor": "hsl(66, 70%, 50%)",
        "fries": 59,
        "friesColor": "hsl(101, 70%, 50%)",
        "donut": 175,
        "donutColor": "hsl(117, 70%, 50%)"
      },
      {
        "country": "AI",
        "hot dog": 87,
        "hot dogColor": "hsl(166, 70%, 50%)",
        "burger": 150,
        "burgerColor": "hsl(273, 70%, 50%)",
        "sandwich": 10,
        "sandwichColor": "hsl(11, 70%, 50%)",
        "kebab": 184,
        "kebabColor": "hsl(58, 70%, 50%)",
        "fries": 144,
        "friesColor": "hsl(319, 70%, 50%)",
        "donut": 2,
        "donutColor": "hsl(299, 70%, 50%)"
      },
      {
        "country": "AL",
        "hot dog": 118,
        "hot dogColor": "hsl(110, 70%, 50%)",
        "burger": 170,
        "burgerColor": "hsl(164, 70%, 50%)",
        "sandwich": 167,
        "sandwichColor": "hsl(24, 70%, 50%)",
        "kebab": 164,
        "kebabColor": "hsl(208, 70%, 50%)",
        "fries": 103,
        "friesColor": "hsl(259, 70%, 50%)",
        "donut": 9,
        "donutColor": "hsl(330, 70%, 50%)"
      },
      {
        "country": "AM",
        "hot dog": 150,
        "hot dogColor": "hsl(355, 70%, 50%)",
        "burger": 45,
        "burgerColor": "hsl(246, 70%, 50%)",
        "sandwich": 0,
        "sandwichColor": "hsl(160, 70%, 50%)",
        "kebab": 133,
        "kebabColor": "hsl(349, 70%, 50%)",
        "fries": 164,
        "friesColor": "hsl(354, 70%, 50%)",
        "donut": 11,
        "donutColor": "hsl(54, 70%, 50%)"
      }
    ]
    

    return (
        <>
            <h1>Reports</h1>
            <hr></hr>
            <div style={{height: 400}}>
              <ResponsiveBar
                data={data}
                keys={[
                    'hot dog',
                    'burger',
                    'sandwich',
                    'kebab',
                    'fries',
                    'donut'
                ]}
                indexBy="country"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#38bcb2',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#eed312',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'fries'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'sandwich'
                        },
                        id: 'lines'
                    }
                ]}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'country',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'food',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
            />
            </div>
            
        </>
    )
}

export default ReportScreen