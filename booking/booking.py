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
booking = Blueprint("booking", __name__,
                    static_folder="static",
                    template_folder="templates")

# api booking / attraction info (not booking yet)  / GET


@booking.route("/api/booking")
def api_booking():
    try:
        if "usermail" in session:
            member_id = session["userid"]
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            cursor.execute(
                "SELECT * FROM `taipeitrip_booking` WHERE `member_id`=%s", [member_id])
            result = cursor.fetchone()
            if result == None:
                return jsonify({
                    "error": True,
                    "message": "No order."
                })

            return jsonify({
                "data": {
                    "attraction": {
                        "id": result["attr_id"],
                        "name": result["attr_name"],
                        "address": result["attr_address"],
                        "image": result["attr_image"]
                    },
                    "date": result["date"],
                    "time": result["time"],
                    "price": result["price"]
                }
            })
    except Error as e:
        print("Error", e)
    finally:
        if (connection_object.is_connected()):
            cursor.close()
            connection_object.close()

# api booking / new booking  / POST


@booking.route("/api/booking", methods=["POST"])
def api_newBooking():
    try:
        if "usermail" in session:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            booking_info = session["booking_info"]
            member_id = session["userid"]
            data = request.get_json()
            input_id = data["attractionId"]
            input_date = data["date"]
            input_time = data["time"]
            input_price = data["price"]
            attr_name = booking_info["name"]
            attr_address = booking_info["address"]
            attr_image = booking_info["image"]
            data = [member_id, input_date, input_time, input_price,
                    input_id, attr_name, attr_address, attr_image]
            print(data)
            for info in data:
                print(info)
                if not info:
                    return jsonify({
                        "error": True,
                        "message": "Missing booking data."
                    })
            # delete old order
            cursor.execute(
                "DELETE FROM `taipeitrip_booking` WHERE `member_id`=%s", [member_id])
            connection_object.commit()
            result = cursor.fetchone()
            # add new booking (be the latest one)
            insert = """INSERT INTO `taipeitrip_booking` (`member_id`,`date`,
                        `time`,`price`,`attr_id`,`attr_name`,`attr_address`,`attr_image`)
                        VALUES (%s,%s,%s,%s,%s,%s,%s,%s);"""
            cursor.execute(insert, data)
            connection_object.commit()
            result = cursor.fetchone()
            print(result)
            return jsonify({
                "ok": True
            })
        else:
            return jsonify({
                "error": True,
                "message": "Please sign in."
            })
    except Error as e:
        print("Error", e)
    finally:
        if (connection_object.is_connected()):
            cursor.close()
            connection_object.close()

# api booking / delete booking  / DELETE


@booking.route("/api/booking", methods=["DELETE"])
def api_deleteBooking():
    try:
        if "usermail" in session:
            member_id = session["userid"]
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            cursor.execute(
                "DELETE FROM `taipeitrip_booking` WHERE `member_id`=%s", [member_id])
            connection_object.commit()
            return jsonify({
                "ok": True
            })
        else:
            return jsonify({
                "error": True,
                "message": "Please sign in."
            })
    except Error as e:
        print("Error", e)
    finally:
        if (connection_object.is_connected()):
            cursor.close()
            connection_object.close()