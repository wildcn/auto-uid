let result = {
  extension: ["vue"],
  language: "vue",
  dir: ["src","test"],
  dist: "auto-uid.dist.json",
  encoding: "utf8",
  attrname: "data-auid",
  fixempty: true,
  fixrepeat: true,
  idprefix: "auid-",
  ignoretag: ["v-hover", "template", "el-table-column","v-else"]
};

module.exports = result;
