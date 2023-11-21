var links = []
currentPage = 0
var nextBtn = null

hources = []


// 生成随机数
function randomNum(min, max) {
    return Math.random() * (min - max) + max
}

//控制频率
shouldGoDetail = true
shouldGoNextPage = true

//控制频率
function shouldGoDetailAction() {
    
    if (shouldGoDetail) {
        shouldGoDetail = false
        setTimeout(() => {
            shouldGoDetail = true
        }, randomNum(2000, 6000));
        return true
    }
    return false
}

function shouldGoNextPageAction() {
    
    if (shouldGoNextPage) {
        shouldGoNextPage = false
        setTimeout(() => {
            shouldGoNextPage = true
        }, randomNum(5000, 20000));
        return true
    }
    return false
}



/// 添加按钮
function injectButton() {
    console.log("尝试注入...")
    


    // 创建悬浮按钮元素
    const floatingButton = document.createElement("div")
    floatingButton.id = "myFloatingButton"
    floatingButton.innerText = '🤖'
    document.body.appendChild(floatingButton)


    chrome.runtime.sendMessage({ action: "getIsStart", value: true }, function(response) {
            
        const isStart = response.value
        console.log('is start --- ', isStart)
        if (isStart) {
            setTimeout(() => {
                scrollToBottom()
            }, 5000);
        }
        });


    // 在按钮上添加点击事件
    floatingButton.addEventListener("click", () => {
        
        chrome.runtime.sendMessage({ action: "setIsStart", value: true }, function(response) {
            
            // 处理按钮点击事件
            console.log("Floating button clicked!");
            scrollToBottom()
          });

    })

   
    return true
}


function parsePageIndex(){
    var div = document.getElementsByClassName('page-box house-lst-page-box')[0]
    var atags = div.getElementsByTagName('a')
    for (let i = 0; i < atags.length; i++) {
        var atag = atags[i]
        let cname = atag.className;
        if (cname == 'on') {
            currentPage = parseInt(atag.text)
            console.log('当前页', currentPage)
        }
        if (atag.textContent == '下一页'){
            nextBtn = atag
            console.log('下一页', nextBtn)
        }
    } 
}

function scrollToBottom(y){

    console.log('开始滚动...')
    

    let sh = window.document.documentElement.scrollHeight
    var offset = y
    if (offset == null) {
        offset = window.screenY + window.innerHeight
    }
    if (offset >= sh-1200) {
        console.log('滚动到底部了')

        pageList()
        return
    }
    let step = 1200
    window.scrollTo(0, offset + step)
    console.log('滚动', offset + step)
    setTimeout(() => {
        scrollToBottom(offset + step)
    }, randomNum(500, 2000));

}


function pageList() {

    parsePageIndex()
    console.log('开始爬取列表....')


    items = document.getElementsByClassName('info clear')
    for (let i = 0; i < items.length; i++) {
        card = items[i]
        try {
            titleD = card.getElementsByClassName('title')[0]
            titleA = titleD.getElementsByTagName('a')[0]
            linkInfo = titleA.href
            title = titleA.text
            info = card.getElementsByClassName('houseInfo')[0].textContent
            follow = card.getElementsByClassName('followInfo')[0].textContent
            price = card.getElementsByClassName('priceInfo')[0].textContent

            hourseInfo = {
                'title': title,
                'link': linkInfo,
                'desc': info,
                'follow': follow,
                'price': price
            }
            hources.push(hourseInfo)
            console.log(hourseInfo)

            
        } catch (error) {
            console.log(error)
        }

    }

    downloadInfo()

    setTimeout(() => {
        if (nextBtn != null) {
            console.log('爬取下一页------')
            nextBtn.click()
        }
    }, 3000);



    // var tagAs = document.getElementsByClassName('s xst')

    // for(let i = 0;i < tagAs.length; i++) {
    //     var taga = tagAs[i]
    //     // var title = taga.innerText
    //     // var link = taga.getAttribute('href')
    //     // console.log(title+' , '+link)
    //     // links.appendChild({'title':title, 'link': link})
    //     // console.log(links, taga)
    //     links.push(taga)

    // }

    // links = links.reverse()

    // console.log('共计', links.length)

    // setTimeout(() => {
    //     pageDetail()
    // }, 1000);
}

function downloadInfo() {
    var content = JSON.stringify(hources)
    let a = document.createElement('a')
    a.href = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(content)
    a.download = 'lianjia_'+ currentPage+ '.txt'
    document.body.appendChild(a)
    a.click()
    a.remove()
}

