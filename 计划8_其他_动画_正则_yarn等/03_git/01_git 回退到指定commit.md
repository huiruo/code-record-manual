#### 方法1.回退不提交（可能不生效）

$ git reset --hard HEAD^ 回退到上个版本
$ git reset --hard HEAD~3 回退到前3次提交之前，以此类推，回退到n次提交之前
$ git reset --hard commit_id 退到/进到 指定commit的sha码

#### 方法2：回退不提交（推荐）
```
git reset --hard 962c01f580a2c5b2afa86625b36d5472af1c4033
git reset --hard 7a5d01600673fd7c6acccb6362f2eca71a5f2d34
git reset --hard 4402b8f403c5f347756da0d21a75a82b587c3dce

git reset --hard 6de121c3f13a88d466fd842284c1095517642b6b
git reset --hard 53809e7c07c4452cee4f761f19e847534b98359c
```

#### 第二步，提交
强推到远程：
$ 
git push origin HEAD --force

