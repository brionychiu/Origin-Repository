from flask import *
from flask_cors import CORS

from member.member import member
from attraction.attraction import attraction
from error.error import error

app=Flask(__name__)
CORS(app,resources={r"/api/*": {"origins": "*"}})

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False
app.secret_key="secret key can't revel"
# app.config['CORS_HEADERS'] = ['Content-Type':application/json]
app.register_blueprint(member)
app.register_blueprint(attraction)
app.register_blueprint(error)


# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

app.run(host= "0.0.0.0",port=3000)

