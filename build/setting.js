var urlList = [
    ["네이버 부동산", "https://new.land.naver.com/search?sk={query}}", "https://land.naver.com/favicon.ico", "부동산"],
    ["네이버 쇼핑", "https://search.shopping.naver.com/search/all.nhn?query={query}", "https://ssl.pstatic.net/imgshopping/cnsv/p/im/home/favicon.ico", "쇼핑"],
    ["네이버 지도", "https://map.naver.com/v5/search/{query}", "https://map.naver.com/v5/assets/icon/favicon-32x32.png", "지도"],
    ["네이버 사전", "https://dict.naver.com/search.nhn?query={query}", "https://dict.naver.com/favicon.ico", "사전"],
    ["네이버 지식인", "https://kin.naver.com/search/list.nhn?query={query}", "https://kin.naver.com/favicon.ico", "지식인"],
    ["네이버 포스트", "https://post.naver.com/search/post.nhn?keyword={query}", "https://post.naver.com/favicon.ico", "포스트"],
    ["네이버 TV", "https://tv.naver.com/search/clip?query={query}", "https://tv.naver.com/favicon.ico", "tv"],
    ["네이버 검색", "https://search.naver.com/search.naver?query={query}", "https://www.naver.com/favicon.ico", "검색"],
    ["네이버 플레이스", "https://store.naver.com/restaurants/list?query={query}", "https://store.naver.com/favicon.ico", "플레이스"],
    ["네이버 웹툰", "https://comic.naver.com/search.nhn?keyword={query}", "https://ssl.pstatic.net/static/comic/favicon/webtoon_favicon_32x32.ico", "웹툰"],
];

document.getElementById("save-button").addEventListener("click", SaveUserConfig); // 저장 버튼 이벤트 리스너

var DataDto = function (serviceName, url, faviconUrl, hotKey) {
    this.serviceName = serviceName;
    this.url = url;
    this.faviconUrl = faviconUrl;
    this.hotKey = hotKey;
}

var PostDto = function (Hotkey, datadto) {
    let post = {}
    post[Hotkey] = datadto;

    return post;
}

if (localStorage.getItem("Posts") == null) {
    saveData(urlList)
    let Posts = getData();
    renderPosts(Posts);
}

else {
    // Posts = JSON.parse(localStorage.getItem("Posts"));
    let Posts = getData();
    renderPosts(Posts);
    document.getElementsByClassName("service-add")[0].addEventListener("click", LayerPopup);
    document.getElementsByClassName("close")[0].addEventListener("click", LayerPopdown);
}

function renderPosts(Posts) {
    let container = document.getElementsByClassName("container")[0];

    for(let hotKey in Posts ) {
        container.insertAdjacentHTML('beforeend', createHtmlList(Posts[hotKey]));
    }

    container.insertAdjacentHTML('beforeend', createAddButton());
}

function createHtmlList(data) {
    let htmlCode = "<li class=\"contents-list\">" +
                        //"<a href=\"" + data["url"].substring(0, data["url"].length - 8) + "\">" + // {query} 로 GET 보내면 404 리턴하는 사이트 존재.
                        "<a href=\"" + data["url"] + "\">" +
                            "<img src=\"" + data["faviconUrl"] + "\" class=\"contents-image\">" + // 슬라이싱 해서 뻬준다.
                        "</a>" +
                        "<h3 class=\"query-name\">" + data["serviceName"] + "</h3>" +
                        "<span class=\"shortcut\">단축키</span>" +
                        "<input type=\"text\" value=\"" + data["hotKey"] + "\" class=\"contents-hotkey\">" +
                    "</li>";

    return htmlCode;
}

function createAddButton() {
    let htmlCode = "<li class=\"contents-list-add\">" +
                        "<h3 class=\"service-title\">다른 서비스 추가하기</h3>" +
                        "<button class=\"service-add\">추가</button>" + 
                    "</li>";

    return htmlCode;
}

function mapToObj(inputMap) {
    let obj = {};

    inputMap.forEach(function(value, key){
        obj[key] = value
    });

    return obj;
}

function saveData(urlList) {
    let Posts = new Map();

    for (let i = 0; i < urlList.length; i++) {
        let data = new DataDto(urlList[i][0], urlList[i][1], urlList[i][2], urlList[i][3]);
        Posts.set(urlList[i][3], data);
    }

    Posts = mapToObj(Posts);

    localStorage.setItem("Posts", JSON.stringify(Posts));
    Posts = JSON.parse(localStorage.getItem("Posts"));

    return Posts;
}

function getData() {
    let Posts;

    Posts = JSON.parse(localStorage.getItem("Posts"));

    return Posts;
}

function getHtmlData() {
    
    let contents = document.getElementsByClassName("contents-list");
    let contentsList = new Array();

    for(var i=0; i<contents.length; i++) {
        contentsList.push(
            [
                contents[i].querySelector('.query-name').innerText,
                decodeURI(contents[i].querySelector('a').href),
                contents[i].querySelector('.contents-image').src,
                contents[i].querySelector('.contents-hotkey').value
            ]);
    }

    return contentsList;
}

function SaveUserConfig() {
    let contetsList;
    let posts;

    contentsList = getHtmlData(); // setting.html 태그 값 읽어서 배열로 리턴

    if (!checkDuplicate(contentsList)) { // False 일 때 저장 허용.
        posts = saveData(contentsList);
        alert("저장되었습니다.");
    }

    else {
        alert("단축키는 중복될 수 없습니다!");
    }
}

function checkDuplicate(contentsList) {
    let hotKeyList = new Array();

    for(let i = 0; i < contentsList.length; i++) {
        hotKeyList.push(contentsList[i][3]);
    }

    return new Set(hotKeyList).size !== hotKeyList.length; // 중복된 요소가 있으면 False return
}

function LayerPopup() {
    let element = document.getElementById("modal");
    
    element.removeAttribute("class");
    element.classList.add("three");
}

function LayerPopdown() {
    let element = document.getElementById("modal");

    element.classList.add("out");
}