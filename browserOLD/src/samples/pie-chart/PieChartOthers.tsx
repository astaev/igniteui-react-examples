
import { IgrPieChart } from 'igniteui-react-charts';
import { IgrPieChartModule } from 'igniteui-react-charts';
import * as React from "react";
import "../styles.css";
import "./PieChartSharedStyles.css";
import { PieChartSharedComponent } from "./PieChartSharedComponent";

IgrPieChartModule.register();

export default class PieChartOthers extends PieChartSharedComponent {

    public data: any[];

    constructor(props: any) {
        super(props);
        this.initData();
    }

    public render() {
        return (
            <div style={{height: "100%", width: "100%", background: "white" }}>

                <IgrPieChart dataSource={this.state.data}
                            labelMemberPath="Company"
                            valueMemberPath="MarketShare"
                            width="100%"
                            height="100%"
                            othersCategoryThreshold="20"
                            othersCategoryType="Number"
                            othersCategoryText="Others"/>
            </div>
        );
    }

    public initData() {
        this.state = { data: [
            { MarketShare: 30, Company: "Google",    },
            { MarketShare: 30, Company: "Apple",     },
            { MarketShare: 15, Company: "Microsoft", },
            { MarketShare: 15, Company: "Samsung",   },
            { MarketShare: 10, Company: "Other",     },
       ] }
    }
}