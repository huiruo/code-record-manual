## redis
```
sudo apt-get update

sudo apt-get install -y redis-server

service 服务识别不了redis 要不没安装 或者安装了名字不是这个
可以用service --status-all 查看一下支持的服务

然后再sudo service redis-server start 成功

启动：
sudo service redis-server start

查看状态：
service redis-server status
```

## 配置
```
root@CHENG:/etc/systemd/system# whereis redis
redis: /etc/redis
cd /etc/redis

改为6388：
设置密码

配置文件中添加 requirepass 123456

重启redis，命令service redis restart。
service redis-server restart

在查看端口情况如下:
netstat -talnp
```