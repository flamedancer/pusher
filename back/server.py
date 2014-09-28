#!/user/bin/env python
#coding: utf-8

import os

import geventwebsocket


html_content = open("../fore/start.html", 'r').read()


def static_wsgi_app(environ, start_response):
    start_response("200 OK", [("Content-Type", "text/html")])
    return html_content


def chat_app(environ, start_response):
    websocket = ws = environ.get("wsgi.websocket")
    if websocket is None:
        return static_wsgi_app(environ, start_response)

    try:
        while True:
            msg = ws.receive()
            if msg:
                ws.send(msg)
            else:
                break

    except geventwebsocket.WebSocketError, ex:
        print "{0}: {1}".format(ex.__class__.__name__, ex)




path = os.path.dirname(geventwebsocket.__file__)
agent = "gevent-websocket/%s" % (geventwebsocket.get_version())


print "Running %s from %s" % (agent, path)
geventwebsocket.WebSocketServer(("0.0.0.0", 9091), chat_app, debug=False).serve_forever()
