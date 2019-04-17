
# feuid

## 工具的作用
    

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
