import * as React from "react";
import "../styles.css";
import "./GeoMapSharedStyles.css";
import DataUtils from "../../utilities/DataUtils"
import WorldUtils from "../../utilities/WorldUtils"

import { IgrGeographicMapModule } from 'igniteui-react-maps';
import { IgrGeographicMap } from 'igniteui-react-maps';
import { IgrGeographicShapeSeries } from 'igniteui-react-maps';
import { IgrDataChartInteractivityModule } from 'igniteui-react-charts';
import { IgrDataContext } from 'igniteui-react-core';
import { IgrShapeDataSource } from 'igniteui-react-core';

IgrGeographicMapModule.register();
IgrDataChartInteractivityModule.register();

export default class MapBindingShapefilePolygons extends React.Component<any,any> {

    public geoMap: IgrGeographicMap;

    constructor(props: any) {
        super(props);

        this.onMapReferenced = this.onMapReferenced.bind(this);
        this.onDataLoaded = this.onDataLoaded.bind(this);
    }

    public render() {
        return (
            <div className="igFlex">
                <div className="igControl" >
                    <IgrGeographicMap
                        ref={this.onMapReferenced}
                        width="100%"
                        height="100%"
                        zoomable="true"/>
                </div>
                <div className="igOverlay-bottom-right">Imagery Tiles: @OpenStreetMap</div>
            </div>
        );
    }

    public onMapReferenced(map: IgrGeographicMap) {
        this.geoMap = map;
        // this.geoMap.backgroundContent = undefined;
        this.geoMap.windowRect = { left: 0.2, top: 0.1, width: 0.6, height: 0.6 };

        const url = DataUtils.getPublicURL();
        // loading a shapefile with geographic polygons
        const sds = new IgrShapeDataSource();
        sds.importCompleted = this.onDataLoaded;
        sds.shapefileSource = url + "/shapes/WorldCountries.shp";
        sds.databaseSource  = url + "/shapes/WorldCountries.dbf";
        sds.dataBind();
    }

    public onDataLoaded(sds: IgrShapeDataSource, e: any) {
        const shapeRecords = sds.getPointData();
        console.log("loaded WorldCountries.shp " + shapeRecords.length);

        const geoPolygons: any[] = [];
        // parsing shapefile data and creating geo-polygons
        for (const record of shapeRecords) {
            // using field/column names from .DBF file
            const country = {
                points: record.points,
                name: record.fieldValues.NAME,
                gdp: record.fieldValues.GDP,
                population: record.fieldValues.POPULATION
            };
            geoPolygons.push(country);
        }

        const geoSeries = new IgrGeographicShapeSeries( { name: "series" });
        geoSeries.dataSource = geoPolygons;
        geoSeries.shapeMemberPath = "points";
        geoSeries.brush = "rgba(146, 146, 146, 0.3)";
        geoSeries.outline = "Black";
        geoSeries.tooltipTemplate = this.createTooltip;
        geoSeries.thickness = 1;
        

        this.geoMap.series.add(geoSeries);
    }

    public createTooltip(context: any) {
        const dataContext = context.dataContext as IgrDataContext;
        if (!dataContext) return null;

        const series = dataContext.series as any;
        if (!series) return null;

        const dataItem = dataContext.item as any;
        if (!dataItem) return null;

        const pop = WorldUtils.toStringAbbr(dataItem.population);
        const gdp = WorldUtils.toStringAbbr(dataItem.gdp * 1000000 / dataItem.population);

        return <div>
            <div  className="tooltipTitle">{dataItem.name}</div>
            <div className="tooltipBox">
                <div className="tooltipRow">
                    <div className="tooltipLbl">Population</div>
                    <div className="tooltipVal">{pop}</div>
                </div>
                <div className="tooltipRow">
                    <div className="tooltipLbl">GDP</div>
                    <div className="tooltipVal">{gdp}</div>
                </div>
            </div>
        </div>
    }


}
