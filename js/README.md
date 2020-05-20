# lovedk in js
## step 1. install

```shell
# use npm
npm install
# or use yarn
yarn
```
对于 Ubuntu 用户，还是需要安装那么一堆。
```shell
sudo apt-get install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```


## step 2. config

方法一：在 `lovedk.js` 的57-58行直接改变变量内容。

```python
let username = '';
let password = '';
```

方法二：使用命令行参数传入

```shell
node lovedk.js <your_username> <your_password>
```




