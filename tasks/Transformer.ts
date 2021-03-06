let transFS = require('fs.extra');

// var platform = "React";
// var igConfig = require('./gulp-config.js')[platform];

var igConfig = require('./gulp-config.js')

// function log(msg) {
//     console.log('Transformer.ts ' + msg);
// }
// log('loaded');


// this class provides information about a sample that is implemented in /samples folder
class SampleInfo {
    public ComponentGroup: string;     // maps
    public ComponentFolder: string;    // geo-map
    public ComponentName: string;      // Geo Map

    // public SampleDirOnDisk: string;    // C:\repo\igniteui-react-examples\samples\maps\geo-map\binding-csv-points\
    public SampleFolderPath: string;     // /samples/maps/geo-map/binding-csv-points/
    public SampleFilePath: string;       // /samples/maps/geo-map/binding-csv-points/src/MapBindingDataCSV.tsx
    public SampleRoute: string;          //         /maps/geo-map/binding-csv-points/
    public SampleFolderName: string;     //                       binding-csv-points
    public SampleFileName: string;       // MapBindingDataCSV.tsx
    public SampleImportName: string;     // MapBindingDataCSV
    public SampleImportPath: string;     // ./geo-map/binding-csv-points/MapBindingDataCSV
    public SampleDisplayName: string;  // Map Binding Data CSV
    public SampleFileSourcePath: string;     // /src/MapBindingDataCSV.tsx
    public SampleFileSourceCode: string;   // source code from /src/MapBindingDataCSV.tsx file
    public SampleReadMe: string;       // content of ReadMe.md file generated for /samples/maps/geo-map/binding-csv-points/
    public SampleFilePaths: string[];  // relative paths to files in sample folder: /samples/maps/geo-map/binding-csv-points/
    public SampleFileNames: string[];  // names of files in sample folder: /samples/maps/geo-map/binding-csv-points/

    public DocsUrl: string             // https://infragistics.com/Reactsite/components/geo-map.html

    public SandboxUrlView: string;     // https://codesandbox.io/embed/github/IgniteUI/igniteui-react-examples/tree/master/samples/maps/geo-map/binding-csv-points
    public SandboxUrlEdit: string;     //     https://codesandbox.io/s/github/IgniteUI/igniteui-react-examples/tree/master/samples/maps/geo-map/binding-csv-points

    public PackageFileContent: PackageJson;
    public PackageDependencies: PackageDependency[];

    constructor() {
        this.SampleFileSourceCode = 'let str = "TODO";';
        this.SampleFilePaths = [];
        this.SampleFileNames = [];
        this.PackageDependencies = [];
        // this.PackageDependencies.indexOf
    }

    public isUsingFileName(name: string): boolean {
        return this.SampleFileNames.includes(name);
    }
}

class Transformer {

    public static getDependencies(sampleInfo: SampleInfo): PackageDependency[] {
        let dependencies: PackageDependency[] = [];
        let packageJson = sampleInfo.PackageFileContent;
        if (packageJson && packageJson.dependencies) {
            dependencies = [];

            let packages = packageJson.dependencies;

            for (var name in packages) {
                if (packages.hasOwnProperty(name)) {
                    let dependency = new PackageDependency();
                    dependency.name = name;
                    dependency.version = packages[name];
                    dependencies.push(dependency);
                    console.log(name + ": " + packages[name]);
                }
            }
        }
        return dependencies;
    }

    public static sort(samples: SampleInfo[]): void {
        samples.sort((a, b) => { return a.SampleFolderPath > b.SampleFolderPath ? 1 : -1});
    }

    public static printNames(samples: SampleInfo[]): void {
        for (const info of samples) {
            console.log(info.SampleFolderPath + " => " + info.SampleDisplayName);
        }
    }
    public static printRoutes(samples: SampleInfo[]): void {
        for (const info of samples) {
            console.log(info.SampleFolderPath + " => " + info.SampleRoute);
        }
    }
    public static printUrls(samples: SampleInfo[]): void {
        for (const info of samples) {
            console.log(info.SampleFolderPath + " => " + info.SandboxUrlEdit);
        }
    }

