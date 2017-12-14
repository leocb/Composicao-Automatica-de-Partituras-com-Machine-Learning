#Imports
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.callbacks import TensorBoard
from keras.callbacks import ModelCheckpoint
import numpy as np
import keras
import random
#Cria resultados que podem ser reproduzidos (Random seed)
import os
#os.environ['PYTHONHASHSEED'] = '0'
#np.random.seed(0)
#TensorBoard
tbCallBack = TensorBoard(log_dir='./../logs/NotasNovas/', histogram_freq=0, write_graph=True)
#fazer em 34 épocas
#Modelo
#Tipo:
model = Sequential()
#Camadas
model.add(Dense(units=512, input_dim=1024, activation='relu'))
model.add(Dense(units=256, activation='relu'))
model.add(Dense(units=176, activation='relu'))
#model.add(Dropout(0.3))
model.add(Dense(units=88, activation='softmax'))
#Otimizador e perda
model.compile(loss='binary_crossentropy',
              optimizer='adam',
              metrics=['accuracy'])
#Path's
DataMainPath = './../dados/concatenado/'
ModelsMainPath = './rede/'
model.save(ModelsMainPath + "NotasNovasMain.h5")
#Load Data using numpy
inputData = np.loadtxt(open(DataMainPath+'FFT.data', 'rt'), delimiter=",")
outputData = np.loadtxt(open(DataMainPath+'NotasNovas.data', 'rt'), delimiter=",")
#Randomiza a posição dos dados
from sklearn.utils import shuffle
inputData, outputData = shuffle(inputData, outputData, random_state=0)
#Checkpoints que vai salvando o modelo durante o treinamento
mcCallBack = ModelCheckpoint(ModelsMainPath + "NotasNovasMain.h5", monitor='val_loss', verbose=0, save_best_only=False, save_weights_only=False, mode='auto', period=1)
# Train the model, 20% of data is used for evaluation
model.fit(inputData, outputData, validation_split=0.20, epochs=30, batch_size=128, callbacks=[tbCallBack,mcCallBack])
model.save(ModelsMainPath + "NotasNovasMain.h5")
