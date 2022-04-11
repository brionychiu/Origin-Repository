import datetime
import requests
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
order = Blueprint("order", __name__,
                  static_folder="static",
                  template_folder="templates")

# api orders / new order  / POST


@order.route("/api/orders", methods=["POST"])
def api_newOrders():
    try:
        if "usermail" in session:
            member_id = session["userid"]
            data = request.get_json()
            contact_name = data["order"]["contact"]["name"]
            contact_mail = data["order"]["contact"]["email"]
            contact_phone = data["order"]["contact"]["phone"]
            if not contact_name or not contact_mail or not contact_phone:
                return jsonify({
                    "error": True,
                    "message": "Missing order data."
                })
            time = datetime.datetime.now()
            time = time.strftime('%Y%m%d%H%M')
            order_number = time+str(member_id)
            attraction_id = data["order"]["trip"]["attraction"]["id"]
            attraction_image = data["order"]["trip"]["attraction"]["image"]
            order_date = data["order"]["trip"]["date"]
            order_time = data["order"]["trip"]["time"]
            order_price = data["order"]["price"]
            # TapPay request
            url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
            headers = {'content-type': 'application/json',
                       "x-api-key": 'partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM'}
            body = {
                "prime": data["prime"],
                "partner_key": 'partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM',
                "merchant_id": "GlobalTesting_CTBC",
                "details": str(member_id) + "的" + order_number + "訂單",
                "amount": order_price,
                "cardholder": {
                    "phone_number": contact_phone,
                    "name": contact_name,
                    "email": contact_mail,
                },
                "remember": True
            }
            tappay_result = requests.post(
                url, json=body, headers=headers).json()
            if tappay_result["status"] == 0:
                order_data = [member_id, order_number,
                              attraction_id, attraction_image,
                              order_date, order_time, order_price,
                              contact_name, contact_mail, contact_phone]
                connection_object = connection_pool.get_connection()
                cursor = connection_object.cursor(dictionary=True)

                # add new order
                insert = """INSERT INTO `taipeitrip_order` (
                            `member_id`,`order_number`,
                            `attraction_id`,`attraction_image`,
                            `order_date`,`order_time`,`order_price`,
                            `contact_name`,`contact_mail`,`contact_phone`)
                            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);"""
                cursor.execute(insert, order_data)
                connection_object.commit()
                result = cursor.fetchone()
                # delete old booking
                cursor.execute(
                    "DELETE FROM `taipeitrip_booking` WHERE `member_id`=%s", [member_id])
                connection_object.commit()
                result = cursor.fetchone()
                return jsonify({
                    "data": {
                        "number": order_number,
                        "payment": {
                            "status": 0,
                            "message": "付款成功"
                        }
                    }
                })
            else:
                return jsonify({
                    "error": True,
                    "message": tappay_result["msg"]
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

# api order / order info / GET


@order.route("/api/order/<orderNumber>")
def api_Order(orderNumber):
    try:
        if "usermail" in session:
            member_id = session["userid"]
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            cursor.execute("""SELECT `name`,`address`,
            `attraction_id`,`attraction_image`,
            `order_date`,`order_time`,`order_price`,
            `contact_name`,`contact_mail`,`contact_phone`
            FROM `taipeitrip_order` JOIN `taipei_attrs` 
            ON `attraction_id` = `id`
            WHERE `order_number`=%s AND `member_id`=%s""", [orderNumber, member_id])
            result = cursor.fetchone()
            if result == None:
                return jsonify({
                    "data": None,
                    "message": "Please check others order number."

                })
            else:
                return jsonify(
                    {
                        "data": {
                            "number": orderNumber,
                            "price": result["order_price"],
                            "trip": {
                                "attraction": {
                                    "id": result["attraction_id"],
                                    "name": result["name"],
                                    "address": result["address"],
                                    "image": result["attraction_image"]
                                },
                                "date": result["order_date"],
                                "time": result["order_time"]
                            },
                            "contact": {
                                "name": result["contact_name"],
                                "email": result["contact_mail"],
                                "phone": result["contact_phone"]
                            },
                            "status": 1
                        }
                    }
                )
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
