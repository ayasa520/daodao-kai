# -*- coding:utf8 -*-
# 这里的路由也是需要写上 /api 的

import os
from datetime import timedelta
from flask import Flask, jsonify, request, session
import pymongo
import json
import time
from flask_cors import *
from werkzeug.utils import redirect

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = os.urandom(24)
# app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

myclient = pymongo.MongoClient("mongodb://121.5.139.18:27017/")
mydb = myclient["test"]
mycol = mydb["test"]


@app.route('/api/login', methods=['post'])
def login():
    if session.get('username'):
        return jsonify({'code': 1, 'msg': "已登录"})
    try:
        data = json.loads(request.get_data(as_text=True))
        myquery = {'username': data['username'], 'password': data['password']}
    except:
        return jsonify({'code': 0, 'msg': "表单填写错误"})
    if len(list(mydb['config'].find(myquery))) != 0:
        session['username'] = data['username']
        session.permanent = True
        return jsonify({'code': 1, 'msg': "登陆成功"})
    else:
        return jsonify({'code': 0, 'msg': "密码错误"})


@app.route('/api/logout', methods=['get'])
def logout():
    if session.get('username'):
        session['username'] = False
        return jsonify({'code': 1, 'msg': "退出登录"})
    else:
        return jsonify({'code': 0, 'msg': "未登录"})


# 查询, q 为查询条数
@app.route('/api/query/<q>', methods=['get'])
def query(q):
    result = list(mycol.find().sort([("_id", -1)]).limit(int(q)))
    for each in result:
        each['_id'] = str(each['_id'])
    return jsonify(result)


# 返回最新创建的
@app.route('/api/create', methods=['post'])
def create():
    if session.get("username"):
        new_content = json.loads(request.get_data(as_text=True))
        new_content['date'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        new_content['_id'] = str(mycol.insert_one(new_content).inserted_id)
        return jsonify({"code":1,"msg":"创建成功","data":new_content})
    else:
        return jsonify({'code': 0, 'msg': "未登录"})


if __name__ == '__main__':
    app.run(debug=True)
