from flask import Flask
import pymongo
app = Flask(__name__)

myclient = pymongo.MongoClient("mongodb://121.5.139.18:27017/")
mydb = myclient["test"]
mycol = mydb["config"]

mydict = {"name":"rikka","password":"cuide5942b"}
mycol.insert_one(mydict)
#
# myquery={"name":"RUNOOB"}
#
# # mycol.delete_one(myquery)
# myresult = mycol.find().limit(3)
#
# for x in myresult:
#   print(x)
#


# @app.route('/')
# def hello_world():
#     return 'Hello World'
#
#
# if __name__ == '__main__':
#     app.run(debug=True)
