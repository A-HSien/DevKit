declare const $: any;
declare const Electron: any;
import { CommonUtility } from './CommonUtility';
import { CSVHelper } from './CSVHelper';


export class ResourceEditorViewModel {
    resources: Resource[] = [];

    constructor(
        public projectName: string
    ) { };

    private sort() {
        this.resources.sort((a, b) => (a.key > b.key) ? 1 : -1);
    };

    private compareTo(toCompare: Resource[]) {
        const map: any = {};
        this.resources.forEach(r => {
            r.status = ResourceStatus.Deleted;
            map[r.key] = r;
        });

        toCompare.forEach(c => {
            const org = map[c.key];
            if (org) { // already exist
                if (org.sameWith(c)) { // content different
                    org.status = ResourceStatus.OldVersion;
                    c.status = ResourceStatus.NewVersion;
                    this.resources.push(c);
                } else { // no different
                    org.status = ResourceStatus.Current;
                }
            } else { // new item
                c.status = ResourceStatus.NewItem;
                this.resources.push(c);
            }
        });
        this.compileView();
    };

    private fileSelected(filePath: string[]) {
        if (!filePath || !filePath.length || filePath.length === 0) return;

        const fs = Electron.remote.require('fs');

        fs.readFile(filePath[0], 'utf-8', (err: any, data: string) => {
            if (err) {
                alert("An error ocurred reading the file :" + err.message);
                return;
            }
            const toCompare = CSVHelper.CSVToObjectArray<Resource>(
                data,
                object => new Resource(object.key, object.zh, object.en)
            );
            this.compareTo(toCompare);
        });
    };

    private compareSelector() {
        const dialog = Electron.remote.dialog;

        dialog.showOpenDialog(
            {
                title: '請選擇比對目標',
                properties: ['openFile', 'showHiddenFiles'],
                filters: [
                    { name: 'All Files', extensions: ['csv'] }
                ]
            },
            this.fileSelected.bind(this)
        )

    };

    private exportCSV() {
        const csvContent = CSVHelper.tableToCSV('.js-resourcesTable');
        CSVHelper.download(csvContent, 'resources.csv');
    };

    compileView() {
        this.sort();
        CommonUtility.compileView('#resourcesEditor', 'app/resourcesEditor.html', this, this.eventBinding.bind(this));
        this.eventBinding();
    };

    private eventBinding() {
        $('.js-exportCSV').on('click', this.exportCSV.bind(this));
        $('.js-compareSelector').on('click', this.compareSelector.bind(this));
    };
};

export class Resource {

    status: ResourceStatus = ResourceStatus.Current;

    constructor(
        public key: string,
        public zh: string,
        public en: string,
    ) { };

    sameWith(toCompare: Resource): boolean {
        return ['key', 'zh', 'en'].every(prop => {
            return this[prop] === toCompare[prop];
        });
    };
};

export enum ResourceStatus {
    Current,
    OldVersion,
    NewVersion,
    NewItem,
    Deleted
};