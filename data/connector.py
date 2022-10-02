from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()


def connect():
    return pooling.MySQLConnectionPool(
        pool_name=os.getenv('pool_name'),
        pool_size=10,
        pool_reset_session=True,
        host=os.getenv('host'),
        user="root",
        password=os.getenv('password'),
        database=os.getenv('database')
    )


print(os.getenv('pool_name'))
