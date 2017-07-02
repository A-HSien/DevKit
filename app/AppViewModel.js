System.register(["./CommonUtility", "./Models", "./ResourceEditorViewModel"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CommonUtility_1, Models_1, ResourceEditorViewModel_1, AppViewModel;
    return {
        setters: [
            function (CommonUtility_1_1) {
                CommonUtility_1 = CommonUtility_1_1;
            },
            function (Models_1_1) {
                Models_1 = Models_1_1;
            },
            function (ResourceEditorViewModel_1_1) {
                ResourceEditorViewModel_1 = ResourceEditorViewModel_1_1;
            }
        ],
        execute: function () {
            AppViewModel = class AppViewModel {
                constructor() {
                    this.workingFolder = '';
                    this.projects = [];
                    this.skipFolder = [
                        'node_modules', '.git', 'packages', 'obj', '.vs', '.nuget', 'bin',
                        'AppAssets', 'iBank.Utilities.Pdf', 'Statement', 'DesignModeling',
                        'Properties', 'Views', 'apis', 'classes', 'Controllers', 'resources'
                    ];
                    this.commandOutputs = [];
                    this.scriptFilterList = [];
                    $('.folderSelector').on('click', this.selectFolder.bind(this));
                    $('#projectPanel').on('click', '.js-executeCommand', this.executeCommand.bind(this));
                    $('#projectPanel').on('click', '.js-editResourceFile', this.editResourceFile.bind(this));
                    $('.js-globeCommand').on('click', 'button', this.executeGlobeCommand.bind(this));
                    $('.js-addToScriptFilter').on('click', this.addToScriptFilter.bind(this));
                    $('.js-scriptFilterList').on('click', '.js-deleteFromScriptFilterList', this.deleteFromScriptFilterList.bind(this));
                    this.createScriptFilterListView();
                }
                selectFolder() {
                    var dialog = Electron.remote.dialog;
                    dialog.showOpenDialog({
                        title: '請選擇目標資料夾',
                        properties: ['openDirectory'],
                    }, this.folderSelected.bind(this));
                }
                ;
                folderSelected(folderNames) {
                    if (!folderNames)
                        return;
                    this.workingFolder = folderNames;
                    $('.workingFolder').html(folderNames);
                    const searchTarget = 'package.json';
                    const searchFilesByFileName = Electron.remote.require('./nodeScripts/searchFilesByFileName');
                    const files = searchFilesByFileName(folderNames, searchTarget, this.skipFolder);
                    this.projects = files.map(file => {
                        const setting = require(file);
                        setting.path = file.replace(searchTarget, '');
                        if (setting.scripts) {
                            const commands = Object.keys(setting.scripts);
                            setting.scripts = commands.map(e => {
                                return {
                                    command: e,
                                    content: setting.scripts[e]
                                };
                            });
                        }
                        else {
                            setting.scripts = [];
                        }
                        return setting;
                    });
                    CommonUtility_1.CommonUtility.compileView('#projectPanel', 'app/projectPanel.html', this);
                }
                ;
                executeCommand($event) {
                    const $target = $($event.currentTarget);
                    let command = $target.html();
                    const path = this.getProjectData($target, 'path');
                    if (!command || !path)
                        return;
                    if ($target.hasClass('js-isBuiltInCommand')) {
                        command = `npm ${command}`;
                    }
                    else {
                        command = `npm run ${command}`;
                    }
                    this.commandOutputs = [];
                    const executeCommand = Electron.remote.require('./nodeScripts/executeCommand');
                    executeCommand(command, [path], true, this.commandCallback.bind(this));
                    return;
                }
                ;
                getProjectData($target, propName) {
                    const $tr = $target.parent().parent();
                    const data = $tr.data(propName);
                    return data;
                }
                ;
                executeGlobeCommand($event) {
                    const $target = $($event.currentTarget);
                    let command = $target.data('command');
                    if (!command)
                        return;
                    let projects = this.projects;
                    if ($target.hasClass('js-isBuiltInCommand')) {
                        command = `npm ${command}`;
                    }
                    else {
                        projects = this.projects.filter(e => e.scripts.some(e => e.command === command));
                        command = `npm run ${command}`;
                    }
                    const dirs = projects.map(e => e.path);
                    if (dirs.length < 1)
                        return;
                    this.commandOutputs = [];
                    const executeCommand = Electron.remote.require('./nodeScripts/executeCommand');
                    executeCommand(command, dirs, true, this.commandCallback.bind(this));
                    return;
                }
                ;
                commandCallback(error, stdout, stderr) {
                    clearTimeout(this.commandOutputsWindowTask);
                    this.commandOutputs.unshift(new Models_1.CommandOutput(error, stdout, stderr));
                    this.commandOutputsWindowTask = setTimeout(() => {
                        CommonUtility_1.CommonUtility.compileView('.js-commandOutputs', 'app/commandOutputs.html', this);
                    }, 1000);
                }
                ;
                addToScriptFilter() {
                    const scriptFilterToAdd = $('.js-scriptFilterToAdd').val();
                    if (scriptFilterToAdd && this.scriptFilterList.indexOf(scriptFilterToAdd) < 0)
                        this.scriptFilterList.push(scriptFilterToAdd);
                    this.createScriptFilterListView();
                }
                ;
                deleteFromScriptFilterList(event) {
                    const target = $(event.currentTarget).text().trim();
                    this.scriptFilterList = this.scriptFilterList.filter(e => e !== target);
                    this.createScriptFilterListView();
                }
                ;
                createScriptFilterListView() {
                    const buttons = this.scriptFilterList.map(e => {
                        return `<button class="btn btn-danger js-deleteFromScriptFilterList"> ${e} <span class="glyphicon glyphicon-remove"></span></button>`;
                    });
                    $('.js-scriptFilterList').html(buttons);
                    this.filterScripts();
                }
                ;
                filterScripts() {
                    const $allCommand = $('#projectPanel .js-executeCommand');
                    $allCommand.show();
                    this.scriptFilterList.forEach(script => {
                        $allCommand.each((index, ele) => {
                            const $ele = $(ele);
                            const content = $ele.text();
                            if (content && content === script) {
                                $ele.hide();
                            }
                        });
                    });
                }
                ;
                editResourceFile($event) {
                    const $target = $($event.currentTarget);
                    const name = this.getProjectData($target, 'name');
                    const path = this.getProjectData($target, 'path');
                    const resx = new ResourceEditorViewModel_1.ResourceEditorViewModel(name);
                    const importResx = (object, resx, propName) => {
                        Object.keys(object).forEach(key => {
                            const value = object[key];
                            let target = resx.resources.find(m => m.key === key);
                            if (!target) {
                                target = new ResourceEditorViewModel_1.Resource(key, '', '');
                                resx.resources.push(target);
                            }
                            target[propName] = value;
                        });
                    };
                    const loadResource = (filePath, propName) => {
                        $.getScript(filePath).done((script, textStatus) => {
                            const resources = window.iBank.resources;
                            importResx(resources, resx, propName);
                            resx.compileView();
                        });
                    };
                    loadResource(`${path}resources/resources.zh-TW.js`, 'zh');
                    loadResource(`${path}resources/resources.en-US.js`, 'en');
                }
                ;
                ;
            };
            exports_1("AppViewModel", AppViewModel);
            ;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwVmlld01vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwVmlld01vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUEsZUFBQTtnQkF1TUU7b0JBck1RLGtCQUFhLEdBQVcsRUFBRSxDQUFDO29CQUMzQixhQUFRLEdBQWMsRUFBRSxDQUFDO29CQUN6QixlQUFVLEdBQUc7d0JBQ25CLGNBQWMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUs7d0JBQ2pFLFdBQVcsRUFBRSxxQkFBcUIsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCO3dCQUNqRSxZQUFZLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLFdBQVc7cUJBQ3JFLENBQUM7b0JBQ00sbUJBQWMsR0FBb0IsRUFBRSxDQUFDO29CQUNyQyxxQkFBZ0IsR0FBYSxFQUFFLENBQUM7b0JBOEx0QyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQy9ELENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3JGLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDekYsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENB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