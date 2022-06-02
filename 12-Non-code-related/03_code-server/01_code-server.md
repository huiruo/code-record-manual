## 基础-创建文件夹和文件
```
mkdir /root/log-codeserver

touch /root/log-codeserver/log.txt

rm -f testfile

rm -rf testfile
```

## 安装
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

## 启动code-server

等待安装完成后，就可以启动code-server了：
```
code-server --port 6666 --host 0.0.0.0
```
注意后面的参数是需要的，否则服务器外面的机器是连不上的。

## 让vscode可以在后台一直运行
```
创建用于接收log回显的文件

之后只需要（在code-server目录下）执行该命令，即可后台运行服务，如果出现错误，则可以去log.txt中查看报错原因。

nohup code-server --port 6688 --host 0.0.0.0 >> /home/code-server/log.txt 2>&1 &
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

