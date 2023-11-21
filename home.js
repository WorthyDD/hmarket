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