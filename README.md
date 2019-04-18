
# feuid

## 使用说明
    提交代码自动添加 唯一ID 属性

    使用原理：git commit 时使用 pre-commit 勾子对已经 git add 的文件里的所有 tag 添加唯一ID属性
    
    解决疼点：UI 自动化测试时，页面上标签的标识变更导致UI测试用例需要重写, feuid 主要为了减少ID变更造成的影响
    
## 适合范围
    * 使用 git 管理的项目
    
    * 使用 npm package.json 安装依赖的前端项目
    
    * 使用 vue 框架的前端项目

## 安装全局指令
    sudo npm install -g feuid

## 使用说明
### 设置提交勾子与处理所有文件指令: feuid -auto 
    cd projectRoot && feuid -auto
    
    # feuid -auto = feuid -setup && feuid -full
    
### 设置提交勾子指令: feuid -setup 
    cd projectRoot && feuid -setup
    
    # 这个指令自动添加2个npm模块 feuid、precommit
    # 并在 package.json 的 scripts 添加 feuid 指令
    # 和在 package.json 添加 pre-commit: ["feuid"] 设置
    # 拷贝 feuid 模块里的 feuid.config.js 到项目根目录
    
### 处理所有文件指令: feuid -full 
    cd projectRoot && feuid -full
    
    # 处理所有符合条件的文档
    
### 处理所有文件指令: feuid -help
    feuid -help
    
    # 显示所有可用命令
    
## 参数配置文件 feuid.config.js
	如果运行命令的项目根目录有 feuid.config.js，工具会自动读取配置参数

## feuid.config.js 说明
	{
	}
