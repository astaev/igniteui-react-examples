// types of axis:
import { IgrNumericYAxis } from 'igniteui-react-charts';
import { IgrNumericXAxis } from 'igniteui-react-charts';

// types of scatter series:
import { IgrBubbleSeries } from 'igniteui-react-charts';
// elements of scatter series:
import { IgrSizeScale } from 'igniteui-react-charts';
import { IgrValueBrushScale } from 'igniteui-react-charts';
import { IgrCustomPaletteBrushScale } from 'igniteui-react-charts';
import { BrushSelectionMode } from 'igniteui-react-charts';
// modules of data chart:
import { IgrDataChart } from 'igniteui-react-charts';
import { IgrDataChartCoreModule } from 'igniteui-react-charts';
import { IgrDataChartScatterCoreModule } from 'igniteui-react-charts';
import { IgrDataChartScatterModule } from 'igniteui-react-charts';
// additional modules
import { IgrDataChartInteractivityModule } from 'igniteui-react-charts';
import { IgrNumberAbbreviatorModule } from 'igniteui-react-charts';
import { MarkerType } from 'igniteui-react-charts';
// legend's modules:
import { IgrLegend } from 'igniteui-react-charts';
import { IgrLegendModule } from 'igniteui-react-charts';

import * as React from 'react';


import { SampleScatterStats } from './SampleScatterStats';

IgrDataChartCoreModule.register();
IgrDataChartScatterCoreModule.register();
IgrDataChartScatterModule.register();
IgrDataChartInteractivityModule.register();
IgrNumberAbbreviatorModule.register();
IgrLegendModule.register();

export default class DataChartTypeScatterBubbleSeries extends React.Component {
    public data: any[];
    public chart: IgrDataChart;
    public legend: IgrLegend;

    constructor(props: any) {
        super(props);

        this.onChartRef = this.onChartRef.bind(this);
    }

    public render() {
        return (
        <div className="igContainer">
            <div className="igComponent"   >
                <IgrDataChart ref={this.onChartRef}
                    isHorizontalZoomEnabled={true}
                    isVerticalZoomEnabled={true}
                    width="100%"
                    height="100%"
                    chartTitle="GDP vs Population">
                    {/* axes: */}
                    <IgrNumericXAxis name="xAxis"
                    isLogarithmic={true}
                    abbreviateLargeNumbers={true}
                    title="Population" />
                    <IgrNumericYAxis name="yAxis"
                    isLogarithmic={true}
                    abbreviateLargeNumbers={true}
                    title="Total GDP ($)" />

                    {/* series is created in the setSeries function  */}
               </IgrDataChart>
            </div>
        </div>
        );
    }

    public onChartRef(chart: IgrDataChart) {
        this.chart = chart;
        this.setSeries();
    }

    public setSeries()
    {
        const sizeScale = new IgrSizeScale({});
        sizeScale.minimumValue = 10;
        sizeScale.maximumValue = 60;

        const brushScale1 = new IgrValueBrushScale({});
        brushScale1.brushes = ["#FFFFFF", "#b56ffc"];
        brushScale1.minimumValue = 10;
        brushScale1.maximumValue = 60;

        const series1 = new IgrBubbleSeries({ name: "series1" });
        series1.title = "Large Countries";
        series1.markerType = MarkerType.Circle;
        series1.dataSource = SampleScatterStats.getCountriesWithLargePop();
        series1.showDefaultTooltip = true;
        series1.xMemberPath = "Population";
        series1.yMemberPath = "GdpTotal";
        series1.radiusMemberPath = "GdpPerCapita";
        series1.radiusScale = sizeScale;
        // series1.fillMemberPath = "GdpPerCapita";
        // series1.fillScale = brushScale1;
        series1.xAxisName = "xAxis";
        series1.yAxisName = "yAxis";

        const brushScale2 = new IgrCustomPaletteBrushScale({});
        brushScale2.brushes = ["#FFFFFF", "#b56ffc"];
        brushScale2.brushSelectionMode = BrushSelectionMode.Interpolate;

        const series2 = new IgrBubbleSeries({ name: "series2" });
        series2.title = "Small Countries";
        series2.markerType = MarkerType.Circle;
        series2.dataSource = SampleScatterStats.getCountriesWithSmallPop();
        series2.showDefaultTooltip = true;
        series2.xMemberPath = "Population";
        series2.yMemberPath = "GdpTotal";
        series2.radiusMemberPath = "GdpPerCapita";
        series2.radiusScale = sizeScale;
        // series2.fillMemberPath = "GdpPerCapita";
        // series2.fillScale = brushScale2;
        series2.xAxisName = "xAxis";
        series2.yAxisName = "yAxis";

        this.chart.series.clear();
        this.chart.series.add(series1);
        this.chart.series.add(series2);

    }
}
