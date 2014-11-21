#!/user/bin/env python
#coding: utf-8

import os
import json
import random

import geventwebsocket


html_content = open("../fore/start.html", 'r').read()


BOX_NUM = 8

waiting_players = []


class Player(object):
    def __init__(self, ws):
        self.ws = ws
        self.uid = ""
        self.opponent = None

    def send(self, msg):
        self.ws.send(json.dumps(msg)) 

    def broad(self, msg):
        msg.update({"uid": self.uid})
        self.send(msg)
        self.opponent.send(msg)
        


def static_wsgi_app(environ, start_response):
    start_response("200 OK", [("Content-Type", "text/html")])
    return html_content


def chat_app(environ, start_response):
    websocket = ws = environ.get("wsgi.websocket")
    player = Player(ws)
    if not waiting_players:
        waiting_players.append(player)
    else:
        opponent = waiting_players.pop()
        player.opponent = opponent
        opponent.opponent = player
        
    if websocket is None:
        return static_wsgi_app(environ, start_response)

    try:
        while True:
            msg = ws.receive()
            if msg:
                deal_msg(player, msg)
            else:
                break

    except geventwebsocket.WebSocketError, ex:
        print "{0}: {1}".format(ex.__class__.__name__, ex)


def deal_msg(player, msg):
    msg_dict = json.loads(msg)
    command = msg_dict.get("c", "")
    if command == "w":
        if not player.opponent:
            player.uid = 'pusher_1'
            msg_dict.update({"uid": player.uid})
            player.send(msg_dict)
        else:
            player.uid = 'pusher_2'
            msg_dict.update({"uid": player.uid})
            player.send(msg_dict)
            player.broad(init_world_msg())
    else:
        print msg_dict 
        player.broad(msg_dict)

    
def init_world_msg():
    data = {}
    all_locations = random.sample(range(0, 400), BOX_NUM + 2) 
    data['c'] = 'b'
    data['data'] = {
        'pusher_1': all_locations[0],
        'pusher_2': all_locations[1],
        'boxes': all_locations[2:],
    }
    return data
    



path = os.path.dirname(geventwebsocket.__file__)
agent = "gevent-websocket/%s" % (geventwebsocket.get_version())


print "Running %s from %s" % (agent, path)
geventwebsocket.WebSocketServer(("0.0.0.0", 9091), chat_app, debug=False).serve_forever()
