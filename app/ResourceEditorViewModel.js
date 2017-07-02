System.register(["./CommonUtility", "./CSVHelper"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CommonUtility_1, CSVHelper_1, ResourceEditorViewModel, Resource;
    return {
        setters: [
            function (CommonUtility_1_1) {
                CommonUtility_1 = CommonUtility_1_1;
            },
            function (CSVHelper_1_1) {
                CSVHelper_1 = CSVHelper_1_1;
            }
        ],
        execute: function () {
            ResourceEditorViewModel = class ResourceEditorViewModel {
                constructor(projectName) {
                    this.projectName = projectName;
                    this.resources = [];
                }
                ;
                fileSelected(filePath) {
                    if (!filePath || !filePath.length || filePath.length === 0)
                        return;
                    const fs = Electron.remote.require('fs');
                    fs.readFile(filePath[0], 'utf-8', (err, data) => {
                        if (err) {
                            alert("An error ocurred reading the file :" + err.message);
                            return;
                        }
                        const toCompare = CSVHelper_1.CSVHelper.CSVToObjectArray(data);
                        console.log(toCompare);
                    });
                }
                ;
                compareSelector() {
                    const dialog = Electron.remote.dialog;
                    dialog.showOpenDialog({
                        title: '請選擇比對目標',
                        properties: ['openFile', 'showHiddenFiles'],
                        filters: [
                            { name: 'All Files', extensions: ['csv'] }
                        ]
                    }, this.fileSelected.bind(this));
                }
                ;
                exportCSV() {
                    const csvContent = CSVHelper_1.CSVHelper.tableToCSV('.js-resourcesTable');
                    CSVHelper_1.CSVHelper.download(csvContent, 'resources.csv');
                }
                ;
                compileView() {
                    CommonUtility_1.CommonUtility.compileView('#resourcesEditor', 'app/resourcesEditor.html', this, this.eventBinding.bind(this));
                    this.eventBinding();
                }
                ;
                eventBinding() {
                    $('.js-exportCSV').on('click', this.exportCSV.bind(this));
                    $('.js-compareSelector').on('click', this.compareSelector.bind(this));
                }
                ;
            };
            exports_1("ResourceEditorViewModel", ResourceEditorViewModel);
            ;
            Resource = class Resource {
                constructor(key, zh, en) {
                    this.key = key;
                    this.zh = zh;
                    this.en = en;
                }
                ;
            };
            exports_1("Resource", Resource);
            ;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2VFZGl0b3JWaWV3TW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJSZXNvdXJjZUVkaXRvclZpZXdNb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztZQU1BLDBCQUFBO2dCQUdJLFlBQ1csV0FBbUI7b0JBQW5CLGdCQUFXLEdBQVgsV0FBVyxDQUFRO29CQUg5QixjQUFTLEdBQWUsRUFBRSxDQUFDO2dCQUl2QixDQUFDO2dCQUFBLENBQUM7Z0JBSUUsWUFBWSxDQUFDLFFBQWtCO29CQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7d0JBQUMsTUFBTSxDQUFDO29CQUVuRSxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFekMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBUSxFQUFFLElBQVk7d0JBQ3JELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQ04sS0FBSyxDQUFDLHFDQUFxQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs0QkFDM0QsTUFBTSxDQUFDO3dCQUNYLENBQUM7d0JBQ0QsTUFBTSxTQUFTLEdBQUcscUJBQVMsQ0FBQyxnQkFBZ0IsQ0FBVyxJQUFJLENBQUMsQ0FBQzt3QkFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDM0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztnQkFBQSxDQUFDO2dCQUVNLGVBQWU7b0JBQ25CLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO29CQUV0QyxNQUFNLENBQUMsY0FBYyxDQUNqQjt3QkFDSSxLQUFLLEVBQUUsU0FBUzt3QkFDaEIsVUFBVSxFQUFFLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDO3dCQUMzQyxPQUFPLEVBQUU7NEJBQ0wsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFO3lCQUM3QztxQkFDSixFQUNELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUMvQixDQUFBO2dCQUVMLENBQUM7Z0JBQUEsQ0FBQztnQkFFTSxTQUFTO29CQUNiLE1BQU0sVUFBVSxHQUFHLHFCQUFTLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7b0JBQzlELHFCQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDcEQsQ0FBQztnQkFBQSxDQUFDO2dCQUVGLFdBQVc7b0JBQ1AsNkJBQWEsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsMEJBQTBCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQzlHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDeEIsQ0FBQztnQkFBQSxDQUFDO2dCQUVNLFlBQVk7b0JBQ2hCLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQzFELENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDMUUsQ0FBQztnQkFBQSxDQUFDO2FBQ0wsQ0FBQTs7WUFBQSxDQUFDO1lBRUYsV0FBQTtnQkFFSSxZQUNXLEdBQVcsRUFDWCxFQUFVLEVBQ1YsRUFBVTtvQkFGVixRQUFHLEdBQUgsR0FBRyxDQUFRO29CQUNYLE9BQUUsR0FBRixFQUFFLENBQVE7b0JBQ1YsT0FBRSxHQUFGLEVBQUUsQ0FBUTtnQkFDakIsQ0FBQztnQkFBQSxDQUFDO2FBQ1QsQ0FBQTs7WUFBQSxDQUFDO1FBQ0YsQ0FBQyJ9