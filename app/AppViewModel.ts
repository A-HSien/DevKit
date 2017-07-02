
declare const Electron: any;
declare const $: any;

import { CommonUtility } from './CommonUtility';
import { Project, CommandOutput } from './Models';
import { ResourceEditorViewModel, Resource } from './ResourceEditorViewModel';



export class AppViewModel {

  private workingFolder: string = '';
  private projects: Project[] = [];
  private skipFolder = [
    'node_modules', '.git', 'packages', 'obj', '.vs', '.nuget', 'bin',
    'AppAssets', 'iBank.Utilities.Pdf', 'Statement', 'DesignModeling',
    'Properties', 'Views', 'apis', 'classes', 'Controllers', 'resources'
  ];
  private commandOutputs: CommandOutput[] = [];
  private scriptFilterList: string[] = [];


  private selectFolder() {
    var dialog = Electron.remote.dialog;

    dialog.showOpenDialog(
      {
        title: '請選擇目標資料夾',
        properties: ['openDirectory'],
      },
      this.folderSelected.bind(this)
    )
  };


  private folderSelected(folderNames: string) {
    if (!folderNames) return;

    this.workingFolder = folderNames;
    $('.workingFolder').html(folderNames);

    const searchTarget = 'package.json';
    const searchFilesByFileName = Electron.remote.require('./nodeScripts/searchFilesByFileName');
    const files: string[] = searchFilesByFileName(folderNames, searchTarget, this.skipFolder);

    this.projects = files.map(file => {
      const setting: Project = require(file);
      setting.path = file.replace(searchTarget, '');
      if (setting.scripts) {

        const commands = Object.keys(setting.scripts);
        setting.scripts = commands.map(e => {
          return {
            command: e,
            content: setting.scripts[e]
          };
        });
      } else {
        setting.scripts = [];
      }
      return setting;
    });

    CommonUtility.compileView('#projectPanel', 'app/projectPanel.html', this);
  };



  private executeCommand($event: any) {
    const $target = $($event.currentTarget);
    let command = $target.html();
    const path = this.getProjectData($target, 'path');
    if (!command || !path) return;

    if ($target.hasClass('js-isBuiltInCommand')) {
      command = `npm ${command}`;
    } else {
      command = `npm run ${command}`;
    }

    this.commandOutputs = [];
    const executeCommand = Electron.remote.require('./nodeScripts/executeCommand');
    executeCommand(command, [path], true, this.commandCallback.bind(this));
    return;
  };


  private getProjectData($target: any, propName: string): string {
    const $tr = $target.parent().parent();
    const data = $tr.data(propName);
    return data;
  };


  private executeGlobeCommand($event: any) {
    const $target = $($event.currentTarget);
    let command = $target.data('command');
    if (!command) return;

    let projects = this.projects;

    if ($target.hasClass('js-isBuiltInCommand')) {
      command = `npm ${command}`;

    } else {
      projects = this.projects.filter(e => e.scripts.some(e => e.command === command));
      command = `npm run ${command}`;
    }

    const dirs = projects.map(e => e.path);
    if (dirs.length < 1) return;

    this.commandOutputs = [];
    const executeCommand = Electron.remote.require('./nodeScripts/executeCommand');
    executeCommand(command, dirs, true, this.commandCallback.bind(this));
    return;
  };


  private commandOutputsWindowTask: NodeJS.Timer;
  private commandCallback(error: any, stdout: any, stderr: any) {
    clearTimeout(this.commandOutputsWindowTask);

    this.commandOutputs.unshift(new CommandOutput(error, stdout, stderr));

    this.commandOutputsWindowTask = setTimeout(() => {
      CommonUtility.compileView('.js-commandOutputs', 'app/commandOutputs.html', this);
    }, 1000);
  };


  private addToScriptFilter() {
    const scriptFilterToAdd = $('.js-scriptFilterToAdd').val();
    if (scriptFilterToAdd && this.scriptFilterList.indexOf(scriptFilterToAdd) < 0)
      this.scriptFilterList.push(scriptFilterToAdd);

    this.createScriptFilterListView();
  };


  private deleteFromScriptFilterList(event: Event) {
    const target: any = $(event.currentTarget).text().trim();
    this.scriptFilterList = this.scriptFilterList.filter(e => e !== target);

    this.createScriptFilterListView();
  };


  private createScriptFilterListView() {
    const buttons = this.scriptFilterList.map(e => {
      return `<button class="btn btn-danger js-deleteFromScriptFilterList"> ${e} <span class="glyphicon glyphicon-remove"></span></button>`;
    });
    $('.js-scriptFilterList').html(buttons);

    this.filterScripts();
  };


  private filterScripts() {
    const $allCommand = $('#projectPanel .js-executeCommand');
    $allCommand.show();
    this.scriptFilterList.forEach(script => {

      $allCommand.each((index: number, ele: any) => {
        const $ele = $(ele);
        const content = $ele.text();
        if (content && content === script) {
          $ele.hide();
        }
      });
    });
  };


  private editResourceFile($event: any) {
    const $target = $($event.currentTarget);
    const name = this.getProjectData($target, 'name');
    const path = this.getProjectData($target, 'path');

    const resx = new ResourceEditorViewModel(name);

    const importResx = (object: any, resx: ResourceEditorViewModel, propName: string) => {
      Object.keys(object).forEach(key => {
        const value: string = object[key];
        let target = resx.resources.find(m => m.key === key);
        if (!target) {
          target = new Resource(key, '', '');
          resx.resources.push(target);
        }
        target[propName] = value;
      });
    };

    const loadResource = (filePath: string, propName: string) => {
      $.getScript(filePath).done(
        (script: any, textStatus: any) => {
          const resources = (window as any).iBank.resources;
          importResx(resources, resx, propName);
          resx.compileView();
        }
      );
    };

    loadResource(`${path}resources/resources.zh-TW.js`, 'zh');
    loadResource(`${path}resources/resources.en-US.js`, 'en');
  };


  constructor() {
    $('.folderSelector').on('click', this.selectFolder.bind(this));
    $('#projectPanel').on('click', '.js-executeCommand', this.executeCommand.bind(this));
    $('#projectPanel').on('click', '.js-editResourceFile', this.editResourceFile.bind(this));
    $('.js-globeCommand').on('click', 'button', this.executeGlobeCommand.bind(this));
    $('.js-addToScriptFilter').on('click', this.addToScriptFilter.bind(this));
    $('.js-scriptFilterList').on('click', '.js-deleteFromScriptFilterList', this.deleteFromScriptFilterList.bind(this));

    this.createScriptFilterListView();
  };
};