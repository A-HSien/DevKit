System.register(["./Models"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Models_1, HandlebarsHelper, AppViewModel, ResourceViewModel, Resource;
    return {
        setters: [
            function (Models_1_1) {
                Models_1 = Models_1_1;
            }
        ],
        execute: function () {
            HandlebarsHelper = class HandlebarsHelper {
                static compileView(selector, templateUrl, model) {
                    $.get(templateUrl, (source) => {
                        const template = Handlebars.compile(source);
                        const html = template(model);
                        $(selector).html(html);
                    });
                }
                ;
            };
            ;
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
                    HandlebarsHelper.compileView('#projectPanel', 'app/projectPanel.html', this);
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
                        HandlebarsHelper.compileView('.js-commandOutputs', 'app/commandOutputs.html', this);
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
                    const resx = new ResourceViewModel(name);
                    const importResx = (object, resx, propName) => {
                        Object.keys(object).forEach(key => {
                            const value = object[key];
                            let target = resx.resources.find(m => m.key === key);
                            if (!target) {
                                target = new Resource(key, '', '');
                                resx.resources.push(target);
                            }
                            target[propName] = value;
                        });
                    };
                    $.getScript(`${path}/resources/resource.zh-TW.js`).done((script, textStatus) => {
                        const zh = window.resource;
                        importResx(zh, resx, 'zh');
                        resx.compileView();
                    });
                    $.getScript(`${path}/resources/resource.en-US.js`).done((script, textStatus) => {
                        const en = window.resource;
                        importResx(en, resx, 'en');
                        resx.compileView();
                    });
                }
                ;
                ;
            };
            exports_1("AppViewModel", AppViewModel);
            ;
            ResourceViewModel = class ResourceViewModel {
                constructor(projectName) {
                    this.projectName = projectName;
                    this.resources = [];
                }
                ;
                compileView() {
                    HandlebarsHelper.compileView('#resourcesEditor', 'app/resourcesEditor.html', this);
                }
                ;
            };
            ;
            Resource = class Resource {
                constructor(key, zh, en) {
                    this.key = key;
                    this.zh = zh;
                    this.en = en;
                }
                ;
            };
            ;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwVmlld01vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwVmlld01vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O1lBUUEsbUJBQUE7Z0JBQ0UsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFnQixFQUFFLFdBQW1CLEVBQUUsS0FBVTtvQkFDbEUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFjO3dCQUNoQyxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUM1QyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzdCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3pCLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQUEsQ0FBQzthQUNILENBQUE7WUFBQSxDQUFDO1lBRUYsZUFBQTtnQkEyTUU7b0JBek1RLGtCQUFhLEdBQVcsRUFBRSxDQUFDO29CQUMzQixhQUFRLEdBQWMsRUFBRSxDQUFDO29CQUN6QixlQUFVLEdBQUc7d0JBQ25CLGNBQWMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUs7d0JBQ2pFLFdBQVcsRUFBRSxxQkFBcUIsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCO3dCQUNqRSxZQUFZLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLFdBQVc7cUJBQ3JFLENBQUM7b0JBQ00sbUJBQWMsR0FBb0IsRUFBRSxDQUFDO29CQUNyQyxxQkFBZ0IsR0FBYSxFQUFFLENBQUM7b0JBa010QyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JB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