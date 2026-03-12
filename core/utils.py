def api_response(success = True , message = "", data=None):
    return{
        "success":success,
        "message":message,
        "data":data
    }