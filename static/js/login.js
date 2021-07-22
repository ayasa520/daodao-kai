function $(id){
    return document.getElementById(id);
}
function ajax_submit(){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("post","/api/login");
    xmlHttp.setRequestHeader("Content-type","application/json;charset=UTF-8");
    xmlHttp.withCredentials = true;
    xmlHttp.send(JSON.stringify({
        "username": $("username").value,
        "password": $("password").value
    }));
    xmlHttp.onreadystatechange=function()
    {
        if (xmlHttp.readyState==4 && xmlHttp.status==200)
        {
            console.log(xmlHttp.responseText);
            var result = JSON.parse(xmlHttp.responseText);
            if(result["code"]===1){
               window.location.href = "/";
            }
        }
    }

 return false;
}
ajax_submit();