import json

# Read the JSON file
with open('log_hoje.json', 'r') as file:
  data = file.read()


data_dict = json.loads(data)

# New JSON structure to store results
new_data = {
  "stores": []
}

# Calculate difference for the entire process
diff = data_dict['crawlingEnd'] - data_dict['crawlingStart']
new_data['difference'] = diff


# Iterate through stores
for store in data_dict['stores']:
  new_store = {
    "name": store['name'],
    "store": store['store'],
    "products": [],
    "difference": store['crawlingEnd'] - store['crawlingStart']
  }
  
  # Calculate difference for each product
  for product in store['products']:
    diff = product['crawlingEnd'] - product['crawlingStart']
    product_info = {
      "id": product['id'],
      "finalStatus": product['finalStatus'],
      "difference": diff
    }
    new_store['products'].append(product_info)
  
  new_data['stores'].append(new_store)
  # calcule difference for each store

# create a new file to store the new JSON structure
with open('new_data.json', 'w') as file:
  json.dump(new_data, file, indent=2) 


with open('new_data.json', 'r') as file:
  data = file.read()

data_dict = json.loads(data)

# Tempo total por loja
# b. Tempo médio e variância por loja
# c. Tempo médio e variância dos produtos
# d. Tempo médio e variância para produtos que tiveram sucesso na coleta de preço
# e. Tempo médio e variância para o restante dos produtos

relatorio = {
  'tempo_total_por_loja': 0,
  'tempo_medio_por_loja': 0,
  'variancia_por_loja': 0,
  'tempo_medio_por_produto': 0,
  'variancia_por_produto': 0,
  'tempo_medio_por_produto_sucesso': 0,
  'variancia_por_produto_sucesso': 0,
  'tempo_medio_por_produto_resto': 0,
  'variancia_por_produto_resto': 0,
}

from utils import calcular_media, calcular_variancia, milliseconds_to_hours

# Tempo total por loja
arr = [] 
for store in data_dict['stores']:
  arr.append(store['difference'])

relatorio['tempo_total_por_loja'] = milliseconds_to_hours(sum(arr))

# tempo medio por loja
relatorio['tempo_medio_por_loja'] = milliseconds_to_hours(sum(arr) / len(arr))

# variancia por loja
relatorio['variancia_por_loja'] = milliseconds_to_hours(calcular_variancia(arr))


# Tempo medio e variancia por produto
arr = []
for store in data_dict['stores']:
  for product in store['products']:
    arr.append(product['difference'])

relatorio['tempo_medio_por_produto'] = milliseconds_to_hours(calcular_media(arr))
relatorio['variancia_por_produto'] = milliseconds_to_hours(calcular_variancia(arr))


# Tempo medio e variancia por produto sucesso
arr = []
for store in data_dict['stores']:
  for product in store['products']:
    if product['finalStatus'] == 'D':
      arr.append(product['difference'])

relatorio['tempo_medio_por_produto_sucesso'] = milliseconds_to_hours(calcular_media(arr))
relatorio['variancia_por_produto_sucesso'] = milliseconds_to_hours(calcular_variancia(arr))

# Tempo medio e variancia por produto resto
arr = []
for store in data_dict['stores']:
  for product in store['products']:
    if product['finalStatus'] != 'D':
      arr.append(product['difference'])

relatorio['tempo_medio_por_produto_resto'] = milliseconds_to_hours(calcular_media(arr))
relatorio['variancia_por_produto_resto'] = milliseconds_to_hours(calcular_variancia(arr))


with open('relatorio.json', 'w') as file:
  json.dump(relatorio, file, indent=2)