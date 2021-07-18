function $(id){
    return document.getElementById(id);
}
    // var data1 = [
    //     {"time":"2010-10-10", "content": "<p>Mr.bring</p>", "from": "edge" },
    //     {"time":"2010-10-10", "content": "<span>asdasd</span>", "from": "chrome" }
    // ]
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("get","api/query/20");
    xmlHttp.send(null);
    xmlHttp.onreadystatechange=function()
    {
        if (xmlHttp.readyState==4 && xmlHttp.status==200)
        {
            console.log(xmlHttp.responseText);
            var result = JSON.parse(xmlHttp.responseText);
            var html = template('template', { list: result })
            $("bbitems").innerHTML = html;
        }
    }