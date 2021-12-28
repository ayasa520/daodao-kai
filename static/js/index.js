Date.prototype.Format = function (fmt) { //javascript时间日期函数
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
function ajaxpromise({ URL, method = 'GET', data = null, contentType = false }) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open(method, URL, true);
        req.send(data);
        req.contentType = contentType;
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status === 200) {
                    resolve((req.responseText));
                } else {
                    reject((req.responseText));
                }
            };
        }
    });
}
function getDate() {
    return new Date().Format("yyyy-MM-dd hh:mm:ss");
}
function getBrowserInfo() {
    var sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/edg\/([\d.]+)/)) ? sys.edge = s[1] :
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
                    (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
                        (s = ua.match(/opera.([\d.]+)/)) ? sys.opera = s[1] :
                            (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
    if (sys.edge) return { broswer: "Edge", version: sys.edge };
    if (sys.ie) return { broswer: "IE", version: sys.ie };
    if (sys.firefox) return { broswer: "Firefox", version: sys.firefox };
    if (sys.chrome) return { broswer: "Chrome", version: sys.chrome };
    if (sys.opera) return { broswer: "Opera", version: sys.opera };
    if (sys.safari) return { broswer: "Safari", version: sys.safari };

    return { broswer: "", version: "0" };
}

function mySelector(param) {
    if (arguments[1] === true) {
        return document.querySelectorAll(param);
    } else {
        return document.querySelector(param);
    }
}

function makeData() {
    var xmlHttp = new XMLHttpRequest();
    function getData(method, url, sendData, callback) {
        xmlHttp.open(method, url, true);
        xmlHttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xmlHttp.withCredentials = true;
        xmlHttp.send(sendData);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var result = JSON.parse(xmlHttp.responseText);
                if (typeof callback === "function") {
                    callback(result);
                }
            }
        }
    }
    return getData;

}
if (typeof dataGetter !== "function") {
    window.dataGetter = makeData();
}

