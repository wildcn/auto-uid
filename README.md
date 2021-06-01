
# auto-uid
基于feuid2(https://github.com/hnjd-fe/feuid2)
## 使用说明
    提交代码自动为标签添加 唯一ID 属性

    解决疼点：UI 自动化测试时，页面上标签的标识变更导致UI测试用例需要重写, auto-uid 主要为了减少ID变更造成的影响
    
## 相对于feuid2的改动

- 基于parse5解析，而非正则
- 可选择不侵入源码，而在编译流程中加入uid
- 支持生成uid对应的map表，并可自定义任意的uid
- 支持写入和清空
- 可根据dom结构生成语义化的uid

## 适用范围
    * 使用 git 管理的项目
    
    * 使用 npm package.json 安装依赖的前端项目
    
    * 使用 vue 框架的前端项目

    *@TODO 后续可支持任意html片段导入

## 一键初始化 (切换到项目根目录, 然后执行以下命令)(执行完这条命令之后以后每次commit的时候会自动生成唯一ID)
    sudo npm install -g auto-uid && auto-uid --auto
    
## 执行效果

### 执行流程
![auto-uid-commit-flow.png](http://p6.qhimg.com/d/inn/06dfd366/images/feuid-commit-flow.png)

### 执行前
![pre-execute.png](http://p8.qhimg.com/d/inn/06dfd366/images/pre-execute.png)

### 执行后
![after-execute.png](http://p9.qhimg.com/d/inn/4dd249a9/after-execute.png)

### package.json
![package.json.png](http://btbtd.org/uploads/auto-uid/package.json.png)

## 安装全局指令
    sudo npm install -g auto-uid

## 设置提交勾子与处理所有文件指令: auto-uid --auto 
    cd projectRoot && auto-uid --auto
    
    # auto-uid --auto = auto-uid --setup && auto-uid --full
    
## 其他操作
    
### 设置提交勾子指令: auto-uid --setup 
    cd projectRoot && auto-uid --setup
    
    # 这个指令自动添加2个npm模块 auto-uid、husky
    # 拷贝 auto-uid 模块里的 auto-uid.config.js 到项目根目录
    # 拷贝 auto-uid 模块里的 .huskyrc.json 到项目根目录
    
### 处理所有文件指令: auto-uid --full 
    cd projectRoot && auto-uid --full
    
    # 处理所有符合条件的文件
    
### 处理指定文件指令: auto-uid --target 
    cd projectRoot && auto-uid --target ./filepath.vue
    
    # 处理单个指定的文件 

### 处理指定目录文件指令: auto-uid --dir 
    cd projectRoot && auto-uid --dir dir
    
    # 处理指定目录下的文件 
    
### 更新已经生成的唯一ID: auto-uid --update
    auto-uid --full --update
    
    # 通常与 --full 或者 --target 结合使用


### 清空dom中写入的uid: auto-uid --clean
    auto-uid --full --clean
    
### dom中写入的uid: auto-uid --write
    auto-uid --full --write
    
### 显示帮助指令: auto-uid --help
    auto-uid --help
    
    # 显示所有可用命令
    
## 参数配置文件 auto-uid.config.js
	如果运行命令的项目根目录有 auto-uid.config.js，工具会自动读取配置参数

## auto-uid.config.js 说明
	{
	    "extension": [ 'vue' ]              //需要处理的文件后缀名
	    , "language": "vue"                 //处理标签的前端框架，目前只支持 vue, 未来会支持 react、angular
	    , "dir": [ 'src' ]                  //需要处理唯一ID的目录，默认为 src
	    , "encoding": "utf8"                //项目中的文件编码
	    , "attrname": "data-testid"         //唯一ID的属性名
	    , "idprefix": ""                    //唯一ID属性值的前缀名
	    , "dist": "auto-uid.dist.json",     //生成UID与DOM对应的MAP
	    , "fixempty": true                  //如果唯一ID属性为空自动修复
	    , "fixrepeat": true                 //如果唯一ID重复自动去重
	    //忽略处理的标签名
	    , "ignoretag": [ "v-hover", "template","v-else", "el-table-column" ]   
	}
