System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AppViewModele, CommandOutput;
    return {
        setters: [],
        execute: function () {
            ;
            ;
            AppViewModele = class AppViewModele {
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
                    $.get('app/projectPanel.html', (source) => {
                        const template = Handlebars.compile(source);
                        const html = template(this);
                        $('#projectPanel').html(html);
                    });
                }
                ;
                executeCommand($event) {
                    const $target = $($event.currentTarget);
                    let command = $target.html();
                    const $parent = $target.parent();
                    const path = $parent.data('path');
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
                    this.commandOutputs.unshift(new CommandOutput(error, stdout, stderr));
                    this.commandOutputsWindowTask = setTimeout(() => {
                        $.get('app/commandOutputs.html', (source) => {
                            const template = Handlebars.compile(source);
                            const html = template(this);
                            $('.js-commandOutputs').html(html);
                        });
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
                ;
            };
            exports_1("AppViewModele", AppViewModele);
            ;
            CommandOutput = class CommandOutput {
                constructor(error, stdout, stderr) {
                    this.error = error;
                    this.stdout = stdout;
                    this.stderr = stderr;
                    this.title = new Date().toLocaleString();
                    this.time = Date.now();
                }
                ;
            };
            ;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwVmlld01vZGVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkFwcFZpZXdNb2RlbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztZQVNDLENBQUM7WUFLRCxDQUFDO1lBR0YsZ0JBQUE7Z0JBbUtFO29CQWpLUSxrQkFBYSxHQUFXLEVBQUUsQ0FBQztvQkFDM0IsYUFBUSxHQUFjLEVBQUUsQ0FBQztvQkFDekIsZUFBVSxHQUFHO3dCQUNuQixjQUFjLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLO3dCQUNqRSxXQUFXLEVBQUUscUJBQXFCLEVBQUUsV0FBVyxFQUFFLGdCQUFnQjt3QkFDakUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxXQUFXO3FCQUNyRSxDQUFDO29CQUNNLG1CQUFjLEdBQW9CLEVBQUUsQ0FBQztvQkFDckMscUJBQWdCLEdBQWEsRUFBRSxDQUFDO29CQTBKdEMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUMvRCxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNyRixDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2pGLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJ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