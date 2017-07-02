declare const $: any;

export class CSVHelper {

    static download(csv: string, filename: string) {
        const csvFile = new Blob([csv], { type: "text/csv" });
        const downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.click();
    };

    static tableToCSV(tableSelector: any): string {
        var csv = [];
        var rows = $(tableSelector).find('tr');

        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");

            for (var j = 0; j < cols.length; j++)
                row.push(cols[j].innerText);

            csv.push(row.join(","));
        }

        return csv.join("\r\n");
    };

    static CSVToObjectArray<T>(csv: string, converter?: (object: T) => T): T[] {
        var allLines = csv.split(/\r\n|\n/);
        var headers = allLines[0].split(',');
        var array = [];

        for (var i = 1; i < allLines.length; i++) {
            var data = allLines[i].split(',');
            if (data.length == headers.length) {
                var object: T = {} as T;
                for (var j = 0; j < headers.length; j++) {
                    object[headers[j]] = data[j];
                }
                if (converter && converter instanceof Function)
                    object = converter(object);
                    
                array.push(object);
            }
        }
        return array;
    };
}; 