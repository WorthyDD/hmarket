# 爬虫运行方式
- 下载代码
- 如果新增其他城市，需修改 manifest.json 的 matches,添加相应城市网址的白名单
  ```
            "matches": [
                "https://cd.lianjia.com/ershoufang/*",
                "https://xa.lianjia.com/ershoufang/*"
            ],
  ```
- 打开chrome 浏览器，扩展程序-管理扩展程序-打开开发者模式(右上角)-加载已解压扩展程序目录-选择程序根目录；
- 扩展插件已加载，打开插件开关；
- 访问链家如： https://xa.lianjia.com/ershoufang/rs/， 选择好城市，筛选条件；
- 点击右下角悬浮按钮 🤖，开始爬虫，爬取的内容自动下载到 download 下；

# 汇总 excel
- 修改 main.py
  ```
  city = 'xian'
  date = '20240220'
  ```
- 在 pyscripts/data 下创建当前日期目录如： 20240220
- 确认代码 main.py
  ```
  if __name__ == '__main__':
    read_download_data()
    writeToExcel()
  ```
- 运行 python3 main.py 写入excel
