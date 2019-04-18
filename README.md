
# feuid

## 使用说明
    git commit 时使用 pre-commit 勾子对已经 add 的文件添加唯一ID属性
    
## 适合范围
    * 使用 git 管理的项目
    * 使用 npm package.json 安装依赖的前端项目
    * 使用 vue 框架的前端项目

## 全局安装
    sudo npm install -g feuid

## 使用
### 方法1: 切换到项目根目录, 然后执行命令 feuid
    cd projectRoot && feuid

### 方法2: 使用 feuid 路径, 支持相对路径
    feuid /var/www/your_project_root

## 参数配置文件 feuid.config.js
	如果运行命令的目录有 feuid.config.js，工具会尝试读取JSON的配置参数，自动填充输入参数

## feuid.config.js 说明
	{
	}
