
参考：https://blog.csdn.net/freeking101/article/details/122725389
https://blog.csdn.net/m0_52443399/article/details/123596933
```
安装 Termux 后，启动它并使用 Termux 的 pkg 命令执行一些必要的软件安装。

订阅附加仓库 root-repo ：pkg install root-repo
执行更新，使所有安装的软件达到最新状态：

pkg install python
        
apt install less   // termux下vim支持触摸移动光标移动位置

sl
安装命令：pkg install sl

fish
安装命令：pkg install fish
执行命令：fish
清屏。
输入：exit，退出。

安装sudo
一开始是不能用sudo命令的，所以需要输入安装sudo
pkg install tsu
```

## 常用快捷键
Ctrl键是终端用户常用的按键，但大多数触摸键盘都没有这个按键。为此 Termux 使用音量减小按钮来模拟Ctrl键。 例如，在触摸键盘上按音量减小+ L发送与在硬件键盘上按Ctrl + L相同的输入。
```
Ctrl+A -> 将光标移动到行首
Ctrl+C -> 中止当前进程
Ctrl+D -> 注销终端会话
Ctrl+E -> 将光标移动到行尾
Ctrl+K -> 从光标删除到行尾
Ctrl+L -> 清除终端
Ctrl+Z -> 挂起（发送SIGTSTP到）当前进程
```
音量加键 也可以作为产生特定输入的 特殊键。
```
音量加+E -> Esc键
音量加+T -> Tab键
音量加+1 -> F1（和音量增加+ 2→F2等）
音量加+0 -> F10
音量加+B -> Alt + B，使用readline时返回一个单词
音量加+F -> Alt + F，使用readline时转发一个单词
音量加+X -> Alt+X
音量加+W -> 向上箭头键
音量加+A -> 向左箭头键
音量加+S -> 向下箭头键
音量加+D -> 向右箭头键
音量加+L -> | （管道字符）
音量加+H -> 〜（波浪号字符）
音量加+U -> _ (下划线字符)
音量加+P -> 上一页
音量加+N -> 下一页
音量加+. -> Ctrl + \（SIGQUIT）
音量加+V -> 显示音量控制
音量加+Q -> 显示额外的按键视图
```

## 目录结构 和 特殊环境变量 PREFIX
```
~ > echo $HOME
/data/data/com.termux/files/home
~ > echo $PREFIX
/data/data/com.termux/files/usr
 
~ > echo $TMPPREFIX
/data/data/com.termux/files/usr/tmp/zsh
```
长期使用 Linux 的朋友可能会发现，这个 HOME 路径看上去可能不太一样，为了方便，Termux 提供了一个特殊的环境变量：PREFIX


## termux 的nginx
```
apt install nginx -y
nginx文件安装完成之后的文件位置：

/usr/sbin/nginx：主程序
/etc/nginx：存放配置文件
/usr/share/nginx：存放静态文件
/var/log/nginx：存放日志

service nginx start  #启动nginx
nginx -s quit
nginx -s reload

ifconfig
192.168.1.102 
192.168.1.255
```

### 在termux 上
```
pkg install nginx

nginx

浏览器输入127.0.0.1:8080看到以下界面即成功
```

### nginx 常用命令
```
nginx -s quit //优雅停止nginx，有连接时会等连接请求完成再杀死worker进程

nginx -s reload //优雅重启，并重新载入配置文件nginx.conf

nginx -s reopen //重新打开日志文件，一般用于切割日志

nginx -v //查看版本

nginx -t //检查nginx的配置文件

nginx -h //查看帮助信息

nginx -V //详细版本信息，包括编译参数

nginx -c filename //指定配置文件
```