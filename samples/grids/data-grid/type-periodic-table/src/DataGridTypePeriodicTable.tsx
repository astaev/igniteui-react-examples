import * as React from 'react';
// grid modules:
import { IgrDataGridModule } from 'igniteui-react-grids';
import { IgrDataGrid } from 'igniteui-react-grids';
import { IgrTextColumn } from 'igniteui-react-grids';
import { IgrTemplateColumn } from 'igniteui-react-grids';
import { IgrTemplateCellInfo } from 'igniteui-react-grids';
import { IgrTemplateHeader } from 'igniteui-react-grids';
import { IgrTemplateCellUpdatingEventArgs } from 'igniteui-react-grids';
import { IgrTemplateHeaderCellUpdatingEventArgs } from 'igniteui-react-grids';
import { IgrGridSelectedItemsChangedEventArgs } from 'igniteui-react-grids';
import { IgrGridSelectedKeysChangedEventArgs } from 'igniteui-react-grids';
import { IgrGridSelectedCellsChangedEventArgs } from 'igniteui-react-grids';
import { IgrGridSelectedCellRangesChangedEventArgs } from 'igniteui-react-grids';
import { IgrGridActiveCellChangedEventArgs } from 'igniteui-react-grids';

IgrDataGridModule.register();

export default class DataGridTypePeriodicTable extends React.Component<any, any> {

    public ElementsData: any[] = [];
    public ElementGroups: number = 18;

    public HorizontalCenterHeader: IgrTemplateHeader;
    public HorizontalRightHeader: IgrTemplateHeader;
    public HorizontalLeftHeader: IgrTemplateHeader;
    public HeatScale: HeatScale;
    public CellSize: number = 50;

    constructor(props: any) {
        super(props);

        this.onVerticalHeaderUpdating = this.onVerticalHeaderUpdating.bind(this);
        this.onElementCellUpdating = this.onElementCellUpdating.bind(this);
        this.activeCellChanged = this.activeCellChanged.bind(this);

        this.createData();

        this.HeatScale = new HeatScale(0, 6000);
        this.HeatScale.isInverted = true;
        this.HeatScale.colors = ['#ffd425', '#e5cc8b', '#e9bc86', '#edac7d', '#f29a71', '#f68863', '#f97454', '#fc5d45', '#fe4035', '#ff0025'];

        this.HorizontalCenterHeader = new IgrTemplateHeader({});
        this.HorizontalCenterHeader.cellUpdating = (s, e) => this.onHorizontalHeaderUpdating(s, e, "center");

        this.HorizontalRightHeader = new IgrTemplateHeader({});
        this.HorizontalRightHeader.cellUpdating = (s, e) => this.onHorizontalHeaderUpdating(s, e, "right");

        this.HorizontalLeftHeader = new IgrTemplateHeader({});
        this.HorizontalLeftHeader.cellUpdating = (s, e) => this.onHorizontalHeaderUpdating(s, e, "left");

        this.state = {
            selectedElement: "",
        }
    }

    public render() {

        return (
            <div className="igContainer" style={{overflow: "hidden"}}>
                <label>Selected Element: {this.state.selectedElement }</label>

                <IgrDataGrid
                    // height="100%"
                    height="calc(100% - 20px)"
                    width="100%"
                    rowHeight={this.CellSize + 5}
                    // rowHeight="110"
                    rowSeparatorHeight="1"
                    rowSeparatorBackground="white"
                    headerHeight="60"
                    headerSeparatorBackground="white"

                    autoGenerateColumns="false"
                    dataSource={this.ElementsData}

                    columnResizingMode="None"
                    activationMode="Cell"
                    activeCellChanged={this.activeCellChanged}
                    selectionMode="SingleCell"
                    selectedItemsChanged={this.selectedItemsChanged}
                    selectedKeysChanged={this.selectedKeysChanged}
                    selectedCellsChanged={this.selectedCellsChanged}
                    selectedCellRangesChanged={this.selectedCellRangesChanged}>

                    <IgrTextColumn propertyPath="row"
                    headerText=" "
                    header={this.HorizontalRightHeader}
                    width="*>40" horizontalAlignment="right" />

                    {this.renderElementColumns()}

                    <IgrTextColumn propertyPath="space" headerText=""
                    header={this.HorizontalLeftHeader}
                    width="*>40" horizontalAlignment="left"    />

               </IgrDataGrid>
            </div>
        );
    }

    public renderElementColumns(): JSX.Element[] {
        const columns: JSX.Element[] = [];

        for (let i = 0; i < this.ElementGroups; i++) {
            const property = "group" + i;
            const group = (i + 1).toString();
            columns.push(this.renderColumn(property, group));
        }
        return columns;
    }

    public renderColumn(columnPath: string, columnName?: string) {
        if (columnName === undefined) {
            columnName = columnPath;
        }
        return <IgrTemplateColumn
        key={columnPath}
        propertyPath={columnPath}
        headerText={columnName}
        header={this.HorizontalCenterHeader}
        width={this.CellSize.toString()}
        paddingBottom="0" paddingLeft="0"
        paddingRight="0" paddingTop="0"
        cellUpdating={this.onElementCellUpdating}
        horizontalAlignment="center"
        verticalAlignment="bottom"
        border="white"
        borderLeftWidth="0.5"
        borderRightWidth="0.5"
        borderTopWidth="0"
        borderBottomWidth="0" />;
    }

    public activeCellChanged (s: IgrDataGrid, e: IgrGridActiveCellChangedEventArgs) {
        console.log("activeCellChanged");

        const column = e.newActiveCell.columnUniqueKey.toString();
        const row = e.newActiveCell.rowIndex;

        const item = this.ElementsData[row];
        if (item === undefined ||
            item[column] === undefined||
            item[column].name === undefined) {
            this.setState({selectedElement: ""});
        } else {
            this.setState({selectedElement: item[column].name + " (" + item[column].symbol + ")"});
        }
    }

    public selectedCellRangesChanged (s: IgrDataGrid, e: IgrGridSelectedCellRangesChangedEventArgs) {
        console.log("selectedCellRangesChanged");
    }

    public selectedItemsChanged (s: IgrDataGrid, e: IgrGridSelectedItemsChangedEventArgs) {
        console.log("selectedItemsChanged");
    }

    public selectedKeysChanged (s: IgrDataGrid, e: IgrGridSelectedKeysChangedEventArgs) {
        console.log("selectedKeysChanged");
    }

    public selectedCellsChanged (s: IgrDataGrid, e: IgrGridSelectedCellsChangedEventArgs) {
        console.log("selectedCellsChanged");
    }

    public onVerticalHeaderUpdating(s: IgrTemplateHeader, e: IgrTemplateHeaderCellUpdatingEventArgs) {
        const content = e.content as HTMLDivElement;
        let label: HTMLSpanElement | null = null;
        if (content.childElementCount === 0) {
            label = document.createElement("div");
            label.style.background = "transparent";
            label.style.color = "gray";
            label.style.fontSize = "small";
            // label.style.transform = "rotate(270deg)";
            // label.style.transformOrigin = "center";
            label.style.textAlign = "center";

            // content.style.lineHeight = "140px";
            content.style.margin = "0px";
            content.style.padding = "0px";
            content.appendChild(label);
        } else {
            label = content.children[0] as HTMLDivElement;
        }

        const info = e.cellInfo as IgrTemplateCellInfo;
        label.textContent = info.value;;
    }

    public onHorizontalHeaderUpdating(s: IgrTemplateHeader, e: IgrTemplateHeaderCellUpdatingEventArgs, align: string) {
        const content = e.content as HTMLDivElement;
        let label: HTMLSpanElement | null = null;
        if (content.childElementCount === 0) {
            label = document.createElement("div");
            label.style.background = "transparent";
            label.style.color = "gray";
            label.style.fontSize = "small";
            label.style.verticalAlign = "bottom";
            label.style.textAlign = align;

            // content.style.lineHeight = "140px";
            content.style.margin = "0px";
            content.style.padding = "0px";
            content.appendChild(label);
        } else {
            label = content.children[0] as HTMLDivElement;
        }

        const info = e.cellInfo as IgrTemplateCellInfo;
        label.textContent = info.value;;
    }

