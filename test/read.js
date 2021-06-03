const fs = require('fs');

const content = fs.readFileSync("/Users/dulianqiang/lanxin/auto-uid/test/t2.vue",{encoding:'utf8'});
console.log('%ccontent: ', 'color: MidnightBlue; background: Aquamarine;', content);
