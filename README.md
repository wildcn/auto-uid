
#  1. <a name='auto-uid'></a>auto-uid

<!-- TOC -->

- [<a name='auto-uid'></a>auto-uid](#a-nameauto-uidaauto-uid)
- [使用说明](#%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)
- [主要功能点](#%E4%B8%BB%E8%A6%81%E5%8A%9F%E8%83%BD%E7%82%B9)
- [适用范围](#%E9%80%82%E7%94%A8%E8%8C%83%E5%9B%B4)
- [import 执行模式](#import-%E6%89%A7%E8%A1%8C%E6%A8%A1%E5%BC%8F)
  - [<a name='Usage'></a>Usage](#a-nameusageausage)
  - [<a name='Hooks'></a>Hooks](#a-namehooksahooks)
    - [<a name='beforeReadNodesFuncnodenode'></a>beforeReadNodesFuncnode=>node](#a-namebeforereadnodesfuncnodenodeabeforereadnodesfuncnodenode)
    - [<a name='beforeAttrsFuncattributeArrayattributeArray'></a>beforeAttrsFuncattributeArray=>attributeArray](#a-namebeforeattrsfuncattributearrayattributearrayabeforeattrsfuncattributearrayattributearray)
    - [<a name='afterAttrsFuncattributeArrayattributeArray'></a>afterAttrsFuncattributeArray=>attributeArray](#a-nameafterattrsfuncattributearrayattributearrayaafterattrsfuncattributearrayattributearray)
    - [<a name='beforeProcessFunchtmlContenthtmlContent'></a>beforeProcessFunchtmlContent=>htmlContent](#a-namebeforeprocessfunchtmlcontenthtmlcontentabeforeprocessfunchtmlcontenthtmlcontent)
    - [<a name='afterProcessFunsparseContentparseContent'></a>afterProcessFunsparseContent=>parseContent](#a-nameafterprocessfunsparsecontentparsecontentaafterprocessfunsparsecontentparsecontent)
- [命令行模式](#%E5%91%BD%E4%BB%A4%E8%A1%8C%E6%A8%A1%E5%BC%8F)
- [参数配置文件 auto-uid.config.js](#%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6-auto-uidconfigjs)
  - [<a name='auto-uid.config.js'></a>auto-uid.config.js 说明](#a-nameauto-uidconfigjsaauto-uidconfigjs-%E8%AF%B4%E6%98%8E)

<!-- /TOC -->
# 使用说明

    提交代码自动为标签添加 唯一ID 属性

    解决疼点：UI 自动化测试时，页面上标签的标识变更导致UI测试用例需要重写, auto-uid 主要为了减少ID变更造成的影响
    PS. 如使用webpack构建项目，可配合[webpack-plugin-auto-uid](https://www.npmjs.com/package/webpack-plugin-auto-uid)使用。

# 主要功能点

- 自动在DOM中生成auto-uid
- 支持生成 uid 对应的 map 表，并可自定义任意的 uid
- 可根据 dom 结构生成语义化的 uid
- 支持修改配置文件自定义 uid

# 适用范围

    * 使用 npm package.json 安装依赖的前端项目
    * 使用 vue 框架的前端项目
    *@TODO 后续可支持任意html片段导入

# import 执行模式

##  2. <a name='Usage'></a>Usage

```bash
npm i auto-uid --save-dev
// or
yarn add auto-uid -D

```

```javascript
import AutoUid from 'auio-uid';

const APP = new AutoUid(options).project;
/* options详情见命令行的指令，例如
{
  auto:true, // 自动插入执行
  clean:true, // 清除所有插入的uid
  ...
}
*/

APP.getChangeFiles(); // 获取目标文件列表

APP.process(); // 插入uid等操作

APP.realChangeFiles; // 真实改动的文件列表

APP.beforeReadNodesFunc.push(function(nodeData) {
  log(nodeData);
  return nodeData;
});
```

##  3. <a name='Hooks'></a>Hooks

PS. 以下 hooks，均在 APP.process()过程中生效。

###  3.1. <a name='beforeReadNodesFuncnodenode'></a>beforeReadNodesFunc(node)=>node

读取 dom 节点前执行

###  3.2. <a name='beforeAttrsFuncattributeArrayattributeArray'></a>beforeAttrsFunc(attributeArray)=>attributeArray

解析 dom 的 attributes 前的拦截器

###  3.3. <a name='afterAttrsFuncattributeArrayattributeArray'></a>afterAttrsFunc(attributeArray)=>attributeArray

解析 attrs 完成后的拦截器

###  3.4. <a name='beforeProcessFunchtmlContenthtmlContent'></a>beforeProcessFunc(htmlContent)=>htmlContent

解析内容前的拦截器

###  3.5. <a name='afterProcessFunsparseContentparseContent'></a>afterProcessFuns(parseContent)=>parseContent

content 处理完成后的拦截器

# 命令行模式

一键初始化 (切换到项目根目录, 然后执行以下命令)(执行完这条命令之后以后每次 commit 的时候会自动生成唯一 ID)

    sudo npm install -g auto-uid && auto-uid --auto

安装全局指令

    sudo npm install -g auto-uid

设置提交勾子与处理所有文件指令: auto-uid --auto

    cd projectRoot && auto-uid --auto

    # auto-uid --auto = auto-uid --setup && auto-uid --full

其他操作

设置提交勾子指令: auto-uid --setup

    cd projectRoot && auto-uid --setup

    # 这个指令自动添加2个npm模块 auto-uid、husky
    # 拷贝 auto-uid 模块里的 auto-uid.config.js 到项目根目录
    # 拷贝 auto-uid 模块里的 .huskyrc.json 到项目根目录

处理所有文件指令: auto-uid --full

    cd projectRoot && auto-uid --full

    # 处理所有符合条件的文件

处理指定文件指令: auto-uid --target

    cd projectRoot && auto-uid --target ./filepath.vue

    # 处理单个指定的文件

处理指定目录文件指令: auto-uid --dir

    cd projectRoot && auto-uid --dir dir

    # 处理指定目录下的文件

更新已经生成的唯一 ID: auto-uid --update

    auto-uid --full --update

    # 通常与 --full 或者 --target 结合使用

清空 dom 中写入的 uid: auto-uid --clean

    auto-uid --full --clean

使用 dom 结构对应的 uid 代替 uuid: auto-uid --dom

    auto-uid --full --dom

dom 中写入的 uid: auto-uid --write

    auto-uid --full --write

显示帮助指令: auto-uid --help

    auto-uid --help

    # 显示所有可用命令

# 参数配置文件 auto-uid.config.js

    如果运行命令的项目根目录有 auto-uid.config.js，工具会自动读取配置参数

##  4. <a name='auto-uid.config.js'></a>auto-uid.config.js 说明

    {
        "extension": [ 'vue' ]              //需要处理的文件后缀名
        , "language": "vue"                 //处理标签的前端框架，目前只支持 vue, 未来会支持 react、angular
        , "dir": [ 'src' ]                  //需要处理唯一ID的目录，默认为 src
        , "encoding": "utf8"                //项目中的文件编码
        , "attrname": "data-testid"         //唯一ID的属性名
        , "idprefix": ""                    //唯一ID属性值的前缀名
        , "dist": "auto-uid.dist.json",     //生成UID与DOM对应的MAP，如需自定义，请修改该文件后重新运行
        , "fixempty": true                  //如果唯一ID属性为空自动修复
        , "fixrepeat": true                 //如果唯一ID重复自动去重
        //忽略处理的标签名
        , "ignoretag": [ "v-hover", "template","v-else", "el-table-column" ]
    }
