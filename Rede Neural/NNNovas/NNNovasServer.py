#Imports Rede Neural
from keras.models import load_model
import numpy as np
#Imports WebSocket
import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.template
#Path's
ModelsMainPath = './rede/'
#Carrega o modelos salvo
model = load_model(ModelsMainPath + "NotasNovasMain.h5")
#inicia o servidor
class MainHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
    def get(self):
        loader = tornado.template.Loader(".")
        self.write(loader.load("index.html").generate())
class WSHandler(tornado.websocket.WebSocketHandler):
    def check_origin(clientId, origin):
        return True
    def open(clientId):
        print('connection opened...')
        clientId.write_message("Connection was accepted.")
    def on_message(clientId, message):
        #Predict the output
        entrada = np.array([np.fromstring(message, dtype=np.float, sep=',')])
        resposta = model.predict(entrada, batch_size=1)
        #resposta = np.round(resposta.astype(np.float),3)
        #Binariza a saida
        treshold = 0.7
        resposta[resposta >= treshold] = 1
        resposta[resposta < treshold] = 0
        clientId.write_message(np.array2string(resposta, precision=4, separator=',').replace("[","").replace("]",""))
    def on_close(clientId):
        print('connection closed...')
application = tornado.web.Application([
    (r'/ws', WSHandler),
    (r'/', MainHandler),
    (r"/(.*)", tornado.web.StaticFileHandler, {"path": "resources"}),
])
if __name__ == "__main__":
    application.listen(9091)
    tornado.ioloop.IOLoop.instance().start()
