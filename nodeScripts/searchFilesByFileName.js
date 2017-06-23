
function searchFilesByFileName(dir, searchTarget, skipTargets) {
    try {
        dir = dir.toString();
        console.log('execute searchFilesByFileName on: ' + dir);
        console.log('searchTarget: ' + searchTarget);
        if (!searchTarget || searchTarget === '') {
            return [];
        }
        var fs = require('fs');
        var path = require('path');

        var contents = fs.readdirSync(dir);
        console.dir(contents);
        var result = contents.reduce(function (list, file) {
            var name = path.join(dir, file).toString();
            if (file.endsWith(searchTarget)) {
                console.info('find: ' + name);
                list.push(name);
            } else {
                var isDir = fs.statSync(name).isDirectory();
                var shouldSkip = !isDir ? true : skipTargets.some(target => file.includes(target));
                if (!shouldSkip) {
                    console.info('keep search on folder: ' + name);
                    var next = searchFilesByFileName(name, searchTarget, skipTargets);
                    return list.concat(next);
                }
            }
            return list;
        }, []);
        return result;
    } catch (err) {
        console.error(err);
    }
};


module.exports = searchFilesByFileName;