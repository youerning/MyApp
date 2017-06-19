from flask import Flask
from flask import Response, request, abort
import urlparse
import requests
import json

app = Flask(__name__)
esUrl = "http://176.31.137.145:9200/"

@app.route("/<app>", methods=["GET","POST"])
def index(app):
    params = "?format=json&pretty"
    data = {}
    error = ""
    req = getattr(requests, request.method.lower())
    if app == "es":
        arg = request.args["api"]
        if "search" in arg:
            params = params + "&size=0"
        url = urlparse.urljoin(esUrl, arg + params)
        # print url
        page = req(url) if request.method == "GET" else req(url, request.data)
        if page.ok:
            try:
                ret =  page.json()
            except Exception as e:
                ret = page.content
                error = str(e)
        else:
            ret = "The url:%s request faild" % url
            error = "request faild"

    elif app == "zab":
        ret = [{"status":"ok"}]

    else:
        ret = ""
        error = "incorrect url"

    data["data"] = ret
    data["error"] = error
    resp = Response(json.dumps(data))
    if error:
        abort(500)

    resp.headers["Content-Type"] = "application/json; charset=UTF-8"
    resp.headers["access-control-allow-origin"] = "*"
    
    return resp

if __name__ == "__main__":
    app.run(port=80,debug=True,host="0.0.0.0")
