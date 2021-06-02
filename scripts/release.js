const shell = require("shelljs");

// tag 参数格式 vx.x.x， x 代表整数，例如：v0.0.1
const tag = process.argv[2];

// 打 tag，并推送到远程
function release() {
  shell.exec("git add .");
  shell.exec(`git commit -m 'build ${tag}'`);
  shell.exec(`npm version ${tag} --allow-same-version`);
  shell.exec(`git push --set-upstream origin ${tag}`);
  shell.exec(`git push`);
}

release();
