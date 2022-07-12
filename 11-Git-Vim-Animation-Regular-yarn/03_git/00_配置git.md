
## 1
```
git config --global user.name "huiruo"
git config --global user.email "2196411859@qq.com"

git config --global user.name "shuling"
git config --global user.email "3221563643@qq.com"

ssh-keygen -t rsa -C "2196411859@qq.com"

Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.

验证添加SSH key成功否：
ssh -T git@github.com

git clone git@github.com:huiruo/code-record-manual.git
```