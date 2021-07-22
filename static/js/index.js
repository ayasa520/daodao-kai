function $(id) {
    return document.getElementById(id);
}
function makeData() {
    var xmlHttp = new XMLHttpRequest();
    function getData(method, url, sendData, callback) {
        xmlHttp.open(method, url);
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
var dataGetter =  makeData();

dataGetter("get", "/api/query/20",null,function(result){
    console.log(result);
    var html = template('template', { list: result })
    $("bbitems").innerHTML = html;
});


function delDD(el) {
    console.log("删除 " + el.id);
    var t = confirm("确定要删除吗？", "")
    if (t) {
        var id = el.id.slice(3);
        dataGetter("post","/api/del",JSON.stringify( {"id":id}),function(result){
            if(result.code){
                var element = $(id);
                element.parentElement.removeChild(element);
            }
            alert(result.msg);
        })

       
    }




}