//app, 显示数量
function Daodao(url, cnt) {
    this.url = url;
    this.cnt = cnt;

    this.init = function (onddLoaded) {
        dataGetter("get", `${this.url}/api/query/${this.cnt}`, null, function (result) {
            console.log(result);
            daodao.logined = result.login;

            if (!document.getElementById('template')) {
                var temp = document.createElement('script');
                temp.id = "template";
                temp.type = "text/html";
                temp.innerHTML = " {{each list item index}}<div class=\"item\" id={{item[\"_id\"]}} ><div id=\"del{{item['_id']}}\"  class=\"delete_right\"><svg t=\"1591347978744\"                viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"14459\"                width=\"20\" height=\"20\" style=\"display: inline\"                ><path                    d=\"M512 883.2A371.2 371.2 0 1 0 140.8 512 371.2 371.2 0 0 0 512 883.2z m0 64a435.2 435.2 0 1 1 435.2-435.2 435.2 435.2 0 0 1-435.2 435.2z\"                    p-id=\"14460\" fill=\"#efefef\"></path><path                    d=\"M557.056 512l122.368 122.368a31.744 31.744 0 1 1-45.056 45.056L512 557.056l-122.368 122.368a31.744 31.744 0 1 1-45.056-45.056L466.944 512 344.576 389.632a31.744 31.744 0 1 1 45.056-45.056L512 466.944l122.368-122.368a31.744 31.744 0 1 1 45.056 45.056z\"                    p-id=\"14461\" fill=\"#efefef\"></path></svg></div><p class=\"datatime\">{{item[\"date\"]}}</p><p class=\"datacont\">                {{@item[\"content\"]}}</p><p class=\"datafrom\"><small><i class=\"fas fa-tools\"></i>{{item[\"from\"]}}</small></p></div>    {{/each}}";
                document.body.appendChild(temp);
            }

            var html = template('template', { list: result.data })
            mySelector("#bbitems").innerHTML = html;
            if (typeof onddLoaded === "function")
                onddLoaded();
            document.getElementById("ddloading").style.display = "none";
            Array.from(document.getElementsByClassName("delete_right")).forEach(
                (el) => {
                    el.addEventListener("click", function () {
                        if (daodao.logined)
                            daodao.delOne(el);
                        else {
                            mySelector("button").click();
                        }
                    })
                }
            )
        });

        function ani() {
            mySelector(".popOut").className = "popOut ani";
        }
        mySelector("button").onclick = function () {
            mySelector(".popOut").style.display = "block";
            ani();
            mySelector(".popOutBg").style.display = "block";
        };
        mySelector(".popOut  .logoff").onclick = function () {
            mySelector(".popOut").style.display = "none";
            mySelector(".popOutBg").style.display = "none";
        };
        mySelector(".popOutBg").onclick = function () {
            mySelector(".popOut").style.display = "none";
            mySelector(".popOutBg").style.display = "none";
            document.getElementsByClassName('createbox')[0].style.display = "none";

        };
        document.getElementsByClassName("dd-create")[0].onclick = function () {
            if (daodao.logined !== 1) {
                mySelector("button").click();
            } else {
                document.getElementsByClassName('createbox')[0].style.display = "block";
                mySelector(".popOutBg").style.display = "block";
            }
        }

        mySelector("#ddloginbox").onsubmit = function () { return daodao.login(); }
        function getPreview() {
            var prev = 1;
            function preview() {
                if (prev) {
                    prev = 0;
                    document.getElementsByClassName('createContent')[0].innerHTML =
                        marked.parse(document.getElementsByClassName('Input_text')[0].value);
                    document.getElementsByClassName('createMain')[0].style.display = "none";
                    document.getElementsByClassName('createContent')[0].style.display = "block";
                    document.getElementsByClassName('dd-preview')[0].innerText = "编辑"
                } else {
                    document.getElementsByClassName('dd-preview')[0].innerText = "预览"
                    document.getElementsByClassName('createContent')[0].style.display = "none";
                    document.getElementsByClassName('createMain')[0].style.display = "block";
                    prev = 1;
                }
            }
            return preview;
        }
        document.getElementsByClassName("dd-preview")[0].onclick = getPreview();
        document.getElementsByClassName("dd-post")[0].onclick = function () { daodao.create(); }
1
        let dom = document.getElementById('up');
        let formData = new FormData();
        let URL = "https://7bu.top/api/upload";

        dom.onchange = function () {
            formData.delete('image');
            formData.append("image", dom.files[0]);
            document.getElementsByClassName('Input_text')[0].value+=` ![${formData.getAll('image')[0].name}](uploading)`
            ajaxpromise({ URL: URL, method: 'POST', data: formData }).then(function onFulfilled(value) {
                document.getElementsByClassName('Input_text')[0].value=document.getElementsByClassName('Input_text')[0].value.replace(`![${formData.getAll('image')[0].name}](uploading)`,`![${JSON.parse(value)['data']['name']}](${JSON.parse(value)['data']['url']})`)
            }).catch(function onRejected(error) {
                alert('错误：' + JSON.parse(error)['data']);
            });
        }
    }
    this.login = function () {
        dataGetter("post", `${this.url}/api/login`, JSON.stringify({
            "username": mySelector("#username").value,
            "password": mySelector("#password").value
        }), function (result) {
            if (result["code"] === 1) {
                daodao.logined = 1;
                mySelector(".popOut").style.display = "none";
                mySelector(".popOutBg").style.display = "none";
            }
            alert(result.msg);
        });
        return false;
    }
    this.create = function () {
        if (document.getElementsByClassName('Input_text')[0].value === "") {
            return 0;
        }
        var ua = getBrowserInfo();
        dataGetter("post", `${this.url}/api/create`, JSON.stringify({
            "content": marked.parse(document.getElementsByClassName('Input_text')[0].value),
            "from": ua["broswer"] + "/" + ua["version"],
            "date": getDate()
        }), function (result) {
            console.log(result);
            alert(result.msg);
            if (result.code) {
                document.getElementsByClassName('Input_text')[0].value = ""; mySelector(".popOutBg").click();
                daodao.init();
            }

        })

    }
    this.delOne = function (el) {
        console.log("删除 " + el.id);
        var t = confirm("确定要删除吗？", "")
        if (t) {
            var id = el.id.slice(3);
            dataGetter("post", `${this.url}/api/del`, JSON.stringify({ "id": id }), function (result) {
                if (result.code) {
                    var element = document.getElementById(id);
                    // element.parentElement.removeChild(element);
                    daodao.init();
                }
                alert(result.msg);
            })
        }
    }
}