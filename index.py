import os
from datetime import timedelta
from flask import Flask, jsonify, request,session
import pymongo
import json
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

myclient = pymongo.MongoClient("mongodb://121.5.139.18:27017/")
mydb = myclient["test"]
mycol = mydb["test"]


@app.route('/api/login', methods=['post'])
def login():
    try:
        data = json.loads(request.get_data(as_text=True))
        myquery = {'name': data['name'], 'password': data['password']}
    except:
        return "表单填写错误"
    if len(list(mydb['config'].find(myquery))) != 0:
        session['username'] = data['name']
        session.permanent = True
        return "登陆成功"
    else:
        return "密码错误"


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
    new_content = json.loads(request.get_data(as_text=True))
    new_content['date'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    new_content['_id'] = str(mycol.insert_one(new_content).inserted_id)
    return jsonify(new_content)




if __name__ == '__main__':
    app.run(debug=True)
