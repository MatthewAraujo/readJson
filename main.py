import json

# Read the JSON file
with open('log.json', 'r') as file:
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
      "difference": diff
    }
    new_store['products'].append(product_info)
  
  new_data['stores'].append(new_store)
  # calcule difference for each store

# create a new file to store the new JSON structure
with open('new_data.json', 'w') as file:
  json.dump(new_data, file, indent=2) 


# Tempo total por loja
with open('new_data.json', 'r') as file:
  data = file.read()

data_dict = json.loads(data)

# for store in data_dict['stores']:
  # print(f"Tempo total para a loja {store['name']} foi de {store['difference']} segundos")

# Tempo medio e variancia por loja
from utils import calcular_media, calcular_variancia

lojas = {}
for store in data_dict['stores']:
  lojas[store['name']] = store['difference']
  media = calcular_media(list(lojas.values()))
  variancia = calcular_variancia(list(lojas.values()))

# Tempo medio e variancia por produto 
produtos = {}
for store in data_dict['stores']:
  for product in store['products']:
    if product['id'] not in produtos:
      produtos[product['id']] = []
    produtos[product['id']].append(product['difference'])

lista_valores = [valor for sublist in list(produtos.values()) for valor in sublist]

media = calcular_media(lista_valores)
variancia = calcular_variancia(lista_valores)
  


# # Tempo medio e variancia para os produtos que tiveram sucesso
lojas_sucesso = {}
for store in data_dict['stores']:
  print(store)
  if store['finalStatus'] != 'D':
    print(f"Tempo médio para a loja {store['name']} foi de {media} segundos")
    lojas_sucesso[store['name']] = store['difference']
    media = calcular_media(list(lojas_sucesso.values()))
    variancia = calcular_variancia(list(lojas_sucesso.values()))



# tempo medio e variancia para o resto dos produtos
for store in data_dict['stores']:
  for product in store['products']:
    if product['finalStatus'] != 'D':
      print(f"Tempo médio para o produto {product['id']} foi de {media} segundos")
      print(f"Variancia para o produto {product['id']} foi de {variancia} segundos")
      print("")

