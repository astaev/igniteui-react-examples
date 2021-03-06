import * as React from 'react';



// for handling of maps events
import { IgrRectChangedEventArgs } from 'igniteui-react-core';

import { IgrGeographicMapModule } from 'igniteui-react-maps';
import { IgrGeographicMap } from 'igniteui-react-maps';
import { IgrOpenStreetMapImagery } from 'igniteui-react-maps';
import { IgrDataChartInteractivityModule } from 'igniteui-react-charts';

IgrGeographicMapModule.register();
IgrDataChartInteractivityModule.register();

export default class MapDisplayImageryOSM extends React.Component<any, any> {

    public geoMap: IgrGeographicMap;

    constructor(props: any) {
        super(props);

        this.onMapReferenced = this.onMapReferenced.bind(this);
    }

    public render() {
        return (
            <div className="igContainer">
                <div className="igComponent" >
                    <IgrGeographicMap
                        ref={this.onMapReferenced}
                        // actualWindowRectChanged={this.onMapWindowRectChanged}
                        width="100%"
                        height="100%"
                        zoomable="true"/>
                </div>
                <div className="igOverlay-bottom-right">Imagery Tiles: @OpenStreetMap</div>
            </div>
        );
    }

    public onMapReferenced(geoMap: IgrGeographicMap) {
        const mapImagery = new IgrOpenStreetMapImagery();
        geoMap.backgroundContent = mapImagery;

        const geoRect = { left: -150.0, top: -60.0, width: 315.0, height: 140.0 };
        geoMap.zoomToGeographic(geoRect);
    }

    public onMapWindowRectChanged(geoMap: IgrGeographicMap, e: IgrRectChangedEventArgs) {
        const rect = e.newRect;
        console.log("win \n left:" + rect.left +
        ", top:" + rect.top + ", width:"  + rect.width + ", height:"  + rect.height);

        const geo = geoMap.getGeographicFromZoom(rect);
        console.log("geo \n left:" + geo.left +
        ", top:" + geo.top + ", width:"  + geo.width + ", height:"  + geo.height);
    }



}