    public static getDataRoutes(samples: SampleInfo[]): void {
        // { name: 'tests', routes: [
        //     { path: '/tests/test-component1-test-sample0', name: 'SampleFileName', component: SampleFileName},
        //     { path: '/tests/test-component1-test-sample1', name: 'MapBindingDataJSON', component: MapBindingDataJSON},
        // ]},
    }

    public static process(samples: SampleInfo[]): void {

        for (const info of samples) {
            // let SampleDirectory = info.SampleDirOnDisk;

            // info.PackageDependencies = this.getDependencies(info);

            // ../samples/maps/geo-map/binding-csv-points
            // let relativePath = this.getRelative(SampleDirectory);
            // .., samples, maps, geo-map, binding-csv-points
            let folders = info.SampleFolderPath.split('/');

            if (folders.length > 2) info.ComponentGroup = folders[2];
            if (folders.length > 3) info.ComponentFolder = folders[3];
            if (folders.length > 4) info.SampleFolderName = folders[4];

            info.ComponentName = Strings.toTitleCase(info.ComponentFolder, '-');
            info.ComponentName = info.ComponentName.replace("Geo Map", "Geographic Map");

            // info.SampleFolderPath = relativePath;
            info.SampleRoute = "/" +  info.ComponentGroup + "/" + info.ComponentFolder + "-" + info.SampleFolderName;

            // console.log(info.SampleFolderPath + " " + info.SampleFilePaths.length);

            let fileNames = [];
            let fileFound = [];
            for (const filePath of info.SampleFilePaths) {
                // console.log(filePath);
                fileFound.push(filePath);
                if (Strings.includes(filePath, igConfig.SamplesFileExtension) &&
                    Strings.excludes(filePath, igConfig.SamplesFileExclusions, true)) {
                        fileNames.push(filePath);
                    // console.log(filePath);
                    // && !filePath.includes("index.tsx")
                    // info.SampleFileName = this.getFileName(filePath);;
                }
            }

            if (fileNames.length === 0) {
                console.log("WARNING Transformer cannot match any " + igConfig.SamplesFileExtension + " files in " + info.SampleFolderPath + " sample:");
                for (const name of fileFound) {
                    console.log('- ' + name);
                }
            } else if (fileNames.length > 1) {
                console.log("WARNING Transformer cannot decide which " + igConfig.SamplesFileExtension + " file to use for sample name: ");
                console.log(" - " + fileNames.join("\n - "));
            } else { // only one .tsx file per sample
                info.SampleFilePath = fileNames[0];
                info.SampleFileName = this.getFileName(info.SampleFilePath);
                info.SampleFileSourcePath = "./src/" + info.SampleFileName;
                info.SampleFileSourceCode = transFS.readFileSync(info.SampleFilePath, "utf8");

                info.SampleImportName = info.SampleFileName.replace('.tsx','').replace('.ts','');
                info.SampleImportPath = './' + info.ComponentFolder + '/' + info.SampleFolderName + '/' + info.SampleImportName;

                info.SampleDisplayName = Strings.splitCamel(info.SampleFileName)
                info.SampleDisplayName = Strings.replace(info.SampleDisplayName, igConfig.SamplesFileExtension, "");
                info.SampleDisplayName = Strings.replace(info.SampleDisplayName, "Map Type ", "");
                info.SampleDisplayName = Strings.replace(info.SampleDisplayName, "Map Binding ", "Binding ");
                info.SampleDisplayName = Strings.replace(info.SampleDisplayName, "Map Display ", "Display ");
                info.SampleDisplayName = Strings.replace(info.SampleDisplayName, "Data Chart Type ", "");
                info.SampleDisplayName = Strings.replace(info.SampleDisplayName, info.ComponentName + " ", "");

                info.SandboxUrlView = this.getSandboxUrl(info, igConfig.SandboxUrlView);
                info.SandboxUrlEdit = this.getSandboxUrl(info, igConfig.SandboxUrlEdit);

                info.DocsUrl = this.getDocsUrl(info);
                // console.log("SAMPLE " + info.SampleFilePath + " => " + info.SampleDisplayName);
            }

            // console.log(info.SampleFolderPath + " => " + info.SampleRoute + " => " + info.SampleDisplayName);

        }
    }


