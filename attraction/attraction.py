from flask import *
from mysql.connector import pooling
from flask import jsonify
from mysql.connector import Error

connection_pool = pooling.MySQLConnectionPool(pool_name="pynative_pool",
                                                  pool_size=10,
                                                  pool_reset_session=True,
                                                  host='localhost',
                                                  database='website',
                                                  user='root',
                                                  password='password123')

attraction = Blueprint("attraction"
                    ,__name__,
                    static_folder="static",
                    template_folder="templates")

@attraction.route("/api/attraction/<attractionId>")
def api_attractions_id(attractionId):
    try:
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
            return jsonify({
                    "data":result_all
                    })
    except Error as e:
        print("Error",e)
    finally:
        if (connection_object.is_connected()):
            cursor.close()
            connection_object.close()


@attraction.route("/api/attractions")
def api_ttractions():
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)
        input_page=request.args.get("page")
        input_page=int(input_page)
        input_keyword=request.args.get("keyword")
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
                return  jsonify({
                    "data":result_all,
                    "nextPage":input_page+1
                })
            if int(count_page) == input_page:
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
                return  jsonify({
                    "data":result_all,
                    "nextPage":input_page+1
                })
            if int(count_page) == input_page:
                return  jsonify({
                    "data":result_all,
                    "nextPage":"null"
            })
    except Error as e:
        print("Error",e)
    finally:
        if (connection_object.is_connected()):
            cursor.close()
            connection_object.close()