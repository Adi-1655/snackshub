const fs = require('fs');
try {
    fs.writeFileSync('exec_log.txt', 'Execution worked!');
    console.log('Written to file');
} catch (e) {
    console.error(e);
}