    public static getSandboxUrl(sampleInfo: SampleInfo, sandboxUrlFormat: string): string {
        let url = sandboxUrlFormat + "";

        url = Strings.replace(url, "{SandboxUrlOptions}", igConfig.SandboxUrlOptions);
        url = Strings.replace(url, "{RepositoryPath}", igConfig.RepositoryPath);
        url = Strings.replace(url, "{RepositoryOrg}", igConfig.RepositoryOrg);
        url = Strings.replace(url, "{RepositoryName}", igConfig.RepositoryName);
        url = Strings.replace(url, "{ComponentGroup}", sampleInfo.ComponentGroup);
        url = Strings.replace(url, "{ComponentFolder}", sampleInfo.ComponentFolder);
        url = Strings.replace(url, "{SampleFolderName}", sampleInfo.SampleFolderName);
        url = Strings.replace(url, "{sampleFile}", sampleInfo.SampleFileName);

        return url;
    }

    public static getDocsUrl(sampleInfo: SampleInfo): string {
        let url = igConfig.DocsUrl + "";

        url = Strings.replace(url, "{PlatformName}", igConfig.PlatformName);
        url = Strings.replace(url, "{ComponentFolder}", sampleInfo.ComponentFolder);

        return url;
    }

    public static verifyPackage(browsersPackage: PackageJson, templatePackage: PackageJson): string[] {

        let errors: string[] = [];

        // if (browsersPackage.author !== templatePackage.author)
        // errors.push("author", "does not match author in browser's package.json");

        // checking if the template has same dependencies as the browser
        for (var name in browsersPackage.dependencies) {
            if (templatePackage.dependencies.hasOwnProperty(name) &&
                browsersPackage.dependencies.hasOwnProperty(name)) {
                let browsersDep = browsersPackage.dependencies[name];
                let templateDep = templatePackage.dependencies[name];
                if (templateDep !== browsersDep) {
                    errors.push("- template's package.json has \"" + name + "\" with \"" + templateDep + "\" while \"" + browsersDep + "\" is in browser's package.json");
                }
            }
        }

        // checking if the browser has same dependencies as the template
        // for (var name in templatePackage.dependencies) {
        //     if (templatePackage.dependencies.hasOwnProperty(name) &&
        //         browsersPackage.dependencies.hasOwnProperty(name)) {
        //         let browsersDep = browsersPackage.dependencies[name];
        //         let templateDep = templatePackage.dependencies[name];
        //         if (templateDep !== browsersDep) {
        //             errors.push("- browser's package.json has \"" + name + "\" with \"" + browsersDep + "\" while \"" + templateDep + "\" in template's package.json");
        //         }
        //     }
        // }

        if (errors.length > 0) {
            console.log("ERRORS found in package.json files: \n" + errors.join('\n'))
        }

        return errors;
    }

