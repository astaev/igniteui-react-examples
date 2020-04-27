// importing axis' modules:
import { IgrNumericYAxis } from 'igniteui-react-charts';
import { IgrCategoryXAxis } from 'igniteui-react-charts';
// importing category series' modules:
import { IgrColumnSeries } from 'igniteui-react-charts';
// importing data chart's modules:
import { IgrDataChart } from 'igniteui-react-charts';
import { IgrDataChartCoreModule } from 'igniteui-react-charts';
import { IgrDataChartCategoryModule } from 'igniteui-react-charts';
import { IgrDataChartInteractivityModule } from 'igniteui-react-charts';
// importing legend's modules:
import { IgrLegend } from 'igniteui-react-charts';
import { IgrLegendModule } from 'igniteui-react-charts';

import * as React from "react";
import "../styles.css";
import "./DataChartSharedStyles.css";
import { DataChartSharedComponent } from "./DataChartSharedComponent";
import { SampleCategoryData } from "./SampleCategoryData";

IgrDataChartCoreModule.register();
IgrDataChartCategoryModule.register();
IgrDataChartInteractivityModule.register();
IgrLegendModule.register();

export default class DataChartTypeCategoryColumnSeries extends DataChartSharedComponent {
    public data: any[];
    public chart: IgrDataChart;
    public legend: IgrLegend;

    constructor(props: any) {
        super(props);

        this.onChartRef = this.onChartRef.bind(this);
        this.onLegendRef = this.onLegendRef.bind(this);
        this.data = SampleCategoryData.create();
    }

    public render() {
        return (
            <div className="sample">
                <div className="options">
                    <span className="legendTitle">Legend: </span>
                    <div className="legendInline">
                        <IgrLegend ref={this.onLegendRef} orientation="Horizontal" />
                    </div>
                </div>
                <div className="chart" style={{ height: "calc(100% - 35px)" }} >
                    <IgrDataChart ref={this.onChartRef}
                        width="100%"
                        height="100%"
                        dataSource={this.data}
                        isHorizontalZoomEnabled={true}
                        isVerticalZoomEnabled={true} >
                        <IgrCategoryXAxis name="xAxis" label="Year"
                            title="Olympic Years" />
                        <IgrNumericYAxis name="yAxis" minimumValue={0}
                            title="Total Olympic Medals" />
                        <IgrColumnSeries
                            name="series1"
                            title="USA"
                            xAxisName="xAxis"
                            yAxisName="yAxis"
                            valueMemberPath="USA"
                            showDefaultTooltip="true" />
                        <IgrColumnSeries
                            name="series2"
                            title="Russia"
                            xAxisName="xAxis"
                            yAxisName="yAxis"
                            valueMemberPath="RUS"
                            showDefaultTooltip="true" />
                    </IgrDataChart>
                </div>
            </div>
        );
    }

    public onLegendRef(legend: IgrLegend) {
        this.legend = legend;
        if (this.chart) {
            this.chart.legend = this.legend;
        }
    }

    public onChartRef(chart: IgrDataChart) {
        this.chart = chart;
        if (this.legend) {
            this.chart.legend = this.legend;
        }
    }
}