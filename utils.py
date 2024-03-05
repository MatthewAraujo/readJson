# Função para calcular a média dos elementos em uma lista
def calcular_media(lst):
  sum_all = 0
  size = 0
  for i in lst:
    sum_all += i
    size += 1
  
  if size == 0:
    return None

  return sum_all / size
  

# Função para calcular a mediana dos elementos em uma lista
def calcular_mediana(lst):
  size = 0

  for i in lst:
    size += 1
  
  if size == 0:
    return None

  if size % 2 == 0:
    return lst[size // 2]
    
  return lst[(size // 2 )]


def calcular_raiz_quadrada(n):
  return n ** 0.5

def calcular_desvio_padrao(lst):
  media = calcular_media(lst)
  sum_val = 0
  size = 0

  for i in lst:
    size += 1

  if media is None:
    return None


  dp = [lst - media for lst in lst]
  dp = [dp ** 2 for dp in dp]
  
  for i in dp:
    sum_val += i

  aswer = calcular_raiz_quadrada(sum_val / size)
  return aswer


# Função para calcular a variância dos elementos em uma lista
def calcular_variancia(lst):
  media = calcular_media(lst)
  sum_val = 0
  size = 0

  for i in lst:
    size += 1

  if media is None:
    return None


  dp = [lst - media for lst in lst]
  dp = [dp ** 2 for dp in dp]

  for i in dp:
    sum_val += i
  
  aswer =  sum_val / size
  return aswer

# Função para calcular a moda dos elementos em uma lista
def calcular_moda(lst):
  most_freq = {}
  size = 0

  for i in lst:
    size += 1
    if i in most_freq:
      most_freq[i] += 1
    else:
      most_freq[i] = 1

  if size == 0:
    return None

  maior = 0
  for key, value in most_freq.items():
    if value > maior:
      maior = value
      most_freq = key
    if value == maior and key != most_freq:
      most_freq = [most_freq, key]

  return most_freq