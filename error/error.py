from flask import *
from flask import jsonify

error = Blueprint("error"
                    ,__name__,
                    static_folder="static",
                    template_folder="templates")
                    
@error.errorhandler(500)
def page_not_found(error):
    return jsonify({
        "error": True,
        "message": "500 Bad Request"
        })