import AutoUid from "../src/main";

const APP = new AutoUid({ debug: true, auto: true }).project;

APP.process();

console.log(APP.realChangeFiles);