function pageDetail() {

    if (!shouldGoDetailAction()) {
        setTimeout(() => {
            pageDetail()
        }, 1000);
        return
    }
    if (links.length == 0) {
        //结束
        nextPage()
        return
    }
    var link = links.pop()
    var href = link.getAttribute('href')
    window.open(href)
    setTimeout(() => {
        pageDetail()
    }, randomNum(1000, 3000));
}

function nextPage() {
    if (!shouldGoNextPageAction()) {
        setTimeout(() => {
            nextPage()
        }, 1);
        return
    } 
    console.log('下一页...')
    links = []

    nextbtns = document.getElementsByClassName('bm_h')
    if (nextPage.length >= 1) {
        btn = nextbtns[0]
        btn.click()
    }
}


function main() {
    (function executeInject() {
        setTimeout(() => {
            if(!injectButton()) {
                executeInject();
                return
            } 
        }, 1000)
    })()
}

main()


/*
// home page search key words

const clothesCategory = [
    
    "连衣裙 女",
    "半身裙 女",
    "长裙 女",
    "羽绒服 女",
    "T恤 女",
    "衬衫 女",
    "外套 女",
    "风衣 女",
    "蕾丝裙 女",
    "旗袍 女",
    "A字裙 女",
    "包臀裙 女",
    "短裙 女",
    "中长裙 女",
    "牛仔裙 女",
    "百褶裙 女",
    "修身裙 女",
    "牛仔裤 女",
    "休闲裤 女",
    "运动裤 女",
    "裙裤 女",
    "长裤 女",
    "短裤 女",
    "阔腿裤 女",
    "直筒裤 女",
    "工装裤 女",
    "九分裤 女",
    "小脚裤 女",
    "背带裤 女",
    "夹克 女",
    "大衣 女",
    "毛呢外套 女",
    "皮草 女",
    "羽绒服 女",
    "棉服 女",
    "薄外套 女",
    "毛皮外套 女",
    "中长外套 女",
    "短外套 女",
    "马甲外套 女",
    "运动上衣 女",
    "运动裤 女",
    "运动套装 女",
    "卫衣 女",
    "毛衣 女",
    "针织衫 女",
    "西装 女",
    "马甲 女",
    "短袖 女",
    "长袖 女",
    "短裤 女",
];

var details = []
currentKeyword = ""
currentPage = ""
currentPageIndex = ""
stop = false

//控制频率
shouldGoDetail = true
shouldGoNextPage = true

//控制频率
function shouldGoDetailAction() {
    if (stop) {
        return false
    }
    if (shouldGoDetail) {
        shouldGoDetail = false
        setTimeout(() => {
            shouldGoDetail = true
        }, randomNum(2000, 15000));
        return true
    }
    return false
}

function shouldGoNextPageAction() {
    if (stop) {
        return false
    }
    if (shouldGoNextPage) {
        shouldGoNextPage = false
        setTimeout(() => {
            shouldGoNextPage = true
        }, randomNum(5000, 20000));
        return true
    }
    return false
}

/// 添加按钮
function injectButton() {
    console.log("尝试注入...")
    console.log("start fetch...");

    var div = document.getElementsByClassName("Tab--tabWrap--usAaiUA")[0]
    if(div == null) {
        div = document.getElementsByClassName("m-tab g-clearfix")[0].getElementsByClassName("tabs")[0]
    }
    
    let btn = document.createElement('a')
    btn.type = "button"
    btn.className = "start_download_photos_btn"
    btn.innerText = "🤖 开始爬取"
    btn.onclick = function(){
        console.log('开始下载图片...')
        stop = false
        saveProgress(()=>{})
        if (currentPage.length > 0) {
            //提取页数
            const pattern = /page=(\d+)/;
            const matches = currentPage.match(pattern);
            const page = matches != null ? matches[1] : 1
            // const page = document.getElementsByClassName("pager")[0].getElementsByClassName("current")[0].textContent;
            
            const box = document.getElementsByClassName('search-suggest-combobox')[0] || document.getElementsByClassName("search-combobox-input-wrap")[0]
            const input = box.getElementsByTagName('input')[0]
            const keyword = input.value
            currentPageIndex = page
            if (keyword) {
                currentKeyword = keyword
            }
            console.log('当前页', currentKeyword, page)

            scrollToBottom()


        } else {
            injectKeywords(true)
        }
        
    }

    let btn2 = document.createElement('a')
    btn2.type = "button"
    btn2.className = "start_download_photos_btn"
    btn2.innerText = "🤖 停止爬虫"
    btn2.onclick = function(){
        console.log('停止爬虫...')
        stop = true
    }

    let btn3 = document.createElement('a')
    btn3.type = "button"
    btn3.className = "start_download_photos_btn"
    btn3.innerText = "🤖 下一个关键词"
    btn3.onclick = function(){
        stop = false
        nextKeyword()
    }
    
    let style = "color:#FFFFFF;background-color:#FF8247;outline-style:none;width:80px;height:30px;border-radius:8px;text-align:center;padding:6px;font-weight:bold;margin-left:10px"
    btn.setAttribute('style', style)
    div.appendChild(btn)
    btn2.setAttribute('style', style)
    div.appendChild(btn2)
    btn3.setAttribute('style', style)
    div.appendChild(btn3)

    // filter_tianmao()
    
    return true
}

function filter_tianmao() {
    tabdivs = document.getElementsByClassName('next-tabs-tab-inner')
    if (tabdivs.length > 1) {
        //销量
        div = tabdivs[2]
        div.click()
        console.log('点击销量')
    }
    setTimeout(() => {
        checkboxs = document.getElementsByClassName('next-checkbox-inner')
        if (checkboxs.length > 1) {
            //天猫
            checkboxs[1].click()
            console.log('点击天猫')
        }
    }, 1200);
}


// 开始爬虫
function startSpider() {

    details = []
    var containers = document.getElementsByClassName('Content--content--sgSCZ12')
    if (containers == null || containers.length == 0) {
        containers = document.getElementsByClassName("grid g-clearfix")
    }
    const container = containers[0]
    var cards = container.getElementsByClassName("item J_MouserOnverReq")
    if (cards == null || cards.length == 0) {
        cards = container.getElementsByClassName("Card--doubleCardWrapper--L2XFE73")
    }
    
    for(let i = 0;i < cards.length; i++) {
        let card = cards[i]
        details.push(card)
    }
    console.log("共"+details.length+"个宝贝")
    // console.log(details)
    startSpiderDetail()
}

// 读取爬虫进度
function readProgess(callback) {
    chrome.storage.local.get(['currentKeyword', 'currentPage', "currentPageIndex"], (res)=>{
        currentKeyword = res.currentKeyword || clothesCategory[0]
        currentPage = res.currentPage || ""
        currentPageIndex = res.currentPageIndex || ""
        console.log('读取本地 ', currentKeyword, currentPage, currentPageIndex, "页")
        callback()
        // injectKeywords()
    })
}

function saveProgress(callback) {
    try {
        chrome.storage.local.set({'currentKeyword': currentKeyword, 
                                 'currentPage': currentPage,
                                "currentPageIndex": currentPageIndex}, ()=>{
            console.log('保存本地')
            callback()
        })
    } catch (error) {
        console.log('save error', error)
    }
}

function injectKeywords(toSpide=false) {

    var inputKeyword = getSearchInputText()
    if (inputKeyword != null && inputKeyword == currentKeyword) {
        return
    }

    var input = getSearchInputWidget()
    console.log("搜索框", input)
    input.value = currentKeyword
    let buttons = document.getElementsByTagName('button')
    for (i in buttons) {
        let btn = buttons[i]
        if (btn.textContent == '搜索') {
            console.log("find search button,", btn)
            btn.click()

            if (toSpide) {
                setTimeout(() => {
                    filter_tianmao()
                    scrollToBottom()
                }, 2000);
            }
            break
        }
    }
}

function addQueryParamToUrl(url, paramName, paramValue) {
    const separator = url.includes("?") ? "&" : "?";
    return url + separator + paramName + "=" + encodeURIComponent(paramValue);
  }
//填充页码
function fillPageIndex() {
    try {
        const inputs = document.getElementsByClassName("next-input next-medium next-pagination-jump-input")[0] || 
        document.getElementsByClassName("m-page g-clearfix")[0]
        const input = inputs.getElementsByTagName("input")[0]
        window.scrollTo(0, 4500)
        input.value = currentPageIndex
        const go = document.getElementsByClassName("next-btn next-medium next-btn-normal next-pagination-jump-go")[0]
        console.log(input, go)
        console.log('填充页码', currentPageIndex, input.value)
    } catch (error) {
        console.log(error)
    }
    
    
}

function scrollToBottom(y){
    let sh = window.document.documentElement.scrollHeight
    var offset = y
    if (offset == null) {
        offset = window.screenY + window.innerHeight
    }
    if (offset >= sh) {
        console.log('滚动到底部了')

        startSpider()
        return
    }
    let step = 1200
    window.scrollTo(0, offset + step)
    console.log('滚动', offset + step)
    const speed = 2000
    setTimeout(() => {
        scrollToBottom(offset + step)
    }, randomNum(speed, speed * 1.2));

}


// 下一页
 function nextPage() {

    if (!shouldGoNextPageAction()) {
        setTimeout(() => {
            nextPage()
        }, 1);
        return
    } 
    details = []
    var btns = document.getElementsByClassName('next-btn next-medium next-btn-normal next-pagination-item next-next')
    if (btns == null || btns.length == 0) {
        btns = document.getElementsByClassName("item next")[0].getElementsByTagName("a")
    }
    

    if (btns == null || btns[0].disabled == true) {
        console.log('结束')
        setTimeout(() => {
            nextKeyword()
        }, randomNum(1000, 3000));
        return
    }

    let btn = btns[0]
    console.log(btn)
    btn.click()
    console.log('点击下一页...')
    
    setTimeout(() => {

        // injectButton()
        currentPage = document.URL
        getPageIndex()
        console.log('下一页', currentPageIndex)
        saveProgress(()=>{})
        scrollToBottom()

    }, randomNum(3000, 8000));
}

// 下一个关键词
function nextKeyword() {
    var found = false
    for(i in clothesCategory) {
        let cat = clothesCategory[i]
        if (cat == currentKeyword) {
            found = true
            continue
        }
        if (found) {
            console.log('下一个关键词', cat)
            currentKeyword = cat
            currentPageIndex = 1
            break
        }
        if (found) {
            break
        }
    }
    if (!found) {
        window.alert('所有关键词都已爬取完毕!')
        return
    }
    saveProgress(()=>{
        injectKeywords(true)
    })
}

// 生成随机数
function randomNum(min, max) {
    return Math.random() * (min - max) + max
}

function getPageIndex() {

    try {
        //提取页数
        const pattern = /page=(\d+)/;
        const matches = currentPage.match(pattern);
        if (matches.length > 1) {
            currentPageIndex = matches[1]
            return
        }

    } catch (error) {
        console.log(error)
    }
    
}

function getSearchInputText() {
    try {
        const input = getSearchInputWidget()
        const keyword = input?.value || ""
        return keyword
    } catch (error) {
        console.log(error)
    }
}

function getSearchInputWidget() {
    
    var box1 = document.getElementsByClassName('search-suggest-combobox')[0]
    var box2 = document.getElementsByClassName("search-combobox-input-wrap")[0]
    var box3 = document.getElementsByClassName('search-combobox')[0]
    var box = box1 || box2 || box3
    if (box != null) {
        var input = box.getElementsByTagName('input')[0]
        return input
    }
    var wraper = document.getElementsByClassName("search")[0]
    var input = wraper.getElementsByTagName("input")[0]
    return input

}


//爬取详情页
function startSpiderDetail(){

    if (!shouldGoDetailAction()) {
        setTimeout(() => {
            startSpiderDetail()
        }, 1000);
        return
    }
    if (details.length == 0) {
        //结束
        nextPage()
        return
    }

    let card = details.pop()
    if (card.tagName.toLowerCase() == "a") {
        card.click()
    } else {
        let a = card.getElementsByTagName("a")[0]
        a.click()
    }
    console.log('打开新窗口', card)
    setTimeout(() => {
        startSpiderDetail()
    }, randomNum(1000, 3000));
}

function checkTimeOutException() {
    chrome.storage.local.get(['time_out_stop'], (res)=>{
        if (res != null && res.time_out_stop == true) {
            stop = true
            //停止 5 min 恢复
            setTimeout(() => {
                chrome.storage.local.set({'time_out_stop': false}, ()=>{
                })
                console.log("检测到详情页超时异常，暂停 3min 继续...")
                stop = false
            }, 3*60*1000);
        }
    })

    setTimeout(() => {
        checkTimeOutException()
    }, 10*1000);
}



function main() {
    (function executeInject() {
        setTimeout(() => {
            if(!injectButton()) {
                executeInject();
                return
            } 
            readProgess(()=> {
                injectKeywords(false)
                setTimeout(() => {
                    filter_tianmao()
                    setTimeout(() => {
                        fillPageIndex()
                    }, 2000);
                }, 3000);
            })
            checkTimeOutException()
        }, 1000)
    })()
}

main()



*/