import * as React from "react";
import { Route, Switch, Link } from "react-router-dom"
import { withRouter } from 'react-router-dom';

import './Scrollbars.css';
import './SamplesBrowser.css';
import { SamplesRouter } from './SamplesRouter';
import { RoutingSample } from './SamplesData';

// import { gridsRoutingData } from "../samples/grids/RoutingData";
import { gaugesRoutingData } from "../samples/gauges/RoutingData";
// import { mapsRoutingData } from "../samples/maps/RoutingData";
// import { tests1RoutingData } from "../samples/tests1/RoutingData";
// import { tests2RoutingData } from "../samples/tests2/RoutingData";

// http://localhost:3000/samples/charts
// http://localhost:3000/charts

export class SamplesBrowser extends React.Component<any, any>
{
    public navLinks: any[] = [];
    public navRoutes: any[] = [];

    constructor(props: any) {
        super(props);

        console.log("SB ()");

        this.onSampleOpen = this.onSampleOpen.bind(this);
        // console.log(TestsRoutes.DataRoutes)

        // this.populateLinks(SamplesRouter.getLinks(mapsRoutingData, this.onSampleOpen));
        this.populateLinks(SamplesRouter.getLinks(gaugesRoutingData, this.onSampleOpen));
        // this.populateLinks(SamplesRouter.getLinks(gridsRoutingData, this.onSampleOpen));
        // this.populateLinks(SamplesRouter.getLinks(tests1RoutingData, this.onSampleOpen));
        // this.populateLinks(SamplesRouter.getLinks(tests2RoutingData, this.onSampleOpen));

        // this.populateRoutes(SamplesRouter.getRoutes(mapsRoutingData));
        this.populateRoutes(SamplesRouter.getRoutes(gaugesRoutingData));
        // this.populateRoutes(SamplesRouter.getRoutes(gridsRoutingData));
        // this.populateRoutes(SamplesRouter.getRoutes(tests1RoutingData));
        // this.populateRoutes(SamplesRouter.getRoutes(tests2RoutingData));

        this.state = {
            SelectedSample: 'react samples browser',
        }
    }

    public populateLinks(array: any[]) {
        for (const item of array) {
            this.navLinks.push(item);
        }
    }

    public populateRoutes(array: any[]) {
        for (const item of array) {
            this.navRoutes.push(item);
        }
    }

    public onSampleOpen = (sample: RoutingSample) => {
        // const item = event.currentTarget.id;
        // console.log('onControlClick ' + item);
        this.setState({
            SelectedSample: sample.name,
        });
    };

    public componentDidUpdate(prevProps: any) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            console.log('Route change!');
        }
    }

    public render() {
        let navBrowsingMode = SamplesRouter.isBrowsingMode();
        let navStyle = navBrowsingMode ? { display: "flex" } : { display: "none" };

        console.log("SB render  " + navBrowsingMode);

        return (
            <div className="sbRoot" >

                <div className="sbNavigation" style={navStyle}>
                    {/* <Link to={`/`}>Samples root</Link>
                    <Link to={`/samples`}>Samples home</Link> */}
                    {/* <Link to={`/samples/charts`}>samples charts </Link> */}
                    {/* <Link to={`/charts`}>charts</Link> */}
                    {this.navLinks}
                    {/* {this.test2Links} */}
                    {/* {this.test1Links}
                    {this.test2Links} */}
                </div>

                <div className="sbContent" >
                    <div className="sbToolbar" style={navStyle}>
                    {this.state.SelectedSample}
                    </div>
                    <div className="sbSwitch" >
                        <Switch >
                            {/* <Route exact={false} path="/samples/charts" key="charts" component={ChartsRouter}/> */}
                            {/* <Route exact={false} path="/charts" key="charts" component={ChartsRouter}/> */}
                            <Route exact={true} path="/"  >
                                <h3>Please select a sample</h3>
                            </Route>
                            <Route exact={true} path="/samples">
                                <h3>Please select a sample</h3>
                            </Route>
                            {this.navRoutes}
                            {/* {this.test2Routes} */}

                            {/* <Route exact={true} >
                                <h3>NoPageFound exact=true</h3>
                            </Route> */}
                            <Route exact={false} >
                                <h3>NoPageFound exact=false</h3>
                            </Route>
                            {/* <Route component={NoPageFound} /> */}
                        </Switch>
                    </div>

                </div>

            </div>
        );
    }
}

export default withRouter(SamplesBrowser);