const executeCommandByFileSearch = require('./executeCommandByFileSearch');
executeCommandByFileSearch(
    'npm run unzipLib',
    'package.json',
    ['node_modules', '.git', 'packages', 'obj', 'AppAssets', 'Statement', '.vs', '.nuget'],
    true
);