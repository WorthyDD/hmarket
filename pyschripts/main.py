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
date = '2024年05月10日'

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

def mergeExcel(before, after, result_sheet):
    # datadir = f'./data/{city}/{date}'
    target_excel = f'./data/{city}/{date}/lianjia.xlsx'
    sheet_name1 = before
    sheet_name2 = after
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
    merged_df['area'] = merged_df['desc'].str.extract(r'([0-9.]+)平米')
    merged_df['area'] = pd.to_numeric(merged_df['area'], errors='coerce')
    merged_df['avg_price1'] = merged_df['price1'] / merged_df['area']
    merged_df['avg_price2'] = merged_df['price2'] / merged_df['area']




    print(merged_df.columns.tolist())


    # 统计数据
    total_rows = len(merged_df)
    price_above_1 = merged_df[merged_df['price_diff'] >= 1]
    count_price_above_1 = len(price_above_1)
    max_price_above_1 = price_above_1['price_diff'].max()
    min_price_above_1 = price_above_1['price_diff'].min()
    mean_price_above_1 = price_above_1['price_diff'].mean()
    mean_price_before = merged_df['avg_price1'].mean()
    mean_price_after = merged_df['avg_price2'].mean()

    # 3. df price <= -1 有多少条数据？<=-1 的数据中最大值和最小值分别是多少？<=-1的平均值是多少？
    price_below_minus_1 = merged_df[merged_df['price_diff'] <= -1]
    count_price_below_minus_1 = len(price_below_minus_1)
    max_price_below_minus_1 = price_below_minus_1['price_diff'].max()
    min_price_below_minus_1 = price_below_minus_1['price_diff'].min()
    mean_price_below_minus_1 = price_below_minus_1['price_diff'].mean()

    # 4. 计算 df price 平均值
    average_price = merged_df['price_diff'].mean()

    # 5. 计算 df ratio 平均值
    average_ratio = merged_df['percent'].mean()

    content = f'{before}至{after}：总共{total_rows}个房源，上月均价: {round(mean_price_before, 2)}万, 当月均价:{round(mean_price_after, 2)}万, {count_price_above_1}个降价，降价幅度在{round(min_price_above_1,1)}万到{round(max_price_above_1,1)}万不等，平均降幅{round(mean_price_above_1,1)}万， {count_price_below_minus_1}个房源上涨，涨价幅度在{-round(min_price_below_minus_1,1)}万到{-round(max_price_below_minus_1,1)}万不等，平均涨幅{-round(mean_price_below_minus_1,1)}万。全部房源平均降价{round(average_price,1)}万，降幅{round(average_ratio*100,2)}%。'
    print(content)


    with pd.ExcelWriter(target_excel, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
            merged_df.to_excel(writer, index=False, sheet_name=result_sheet, header=True)





if __name__ == '__main__':
    # read_download_data()

    writeToExcel()

    # mergeExcel('2024年03月25日', '2024年02月20日', '24年2月')
    mergeExcel('2024年03月25日', date, '24年4月')