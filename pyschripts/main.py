#coding：utf-8
import traceback
import random
import re
# import requests
import os
import shutil
import platform
import json
import time
import pandas as pd


#配置
city = 'xian'
date = '2023-11-23'

def read_download_data():

    type = platform.system()
    print('current system: ', type)
    path = 'C:\\Users\\cathy\\Downloads\\' if type == 'Windows' else '/Users/wuxi/Downloads/'
    print(path)
    # path = os.curdir+"/data/"
    # print(path)
    cur_img_path = f".\\data\\{city}" if type == "Windows" else f"./data/{city}/"
    for root,folders,files in os.walk(path):
        for file in files:
            # print(file)
            if not(file.startswith('lianjia_') and file.endswith('txt')):
                continue
            try:
                source_path = path + file
                print('move', source_path, cur_img_path)
                if not os.path.isfile(cur_img_path+file):
                    shutil.move(source_path, cur_img_path)
                # download(path + file)
            except Exception as e:
                traceback.print_exc(e)
                # continue
            finally:
                continue


def writeToExcel():

    datadir = f'./data/{city}'
    target_excel = f'./data/{city}/lianjia.xlsx'


    files = os.listdir(datadir)

    df = None
    for filename in files:
        filepath = os.path.join(datadir, filename)
        if not os.path.isfile(filepath):
            continue
        if not filename.endswith('txt'):
            continue
        with open(filepath, 'r', encoding='utf-8') as file:

            try:
                data = json.load(file)
                print(data)
                if df is None:
                    df = pd.DataFrame(data)
                else:
                    new_df = pd.DataFrame(data)
                    df = pd.concat([df, new_df], ignore_index=True)

            except Exception as e:
                print(filename, '----------', e)

    if not os.path.exists(target_excel):
        df.to_excel(target_excel, index=False, sheet_name=date)
    else:
        # 追加到现有的 Excel 文件
        with pd.ExcelWriter(target_excel, engine='openpyxl', mode='a', if_sheet_exists='overlay') as writer:
            df.to_excel(writer, index=False, sheet_name=date, header=False)

if __name__ == '__main__':
    # read_download_data()

    writeToExcel()