    public onElementCellUpdating(s: IgrTemplateColumn, e: IgrTemplateCellUpdatingEventArgs) {
        const content = e.content as HTMLDivElement;
        const info = e.cellInfo as IgrTemplateCellInfo;
        let cell: HTMLDivElement | null = null;
        let atomic: HTMLDivElement | null = null;
        let symbol: HTMLDivElement | null = null;
        let mass:   HTMLDivElement | null = null;

        if (content.childElementCount !== 0) {
            cell = content.children[0] as HTMLDivElement;
            atomic = cell.children[0] as HTMLDivElement;
            symbol = cell.children[1] as HTMLDivElement;
            mass   = cell.children[2] as HTMLDivElement;
        } else {
            atomic = document.createElement("div");
            atomic.style.minWidth = "10px";
            atomic.style.margin = "0px";
            atomic.style.padding = "0px";
            atomic.style.fontFamily = "Verdana";
            atomic.style.fontSize = "8pt";
            atomic.style.textAlign = "left";
            // atomic.style.color = "gray"
            atomic.style.lineHeight = "initial";

            symbol = document.createElement("div");
            symbol.style.minWidth = "10px";
            symbol.style.margin = "0px";
            symbol.style.padding = "0px";
            symbol.style.fontFamily = "Verdana";
            symbol.style.fontSize = "12pt";
            symbol.style.textAlign = "left";
            symbol.style.lineHeight = "initial";

            mass = document.createElement("div");
            mass.style.minWidth = "10px";
            mass.style.margin = "0px";
            mass.style.padding = "0px";
            mass.style.fontFamily = "Verdana";
            mass.style.fontSize = "7pt";
            mass.style.textAlign = "left";
            // mass.style.color = "gray"
            mass.style.lineHeight = "initial";

            cell = document.createElement("div");
            cell.style.display = "grid";
            cell.style.lineHeight = "initial";
            cell.style.height = "100%";
            // cell.style.height = "70px";
            cell.style.padding = "2px";
            cell.style.paddingBottom = "5px";
            cell.appendChild(atomic);
            cell.appendChild(symbol);
            cell.appendChild(mass);

            content.style.height = "100%";
            content.style.display = "block";
            content.style.margin = "0px";
            content.style.padding = "0px";
            content.appendChild(cell);
        }

        // symbol.style.background = this.HeatScale.getColor(info.value);

        const element = info.value;

        if (element === undefined || element === null || element.symbol === "") {
            cell.style.background = "white";
            cell.style.color = "black";

            atomic.textContent = "";
            symbol.textContent = "";
            mass.textContent = "";

        } else if (element.symbol === "..") {
            cell.style.background = "#ffbb00";
            cell.style.color = "black";

            mass.textContent   = "";
            atomic.textContent = "";
            symbol.textContent = "...";
            symbol.style.textAlign = "center";

        } else {

            mass.textContent = element.standardState;
            atomic.textContent = element.atomic;
            symbol.textContent = element.symbol;
            symbol.style.textAlign = "left";

            if (element.standardState === "gas") {
                cell.style.background = "#10b401";
                cell.style.color = "black";

            } else if (element.standardState === "solid") {
                cell.style.background = "#ffbb00";
                cell.style.color = "black";

            } else if (element.standardState === "liquid") {
                cell.style.background = "#00aeff";
                cell.style.color = "black";

            } else {
                cell.style.background = "gray";
                cell.style.color = "white";
                mass.textContent = "unknown";
            }
        }
    }

    public createData() {

        let elementsLookup = new Map<string, any>();
        for (const element of this.getElements()) {
            const symbol = element.symbol.toString().toUpperCase();
            elementsLookup.set(symbol, element);
        }

        let elementsTable = [
            // 1    2     3     4     5     6     7     8     9    10    11    12    13    14    15    16    17    18
            ["H" , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , "HE"],
            ["LI", "BE", ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , "B" , "C" , "N" , "O" , "F" , "NE"],
            ["NA", "MG", ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , "AL", "SI", "P" , "S" , "CL", "AR"],
            ["K" , "CA", "SC", "TI", "V" , "CR", "MN", "FE", "CO", "NI", "CU", "ZN", "GA", "GE", "AS", "SE", "BR", "KR"],
            ["RB", "SR", "Y" , "ZR", "NB", "MO", "TC", "RU", "RH", "PB", "AG", "CD", "IN", "SN", "SB", "TE", "I" , "XE"],
            ["CS", "BA", "..", "HF", "TA", "W" , "RE", "OS", "IR", "PT", "AU", "HG", "TI", "PB", "BI", "PO", "AT", "RN"],
            ["FR", "RA", "..", "RF", "DB", "SG", "BH", "HS", "MT", "DS", "RG", "CN", "NH", "FL", "MC", "LV", "TS", "OG"],
            [""  , ""  , "..", ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ],
            [""  , ""  , "..", "LA", "CE", "PR", "ND", "PM", "SM", "EU", "GD", "TB", "DY", "HO", "ER", "TM", "YB", "LU"],
            [""  , ""  , "..", "AC", "TH", "PA", "U" , "NP", "PU", "AM", "CM", "BK", "CF", "ES", "FM", "MD", "NO", "LR"],
        ];

        this.ElementsData = [];
        for (let r = 0; r < elementsTable.length; r++) {

            const dataItem: any = {};
            dataItem.row = r < 7 ? r + 1 : "";
            dataItem.space = r < 7 ? r + 1 : "";

            for (let g = 0; g < elementsTable[r].length; g++) {
                const group = "group" + g;

                const symbol = elementsTable[r][g];

                if (symbol === "" || symbol === "..") {
                    const element: any = {};
                    element.row = r + 1;
                    element.group = g + 1;
                    element.symbol = symbol;
                    dataItem[group] = element;
                } else if (!elementsLookup.has(symbol)) {
                    console.error("missing element data for " + symbol)
                } else  {
                    const element = elementsLookup.get(symbol);
                    element.row = r + 1;
                    element.group = g + 1;
                    dataItem[group] = element;
                }
            }
            this.ElementsData.push(dataItem);
        }

    }

