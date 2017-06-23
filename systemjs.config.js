(function (global) {
    System.config({
        paths: {
            'npm:': 'node_modules/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: 'app'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './startup.js',
                defaultExtension: 'js'
            }
        }
    });

    System.registerDynamic('moment', [], true, function (require, exports, module) {
        module.exports = moment;
    });
})(this);