    // gets updated package.json file for a sample using a template
    public static getPackage(sample: SampleInfo, tempPackage: PackageJson): string {
        let samplePackage = sample.PackageFileContent;

        let title = tempPackage.name;
        title = Strings.replace(title, 'platform-name', igConfig.PlatformName);
        title = Strings.replace(title, 'component-name', sample.ComponentName);
        title = Strings.replace(title, 'sample-name', sample.SampleDisplayName);
        title = Strings.replace(title, ' ', '-');
        title = title.toLowerCase();

        let descr = tempPackage.description;
        descr = Strings.replace(descr, 'platform-name', igConfig.PlatformName);
        descr = Strings.replace(descr, 'component-name', sample.ComponentName);
        descr = Strings.replace(descr, 'sample-name', sample.SampleDisplayName);

        samplePackage.name = title;
        samplePackage.description = descr;
        samplePackage.author = tempPackage.author;
        samplePackage.homepage = tempPackage.homepage;
        samplePackage.version = tempPackage.version;
        samplePackage.private = tempPackage.private;
        samplePackage.browserslist = tempPackage.browserslist;

        samplePackage.scripts = tempPackage.scripts;

        // updating scripts in a sample using scripts from the template
        // for (var name in tempPackage.scripts) {
        //     if (tempPackage.scripts.hasOwnProperty(name) &&
        //         samplePackage.scripts.hasOwnProperty(name)) {
        //         samplePackage.scripts[name] = tempPackage.scripts[name]
        //     }
        // }

        // updating version of dependencies in a sample using dependencies from the template
        for (var name in tempPackage.dependencies) {
            if (tempPackage.dependencies.hasOwnProperty(name) &&
                samplePackage.dependencies.hasOwnProperty(name)) {
                samplePackage.dependencies[name] = tempPackage.dependencies[name]
            }
        }

        // updating devDependencies in a sample using devDependencies from the template
        for (var name in tempPackage.devDependencies) {
            if (tempPackage.devDependencies.hasOwnProperty(name) &&
                samplePackage.devDependencies.hasOwnProperty(name)) {
                samplePackage.devDependencies[name] = tempPackage.devDependencies[name]
            }
        }

        return JSON.stringify(samplePackage, null, '  ');
    }

    public static getSampleInfo(samplePackageFile: any, sampleFilePaths?: string[]): SampleInfo {

        let info = new SampleInfo();

        info.SampleFolderPath = this.getRelative(samplePackageFile.dirname);
        info.PackageFileContent = JSON.parse(samplePackageFile.contents.toString());
        info.SampleFilePaths = sampleFilePaths;

        for (const filePath of info.SampleFilePaths) {
            var parts = filePath.split('/');
            info.SampleFileNames.push(parts[parts.length - 1]);
        }
        // info.PackageFileContent = JSON.parse(fs.readFileSync(samplePackageFile));

        return info;
    }

    public static getRelative(path: string): string {
        // let path = filePath;
        if (path.indexOf(igConfig.RepositoryName) > -1) {
            path = path.split(igConfig.RepositoryName)[1];
            path = path.split("\\").join("/");
            return "." + path;
            // return path;
        }

        console.log("failed on getRelative " + path);
        return path;
    }

    public static getFileName(relativePath: string): string {
        // ./samples/maps/geo-map/display-esri-imagery/src/FileName.tsx
        let parts = relativePath.split("/");
        if (parts.length > 0) {
            return parts[parts.length - 1]; // FileName.tsx
        }
        console.log("failed on getFileName " + relativePath);
        return "";
    }

    public static getSourcePath(relativePath: string): string {
        // ./samples/maps/geo-map/display-esri-imagery/src/FileName.tsx
        let parts = relativePath.split("/src");
        if (parts.length > 0) {
            return "./src" + parts[parts.length - 1]; // ./src/FileName.tsx
        }
        console.log("failed on getSourcePath " + relativePath);
        return "";
    }

    public static getParent(path: string): string {
        const folders = path.split('\\');
        if (folders.length > 1) {
            return folders[folders.length  - 1];
        }
        return "";
    }


    public static updateIndex(sample: SampleInfo, template: string): string {

        let content = template + "";

        content = Strings.replace(content, "SampleFileName", sample.SampleFileName);
        content = Strings.replace(content, ".tsx", "");
        return content;
    }


