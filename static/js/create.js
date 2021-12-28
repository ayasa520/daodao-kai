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
    return time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");
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
function preview() {
    document.getElementById('createContent').innerHTML =
         marked.parse(document.getElementsByClassName('Input_text')[0].value);
}
function create() {
    if (document.getElementsByClassName('Input_text')[0].value === "") {
        return 0;
    }
    var ua = getBrowserInfo();
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("post", "/api/create");
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(
        JSON.stringify({
            "content":  marked.parse(document.getElementsByClassName('Input_text')[0].value),
            "from": ua["broswer"]+"/"+ua["version"],
            "date": getDate()
        })
    );
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            console.log(xmlHttp.responseText);
            var result = JSON.parse(xmlHttp.responseText);
            alert(result["msg"]);
        }
    }
}