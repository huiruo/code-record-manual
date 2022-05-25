
## 开始
```
终端进入：
wsl -u root
```

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
git config --global user.email 2196411859@qq.com

ssh-keygen -t rsa -C "2196411859@qq.com"


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