    // generates content of readme file for a given sample based on provided template of readme file
    public static updateReadme(sample: SampleInfo, template: string): string {

        // let ComponentGroup = "maps";
        // let ComponentFolder = "geo-map";
        // let SampleFolderName = "binding-csv-points";
        // let sampleFile = "MapBindingDataCSV.tsx";

        let readMe = template + "";
        // replacing variables with values that were generated while processing each sample:
        readMe = Strings.replace(readMe, "{SandboxUrlView}", sample.SandboxUrlView);
        readMe = Strings.replace(readMe, "{SandboxUrlEdit}", sample.SandboxUrlEdit);

        readMe = Strings.replace(readMe, "{ComponentFolder}", sample.ComponentFolder);
        readMe = Strings.replace(readMe, "{ComponentGroup}", sample.ComponentGroup);
        readMe = Strings.replace(readMe, "{ComponentName}", sample.ComponentName);

        // readMe = Strings.replace(readMe, "{SampleFolderPath}", sample.SampleFolderPath);
        readMe = Strings.replace(readMe, "{SampleFolderPath}", sample.SampleFolderPath);
        readMe = Strings.replace(readMe, "{SampleFolderName}", sample.SampleFolderName);
        readMe = Strings.replace(readMe, "{SampleRoute}", sample.SampleRoute);
        readMe = Strings.replace(readMe, "{SampleDisplayName}", sample.SampleDisplayName);
        readMe = Strings.replace(readMe, "{SampleFileName}", sample.SampleFileName);
        readMe = Strings.replace(readMe, "{SampleFilePath}", sample.SampleFilePath);
        readMe = Strings.replace(readMe, "{SampleFileSourcePath}", sample.SampleFileSourcePath);
        readMe = Strings.replace(readMe, "{SampleFileSourceCode}", sample.SampleFileSourceCode);

        readMe = Strings.replace(readMe, "{DocsUrl}", sample.DocsUrl);

        readMe = Strings.replace(readMe, "{RepositoryWarning}", igConfig.RepositoryWarning);
        readMe = Strings.replace(readMe, "{RepositoryUrl}", igConfig.RepositoryUrl);
        readMe = Strings.replace(readMe, "{RepositoryPath}", igConfig.RepositoryPath);
        readMe = Strings.replace(readMe, "{RepositoryOrg}", igConfig.RepositoryOrg);
        readMe = Strings.replace(readMe, "{RepositoryName}", igConfig.RepositoryName);

        readMe = Strings.replace(readMe, "{PlatformCode}", igConfig.PlatformCode);
        readMe = Strings.replace(readMe, "{PlatformName}", igConfig.PlatformName);

        readMe = Strings.replace(readMe, "{BrowserHostUrl}", igConfig.BrowserHostUrl);
        readMe = Strings.replace(readMe, "{BrowserRootPath}", igConfig.BrowserRootPath);

        // console.log("====== ReadMe.md File =======================");
        // console.log(readMe);
        // console.log("====== ReadMe.md File =======================");
        return readMe;
    }

    public static getRoutingGroups(samples: SampleInfo[]): SampleGroup[] {
        let componentsMap = new Map<string, SampleComponent>();

        for (const item of samples) {
            if (componentsMap.has(item.ComponentName)) {
                componentsMap.get(item.ComponentName).Samples.push(item);
            } else {
                let component = new SampleComponent();
                component.Name = item.ComponentName;
                component.Group = item.ComponentGroup;
                component.Samples.push(item);
                componentsMap.set(item.ComponentName, component);
            }
        }

        let groupMap = new Map<string, SampleGroup>();

        for (let key of Array.from( componentsMap.keys()) ) {
            let component = componentsMap.get(key);

            if (groupMap.has(component.Group)) {
                groupMap.get(component.Group).Components.push(component);
            } else {
                let group = new SampleGroup();
                group.Name = component.Group;
                group.Components.push(component);
                groupMap.set(component.Group, group);
            }
        }

        let groups: SampleGroup[] = [];
        for (let key of Array.from( groupMap.keys()) ) {
            let group = groupMap.get(key);
            group.Components = group.Components.sort(this.sortByComponentsName);

            for (let i = 0; i < group.Components.length; i++) {
                // const element = group.Components[i];
                group.Components[i].Samples = group.Components[i].Samples.sort(this.sortBySamplesName);
            }
            // console.log('group ' + key);
            // for (const component of group.Components) {
            //     console.log('component ' + component.name);

                // component.Samples = component.Samples.sort(this.sortBySamplesName);
            //     for (const sample of component.samples) {
            //         console.log('sample ' + sample.SampleFolderName);
            //     }
            // }
            // let group = new SampleGroup();
            // group.name = key;
            // group.samples = map.get(key);

            // for (let item of map.get(key) ) {
            //     console.log(item.SampleRoute);
            // }
            // // groups.push(map.get(key));
            groups.push(group);
        }
        return groups;
    }

