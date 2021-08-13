# -*- coding:utf8 -*-
# 这里的路由也是需要写上 /api 的

import os
import subprocess
import urllib
from dataclasses import dataclass
from bson import ObjectId
from datetime import timedelta
import os
from werkzeug.utils import secure_filename
import sys
from flask import Flask, jsonify, request, session, g
import pymongo
import json
import time
import re
from flask_cors import *
from werkzeug.utils import redirect
from markupsafe import escape

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = os.urandom(24)
# app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

# url='mongodb://%s:%s@%s' % ("rikka",urllib.quote_plus( "P@55w0rd"), "cluster0.fznke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
myclient = pymongo.MongoClient(os.environ['MONGODB'])
mydb = myclient["test"]
mycol = mydb["test"]


@dataclass
class User:
    username: str
    password: str


users = [
    User(os.environ['USERNAME'], os.environ['PASSWORD'])
]


@app.before_request
def before_request():
    g.user = None
    if session.get('username'):
        g.user = [u for u in users if u.username == session['username']][0]


@app.route('/api/login', methods=['post'])
def login():
    if g.user:
        return jsonify({'code': 1, 'msg': "已登录"})
    try:
        data = json.loads(request.get_data(as_text=True))
        # myquery = {'username': data['username'], 'password': data['password']}
    except Exception as e:
        print(e)
        return jsonify({'code': 0, 'msg': "表单填写错误"})
    user = [u for u in users if u.username == data['username']]
    if len(user) > 0 and user[0].password == data['password']:
        session['username'] = data['username']
        session.permanent = True
        return jsonify({'code': 1, 'msg': "登陆成功"})
    else:
        return jsonify({'code': 0, 'msg': "密码错误"})

# @app.route('/api/upload', methods=['post'])
# def upload():
#     file = request.files['img']
#     if file and 'image' in file.mimetype:
#         filename = secure_filename(file.filename)
#         file.save(os.path.join(os.getcwd() + "/static", filename))
#         subprocess.Popen('cd static && ../LightUploader -c ../auth.json -f "{}" -r "/Public/image"; if [ "$?" != 0 ]; then echo "Fail!";else rm -rf {};echo "Success!"; fi'.format(filename,filename),shell=True)
#         return jsonify({'url':"https://onedrive.bilibilianime.com/e55T/image/{}".format(filename)}),200
#     return jsonify({'data':"不允许上传非图片文件"}), 415


@app.route('/api/logout', methods=['get'])
def logout():
    if g.user:
        session['username'] = False
        return jsonify({'code': 1, 'msg': "退出登录"})
    else:
        return jsonify({'code': 0, 'msg': "未登录"})


@app.route('/api/del', methods=['post'])
def delete():
    if g.user:
        try:
            data = json.loads(request.get_data(as_text=True))
            result = mycol.delete_one({"_id": ObjectId(data['id'])})
            if result.deleted_count:
                return jsonify({'code': 1, 'msg': "删除成功"})
            else:
                return jsonify({'code': 0, 'msg': "删除失败"})
        except:
            return jsonify({'code': 0, 'msg': "表单错误"})
    else:
        return jsonify({'code': 0, 'msg': "未登录"})


# 查询, q 为查询条数
@app.route('/api/query/<q>', methods=['get'])
def query(q):
    result = list(mycol.find().sort([("_id", -1)]).limit(int(q)))
    for each in result:
        each['_id'] = str(each['_id'])

    islogin = 0
    if g.user:
        islogin = 1

    return jsonify({"login": islogin, "data": result})


# 返回最新创建的
@app.route('/api/create', methods=['post'])
def create():
    if session.get("username"):
        new_content = json.loads(request.get_data(as_text=True))

        if len(re.findall("<script>.*</script>", new_content["content"])) > 0:
            new_content["content"] = escape(new_content["content"])

        # new_content['date'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        new_content['_id'] = str(mycol.insert_one(new_content).inserted_id)
        return jsonify({"code": 1, "msg": "创建成功", "data": new_content})
    else:
        return jsonify({'code': 0, 'msg': "未登录"})


if __name__ == '__main__':
    app.run(debug=True)
