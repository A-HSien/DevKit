declare const Handlebars: any;
declare const $: any;

export class CommonUtility {
    static compileView(selector: string, templateUrl: string, model: any, afterFunction?: Function) {
        $.get(templateUrl, (source: string) => {
            const template = Handlebars.compile(source);
            const html = template(model);
            $(selector).html(html);
            if (afterFunction && afterFunction instanceof Function)
                afterFunction();

        });
    };
};