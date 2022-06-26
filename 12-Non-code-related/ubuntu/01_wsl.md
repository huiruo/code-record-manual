## 安装
https://docs.microsoft.com/zh-cn/windows/wsl/install 

## 在 wsl 中打开
```
在vs 打开项目：
code .
```

## 创建
```
cd /home/ruo

mkdir user_ws
```

## git 
```
git config --global user.name "huiruo"
git config --global user.email "2196411859@qq.com"

ssh-keygen -t rsa -C "2196411859@qq.com"

cd /root/.ssh/id_rsa.pub


默认密钥文件路径在~/.ssh，id_rsa是私钥文件，id_rsa.pub是公钥文件
/home/ruo/.ssh/id_rsa

test:
ssh -T git@github.com
```

## node
```
参考：https://developer.aliyun.com/article/760687

安装指定版本:
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
NodeSource 源启用成功后，安装 Node.js 和 npm:
sudo apt-get install -y nodejs

卸载旧版本：
sudo apt-get remove nodejs
sudo apt autoremove
```

## yarn
```
npm install -g yarn --force
```


```javaScript
未能保存“typeorm.config.ts”: 无法写入文件"vscode-remote://wsl+ubuntu-20.04/home/ruo/user_ws/boter/apps/server/config/typeorm.config.ts"(NoPermissions (FileSystemError): Error: EACCES: permission denied, open '/home/ruo/user_ws/boter/apps/server/config/typeorm.config.ts')


wsl (NoPermissions (FileSystemError): Error: EACCES: permission denied, open
```

```
Try this, fixed it for me

sudo chown -R username path 
Example:

sudo chown -R root /home/ruo/user_ws/boter
cd /home/ruo/user_ws/boter

// 这条命令可以
sudo chown -R root /home/
sudo chown 777 /home/
sudo chown 777 /home/ruo/


EACCES: permission denied, open '/home/ruo/.vscode-server/extensions/.obsolete'

chmod 777 -R  需要改变存取模式的目录（中间加的　-R 是递归这个目录下的所有目录和文件）
sudo chmod 777 /home/ -R
```
