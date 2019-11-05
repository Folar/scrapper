
function forker()
{
    var cp = require('child_process');
    cp.fork(__dirname + '/scapper.js');
}
forker();
setInterval(forker,1000*60*1)