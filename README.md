_Sorry english speakers, everything in here is in Brazilian Portuguese; Maybe google translate can help you. Good luck!_

# Composição Automática de Partituras com Machine Learning

Projeto desenvolvido como trabalho de conclusão de curso de **Engenharia da Computação** da faculdade **UniSalesiano de Araçatuba**.

## Desenvolvido por
- André Igor Gallacci
- João Augusto Silva Lêdo
- Leonardo César Bottaro

## Sob orientação dos professores
- James Clauton da Silva (Doutor)
- José Vital Ferraz Leão (Mestre)
- Renato de Aguiar Teixeira Mendes (Doutor)

# Documentos
O artigo e relatorio técnico, com informações mais detalhadas do que foi feito, qual o nosso objetivo, como fizemos e os resultados, podem ser encontrados dentro da pasta _Artigo & Relatório Técnico_

A pasta _Apresentações & Vídeos_ contém as apresentações que fizemos ao nossos professores e colegas durante as aulas e "checkpoints" do trabalho.

As outras três pastas contém o código fonte de diferentes partes do projeto, recomendo olhar o relatório técnico para mais informações sobre o conteudo de cada uma.

# Executar o projeto
## Front-end (Interface)
Distribua todos os arquivos da pasta `interface` com um servidor básico de arquivos estáticos, recomendo a extensão _Chrome Web Server_ do Google Chrome ou então subir os arquivos no _Firebase Hosting_ do Google, depois disso, basta acessar o index.html do servidor pelo seu navegador de internet.

## Back-end (Rede Neural)
O back-end é feito em Python e depende de algumas bibliotecas para funcionar corretamente, tenha instalado em seu ambiente:
- Python 3.6.2
- Tornado
- Numpy
- Keras
- TensorFlow 1.3

Após instalado essas dependencias, execute o arquivo `ServerFinal.py` dentro do _Python_. Quando a mensagem "**_READY!_**" aparecer na tela, significa que o servidor está rodando e aguardando conexões.

## Em ação!
Agora na interface, Ajuste o BPM para que fique de acordo da musica que será tocada, depois basta colocar o endereço IP do servidor python e  clicar no botao "**_conectar_**". A partir deste momento o programa vai começar a escutar seu microfone e desenhar as notas que ouvir.

# Bibliotecas utilizadas
Muito obrigado aos desenvolvedores e a comunidade open-source, sem eles esse projeto não seria possível!
- p5.js - https://github.com/processing/p5.js
- MIDI.js - https://github.com/mudcube/MIDI.js/
- VexFlow - https://github.com/0xfe/vexflow
- VexFlow-json - https://github.com/rubiety/vexflow-json
- Tornado - https://github.com/tornadoweb/tornado

# Observações
- Use sob sua própria conta e risco, não nos responsabilizamos por qualquer dano causada pelo uso deste software.
- O navegador **_Safari_** não permite utilizar o microfone, ou seja, este programa nao funciona no _safari_.
- Programa experimental, **não** recomendamos seu uso para aplicações finais.
- Perdi o Jogo.