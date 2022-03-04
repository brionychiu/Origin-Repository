from email.mime import image
import mysql.connector
import json

cnx = mysql.connector.connect(
host="localhost",
port="3306",
user="root",
password="password123",
database="website"
)

    
with open('taipei-attractions.json', "r",encoding="utf-8") as file:
    data=json.load(file)
data=data["result"]["results"]
for i in data:
    name=i["stitle"]
    category=i["CAT2"]
    description=i["xbody"]
    address=i["address"]
    transport=i["info"]
    mrt=i["MRT"]
    latitude=i["latitude"]
    longitude=i["longitude"]
    images=i["file"].replace('JPG','jpg')
    images=images.split("https://www.travel.taipei/streams/")
    images=images[0]
    try:
        cur = cnx.cursor()
        cur.execute("INSERT INTO `taipei_attrs`(`name`,`category`,`description`,`address`,`transport`,`mrt`,`latitude`,`longitude`,`images`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s);",(name,category,description,address,transport,mrt,latitude,longitude,images))  
        cnx.commit()
    except mysql.connector.Error as err:
        cnx.rollback()
cur.close()
cnx.close()
          







