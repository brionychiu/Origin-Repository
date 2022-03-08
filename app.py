from flask import *
from mysql.connector import pooling
from flask import jsonify
from flask_cors import CORS

connection_pool = pooling.MySQLConnectionPool(pool_name="pynative_pool",
                                                  pool_size=5,
                                                  pool_reset_session=True,
                                                  host='localhost',
                                                  database='website',
                                                  user='root',
                                                  password='password123')

app=Flask(__name__)
CORS(app,resources={r"/api/*": {"origins": "*"}})

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False
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

@app.route("/api/attraction/<attractionId>")
def api_attractions_id(attractionId):
    connection_object = connection_pool.get_connection()
    cursor = connection_object.cursor(dictionary=True)
    cursor.execute("SELECT COUNT(`id`) FROM `taipei_attrs`")
    count_page=cursor.fetchone()
    count_page=count_page["COUNT(`id`)"]
    if int(count_page) >= int(attractionId):
        cursor.execute("SELECT * FROM `taipei_attrs` WHERE `id`=%s",[attractionId])
        result=cursor.fetchone()
        # result_all=[]
        images_new=[]
        images=result["images"].split("https")
        if '' in images:
            images.remove('')
        for n in range(len(images)):
            images_https = "https"+images[n]
            images_new.append(images_https)
        result_all=(
            {
            "id":result["id"],
            "name":result["name"],
            "category":result["category"],
            "description":result["description"],
            "address":result["address"],
            "transport":result["transport"],
            "mrt":result["mrt"],
            "latitude":result["latitude"],
            "longitude":result["longitude"],
            "images":images_new
        })
        if connection_object.is_connected():
            cursor.close()
            connection_object.close()
        return jsonify({
                "data":result_all
                })


@app.route("/api/attractions")
def api_ttractions():
    input_page=request.args.get("page")
    input_page=int(input_page)
    input_keyword=request.args.get("keyword")
    connection_object = connection_pool.get_connection()
    cursor = connection_object.cursor(dictionary=True)
    if input_keyword!=None:
        cursor.execute("SELECT COUNT(`name`) FROM `taipei_attrs` WHERE LOCATE( %s ,`name`) ;",[input_keyword])
        count_page=cursor.fetchone()
        count_page=count_page["COUNT(`name`)"]/12
        cursor.execute("SELECT * FROM `taipei_attrs` WHERE LOCATE( %s ,`name`) LIMIT %s,12;",[input_keyword,(input_page*12)])
        results=cursor.fetchall()
        result_all=[]
        for result in results:
            images_new=[]
            images=result["images"].split("https")
            if '' in images:
                images.remove('')
            for n in range(len(images)):
                images_https = "https"+images[n]
                images_new.append(images_https)
            result_all.append(
                {
                "id":result["id"],
                "name":result["name"],
                "category":result["category"],
                "description":result["description"],
                "address":result["address"],
                "transport":result["transport"],
                "mrt":result["mrt"],
                "latitude":result["latitude"],
                "longitude":result["longitude"],
                "images":images_new
            })
        if  int(count_page) > input_page:
            if connection_object.is_connected():
                cursor.close()
                connection_object.close()
            return  jsonify({
                "data":result_all,
                "nextPage":input_page+1
            })
        if int(count_page) == input_page:
            if connection_object.is_connected():
                cursor.close()
                connection_object.close()
            return  jsonify({
                "data":result_all,
                "nextPage":"null"
        })
    else:
        cursor.execute("SELECT COUNT(`name`) FROM `taipei_attrs`")
        count_page=cursor.fetchone()
        count_page=count_page["COUNT(`name`)"]/12
        cursor.execute("SELECT * FROM `taipei_attrs` ORDER BY `id` LIMIT %s,12;",[(input_page*12)])
        results=cursor.fetchall()
        result_all=[]
        for result in results:
            images_new=[]
            images=result["images"].split("https")
            if '' in images:
                images.remove('')
            for n in range(len(images)):
                images_https = "https"+images[n]
                images_new.append(images_https)
            result_all.append(
                {
                "id":result["id"],
                "name":result["name"],
                "category":result["category"],
                "description":result["description"],
                "address":result["address"],
                "transport":result["transport"],
                "mrt":result["mrt"],
                "latitude":result["latitude"],
                "longitude":result["longitude"],
                "images":images_new
            })
        if  int(count_page) > input_page:
            if connection_object.is_connected():
                cursor.close()
                connection_object.close()
            return  jsonify({
                "data":result_all,
                "nextPage":input_page+1
            })
        if int(count_page) == input_page:
            if connection_object.is_connected():
                cursor.close()
                connection_object.close()
            return  jsonify({
                "data":result_all,
                "nextPage":"null"
        })
@app.errorhandler(500)
def page_not_found(error):
    return jsonify({
        "error": True,
        "message": "500 Bad Request"
        })
app.run(host= "0.0.0.0",port=3000)

