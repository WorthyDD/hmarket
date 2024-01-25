#coding：utf-8
import re
import traceback
import os
import shutil
import platform
import json
import pandas as pd


#配置
# city = 'chengdu'
city = 'xian'
date = '20240125'

def read_download_data():

    type = platform.system()
    print('current system: ', type)
    path = 'C:\\Users\\cathy\\Downloads\\' if type == 'Windows' else '/Users/wuxi/Downloads/'
    print(path)
    # path = os.curdir+"/data/"
    # print(path)
    cur_img_path = f".\\data\\{city}" if type == "Windows" else f"./data/{city}/{date}"
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


def clean_sheet_name(name):
    # 移除非法字符
    cleaned_name = re.sub(r'[\\/*?:\[\]]', '', name)
    return cleaned_name[:31]  # 限制长度为31个字符，以确保符合 Excel 的限制


def writeToExcel():

    datadir = f'./data/{city}/{date}'
    target_excel = f'./data/{city}/{date}/lianjia.xlsx'


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
    # df['title'] = df['title'].apply(clean_sheet_name)
    mask = df['title'].str.contains('A级景区房，毛坯房任意发挥装修')
    df.loc[mask, 'title'] = '未知标题'

    if not os.path.exists(target_excel):
        df.to_excel(target_excel, index=False, sheet_name=date)
    else:
        # 追加到现有的 Excel 文件
        with pd.ExcelWriter(target_excel, engine='openpyxl', mode='a', if_sheet_exists='overlay') as writer:
            df.to_excel(writer, index=False, sheet_name=date, header=True)

def mergeExcel():
    # datadir = f'./data/{city}/{date}'
    target_excel = f'./data/{city}/{date}/lianjia.xlsx'
    sheet_name1 = '20231222'
    sheet_name2 = '20240125'
    df1 = pd.read_excel( target_excel, sheet_name=sheet_name1)
    df2 = pd.read_excel(target_excel, sheet_name=sheet_name2)
    df2 = df2.drop(columns=['title', 'desc', 'follow'])
    df1.rename(columns={'price':'price1'}, inplace=True)
    df2.rename(columns={'price':'price2'}, inplace=True)

    print(df1.columns.tolist(), df2.columns.tolist())

    df1['price1'] = df1['price1'].str.extract(r'([0-9.]+)')
    df1['price1'] = pd.to_numeric(df1['price1'], errors='coerce')

    df2['price2'] = df2['price2'].str.extract(r'([0-9.]+)')
    df2['price2'] = pd.to_numeric(df2['price2'], errors='coerce')


    print(df1.columns.tolist(), df2.columns.tolist())
    merged_df = pd.merge(df1, df2, on='link',how='inner')
    print(merged_df)
    merged_df['price_diff'] = merged_df['price1'] - merged_df['price2']
    merged_df['percent'] = (merged_df['price_diff'] / merged_df['price1'])

    

    print(merged_df.columns.tolist())
    with pd.ExcelWriter(target_excel, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
            merged_df.to_excel(writer, index=False, sheet_name='202401merged', header=True)





if __name__ == '__main__':
    # read_download_data()

    writeToExcel()

    mergeExcel()