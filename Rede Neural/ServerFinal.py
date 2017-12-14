# Imports Rede Neural
from keras.models import load_model
import numpy as np

# Imports WebSocket
import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.template
import os

# Path's
dir = os.path.dirname(__file__)
ModelNovasMainPath = os.path.join(dir, 'NNNovas','rede')
ModelTocadasMainPath = os.path.join(dir, 'NNTocadas','rede')

# Carrega o modelos salvo
modelNovas = load_model(os.path.join(ModelNovasMainPath ,'NotasNovasMain.h5'))
modelTocadas = load_model(os.path.join(ModelTocadasMainPath ,'NotasTocadasMain.h5'))

# inicia o servidor
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
        #clientId.write_message("Connection was accepted.")

    def on_message(clientId, message):
        # Recebe os dados de entrada do FFT
        entrada = np.array([np.fromstring(message, dtype=np.float, sep=',')])

        # Saida da rede neural
        respostaNovas = modelNovas.predict(entrada, batch_size=1)
        respostaTocadas = modelTocadas.predict(entrada, batch_size=1)

        # Se quiser usar a resposta direta da rede, arredonde a resposta da rede para 3 casas decimais
        respostaTocadas = np.round(respostaTocadas.astype(np.float), 3)
        respostaNovas = np.round(respostaNovas.astype(np.float), 3)

        # Binariza a saida
        #treshold = 0.7
        #respostaNovas[respostaNovas >= treshold] = 1
        #respostaNovas[respostaNovas < treshold] = 0
        #respostaTocadas[respostaTocadas >= treshold] = 1
        #respostaTocadas[respostaTocadas < treshold] = 0

        # Cria as strings de resposta
        stringNovas = np.array2string(
            respostaNovas, precision=4, separator=',').replace("[", "").replace("]", "")
        stringTocadas = np.array2string(
            respostaTocadas, precision=4, separator=',').replace("[", "").replace("]", "")

        # envia a resposta
        clientId.write_message(stringNovas + "|" + stringTocadas)

    def on_close(clientId):
        print('connection closed...')


application = tornado.web.Application([
    (r'/ws', WSHandler),
    (r'/', MainHandler),
    (r"/(.*)", tornado.web.StaticFileHandler, {"path": "resources"}),
])
if __name__ == "__main__":
    print('ready!')
    application.listen(9091)
    tornado.ioloop.IOLoop.instance().start()
