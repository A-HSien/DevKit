System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CommonUtility;
    return {
        setters: [],
        execute: function () {
            CommonUtility = class CommonUtility {
                static compileView(selector, templateUrl, model, afterFunction) {
                    $.get(templateUrl, (source) => {
                        const template = Handlebars.compile(source);
                        const html = template(model);
                        $(selector).html(html);
                        if (afterFunction && afterFunction instanceof Function)
                            afterFunction();
                    });
                }
                ;
            };
            exports_1("CommonUtility", CommonUtility);
            ;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbW9uVXRpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbW1vblV0aWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztZQUdBLGdCQUFBO2dCQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBZ0IsRUFBRSxXQUFtQixFQUFFLEtBQVUsRUFBRSxhQUF3QjtvQkFDMUYsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFjO3dCQUM5QixNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUM1QyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzdCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3ZCLEVBQUUsQ0FBQyxDQUFDLGFBQWEsSUFBSSxhQUFhLFlBQVksUUFBUSxDQUFDOzRCQUNuRCxhQUFhLEVBQUUsQ0FBQztvQkFFeEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztnQkFBQSxDQUFDO2FBQ0wsQ0FBQTs7WUFBQSxDQUFDO1FBQUEsQ0FBQyJ9