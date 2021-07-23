
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
const dataGetter = makeData();

//app, 显示数量
function Daodao(url, cnt) {
    this.url = url;
    this.cnt = cnt;

    this.init = function () {
        dataGetter("get", `${this.url}/api/query/${this.cnt}`, null, function (result) {
            console.log(result);
            var html = template('template', { list: result })
            mySelector("#bbitems").innerHTML = html;
            Array.from(document.getElementsByClassName("delete_right")).forEach(
                (el) => {
                    el.addEventListener("click", function () {
                        daodao.delOne(el);
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
            document.getElementsByClassName('createbox')[0].style.display="none";

        };
        document.getElementsByClassName("createDaodao")[0].onclick=function(){
            document.getElementsByClassName('createbox')[0].style.display="block";
            mySelector(".popOutBg").style.display = "block";
        }
        mySelector("#ddloginbox").onsubmit = function () { return daodao.login(); }
        function getPreview() {
            var prev = 1;
            function preview(){
                if(prev){
                    prev=0;
                    document.getElementsByClassName('createContent')[0].innerHTML =
                    marked(document.getElementsByClassName('Input_text')[0].value);
                    document.getElementsByClassName('createMain')[0].style.display="none";
                    document.getElementsByClassName('createContent')[0].style.display="block";
                }else{
                    document.getElementsByClassName('createContent')[0].style.display="none";
                    document.getElementsByClassName('createMain')[0].style.display="block";
                    prev=1;
                }
            }
            return preview;
        }
        document.getElementsByClassName("previewBtn")[0].onclick=getPreview();
        document.getElementsByClassName("postBtn")[0].onclick=function(){daodao.create();}

    }
    this.login = function () {
        dataGetter("post", `${this.url}/api/login`, JSON.stringify({
            "username": mySelector("#username").value,
            "password": mySelector("#password").value
        }), function (result) {
            if (result["code"] === 1) {

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
            "content": marked(document.getElementsByClassName('Input_text')[0].value),
            "from": ua["broswer"] + "/" + ua["version"],
            "date": getDate()
        }), function (result) {
            console.log(result);
            document.getElementsByClassName('Input_text')[0].value = "";
            alert(result.msg);
            mySelector(".popOutBg").click();
            daodao.init();
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


