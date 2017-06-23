function executeCommand(command, dirs, showError, callback) {
    console.log('================================================================');
    var project = dirs.splice(0, 1).toString();
    process.chdir(project);
    console.log(`processing ${command}, on: ${process.cwd()}`);

    var exec = require('child_process').exec;
    exec(command, function (error, stdout, stderr) {
        if (showError && showError.toString() === 'true') {
            if (error) { console.log('error: ' + error); }
            if (stderr) { console.log('stderr: ' + stderr); }
        }
        if (stdout) { console.log('stdout: ' + stdout); }
        callback(error, stdout, stderr);
        while (dirs.length > 0) { executeCommand(command, dirs, showError, callback); }
    });
};

module.exports = executeCommand;