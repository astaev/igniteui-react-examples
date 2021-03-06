<!-- NOTE: do not change this file because it will be auto re-generated from template file: -->
<!-- https://github.com/IgniteUI/igniteui-react-examples/tree/master/templates/sample/ReadMe.md -->

<!-- ## Table of Contents -->
<!-- - [Sample Preview](#Sample-Preview) -->
- [Source Code](#Source-Code)
- [Instructions](#Instructions)

This folder contains implementation of React application with example of Category Chart Markers.
<!-- in the Category Chart component -->
<!-- [Category Chart](https://infragistics.com/Reactsite/components/category-chart.html) -->

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <body>
        <a target="_blank" href="https://codesandbox.io/s/github/IgniteUI/igniteui-react-examples/tree/master/samples/charts/category-chart/markers?fontsize=14&hidenavigation=1&theme=dark&view=preview&file=/src/CategoryChartMarkers.tsx" rel="noopener noreferrer">
            <img height="40px" style="border-radius: 0.25rem" alt="Edit on CodeSandbox" src="https://static.infragistics.com/xplatform/images/sandbox/code.png"/>
        </a>
        <!-- <a target="_blank"
href="https://codesandbox.io/s/github/IgniteUI/igniteui-react-examples/tree/master/samples/maps/geo-map/binding-csv-points?fontsize=14&hidenavigation=1&theme=dark&view=preview">
            <img alt="Edit Sample" src="https://codesandbox.io/static/img/play-codesandbox.svg"/>
        </a> -->
        <!-- <a target="_blank" style="margin-left: 0.5rem"
href="https://codesandbox.io/embed/github/IgniteUI/igniteui-react-examples/tree/master/samples/charts/category-chart/markers?fontsize=14&hidenavigation=1&theme=dark&view=preview&file=/src/CategoryChartMarkers.tsx">
            <img height="40px" style="border-radius: 5px" alt="View on CodeSandbox" src="https://static.infragistics.com/xplatform/images/sandbox/view.png"/>
        </a> -->
        <!-- <a target="_blank"
href="https://codesandbox.io/embed/github/IgniteUI/igniteui-react-examples/tree/master/samples/maps/geo-map/binding-csv-points?fontsize=14&hidenavigation=1&theme=dark&view=preview">
            <img alt="View on CodeSandbox" src="https://static.infragistics.com/xplatform/images/sandbox/view.png"/>
        </a>
https://codesandbox.io/embed/react-treemap-overview-rtb45
https://codesandbox.io/static/img/play-codesandbox.svg
https://codesandbox.io/embed/react-treemap-overview-rtb45?view=browser -->
    </body>
</html>

<!-- ## Sample Preview -->

<!-- <iframe
  src="https://codesandbox.io/embed/github/IgniteUI/igniteui-react-examples/tree/master/samples/charts/category-chart/markers?fontsize=14&hidenavigation=1&theme=dark&view=preview&file=/src/CategoryChartMarkers.tsx"
  style="width:100%; height:400px; border:0; border-radius: 4px; overflow:hidden;"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe> -->

## Source Code

The following section provides source code from:
`./src/CategoryChartMarkers.tsx` file:

```tsx
import { IgrCategoryChart } from 'igniteui-react-charts';
import { IgrCategoryChartModule } from 'igniteui-react-charts';
import * as React from 'react';




IgrCategoryChartModule.register();

export default class CategoryChartMarkers extends React.Component<any, any> {
    public data: any[];

    constructor(props: any) {
        super(props);

        this.state = { chartType: "Line", markersTypes: "Circle" }
        this.initData();
    }

    public render() {
        return (
            <div className="igContainer">
                <div className="igOptions">
                    <span className="igOptions-label">Chart Type: </span>
                    <select value={this.state.chartType}
                        onChange={this.onChartTypeChanged}>
                        <option>Auto</option>
                        <option>Area</option>
                        <option>Column</option>
                        <option>Point</option>
                        <option>Line</option>
                        <option>Spline</option>
                        <option>SplineArea</option>
                        <option>StepArea</option>
                        <option>StepLine</option>
                        <option>Waterfall</option>
                    </select>
                    <span className="igOptions-label"> Marker Type: </span>
                    <select value={this.state.markersTypes}
                        onChange={this.onMarkerTypeChanged}>
                        <option>Automatic</option>
                        <option>Circle</option>
                        <option>Triangle</option>
                        <option>Pyramid</option>
                        <option>Square</option>
                        <option>Diamond</option>
                        <option>Pentagon</option>
                        <option>Hexagon</option>
                        <option>Tetragram</option>
                        <option>Pentagram</option>
                        <option>Hexagram</option>
                        <option>None</option>
                    </select>
                </div>
                <div className="igComponent" style={{height: "calc(100% - 50px)"}} >
                    <IgrCategoryChart
                        width="100%"
                        height="100%"
                        chartTitle="Olympic Medals By Country"
                        isSeriesHighlightingEnabled={true}
                        dataSource={this.data}
                        chartType={this.state.chartType}
                        markerTypes={this.state.markersTypes}
                        yAxisMinimumValue={0}/>
                </div>
            </div>

        );
    }
    public onChartTypeChanged = (e: any) =>{
        const chartMode = e.target.value.toString();
        this.setState({chartType: chartMode});
    }

    public onMarkerTypeChanged = (e: any) =>{
        const markers = e.target.value.toString();
        this.setState({markersTypes: markers});
    }

    public initData() {
        const usaMedals: any = [
            { Year: "1996", UnitedStates: 148 },
            { Year: "2000", UnitedStates: 142 },
            { Year: "2004", UnitedStates: 134 },
            { Year: "2008", UnitedStates: 131 },
            { Year: "2012", UnitedStates: 135 },
            { Year: "2016", UnitedStates: 146 }
        ];
        const chinaMedals: any = [
            { Year: "1996", China: 110 },
            { Year: "2000", China: 115 },
            { Year: "2004", China: 121 },
            { Year: "2008", China: 129 },
            { Year: "2012", China: 115 },
            { Year: "2016", China: 112 }
        ];
        const russiaMedals: any = [
            { Year: "1996", Russia: 95 },
            { Year: "2000", Russia: 91 },
            { Year: "2004", Russia: 86 },
            { Year: "2008", Russia: 65 },
            { Year: "2012", Russia: 77 },
            { Year: "2016", Russia: 88 }
        ];
        this.data = [ usaMedals, chinaMedals, russiaMedals ];
    }

}

```

## Instructions
To run this sample locally, execute these commands:

```
git clone https://github.com/IgniteUI/igniteui-react-examples.git
cd igniteui-react-examples
cd ./samples/charts/category-chart/markers
npm install
npm start

```

Then open http://localhost:3000/ in your browser

