function get_data(url, callback, extra) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("get", url);
    xmlHttp.send(null);
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (extra)
                callback(JSON.parse(xmlHttp.responseText), extra);
            else
                callback(JSON.parse(xmlHttp.responseText));
        }
    }
}

function daodao_page_init(url, template_html, extra) {
    get_data(url, function (data) {
        if (!document.getElementById('daodao_template')) {
            var temp = document.createElement('script');
            temp.id = "daodao_template";
            temp.type = "text/html";
            temp.innerHTML = template_html;
            document.body.appendChild(temp);
        }
        function generate_daodao_html () {
            var html = template('daodao_template', { list: data });
            var sec = document.createElement('section');
            sec.className = "timeline page-1";
            sec.innerHTML = html;
            document.getElementById("bber").appendChild(sec);
            if(extra)
                extra();
        }
        if (template !== 'function') {
            getScript('https://unpkg.zhimg.com/art-template@4.13.2/lib/template-web.js').then(
                generate_daodao_html  )
        }else{
            generate_daodao_html();
        }
    })
}

function daodao_card_init(url, options) {
    get_data(url, generateBBHtml, options);
}


function generateBBHtml(array, options) {
    var bbdom = document.querySelector('#bber-talk');
    var result = '';
    let array_list_num;
    if (array.length < 10) {
        array_list_num = array.length
    } else {
        array_list_num = 10
    }
    for (let i = 0; i < array_list_num; i++) {
        var flag_daodao = true
        for (let item of options.filter_daodao) {
            if (array[i].content.indexOf(item) >= 0) {
                flag_daodao = false
            }
        }
        if (flag_daodao) {
            var tempp = document.createElement('p');
            tempp.innerHTML = array[i].content;
            array[i].content = tempp.innerText;
            tempp = null;
            result += `<div class='li-style swiper-slide' ><a style="height=100%;weight=100%" href="${options.bbpath}#${array[i]._id}">${array[i].content}</a></div>`;
        }
    }
    var bbdom = document.querySelector('#bber-talk');
    bbdom.innerHTML = result;
    window.lazyLoadInstance && window.lazyLoadInstance.update();
    window.pjax && window.pjax.refresh(bbdom);
    var swiper = new Swiper('.swiper-container', {
        direction: 'vertical', // 垂直切换选项
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: true,
        },
    });
}