    public static sortByComponentsName(a: any, b: any) {
        if (a.Name > b.Name) { return 1; }
        if (a.Name < b.Name) { return -1; }
        return 0;
    }

    public static sortBySamplesName(a: any, b: any) {
        if (a.SampleDisplayName > b.SampleDisplayName) { return 1; }
        if (a.SampleDisplayName < b.SampleDisplayName) { return -1; }
        return 0;
    }

    public static getRoutingFile(group: SampleGroup): string {

        let imports = '\n';
        imports += "import { RoutingGroup } from '../../navigation/SamplesData'; \n";

        let routes = "// creating routing data for " + group.Name + " samples: \n";
        routes += "export const " + group.Name + "RoutingData: RoutingGroup = { \n";
        routes += "    name: '" + group.Name + "',\n";
        routes += "    components: [\n";

        for (const component of group.Components) {
            console.log('component ' + component.Name);

            // let componentPath = '/' + group.name + '/' + component.name;
            // routes += "    {     path: '" + componentPath +  "', name: '" + component.name + "', routes: [ \n";
            // let componentName = component.Name; // .replace("Geo Map", "Geographic Map");
            routes += "    {     name: '" + component.Name + "', routes: [ \n";

            imports += "// importing " + component.Name + " samples: \n";

            for (const info of component.Samples) {
                console.log('- sample ' + info.SampleDisplayName);

                // console.log('sample ' + sample.SampleFolderName);
                // let sampleClass = info.SampleFileName.replace('.tsx','');
                // let samplePath = './' + info.ComponentFolder + '/' + info.SampleFolderName + '/' + info.SampleClassName;
                imports += "import " + info.SampleImportName +  " from '" + info.SampleImportPath + "'; \n";

                routes += "        { path: '" + info.SampleRoute + "', name: '" + info.SampleDisplayName + "', component: " + info.SampleImportName + " }, \n";
            }
            routes += '    ]},\n';
        }

        routes += '    ]\n';
        routes += '};\n';

        let content = imports + "\n" + routes;
        // console.log(content);
        return content;
    }
}

class SampleGroup {

    public Name: string;
    public Components: SampleComponent[];

    constructor() {
        this.Components = [];
    }
}

class SampleComponent {

    public Name: string;
    public Group: string;
    public Samples: SampleInfo[];

    constructor() {
        this.Samples = [];
    }
}

class Strings {

    public static excludes(str: string, exclusions: string[], useEndsWith?: boolean): boolean {
        for (const exclusion of exclusions) {
            if (useEndsWith) {
                if (str.endsWith(exclusion)) { return false; }
            } else {
                if (str.includes(exclusion)) { return false; }
            }
        }
        return true;
    }

    public static includes(str: string, pattern: string): boolean {
        return str.includes(pattern);
    }

    public static replace(orgStr: string, oldStr: string, newStr: string): string {
        return orgStr.split(oldStr).join(newStr);
    }

    public static toTitleCase(str: string, separator?: string) {
        if (separator === undefined) { separator = ' '; }
        return str.toLowerCase().split(separator).map(function(word) {
          return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
      }

    public static splitCamel(orgStr: string): string {
        return orgStr.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    }

    // .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    //   .split(/(?=[A-Z])/) v
}

class PackageJson {
    public name?: string;
    public description?: string;
    public author?: string;
    public homepage?: string;
    public version?: string;
    public private?: boolean;
    public scripts: any;
    public dependencies: any;
    public devDependencies: any;
    public browserslist?: string[];
}

class PackageDependency {
    public name: string;
    public version: string;

    public samples?: SampleInfo[];

    constructor() {
        this.samples = [];
    }

    public toString() : string {
        return '"' + this.name + `": "` + this.version + '"';
    }
}