<!-- NOTE: do not change this file because it will be auto re-generated from template file: -->
<!-- https://github.com/IgniteUI/igniteui-react-examples/tree/master/templates/sample/ReadMe.md -->

<!-- ## Table of Contents -->
<!-- - [Sample Preview](#Sample-Preview) -->
- [Source Code](#Source-Code)
- [Instructions](#Instructions)

This folder contains implementation of React application with example of Bullet Graph Animation.
<!-- in the Bullet Graph component -->
<!-- [Bullet Graph](https://infragistics.com/Reactsite/components/bullet-graph.html) -->

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <body>
        <a target="_blank" href="https://codesandbox.io/s/github/IgniteUI/igniteui-react-examples/tree/master/samples/gauges/bullet-graph/animation?fontsize=14&hidenavigation=1&theme=dark&view=preview&file=/src/BulletGraphAnimation.tsx" rel="noopener noreferrer">
            <img height="40px" style="border-radius: 0.25rem" alt="Edit on CodeSandbox" src="https://static.infragistics.com/xplatform/images/sandbox/code.png"/>
        </a>
        <!-- <a target="_blank"
href="https://codesandbox.io/s/github/IgniteUI/igniteui-react-examples/tree/master/samples/maps/geo-map/binding-csv-points?fontsize=14&hidenavigation=1&theme=dark&view=preview">
            <img alt="Edit Sample" src="https://codesandbox.io/static/img/play-codesandbox.svg"/>
        </a> -->
        <!-- <a target="_blank" style="margin-left: 0.5rem"
href="https://codesandbox.io/embed/github/IgniteUI/igniteui-react-examples/tree/master/samples/gauges/bullet-graph/animation?fontsize=14&hidenavigation=1&theme=dark&view=preview&file=/src/BulletGraphAnimation.tsx">
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
  src="https://codesandbox.io/embed/github/IgniteUI/igniteui-react-examples/tree/master/samples/gauges/bullet-graph/animation?fontsize=14&hidenavigation=1&theme=dark&view=preview&file=/src/BulletGraphAnimation.tsx"
  style="width:100%; height:400px; border:0; border-radius: 4px; overflow:hidden;"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe> -->

## Source Code

The following section provides source code from:
`./src/BulletGraphAnimation.tsx` file:

```tsx
import { IgrBulletGraph } from 'igniteui-react-gauges';
import { IgrBulletGraphModule } from 'igniteui-react-gauges';
import { IgrLinearGraphRange } from 'igniteui-react-gauges';
import * as React from 'react';



IgrBulletGraphModule.register();

export default class BulletGraphAnimation extends React.Component {
    public gauge: IgrBulletGraph;

    constructor(props: any) {
        super(props);

        this.onGaugeRef = this.onGaugeRef.bind(this);
        this.onAnimateToGauge1 = this.onAnimateToGauge1.bind(this);
        this.onAnimateToGauge2 = this.onAnimateToGauge2.bind(this);
        this.onAnimateToGauge3 = this.onAnimateToGauge3.bind(this);
    }

    public onGaugeRef(component: IgrBulletGraph) {
        this.gauge = component;
        this.onAnimateToGauge3(null);
    }

    public render() {
        return (
            <div className="igContainer" >

                <div className="igOptions">
                    <button onClick={this.onAnimateToGauge1} className="igOptions-button">Gauge Animation #1</button>
                    <button onClick={this.onAnimateToGauge2} className="igOptions-button">Gauge Animation #2</button>
                    <button onClick={this.onAnimateToGauge3} className="igOptions-button">Gauge Animation #3</button>
                </div>

                <IgrBulletGraph
                    ref={this.onGaugeRef}
                    transitionDuration={1000}
                    height="80px"
                    width="100%"
                    minimumValue={0}
                    maximumValue={120}
                    valueBrush="#4286f4"
                    value={70}
                    targetValueBrush="#4286f4"
                    targetValue={90}
                    targetValueBreadth={10}
                    interval={10}
                    labelInterval={10}
                    labelExtent={0.02}
                    rangeBrushes ="#FF9800, #F96232, #C62828"
                    rangeOutlines="#FF9800, #F96232, #C62828"
                    scaleBackgroundThickness={0}
                    scaleBackgroundBrush="#dbdbdb"
                    scaleBackgroundOutline="gray"/>
            </div>
        );
    }

    public onAnimateToGauge3 = (e: any) => {

        if (!this.gauge) { return; }

        this.gauge.minimumValue = 0;
        this.gauge.maximumValue = 120;
        this.gauge.value = 70;
        this.gauge.interval = 10;

        // setting appearance of labels
        this.gauge.labelInterval = 10;
        this.gauge.labelExtent = 0.02;

        // setting custom appearance of performance bar
        this.gauge.valueInnerExtent = 0.5;
        this.gauge.valueOuterExtent = 0.7;
        this.gauge.valueBrush = "#000000";

        // setting custom appearance of target bar
        this.gauge.targetValueBrush = "#000000";
        this.gauge.targetValueBreadth = 10;
        this.gauge.targetValue = 90;

        // setting appearance of major/minor ticks
        this.gauge.minorTickCount = 5;
        this.gauge.minorTickEndExtent = 0.10;
        this.gauge.minorTickStartExtent = 0.20;
        this.gauge.tickStartExtent = 0.20;
        this.gauge.tickEndExtent = 0.05;
        this.gauge.tickStrokeThickness = 2;

        // setting custom gauge ranges
        const range1 = new IgrLinearGraphRange({});
        range1.startValue = 0;
        range1.endValue = 40;
        const range2 = new IgrLinearGraphRange({});
        range2.startValue = 40;
        range2.endValue = 80;
        const range3 = new IgrLinearGraphRange({});
        range3.startValue = 80;
        range3.endValue = 120;

        this.gauge.rangeBrushes  = [ "#FF9800", "#F96232", "#C62828"];
        this.gauge.rangeOutlines = [ "#FF9800", "#F96232", "#C62828"];
        this.gauge.ranges.clear();
        this.gauge.ranges.add(range1);
        this.gauge.ranges.add(range2);
        this.gauge.ranges.add(range3);

        // setting extent of all gauge ranges
        for (let i = 0; i < this.gauge.ranges.count; i++) {
            const range = this.gauge.ranges.item(i);
            range.innerStartExtent = 0.2;
            range.innerEndExtent = 0.2;
            range.outerStartExtent = 0.95;
            range.outerEndExtent = 0.95;
        }

        // setting extent of gauge scale
        this.gauge.scaleBackgroundThickness = 0.5;
        this.gauge.scaleBackgroundBrush = "#dbdbdb";
        this.gauge.scaleBackgroundOutline = "gray";
        this.gauge.scaleStartExtent = 0.05;
        this.gauge.scaleEndExtent = 0.95;
        this.gauge.scaleBackgroundThickness = 0;

        // setting appearance of backing fill and outline
        this.gauge.backingBrush = "#f7f7f7";
        this.gauge.backingOutline = "#d1d1d1";
        this.gauge.backingStrokeThickness = 0;
    }

    public onAnimateToGauge2 = (e: any) => {

        if (!this.gauge) { return; }

        this.gauge.minimumValue = 100;
        this.gauge.maximumValue = 200;
        this.gauge.value = 120;
        this.gauge.interval = 10;

        // setting appearance of labels
        this.gauge.labelInterval = 10;
        this.gauge.labelExtent = 0.02;

        // setting custom appearance of performance bar
        this.gauge.valueInnerExtent = 0.5;
        this.gauge.valueOuterExtent = 0.7;
        this.gauge.valueBrush = "#000000";

        // setting custom appearance of target bar
        this.gauge.targetValueBrush = "#000000";
        this.gauge.targetValueBreadth = 10;
        this.gauge.targetValue = 180;

        // setting appearance of major/minor ticks
        this.gauge.minorTickCount = 5;
        this.gauge.minorTickEndExtent = 0.10;
        this.gauge.minorTickStartExtent = 0.20;
        this.gauge.tickStartExtent = 0.20;
        this.gauge.tickEndExtent = 0.05;
        this.gauge.tickStrokeThickness = 2;

        // setting custom gauge ranges
        const range1 = new IgrLinearGraphRange({});
        range1.startValue = 100;
        range1.endValue = 125;
        const range2 = new IgrLinearGraphRange({});
        range2.startValue = 125;
        range2.endValue = 150;
        const range3 = new IgrLinearGraphRange({});
        range3.startValue = 150;
        range3.endValue = 175;
        const range4 = new IgrLinearGraphRange({});
        range4.startValue = 175;
        range4.endValue = 200;

        this.gauge.rangeBrushes  = [ "#0078C8", "#0099FF", "#21A7FF", "#4FB9FF"];
        this.gauge.rangeOutlines = [ "#0078C8", "#0099FF", "#21A7FF", "#4FB9FF"];
        this.gauge.ranges.clear();
        this.gauge.ranges.add(range1);
        this.gauge.ranges.add(range2);
        this.gauge.ranges.add(range3);
        this.gauge.ranges.add(range4);

        // setting extent of all gauge ranges
        for (let i = 0; i < this.gauge.ranges.count; i++) {
            const range = this.gauge.ranges.item(i);
            range.innerStartExtent = 0.2;
            range.innerEndExtent = 0.2;
            range.outerStartExtent = 0.95;
            range.outerEndExtent = 0.95;
        }

        // setting extent of gauge scale
        this.gauge.scaleBackgroundThickness = 0.5;
        this.gauge.scaleBackgroundBrush = "#dbdbdb";
        this.gauge.scaleBackgroundOutline = "gray";
        this.gauge.scaleStartExtent = 0.05;
        this.gauge.scaleEndExtent = 0.95;
        this.gauge.scaleBackgroundThickness = 0;

        // setting appearance of backing fill and outline
        this.gauge.backingBrush = "#f7f7f7";
        this.gauge.backingOutline = "#d1d1d1";
        this.gauge.backingStrokeThickness = 0;
    }

    public onAnimateToGauge1 = (e: any) => {

        if (!this.gauge) { return; }

        this.gauge.minimumValue = 0;
        this.gauge.maximumValue = 80;
        this.gauge.value = 70;
        this.gauge.interval = 20;

        // setting appearance of labels
        this.gauge.labelInterval = 20;
        this.gauge.labelExtent = 0.02;

        // setting custom appearance of performance bar
        this.gauge.valueInnerExtent = 0.5;
        this.gauge.valueOuterExtent = 0.7;
        this.gauge.valueBrush = "#000000";

        // setting custom appearance of target bar
        this.gauge.targetValueBrush = "#000000";
        this.gauge.targetValueBreadth = 10;
        this.gauge.targetValue = 60;

        // setting appearance of major/minor ticks
        this.gauge.minorTickCount = 5;
        this.gauge.minorTickEndExtent = 0.10;
        this.gauge.minorTickStartExtent = 0.20;
        this.gauge.tickStartExtent = 0.20;
        this.gauge.tickEndExtent = 0.05;
        this.gauge.tickStrokeThickness = 2;

        // setting custom gauge ranges
        const range1 = new IgrLinearGraphRange({});
        range1.startValue = 0;
        range1.endValue = 40;
        const range2 = new IgrLinearGraphRange({});
        range2.startValue = 40;
        range2.endValue = 80;

        this.gauge.rangeBrushes  = [ "#a4bd29", "#F86232" ];
        this.gauge.rangeOutlines = [ "#a4bd29", "#F86232" ];
        this.gauge.ranges.clear();
        this.gauge.ranges.add(range1);
        this.gauge.ranges.add(range2);

        // setting extent of all gauge ranges
        for (let i = 0; i < this.gauge.ranges.count; i++) {
            const range = this.gauge.ranges.item(i);
            range.innerStartExtent = 0.2;
            range.innerEndExtent = 0.2;
            range.outerStartExtent = 0.95;
            range.outerEndExtent = 0.95;
        }

        // setting extent of gauge scale
        this.gauge.scaleBackgroundThickness = 0.5;
        this.gauge.scaleBackgroundBrush = "#dbdbdb";
        this.gauge.scaleBackgroundOutline = "gray";
        this.gauge.scaleStartExtent = 0.05;
        this.gauge.scaleEndExtent = 0.95;
        this.gauge.scaleBackgroundThickness = 0;

        // setting appearance of backing fill and outline
        this.gauge.backingBrush = "#f7f7f7";
        this.gauge.backingOutline = "#d1d1d1";
        this.gauge.backingStrokeThickness = 0;

    }

}
```

## Instructions
To run this sample locally, execute these commands:

```
git clone https://github.com/IgniteUI/igniteui-react-examples.git
cd igniteui-react-examples
cd ./samples/gauges/bullet-graph/animation
npm install
npm start

```

Then open http://localhost:3000/ in your browser

