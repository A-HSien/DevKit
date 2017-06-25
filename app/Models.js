System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CommandOutput;
    return {
        setters: [],
        execute: function () {
            ;
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
            exports_1("CommandOutput", CommandOutput);
            ;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTW9kZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7WUFLQyxDQUFDO1lBS0QsQ0FBQztZQUVGLGdCQUFBO2dCQUlFLFlBQ1MsS0FBYSxFQUNiLE1BQWMsRUFDZCxNQUFjO29CQUZkLFVBQUssR0FBTCxLQUFLLENBQVE7b0JBQ2IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtvQkFDZCxXQUFNLEdBQU4sTUFBTSxDQUFRO29CQUVyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3pDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN6QixDQUFDO2dCQUFBLENBQUM7YUFDSCxDQUFBOztZQUFBLENBQUM7UUFBQSxDQUFDIn0=