## readme
```
vi ~/.config/code-server/config.yaml

code-server --host 0.0.0.0

后台运行：
proot-distro login ubuntu
nohup code-server --host 0.0.0.0 >> /home/code-server-config/log.txt 2>&1 &
vi /home/code-server-config/log.txt
abchen123
```

## 启动code-server
注意后面的参数是需要的，否则服务器外面的机器是连不上的。
```
code-server --port 6666 --host 0.0.0.0
code-server --host 0.0.0.0
```

### 配置？
```
cd /root/.local/share/code-server/User
touch keybindings.json
```

## 基础-创建文件夹和文件
```
mkdir /root/log-codeserver

touch /root/log-codeserver/log.txt

rm -f testfile

rm -rf testfile

查看版本
cat /etc/issue
```

## 安装 code 
curl -fsSL https://code-server.dev/install.sh | sh
```
CentOS Linux 7 (Core)
Installing v4.4.0 of the amd64 rpm package from GitHub.

+ mkdir -p ~/.cache/code-server

To have systemd start code-server now and restart on boot:
  sudo systemctl enable --now code-server@$USER
Or, if you don't want/need a background service you can run:
  code-server
```

## Stop the code-server
对于后台运行的服务，首先要根据你服务的端口号找到进程pid，然后使用kill命令结束服务进程

查看使用某端口的进程：lsof -i:8090
或 netstat -ap|grep 8090
查看到进程id之后，使用netstat命令查看其占用的端口

netstat -nap|grep 6688

终止后台运行的进程：kill -9 进程号
```
netstat -tunlp

# 回显（部分）
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:9999            0.0.0.0:*               LISTEN      20309/node
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1163/sshd
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      1379/master
tcp6       0      0 :::22                   :::*                    LISTEN      1163/sshd

# 可以看到占用0.0.0.0:9999的进程的pid为20309

# kill掉即可

kill -9 20309

kill -9 20405
```

## 常用软件 termux
apt update     // 更新源
apt upgrade  // 升级软件包
```
pkg install vim
apt install wget   // 下载工具
apt install tar    // 解压缩工具
```

## 安装 linux
pkg install proot-distro 
proot-distro list
```
proot-distro install <alias> 
比如，我要安装ubuntu 20.04，指令为：
proot-distro install ubuntu-20.04

proot-distro login ubuntu
输入exit可以退出登录的linux系统
```

### 安装Linux后
```
apt update
apt upgrade

可选：
apt install nodejs
apt install npm
apt install gcc
apt install g++
apt install gfortran
apt install cmake

然后安装java：
apt search openjdk

然后安装python。
apt install python3
```

### vim 配置
https://www.bilibili.com/video/av844444336/