    public getElements(): any[] {
        return [
            {"atomic":1,"symbol":"H","name":"Hydrogen","mass":"1.00794(4)","cpkHexColor":"FFFFFF","electronicConfiguration":"1s1","gativity":2.2,"atomicRadius":37,"ionRadius":"","vanDelWaalsRadius":120,"ionizationEnergy":1312,"electronAffinity":-73,"oxidationStates":"-1, 1","standardState":"gas","bondingType":"diatomic","meltingPoint":14,"boilingPoint":20,"density":0.0000899,"groupBlock":"nonmetal","yearDiscovered":1766},
            {"atomic":2,"symbol":"He","name":"Helium","mass":"4.002602(2)","cpkHexColor":"D9FFFF","electronicConfiguration":"1s2","gativity":"","atomicRadius":32,"ionRadius":"","vanDelWaalsRadius":140,"ionizationEnergy":2372,"electronAffinity":0,"oxidationStates":"","standardState":"gas","bondingType":"atomic","meltingPoint":"","boilingPoint":4,"density":0.0001785,"groupBlock":"noble gas","yearDiscovered":1868},
            {"atomic":3,"symbol":"Li","name":"Lithium","mass":"6.941(2)","cpkHexColor":"CC80FF","electronicConfiguration":"[He] 2s1","gativity":0.98,"atomicRadius":134,"ionRadius":"76 (+1)","vanDelWaalsRadius":182,"ionizationEnergy":520,"electronAffinity":-60,"oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":454,"boilingPoint":1615,"density":0.535,"groupBlock":"alkali metal","yearDiscovered":1817},
            {"atomic":4,"symbol":"Be","name":"Beryllium","mass":"9.012182(3)","cpkHexColor":"C2FF00","electronicConfiguration":"[He] 2s2","gativity":1.57,"atomicRadius":90,"ionRadius":"45 (+2)","vanDelWaalsRadius":"","ionizationEnergy":900,"electronAffinity":0,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":1560,"boilingPoint":2743,"density":1.848,"groupBlock":"alkaline earth metal","yearDiscovered":1798},
            {"atomic":5,"symbol":"B","name":"Boron","mass":"10.811(7)","cpkHexColor":"FFB5B5","electronicConfiguration":"[He] 2s2 2p1","gativity":2.04,"atomicRadius":82,"ionRadius":"27 (+3)","vanDelWaalsRadius":"","ionizationEnergy":801,"electronAffinity":-27,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"covalent network","meltingPoint":2348,"boilingPoint":4273,"density":2.46,"groupBlock":"metalloid","yearDiscovered":1807},
            {"atomic":6,"symbol":"C","name":"Carbon","mass":"12.0107(8)","cpkHexColor":909090,"electronicConfiguration":"[He] 2s2 2p2","gativity":2.55,"atomicRadius":77,"ionRadius":"16 (+4)","vanDelWaalsRadius":170,"ionizationEnergy":1087,"electronAffinity":-154,"oxidationStates":"-4, -3, -2, -1, 1, 2, 3, 4","standardState":"solid","bondingType":"covalent network","meltingPoint":3823,"boilingPoint":4300,"density":2.26,"groupBlock":"nonmetal","yearDiscovered":"Ancient"},
            {"atomic":7,"symbol":"N","name":"Nitrogen","mass":"14.0067(2)","cpkHexColor":"3050F8","electronicConfiguration":"[He] 2s2 2p3","gativity":3.04,"atomicRadius":75,"ionRadius":"146 (-3)","vanDelWaalsRadius":155,"ionizationEnergy":1402,"electronAffinity":-7,"oxidationStates":"-3, -2, -1, 1, 2, 3, 4, 5","standardState":"gas","bondingType":"diatomic","meltingPoint":63,"boilingPoint":77,"density":0.001251,"groupBlock":"nonmetal","yearDiscovered":1772},
            {"atomic":8,"symbol":"O","name":"Oxygen","mass":"15.9994(3)","cpkHexColor":"FF0D0D","electronicConfiguration":"[He] 2s2 2p4","gativity":3.44,"atomicRadius":73,"ionRadius":"140 (-2)","vanDelWaalsRadius":152,"ionizationEnergy":1314,"electronAffinity":-141,"oxidationStates":"-2, -1, 1, 2","standardState":"gas","bondingType":"diatomic","meltingPoint":55,"boilingPoint":90,"density":0.001429,"groupBlock":"nonmetal","yearDiscovered":1774},
            {"atomic":9,"symbol":"F","name":"Fluorine","mass":"18.9984032(5)","cpkHexColor":9e+51,"electronicConfiguration":"[He] 2s2 2p5","gativity":3.98,"atomicRadius":71,"ionRadius":"133 (-1)","vanDelWaalsRadius":147,"ionizationEnergy":1681,"electronAffinity":-328,"oxidationStates":-1,"standardState":"gas","bondingType":"atomic","meltingPoint":54,"boilingPoint":85,"density":0.001696,"groupBlock":"halogen","yearDiscovered":1670},
            {"atomic":10,"symbol":"Ne","name":"Neon","mass":"20.1797(6)","cpkHexColor":"B3E3F5","electronicConfiguration":"[He] 2s2 2p6","gativity":"","atomicRadius":69,"ionRadius":"","vanDelWaalsRadius":154,"ionizationEnergy":2081,"electronAffinity":0,"oxidationStates":"","standardState":"gas","bondingType":"atomic","meltingPoint":25,"boilingPoint":27,"density":0.0009,"groupBlock":"noble gas","yearDiscovered":1898},
            {"atomic":11,"symbol":"Na","name":"Sodium","mass":"22.98976928(2)","cpkHexColor":"AB5CF2","electronicConfiguration":"[Ne] 3s1","gativity":0.93,"atomicRadius":154,"ionRadius":"102 (+1)","vanDelWaalsRadius":227,"ionizationEnergy":496,"electronAffinity":-53,"oxidationStates":"-1, 1","standardState":"solid","bondingType":"metallic","meltingPoint":371,"boilingPoint":1156,"density":0.968,"groupBlock":"alkali metal","yearDiscovered":1807},
            {"atomic":12,"symbol":"Mg","name":"Magnesium","mass":"24.3050(6)","cpkHexColor":"8AFF00","electronicConfiguration":"[Ne] 3s2","gativity":1.31,"atomicRadius":130,"ionRadius":"72 (+2)","vanDelWaalsRadius":173,"ionizationEnergy":738,"electronAffinity":0,"oxidationStates":"1, 2","standardState":"solid","bondingType":"metallic","meltingPoint":923,"boilingPoint":1363,"density":1.738,"groupBlock":"alkaline earth metal","yearDiscovered":1808},
            {"atomic":13,"symbol":"Al","name":"Aluminum","mass":"26.9815386(8)","cpkHexColor":"BFA6A6","electronicConfiguration":"[Ne] 3s2 3p1","gativity":1.61,"atomicRadius":118,"ionRadius":"53.5 (+3)","vanDelWaalsRadius":"","ionizationEnergy":578,"electronAffinity":-43,"oxidationStates":"1, 3","standardState":"solid","bondingType":"metallic","meltingPoint":933,"boilingPoint":2792,"density":2.7,"groupBlock":"metal","yearDiscovered":"Ancient"},
            {"atomic":14,"symbol":"Si","name":"Silicon","mass":"28.0855(3)","cpkHexColor":"F0C8A0","electronicConfiguration":"[Ne] 3s2 3p2","gativity":1.9,"atomicRadius":111,"ionRadius":"40 (+4)","vanDelWaalsRadius":210,"ionizationEnergy":787,"electronAffinity":-134,"oxidationStates":"-4, -3, -2, -1, 1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1687,"boilingPoint":3173,"density":2.33,"groupBlock":"metalloid","yearDiscovered":1854},
            {"atomic":15,"symbol":"P","name":"Phosphorus","mass":"30.973762(2)","cpkHexColor":"FF8000","electronicConfiguration":"[Ne] 3s2 3p3","gativity":2.19,"atomicRadius":106,"ionRadius":"44 (+3)","vanDelWaalsRadius":180,"ionizationEnergy":1012,"electronAffinity":-72,"oxidationStates":"-3, -2, -1, 1, 2, 3, 4, 5","standardState":"solid","bondingType":"covalent network","meltingPoint":317,"boilingPoint":554,"density":1.823,"groupBlock":"nonmetal","yearDiscovered":1669},
            {"atomic":16,"symbol":"S","name":"Sulfur","mass":"32.065(5)","cpkHexColor":"FFFF30","electronicConfiguration":"[Ne] 3s2 3p4","gativity":2.58,"atomicRadius":102,"ionRadius":"184 (-2)","vanDelWaalsRadius":180,"ionizationEnergy":1000,"electronAffinity":-200,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"covalent network","meltingPoint":388,"boilingPoint":718,"density":1.96,"groupBlock":"nonmetal","yearDiscovered":"Ancient"},
            {"atomic":17,"symbol":"Cl","name":"Chlorine","mass":"35.453(2)","cpkHexColor":"1FF01F","electronicConfiguration":"[Ne] 3s2 3p5","gativity":3.16,"atomicRadius":99,"ionRadius":"181 (-1)","vanDelWaalsRadius":175,"ionizationEnergy":1251,"electronAffinity":-349,"oxidationStates":"-1, 1, 2, 3, 4, 5, 6, 7","standardState":"gas","bondingType":"covalent network","meltingPoint":172,"boilingPoint":239,"density":0.003214,"groupBlock":"halogen","yearDiscovered":1774},
            {"atomic":18,"symbol":"Ar","name":"Argon","mass":"39.948(1)","cpkHexColor":"80D1E3","electronicConfiguration":"[Ne] 3s2 3p6","gativity":"","atomicRadius":97,"ionRadius":"","vanDelWaalsRadius":188,"ionizationEnergy":1521,"electronAffinity":0,"oxidationStates":"","standardState":"gas","bondingType":"atomic","meltingPoint":84,"boilingPoint":87,"density":0.001784,"groupBlock":"noble gas","yearDiscovered":1894},
            {"atomic":19,"symbol":"K","name":"Potassium","mass":"39.0983(1)","cpkHexColor":"8F40D4","electronicConfiguration":"[Ar] 4s1","gativity":0.82,"atomicRadius":196,"ionRadius":"138 (+1)","vanDelWaalsRadius":275,"ionizationEnergy":419,"electronAffinity":-48,"oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":337,"boilingPoint":1032,"density":0.856,"groupBlock":"alkali metal","yearDiscovered":1807},
            {"atomic":20,"symbol":"Ca","name":"Calcium","mass":"40.078(4)","cpkHexColor":"3DFF00","electronicConfiguration":"[Ar] 4s2","gativity":1,"atomicRadius":174,"ionRadius":"100 (+2)","vanDelWaalsRadius":"","ionizationEnergy":590,"electronAffinity":-2,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":1115,"boilingPoint":1757,"density":1.55,"groupBlock":"alkaline earth metal","yearDiscovered":"Ancient"},
            {"atomic":21,"symbol":"Sc","name":"Scandium","mass":"44.955912(6)","cpkHexColor":"E6E6E6","electronicConfiguration":"[Ar] 3d1 4s2","gativity":1.36,"atomicRadius":144,"ionRadius":"74.5 (+3)","vanDelWaalsRadius":"","ionizationEnergy":633,"electronAffinity":-18,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1814,"boilingPoint":3103,"density":2.985,"groupBlock":"transition metal","yearDiscovered":1876},
            {"atomic":22,"symbol":"Ti","name":"Titanium","mass":"47.867(1)","cpkHexColor":"BFC2C7","electronicConfiguration":"[Ar] 3d2 4s2","gativity":1.54,"atomicRadius":136,"ionRadius":"86 (+2)","vanDelWaalsRadius":"","ionizationEnergy":659,"electronAffinity":-8,"oxidationStates":"-1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1941,"boilingPoint":3560,"density":4.507,"groupBlock":"transition metal","yearDiscovered":1791},
            {"atomic":23,"symbol":"V","name":"Vanadium","mass":"50.9415(1)","cpkHexColor":"A6A6AB","electronicConfiguration":"[Ar] 3d3 4s2","gativity":1.63,"atomicRadius":125,"ionRadius":"79 (+2)","vanDelWaalsRadius":"","ionizationEnergy":651,"electronAffinity":-51,"oxidationStates":"-1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":2183,"boilingPoint":3680,"density":6.11,"groupBlock":"transition metal","yearDiscovered":1803},
            {"atomic":24,"symbol":"Cr","name":"Chromium","mass":"51.9961(6)","cpkHexColor":"8A99C7","electronicConfiguration":"[Ar] 3d5 4s1","gativity":1.66,"atomicRadius":127,"ionRadius":"80 (+2*)","vanDelWaalsRadius":"","ionizationEnergy":653,"electronAffinity":-64,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2180,"boilingPoint":2944,"density":7.14,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
            {"atomic":25,"symbol":"Mn","name":"Manganese","mass":"54.938045(5)","cpkHexColor":"9C7AC7","electronicConfiguration":"[Ar] 3d5 4s2","gativity":1.55,"atomicRadius":139,"ionRadius":"67 (+2)","vanDelWaalsRadius":"","ionizationEnergy":717,"electronAffinity":0,"oxidationStates":"-3, -2, -1, 1, 2, 3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":1519,"boilingPoint":2334,"density":7.47,"groupBlock":"transition metal","yearDiscovered":1774},
            {"atomic":26,"symbol":"Fe","name":"Iron","mass":"55.845(2)","cpkHexColor":"E06633","electronicConfiguration":"[Ar] 3d6 4s2","gativity":1.83,"atomicRadius":125,"ionRadius":"78 (+2*)","vanDelWaalsRadius":"","ionizationEnergy":763,"electronAffinity":-16,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":1811,"boilingPoint":3134,"density":7.874,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
            {"atomic":27,"symbol":"Co","name":"Cobalt","mass":"58.933195(5)","cpkHexColor":"F090A0","electronicConfiguration":"[Ar] 3d7 4s2","gativity":1.88,"atomicRadius":126,"ionRadius":"74.5 (+2*)","vanDelWaalsRadius":"","ionizationEnergy":760,"electronAffinity":-64,"oxidationStates":"-1, 1, 2, 3, 4, 5","standardState":"solid","bondingType":"metallic","meltingPoint":1768,"boilingPoint":3200,"density":8.9,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
            {"atomic":28,"symbol":"Ni","name":"Nickel","mass":"58.6934(4)","cpkHexColor":"50D050","electronicConfiguration":"[Ar] 3d8 4s2","gativity":1.91,"atomicRadius":121,"ionRadius":"69 (+2)","vanDelWaalsRadius":163,"ionizationEnergy":737,"electronAffinity":-112,"oxidationStates":"-1, 1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1728,"boilingPoint":3186,"density":8.908,"groupBlock":"transition metal","yearDiscovered":1751},
            {"atomic":29,"symbol":"Cu","name":"Copper","mass":"63.546(3)","cpkHexColor":"C88033","electronicConfiguration":"[Ar] 3d10 4s1","gativity":1.9,"atomicRadius":138,"ionRadius":"77 (+1)","vanDelWaalsRadius":140,"ionizationEnergy":746,"electronAffinity":-118,"oxidationStates":"1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1358,"boilingPoint":3200,"density":8.92,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
            {"atomic":30,"symbol":"Zn","name":"Zinc","mass":"65.38(2)","cpkHexColor":"7D80B0","electronicConfiguration":"[Ar] 3d10 4s2","gativity":1.65,"atomicRadius":131,"ionRadius":"74 (+2)","vanDelWaalsRadius":139,"ionizationEnergy":906,"electronAffinity":0,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":693,"boilingPoint":1180,"density":7.14,"groupBlock":"transition metal","yearDiscovered":1746},
            {"atomic":31,"symbol":"Ga","name":"Gallium","mass":"69.723(1)","cpkHexColor":"C28F8F","electronicConfiguration":"[Ar] 3d10 4s2 4p1","gativity":1.81,"atomicRadius":126,"ionRadius":"62 (+3)","vanDelWaalsRadius":187,"ionizationEnergy":579,"electronAffinity":-29,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":303,"boilingPoint":2477,"density":5.904,"groupBlock":"metal","yearDiscovered":1875},
            {"atomic":32,"symbol":"Ge","name":"Germanium","mass":"72.64(1)","cpkHexColor":"668F8F","electronicConfiguration":"[Ar] 3d10 4s2 4p2","gativity":2.01,"atomicRadius":122,"ionRadius":"73 (+2)","vanDelWaalsRadius":"","ionizationEnergy":762,"electronAffinity":-119,"oxidationStates":"-4, 1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1211,"boilingPoint":3093,"density":5.323,"groupBlock":"metalloid","yearDiscovered":1886},
            {"atomic":33,"symbol":"As","name":"Arsenic","mass":"74.92160(2)","cpkHexColor":"BD80E3","electronicConfiguration":"[Ar] 3d10 4s2 4p3","gativity":2.18,"atomicRadius":119,"ionRadius":"58 (+3)","vanDelWaalsRadius":185,"ionizationEnergy":947,"electronAffinity":-78,"oxidationStates":"-3, 2, 3, 5","standardState":"solid","bondingType":"metallic","meltingPoint":1090,"boilingPoint":887,"density":5.727,"groupBlock":"metalloid","yearDiscovered":"Ancient"},
            {"atomic":34,"symbol":"Se","name":"Selenium","mass":"78.96(3)","cpkHexColor":"FFA100","electronicConfiguration":"[Ar] 3d10 4s2 4p4","gativity":2.55,"atomicRadius":116,"ionRadius":"198 (-2)","vanDelWaalsRadius":190,"ionizationEnergy":941,"electronAffinity":-195,"oxidationStates":"-2, 2, 4, 6","standardState":"solid","bondingType":"metallic","meltingPoint":494,"boilingPoint":958,"density":4.819,"groupBlock":"nonmetal","yearDiscovered":1817},
            {"atomic":35,"symbol":"Br","name":"Bromine","mass":"79.904(1)","cpkHexColor":"A62929","electronicConfiguration":"[Ar] 3d10 4s2 4p5","gativity":2.96,"atomicRadius":114,"ionRadius":"196 (-1)","vanDelWaalsRadius":185,"ionizationEnergy":1140,"electronAffinity":-325,"oxidationStates":"-1, 1, 3, 4, 5, 7","standardState":"liquid","bondingType":"covalent network","meltingPoint":266,"boilingPoint":332,"density":3.12,"groupBlock":"halogen","yearDiscovered":1826},
            {"atomic":36,"symbol":"Kr","name":"Krypton","mass":"83.798(2)","cpkHexColor":"5CB8D1","electronicConfiguration":"[Ar] 3d10 4s2 4p6","gativity":"","atomicRadius":110,"ionRadius":"","vanDelWaalsRadius":202,"ionizationEnergy":1351,"electronAffinity":0,"oxidationStates":2,"standardState":"gas","bondingType":"atomic","meltingPoint":116,"boilingPoint":120,"density":0.00375,"groupBlock":"noble gas","yearDiscovered":1898},
            {"atomic":37,"symbol":"Rb","name":"Rubidium","mass":"85.4678(3)","cpkHexColor":"702EB0","electronicConfiguration":"[Kr] 5s1","gativity":0.82,"atomicRadius":211,"ionRadius":"152 (+1)","vanDelWaalsRadius":"","ionizationEnergy":403,"electronAffinity":-47,"oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":312,"boilingPoint":961,"density":1.532,"groupBlock":"alkali metal","yearDiscovered":1861},
            {"atomic":38,"symbol":"Sr","name":"Strontium","mass":"87.62(1)","cpkHexColor":"00FF00","electronicConfiguration":"[Kr] 5s2","gativity":0.95,"atomicRadius":192,"ionRadius":"118 (+2)","vanDelWaalsRadius":"","ionizationEnergy":550,"electronAffinity":-5,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":1050,"boilingPoint":1655,"density":2.63,"groupBlock":"alkaline earth metal","yearDiscovered":1790},
            {"atomic":39,"symbol":"Y","name":"Yttrium","mass":"88.90585(2)","cpkHexColor":"94FFFF","electronicConfiguration":"[Kr] 4d1 5s2","gativity":1.22,"atomicRadius":162,"ionRadius":"90 (+3)","vanDelWaalsRadius":"","ionizationEnergy":600,"electronAffinity":-30,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1799,"boilingPoint":3618,"density":4.472,"groupBlock":"transition metal","yearDiscovered":1794},
            {"atomic":40,"symbol":"Zr","name":"Zirconium","mass":"91.224(2)","cpkHexColor":"94E0E0","electronicConfiguration":"[Kr] 4d2 5s2","gativity":1.33,"atomicRadius":148,"ionRadius":"72 (+4)","vanDelWaalsRadius":"","ionizationEnergy":640,"electronAffinity":-41,"oxidationStates":"1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":2128,"boilingPoint":4682,"density":6.511,"groupBlock":"transition metal","yearDiscovered":1789},
            {"atomic":41,"symbol":"Nb","name":"Niobium","mass":"92.90638(2)","cpkHexColor":"73C2C9","electronicConfiguration":"[Kr] 4d4 5s1","gativity":1.6,"atomicRadius":137,"ionRadius":"72 (+3)","vanDelWaalsRadius":"","ionizationEnergy":652,"electronAffinity":-86,"oxidationStates":"-1, 2, 3, 4, 5","standardState":"solid","bondingType":"metallic","meltingPoint":2750,"boilingPoint":5017,"density":8.57,"groupBlock":"transition metal","yearDiscovered":1801},
            {"atomic":42,"symbol":"Mo","name":"Molybdenum","mass":"95.96(2)","cpkHexColor":"54B5B5","electronicConfiguration":"[Kr] 4d5 5s1","gativity":2.16,"atomicRadius":145,"ionRadius":"69 (+3)","vanDelWaalsRadius":"","ionizationEnergy":684,"electronAffinity":-72,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2896,"boilingPoint":4912,"density":10.28,"groupBlock":"transition metal","yearDiscovered":1778},
            {"atomic":43,"symbol":"Tc","name":"Technetium","mass":[98],"cpkHexColor":"3B9E9E","electronicConfiguration":"[Kr] 4d5 5s2","gativity":1.9,"atomicRadius":156,"ionRadius":"64.5 (+4)","vanDelWaalsRadius":"","ionizationEnergy":702,"electronAffinity":-53,"oxidationStates":"-3, -1, 1, 2, 3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":2430,"boilingPoint":4538,"density":11.5,"groupBlock":"transition metal","yearDiscovered":1937},
            {"atomic":44,"symbol":"Ru","name":"Ruthenium","mass":"101.07(2)","cpkHexColor":"248F8F","electronicConfiguration":"[Kr] 4d7 5s1","gativity":2.2,"atomicRadius":126,"ionRadius":"68 (+3)","vanDelWaalsRadius":"","ionizationEnergy":710,"electronAffinity":-101,"oxidationStates":"-2, 1, 2, 3, 4, 5, 6, 7, 8","standardState":"solid","bondingType":"metallic","meltingPoint":2607,"boilingPoint":4423,"density":12.37,"groupBlock":"transition metal","yearDiscovered":1827},
            {"atomic":45,"symbol":"Rh","name":"Rhodium","mass":"102.90550(2)","cpkHexColor":"0A7D8C","electronicConfiguration":"[Kr] 4d8 5s1","gativity":2.28,"atomicRadius":135,"ionRadius":"66.5 (+3)","vanDelWaalsRadius":"","ionizationEnergy":720,"electronAffinity":-110,"oxidationStates":"-1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2237,"boilingPoint":3968,"density":12.45,"groupBlock":"transition metal","yearDiscovered":1803},
            {"atomic":46,"symbol":"Pd","name":"Palladium","mass":"106.42(1)","cpkHexColor":6985,"electronicConfiguration":"[Kr] 4d10","gativity":2.2,"atomicRadius":131,"ionRadius":"59 (+1)","vanDelWaalsRadius":163,"ionizationEnergy":804,"electronAffinity":-54,"oxidationStates":"2, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1828,"boilingPoint":3236,"density":12.023,"groupBlock":"transition metal","yearDiscovered":1803},
            {"atomic":47,"symbol":"Ag","name":"Silver","mass":"107.8682(2)","cpkHexColor":"C0C0C0","electronicConfiguration":"[Kr] 4d10 5s1","gativity":1.93,"atomicRadius":153,"ionRadius":"115 (+1)","vanDelWaalsRadius":172,"ionizationEnergy":731,"electronAffinity":-126,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1235,"boilingPoint":2435,"density":10.49,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
            {"atomic":48,"symbol":"Cd","name":"Cadmium","mass":"112.411(8)","cpkHexColor":"FFD98F","electronicConfiguration":"[Kr] 4d10 5s2","gativity":1.69,"atomicRadius":148,"ionRadius":"95 (+2)","vanDelWaalsRadius":158,"ionizationEnergy":868,"electronAffinity":0,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":594,"boilingPoint":1040,"density":8.65,"groupBlock":"transition metal","yearDiscovered":1817},
            {"atomic":49,"symbol":"In","name":"Indium","mass":"114.818(3)","cpkHexColor":"A67573","electronicConfiguration":"[Kr] 4d10 5s2 5p1","gativity":1.78,"atomicRadius":144,"ionRadius":"80 (+3)","vanDelWaalsRadius":193,"ionizationEnergy":558,"electronAffinity":-29,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":430,"boilingPoint":2345,"density":7.31,"groupBlock":"metal","yearDiscovered":1863},
            {"atomic":50,"symbol":"Sn","name":"Tin","mass":"118.710(7)","cpkHexColor":668080,"electronicConfiguration":"[Kr] 4d10 5s2 5p2","gativity":1.96,"atomicRadius":141,"ionRadius":"112 (+2)","vanDelWaalsRadius":217,"ionizationEnergy":709,"electronAffinity":-107,"oxidationStates":"-4, 2, 4","standardState":"solid","bondingType":"metallic","meltingPoint":505,"boilingPoint":2875,"density":7.31,"groupBlock":"metal","yearDiscovered":"Ancient"},
            {"atomic":51,"symbol":"Sb","name":"Antimony","mass":"121.760(1)","cpkHexColor":"9E63B5","electronicConfiguration":"[Kr] 4d10 5s2 5p3","gativity":2.05,"atomicRadius":138,"ionRadius":"76 (+3)","vanDelWaalsRadius":"","ionizationEnergy":834,"electronAffinity":-103,"oxidationStates":"-3, 3, 5","standardState":"solid","bondingType":"metallic","meltingPoint":904,"boilingPoint":1860,"density":6.697,"groupBlock":"metalloid","yearDiscovered":"Ancient"},
            {"atomic":52,"symbol":"Te","name":"Tellurium","mass":"127.60(3)","cpkHexColor":"D47A00","electronicConfiguration":"[Kr] 4d10 5s2 5p4","gativity":2.1,"atomicRadius":135,"ionRadius":"221 (-2)","vanDelWaalsRadius":206,"ionizationEnergy":869,"electronAffinity":-190,"oxidationStates":"-2, 2, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":723,"boilingPoint":1261,"density":6.24,"groupBlock":"metalloid","yearDiscovered":1782},
            {"atomic":53,"symbol":"I","name":"Iodine","mass":"126.90447(3)","cpkHexColor":940094,"electronicConfiguration":"[Kr] 4d10 5s2 5p5","gativity":2.66,"atomicRadius":133,"ionRadius":"220 (-1)","vanDelWaalsRadius":198,"ionizationEnergy":1008,"electronAffinity":-295,"oxidationStates":"-1, 1, 3, 5, 7","standardState":"solid","bondingType":"covalent network","meltingPoint":387,"boilingPoint":457,"density":4.94,"groupBlock":"halogen","yearDiscovered":1811},
            {"atomic":54,"symbol":"Xe","name":"Xenon","mass":"131.293(6)","cpkHexColor":"429EB0","electronicConfiguration":"[Kr] 4d10 5s2 5p6","gativity":"","atomicRadius":130,"ionRadius":"48 (+8)","vanDelWaalsRadius":216,"ionizationEnergy":1170,"electronAffinity":0,"oxidationStates":"2, 4, 6, 8","standardState":"gas","bondingType":"atomic","meltingPoint":161,"boilingPoint":165,"density":0.0059,"groupBlock":"noble gas","yearDiscovered":1898},
            {"atomic":55,"symbol":"Cs","name":"Cesium","mass":"132.9054519(2)","cpkHexColor":"57178F","electronicConfiguration":"[Xe] 6s1","gativity":0.79,"atomicRadius":225,"ionRadius":"167 (+1)","vanDelWaalsRadius":"","ionizationEnergy":376,"electronAffinity":-46,"oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":302,"boilingPoint":944,"density":1.879,"groupBlock":"alkali metal","yearDiscovered":1860},
            {"atomic":56,"symbol":"Ba","name":"Barium","mass":"137.327(7)","cpkHexColor":"00C900","electronicConfiguration":"[Xe] 6s2","gativity":0.89,"atomicRadius":198,"ionRadius":"135 (+2)","vanDelWaalsRadius":"","ionizationEnergy":503,"electronAffinity":-14,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":1000,"boilingPoint":2143,"density":3.51,"groupBlock":"alkaline earth metal","yearDiscovered":1808},
            {"atomic":57,"symbol":"La","name":"Lanthanum","mass":"138.90547(7)","cpkHexColor":"70D4FF","electronicConfiguration":"[Xe] 5d1 6s2","gativity":1.1,"atomicRadius":169,"ionRadius":"103.2 (+3)","vanDelWaalsRadius":"","ionizationEnergy":538,"electronAffinity":-48,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1193,"boilingPoint":3737,"density":6.146,"groupBlock":"lanthanoid","yearDiscovered":1839},
            {"atomic":58,"symbol":"Ce","name":"Cerium","mass":"140.116(1)","cpkHexColor":"FFFFC7","electronicConfiguration":"[Xe] 4f1 5d1 6s2","gativity":1.12,"atomicRadius":"","ionRadius":"102 (+3)","vanDelWaalsRadius":"","ionizationEnergy":534,"electronAffinity":-50,"oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1071,"boilingPoint":3633,"density":6.689,"groupBlock":"lanthanoid","yearDiscovered":1803},
            {"atomic":59,"symbol":"Pr","name":"Praseodymium","mass":"140.90765(2)","cpkHexColor":"D9FFC7","electronicConfiguration":"[Xe] 4f3 6s2","gativity":1.13,"atomicRadius":"","ionRadius":"99 (+3)","vanDelWaalsRadius":"","ionizationEnergy":527,"electronAffinity":-50,"oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1204,"boilingPoint":3563,"density":6.64,"groupBlock":"lanthanoid","yearDiscovered":1885},
            {"atomic":60,"symbol":"Nd","name":"Neodymium","mass":"144.242(3)","cpkHexColor":"C7FFC7","electronicConfiguration":"[Xe] 4f4 6s2","gativity":1.14,"atomicRadius":"","ionRadius":"129 (+2)","vanDelWaalsRadius":"","ionizationEnergy":533,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1294,"boilingPoint":3373,"density":7.01,"groupBlock":"lanthanoid","yearDiscovered":1885},
            {"atomic":61,"symbol":"Pm","name":"Promethium","mass":[145],"cpkHexColor":"A3FFC7","electronicConfiguration":"[Xe] 4f5 6s2","gativity":1.13,"atomicRadius":"","ionRadius":"97 (+3)","vanDelWaalsRadius":"","ionizationEnergy":540,"electronAffinity":-50,"oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1373,"boilingPoint":3273,"density":7.264,"groupBlock":"lanthanoid","yearDiscovered":1947},
            {"atomic":62,"symbol":"Sm","name":"Samarium","mass":"150.36(2)","cpkHexColor":"8FFFC7","electronicConfiguration":"[Xe] 4f6 6s2","gativity":1.17,"atomicRadius":"","ionRadius":"122 (+2)","vanDelWaalsRadius":"","ionizationEnergy":545,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1345,"boilingPoint":2076,"density":7.353,"groupBlock":"lanthanoid","yearDiscovered":1853},
            {"atomic":63,"symbol":"Eu","name":"Europium","mass":"151.964(1)","cpkHexColor":"61FFC7","electronicConfiguration":"[Xe] 4f7 6s2","gativity":1.2,"atomicRadius":"","ionRadius":"117 (+2)","vanDelWaalsRadius":"","ionizationEnergy":547,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1095,"boilingPoint":1800,"density":5.244,"groupBlock":"lanthanoid","yearDiscovered":1901},
            {"atomic":64,"symbol":"Gd","name":"Gadolinium","mass":"157.25(3)","cpkHexColor":"45FFC7","electronicConfiguration":"[Xe] 4f7 5d1 6s2","gativity":1.2,"atomicRadius":"","ionRadius":"93.8 (+3)","vanDelWaalsRadius":"","ionizationEnergy":593,"electronAffinity":-50,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1586,"boilingPoint":3523,"density":7.901,"groupBlock":"lanthanoid","yearDiscovered":1880},
            {"atomic":65,"symbol":"Tb","name":"Terbium","mass":"158.92535(2)","cpkHexColor":"30FFC7","electronicConfiguration":"[Xe] 4f9 6s2","gativity":1.2,"atomicRadius":"","ionRadius":"92.3 (+3)","vanDelWaalsRadius":"","ionizationEnergy":566,"electronAffinity":-50,"oxidationStates":"1, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1629,"boilingPoint":3503,"density":8.219,"groupBlock":"lanthanoid","yearDiscovered":1843},
            {"atomic":66,"symbol":"Dy","name":"Dysprosium","mass":"162.500(1)","cpkHexColor":"1FFFC7","electronicConfiguration":"[Xe] 4f10 6s2","gativity":1.22,"atomicRadius":"","ionRadius":"107 (+2)","vanDelWaalsRadius":"","ionizationEnergy":573,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1685,"boilingPoint":2840,"density":8.551,"groupBlock":"lanthanoid","yearDiscovered":1886},
            {"atomic":67,"symbol":"Ho","name":"Holmium","mass":"164.93032(2)","cpkHexColor":"00FF9C","electronicConfiguration":"[Xe] 4f11 6s2","gativity":1.23,"atomicRadius":"","ionRadius":"90.1 (+3)","vanDelWaalsRadius":"","ionizationEnergy":581,"electronAffinity":-50,"oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1747,"boilingPoint":2973,"density":8.795,"groupBlock":"lanthanoid","yearDiscovered":1878},
            {"atomic":68,"symbol":"Er","name":"Erbium","mass":"167.259(3)","cpkHexColor":0,"electronicConfiguration":"[Xe] 4f12 6s2","gativity":1.24,"atomicRadius":"","ionRadius":"89 (+3)","vanDelWaalsRadius":"","ionizationEnergy":589,"electronAffinity":-50,"oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1770,"boilingPoint":3141,"density":9.066,"groupBlock":"lanthanoid","yearDiscovered":1842},
            {"atomic":69,"symbol":"Tm","name":"Thulium","mass":"168.93421(2)","cpkHexColor":"00D452","electronicConfiguration":"[Xe] 4f13 6s2","gativity":1.25,"atomicRadius":"","ionRadius":"103 (+2)","vanDelWaalsRadius":"","ionizationEnergy":597,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1818,"boilingPoint":2223,"density":9.321,"groupBlock":"lanthanoid","yearDiscovered":1879},
            {"atomic":70,"symbol":"Yb","name":"Ytterbium","mass":"173.054(5)","cpkHexColor":"00BF38","electronicConfiguration":"[Xe] 4f14 6s2","gativity":1.1,"atomicRadius":"","ionRadius":"102 (+2)","vanDelWaalsRadius":"","ionizationEnergy":603,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1092,"boilingPoint":1469,"density":6.57,"groupBlock":"lanthanoid","yearDiscovered":1878},
            {"atomic":71,"symbol":"Lu","name":"Lutetium","mass":"174.9668(1)","cpkHexColor":"00AB24","electronicConfiguration":"[Xe] 4f14 5d1 6s2","gativity":1.27,"atomicRadius":160,"ionRadius":"86.1 (+3)","vanDelWaalsRadius":"","ionizationEnergy":524,"electronAffinity":-50,"oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1936,"boilingPoint":3675,"density":9.841,"groupBlock":"lanthanoid","yearDiscovered":1907},
            {"atomic":72,"symbol":"Hf","name":"Hafnium","mass":"178.49(2)","cpkHexColor":"4DC2FF","electronicConfiguration":"[Xe] 4f14 5d2 6s2","gativity":1.3,"atomicRadius":150,"ionRadius":"71 (+4)","vanDelWaalsRadius":"","ionizationEnergy":659,"electronAffinity":0,"oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":2506,"boilingPoint":4876,"density":13.31,"groupBlock":"transition metal","yearDiscovered":1923},
            {"atomic":73,"symbol":"Ta","name":"Tantalum","mass":"180.94788(2)","cpkHexColor":"4DA6FF","electronicConfiguration":"[Xe] 4f14 5d3 6s2","gativity":1.5,"atomicRadius":138,"ionRadius":"72 (+3)","vanDelWaalsRadius":"","ionizationEnergy":761,"electronAffinity":-31,"oxidationStates":"-1, 2, 3, 4, 5","standardState":"solid","bondingType":"metallic","meltingPoint":3290,"boilingPoint":5731,"density":16.65,"groupBlock":"transition metal","yearDiscovered":1802},
            {"atomic":74,"symbol":"W","name":"Tungsten","mass":"183.84(1)","cpkHexColor":"2194D6","electronicConfiguration":"[Xe] 4f14 5d4 6s2","gativity":2.36,"atomicRadius":146,"ionRadius":"66 (+4)","vanDelWaalsRadius":"","ionizationEnergy":770,"electronAffinity":-79,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":3695,"boilingPoint":5828,"density":19.25,"groupBlock":"transition metal","yearDiscovered":1783},
            {"atomic":75,"symbol":"Re","name":"Rhenium","mass":"186.207(1)","cpkHexColor":"267DAB","electronicConfiguration":"[Xe] 4f14 5d5 6s2","gativity":1.9,"atomicRadius":159,"ionRadius":"63 (+4)","vanDelWaalsRadius":"","ionizationEnergy":760,"electronAffinity":-15,"oxidationStates":"-3, -1, 1, 2, 3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":3459,"boilingPoint":5869,"density":21.02,"groupBlock":"transition metal","yearDiscovered":1925},
            {"atomic":76,"symbol":"Os","name":"Osmium","mass":"190.23(3)","cpkHexColor":266696,"electronicConfiguration":"[Xe] 4f14 5d6 6s2","gativity":2.2,"atomicRadius":128,"ionRadius":"63 (+4)","vanDelWaalsRadius":"","ionizationEnergy":840,"electronAffinity":-106,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6, 7, 8","standardState":"solid","bondingType":"metallic","meltingPoint":3306,"boilingPoint":5285,"density":22.61,"groupBlock":"transition metal","yearDiscovered":1803},
            {"atomic":77,"symbol":"Ir","name":"Iridium","mass":"192.217(3)","cpkHexColor":175487,"electronicConfiguration":"[Xe] 4f14 5d7 6s2","gativity":2.2,"atomicRadius":137,"ionRadius":"68 (+3)","vanDelWaalsRadius":"","ionizationEnergy":880,"electronAffinity":-151,"oxidationStates":"-3, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2739,"boilingPoint":4701,"density":22.65,"groupBlock":"transition metal","yearDiscovered":1803},
            {"atomic":78,"symbol":"Pt","name":"Platinum","mass":"195.084(9)","cpkHexColor":"D0D0E0","electronicConfiguration":"[Xe] 4f14 5d9 6s1","gativity":2.28,"atomicRadius":128,"ionRadius":"86 (+2)","vanDelWaalsRadius":175,"ionizationEnergy":870,"electronAffinity":-205,"oxidationStates":"2, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2041,"boilingPoint":4098,"density":21.09,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
            {"atomic":79,"symbol":"Au","name":"Gold","mass":"196.966569(4)","cpkHexColor":"FFD123","electronicConfiguration":"[Xe] 4f14 5d10 6s1","gativity":2.54,"atomicRadius":144,"ionRadius":"137 (+1)","vanDelWaalsRadius":166,"ionizationEnergy":890,"electronAffinity":-223,"oxidationStates":"-1, 1, 2, 3, 5","standardState":"solid","bondingType":"metallic","meltingPoint":1337,"boilingPoint":3129,"density":19.3,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
            {"atomic":80,"symbol":"Hg","name":"Mercury","mass":"200.59(2)","cpkHexColor":"B8B8D0","electronicConfiguration":"[Xe] 4f14 5d10 6s2","gativity":2,"atomicRadius":149,"ionRadius":"119 (+1)","vanDelWaalsRadius":155,"ionizationEnergy":1007,"electronAffinity":0,"oxidationStates":"1, 2, 4","standardState":"liquid","bondingType":"metallic","meltingPoint":234,"boilingPoint":630,"density":13.534,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
            {"atomic":81,"symbol":"Tl","name":"Thallium","mass":"204.3833(2)","cpkHexColor":"A6544D","electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p1","gativity":2.04,"atomicRadius":148,"ionRadius":"150 (+1)","vanDelWaalsRadius":196,"ionizationEnergy":589,"electronAffinity":-19,"oxidationStates":"1, 3","standardState":"solid","bondingType":"metallic","meltingPoint":577,"boilingPoint":1746,"density":11.85,"groupBlock":"metal","yearDiscovered":1861},
            {"atomic":82,"symbol":"Pb","name":"Lead","mass":"207.2(1)","cpkHexColor":575961,"electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p2","gativity":2.33,"atomicRadius":147,"ionRadius":"119 (+2)","vanDelWaalsRadius":202,"ionizationEnergy":716,"electronAffinity":-35,"oxidationStates":"-4, 2, 4","standardState":"solid","bondingType":"metallic","meltingPoint":601,"boilingPoint":2022,"density":11.34,"groupBlock":"metal","yearDiscovered":"Ancient"},
            {"atomic":83,"symbol":"Bi","name":"Bismuth","mass":"208.98040(1)","cpkHexColor":"9E4FB5","electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p3","gativity":2.02,"atomicRadius":146,"ionRadius":"103 (+3)","vanDelWaalsRadius":"","ionizationEnergy":703,"electronAffinity":-91,"oxidationStates":"-3, 3, 5","standardState":"solid","bondingType":"metallic","meltingPoint":544,"boilingPoint":1837,"density":9.78,"groupBlock":"metal","yearDiscovered":"Ancient"},
            {"atomic":84,"symbol":"Po","name":"Polonium","mass":[209],"cpkHexColor":"AB5C00","electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p4","gativity":2,"atomicRadius":"","ionRadius":"94 (+4)","vanDelWaalsRadius":"","ionizationEnergy":812,"electronAffinity":-183,"oxidationStates":"-2, 2, 4, 6","standardState":"solid","bondingType":"metallic","meltingPoint":527,"boilingPoint":1235,"density":9.196,"groupBlock":"metalloid","yearDiscovered":1898},
            {"atomic":85,"symbol":"At","name":"Astatine","mass":[210],"cpkHexColor":"754F45","electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p5","gativity":2.2,"atomicRadius":"","ionRadius":"62 (+7)","vanDelWaalsRadius":"","ionizationEnergy":920,"electronAffinity":-270,"oxidationStates":"-1, 1, 3, 5","standardState":"solid","bondingType":"covalent network","meltingPoint":575,"boilingPoint":"","density":"","groupBlock":"halogen","yearDiscovered":1940},
            {"atomic":86,"symbol":"Rn","name":"Radon","mass":[222],"cpkHexColor":428296,"electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p6","gativity":"","atomicRadius":145,"ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":1037,"electronAffinity":"","oxidationStates":2,"standardState":"gas","bondingType":"atomic","meltingPoint":202,"boilingPoint":211,"density":0.00973,"groupBlock":"noble gas","yearDiscovered":1900},
            {"atomic":87,"symbol":"Fr","name":"Francium","mass":[223],"cpkHexColor":420066,"electronicConfiguration":"[Rn] 7s1","gativity":0.7,"atomicRadius":"","ionRadius":"180 (+1)","vanDelWaalsRadius":"","ionizationEnergy":380,"electronAffinity":"","oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"alkali metal","yearDiscovered":1939},
            {"atomic":88,"symbol":"Ra","name":"Radium","mass":[226],"cpkHexColor":"007D00","electronicConfiguration":"[Rn] 7s2","gativity":0.9,"atomicRadius":"","ionRadius":"148 (+2)","vanDelWaalsRadius":"","ionizationEnergy":509,"electronAffinity":"","oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":973,"boilingPoint":2010,"density":5,"groupBlock":"alkaline earth metal","yearDiscovered":1898},
            {"atomic":89,"symbol":"Ac","name":"Actinium","mass":[227],"cpkHexColor":"70ABFA","electronicConfiguration":"[Rn] 6d1 7s2","gativity":1.1,"atomicRadius":"","ionRadius":"112 (+3)","vanDelWaalsRadius":"","ionizationEnergy":499,"electronAffinity":"","oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1323,"boilingPoint":3473,"density":10.07,"groupBlock":"actinoid","yearDiscovered":1899},
            {"atomic":90,"symbol":"Th","name":"Thorium","mass":"232.03806(2)","cpkHexColor":"00BAFF","electronicConfiguration":"[Rn] 6d2 7s2","gativity":1.3,"atomicRadius":"","ionRadius":"94 (+4)","vanDelWaalsRadius":"","ionizationEnergy":587,"electronAffinity":"","oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":2023,"boilingPoint":5093,"density":11.724,"groupBlock":"actinoid","yearDiscovered":1828},
            {"atomic":91,"symbol":"Pa","name":"Protactinium","mass":"231.03588(2)","cpkHexColor":"00A1FF","electronicConfiguration":"[Rn] 5f2 6d1 7s2","gativity":1.5,"atomicRadius":"","ionRadius":"104 (+3)","vanDelWaalsRadius":"","ionizationEnergy":568,"electronAffinity":"","oxidationStates":"3, 4, 5","standardState":"solid","bondingType":"metallic","meltingPoint":1845,"boilingPoint":4273,"density":15.37,"groupBlock":"actinoid","yearDiscovered":1913},
            {"atomic":92,"symbol":"U","name":"Uranium","mass":"238.02891(3)","cpkHexColor":"008FFF","electronicConfiguration":"[Rn] 5f3 6d1 7s2","gativity":1.38,"atomicRadius":"","ionRadius":"102.5 (+3)","vanDelWaalsRadius":186,"ionizationEnergy":598,"electronAffinity":"","oxidationStates":"3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":1408,"boilingPoint":4200,"density":19.05,"groupBlock":"actinoid","yearDiscovered":1789},
            {"atomic":93,"symbol":"Np","name":"Neptunium","mass":[237],"cpkHexColor":"0080FF","electronicConfiguration":"[Rn] 5f4 6d1 7s2","gativity":1.36,"atomicRadius":"","ionRadius":"110 (+2)","vanDelWaalsRadius":"","ionizationEnergy":605,"electronAffinity":"","oxidationStates":"3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":917,"boilingPoint":4273,"density":20.45,"groupBlock":"actinoid","yearDiscovered":1940},
            {"atomic":94,"symbol":"Pu","name":"Plutonium","mass":[244],"cpkHexColor":"006BFF","electronicConfiguration":"[Rn] 5f6 7s2","gativity":1.28,"atomicRadius":"","ionRadius":"100 (+3)","vanDelWaalsRadius":"","ionizationEnergy":585,"electronAffinity":"","oxidationStates":"3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":913,"boilingPoint":3503,"density":19.816,"groupBlock":"actinoid","yearDiscovered":1940},
            {"atomic":95,"symbol":"Am","name":"Americium","mass":[243],"cpkHexColor":"545CF2","electronicConfiguration":"[Rn] 5f7 7s2","gativity":1.3,"atomicRadius":"","ionRadius":"126 (+2)","vanDelWaalsRadius":"","ionizationEnergy":578,"electronAffinity":"","oxidationStates":"2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":1449,"boilingPoint":2284,"density":"","groupBlock":"actinoid","yearDiscovered":1944},
            {"atomic":96,"symbol":"Cm","name":"Curium","mass":[247],"cpkHexColor":"785CE3","electronicConfiguration":"[Rn] 5f7 6d1 7s2","gativity":1.3,"atomicRadius":"","ionRadius":"97 (+3)","vanDelWaalsRadius":"","ionizationEnergy":581,"electronAffinity":"","oxidationStates":"3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1618,"boilingPoint":3383,"density":13.51,"groupBlock":"actinoid","yearDiscovered":1944},
            {"atomic":97,"symbol":"Bk","name":"Berkelium","mass":[247],"cpkHexColor":"8A4FE3","electronicConfiguration":"[Rn] 5f9 7s2","gativity":1.3,"atomicRadius":"","ionRadius":"96 (+3)","vanDelWaalsRadius":"","ionizationEnergy":601,"electronAffinity":"","oxidationStates":"3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1323,"boilingPoint":"","density":14.78,"groupBlock":"actinoid","yearDiscovered":1949},
            {"atomic":98,"symbol":"Cf","name":"Californium","mass":[251],"cpkHexColor":"A136D4","electronicConfiguration":"[Rn] 5f10 7s2","gativity":1.3,"atomicRadius":"","ionRadius":"95 (+3)","vanDelWaalsRadius":"","ionizationEnergy":608,"electronAffinity":"","oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1173,"boilingPoint":"","density":15.1,"groupBlock":"actinoid","yearDiscovered":1950},
            {"atomic":99,"symbol":"Es","name":"Einsteinium","mass":[252],"cpkHexColor":"B31FD4","electronicConfiguration":"[Rn] 5f11 7s2","gativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":619,"electronAffinity":"","oxidationStates":"2, 3","standardState":"solid","bondingType":"","meltingPoint":1133,"boilingPoint":"","density":"","groupBlock":"actinoid","yearDiscovered":1952},
            {"atomic":100,"symbol":"Fm","name":"Fermium","mass":[257],"cpkHexColor":"B31FBA","electronicConfiguration":"[Rn] 5f12 7s2","gativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":627,"electronAffinity":"","oxidationStates":"2, 3","standardState":"","bondingType":"","meltingPoint":1800,"boilingPoint":"","density":"","groupBlock":"actinoid","yearDiscovered":1952},
            {"atomic":101,"symbol":"Md","name":"Mendelevium","mass":[258],"cpkHexColor":"B30DA6","electronicConfiguration":"[Rn] 5f13 7s2","gativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":635,"electronAffinity":"","oxidationStates":"2, 3","standardState":"","bondingType":"","meltingPoint":1100,"boilingPoint":"","density":"","groupBlock":"actinoid","yearDiscovered":1955},
            {"atomic":102,"symbol":"No","name":"Nobelium","mass":[259],"cpkHexColor":"BD0D87","electronicConfiguration":"[Rn] 5f14 7s2","gativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":642,"electronAffinity":"","oxidationStates":"2, 3","standardState":"","bondingType":"","meltingPoint":1100,"boilingPoint":"","density":"","groupBlock":"actinoid","yearDiscovered":1957},
            {"atomic":103,"symbol":"Lr","name":"Lawrencium","mass":[262],"cpkHexColor":"C70066","electronicConfiguration":"[Rn] 5f14 7s2 7p1","gativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":3,"standardState":"","bondingType":"","meltingPoint":1900,"boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1961},
            {"atomic":104,"symbol":"Rf","name":"Rutherfordium","mass":[267],"cpkHexColor":"CC0059","electronicConfiguration":"[Rn] 5f14 6d2 7s2","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":4,"standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1969},
            {"atomic":105,"symbol":"Db","name":"Dubnium","mass":[268],"cpkHexColor":"D1004F","electronicConfiguration":"[Rn] 5f14 6d3 7s2","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1967},
            {"atomic":106,"symbol":"Sg","name":"Seaborgium","mass":[271],"cpkHexColor":"D90045","electronicConfiguration":"[Rn] 5f14 6d4 7s2","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1974},
            {"atomic":107,"symbol":"Bh","name":"Bohrium","mass":[272],"cpkHexColor":"E00038","electronicConfiguration":"[Rn] 5f14 6d5 7s2","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1976},
            {"atomic":108,"symbol":"Hs","name":"Hassium","mass":[270],"cpkHexColor":"E6002E","electronicConfiguration":"[Rn] 5f14 6d6 7s2","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1984},
            {"atomic":109,"symbol":"Mt","name":"Meitnerium","mass":[276],"cpkHexColor":"EB0026","electronicConfiguration":"[Rn] 5f14 6d7 7s2","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1982},
            {"atomic":110,"symbol":"Ds","name":"Darmstadtium","mass":[281],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d9 7s1","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1994},
            {"atomic":111,"symbol":"Rg","name":"Roentgenium","mass":[280],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s1","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1994},
            {"atomic":112,"symbol":"Cn","name":"Copernicium","mass":[285],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1996},
            {"atomic":113,"symbol":"Nh","name":"Nihonium","mass":[284],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p1","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":2003},
            {"atomic":114,"symbol":"Fl","name":"Flerovium","mass":[289],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p2","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":1998},
            {"atomic":115,"symbol":"Mc","name":"Moscovium","mass":[288],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p3","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":2003},
            {"atomic":116,"symbol":"Lv","name":"Livermorium","mass":[293],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p4","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":2000},
            {"atomic":117,"symbol":"Ts","name":"Tennessine","mass":[294],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p5","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":2010},
            {"atomic":118,"symbol":"Og","name":"Oganesson","mass":[294],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p6","gativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"noble gas","yearDiscovered":2002}
            ]
    }
}

class HeatScale {

    public minimum: number = 0;
    public maximum: number = 1;
    public colors: string[] = ["white", "yellow", "orange", "red"];
    public isInverted: boolean = false;

    constructor(min: number, max: number) {
        this.minimum = min;
        this.maximum = max;
    }

    public getRange(): number {
        return this.maximum - this.minimum;
    }

    public getUnscaled(v: number): number {
        return this.Clamp(this.minimum + v * this.getRange(), this.minimum, this.maximum);
    }

    public getScaled(v: number): number
    {
        return this.Clamp((v - this.minimum) / this.getRange(), this.minimum, this.maximum);
    }

    public Clamp(value: number, min: number, max: number): number {
        return Math.min(max, Math.max(min, value));
    }

    public getColor(v: number): string
    {
        let scale =  this.getScaled(v);
        let index = Math.round(scale * (this.colors.length - 1));
        if (this.isInverted) {
            index = this.colors.length - index - 1;
        }
        // console.log("" +  index + " " + scale + " " + v)
        if (index < 0 || index > this.colors.length) {
            return "white";
        } else {
            return this.colors[index]
        } ;
    }
}
