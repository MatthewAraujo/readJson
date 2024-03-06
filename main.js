const fs = require('fs');

// Read the JSON file
const data = fs.readFileSync('log_hoje.json', 'utf8');
const dataDict = JSON.parse(data);

// New JSON structure to store results
let new_data = {
  "stores": []
};

// Calculate difference for the entire process
const diff = dataDict['crawlingEnd'] - dataDict['cr awlingStart'];
new_data['difference'] = diff;

// Iterate through stores
for (const store of dataDict['stores']) {
  const new_store = {
    "name": store['name'],
    "store": store['store'],
    "products": [],
    "difference": store['crawlingEnd'] - store['crawlingStart']
  };

  // Calculate difference for each product
  for (const product of store['products']) {
    const diff = product['crawlingEnd'] - product['crawlingStart'];
    const product_info = {
      "id": product['id'],
      "finalStatus": product['finalStatus'],
      "difference": diff
    };
    new_store['products'].push(product_info);
  }

  new_data['stores'].push(new_store);
}

// Create a new file to store the new JSON structure
fs.writeFileSync('new_data.json', JSON.stringify(new_data, null, 2));

const newData = fs.readFileSync('new_data.json', 'utf8');
const dataDictNew = JSON.parse(newData);

const relatorio = {
  'tempo_total_por_loja': [],
  'tempo_medio_por_loja_e_variancia': [],
  'tempo_medio_por_produto_e_variancia': [],
  'tempo_medio_por_produto_sucesso_e_variancia': [],
  'tempo_medio_por_produto_resto_e_variancia': [],
};

// Function to calculate average
function calcularMedia(arr) {
  const sum = arr.reduce((acc, curr) => acc + curr, 0);
  return sum / arr.length;
}

// Function to calculate variance
function calcularVariancia(arr) {
  const mean = calcularMedia(arr);
  const sum = arr.reduce((acc, curr) => acc + (curr - mean) ** 2, 0);
  return sum / arr.length;
}

// Function to convert milliseconds to hours
function millisecondsToHours(milliseconds) {
  const seconds = milliseconds / 1000;
  const hours = seconds / 3600;
  const pad = (num) => (num < 10 ? "0" + num : num); // Function to pad single digit with leading zero if necessary
  const hh = pad(Math.floor(hours));
  const mm = pad(Math.floor((hours % 1) * 60));
  const ss = pad(Math.floor(((hours * 60) % 1) * 60));
  return `${hh}:${mm}:${ss}`;
}


// Tempo total por loja
const tempoTotalPorLoja = {};
for (const store of dataDictNew.stores) {
  tempoTotalPorLoja[store.name] = millisecondsToHours(store.difference);
}
relatorio['tempo_total_por_loja'] = tempoTotalPorLoja;

// Tempo médio e variância por loja
const tempoMedioPorLojaEVariancia = {};
for (const store of dataDictNew.stores) {
  for (const product of store.products) {
    if (tempoMedioPorLojaEVariancia[store.name]) {
      tempoMedioPorLojaEVariancia[store.name].push(product.difference);
    } else {
      tempoMedioPorLojaEVariancia[store.name] = [product.difference];
    }
  }
}

for (const [key, value] of Object.entries(tempoMedioPorLojaEVariancia)) {
  tempoMedioPorLojaEVariancia[key] = {
    "media": millisecondsToHours(calcularMedia(value)),
    "variancia": millisecondsToHours(calcularVariancia(value))
  };
}

relatorio['tempo_medio_por_loja_e_variancia'] = tempoMedioPorLojaEVariancia;

// Tempo médio e variância dos produtos
const tempoMedioPorProdutoEVariancia = {};
for (const store of dataDictNew.stores) {
  for (const product of store.products) {
    if (tempoMedioPorProdutoEVariancia[product.id]) {
      tempoMedioPorProdutoEVariancia[product.id].push(product.difference);
    } else {
      tempoMedioPorProdutoEVariancia[product.id] = [product.difference];
    }
  }
}

for (const [key, value] of Object.entries(tempoMedioPorProdutoEVariancia)) {
  tempoMedioPorProdutoEVariancia[key] = {
    "media": millisecondsToHours(calcularMedia(value)),
    "variancia": millisecondsToHours(calcularVariancia(value))
  };
}

relatorio['tempo_medio_por_produto_e_variancia'] = tempoMedioPorProdutoEVariancia;

// Tempo médio e variancia dos produtos com sucesso
const tempoMedioPorProdutoSucessoEVariancia = {};
for (const store of dataDictNew.stores) {
  for (const product of store.products) {
    if (product.finalStatus === "D") {
      if (tempoMedioPorProdutoSucessoEVariancia[product.id]) {
        tempoMedioPorProdutoSucessoEVariancia[product.id].push(product.difference);
      } else {
        tempoMedioPorProdutoSucessoEVariancia[product.id] = [product.difference];
      }
    }
  }
}

for (const [key, value] of Object.entries(tempoMedioPorProdutoSucessoEVariancia)) {
  tempoMedioPorProdutoSucessoEVariancia[key] = {
    "media": millisecondsToHours(calcularMedia(value)),
    "variancia": millisecondsToHours(calcularVariancia(value))
  };
}

relatorio['tempo_medio_por_produto_sucesso_e_variancia'] = tempoMedioPorProdutoSucessoEVariancia;


// Tempo medio e variancia dos restantes dos produtos
const tempoMedioPorProdutoRestoEVariancia = {};
for (const store of dataDictNew.stores) {
  for (const product of store.products) {
    if (product.finalStatus !== "D") {
      if (tempoMedioPorProdutoRestoEVariancia[product.id]) {
        tempoMedioPorProdutoRestoEVariancia[product.id].push(product.difference);
      } else {
        tempoMedioPorProdutoRestoEVariancia[product.id] = [product.difference];
      }
    }
  }
}

for (const [key, value] of Object.entries(tempoMedioPorProdutoRestoEVariancia)) {
  tempoMedioPorProdutoRestoEVariancia[key] = {
    "media": millisecondsToHours(calcularMedia(value)),
    "variancia": millisecondsToHours(calcularVariancia(value))
  };
}

relatorio['tempo_medio_por_produto_resto_e_variancia'] = tempoMedioPorProdutoRestoEVariancia;
function createTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return timestamp;
}
// Example usage:
const timestamp = createTimestamp().replace(' ', `-`)

// Write the report to a JSON file
fs.writeFileSync(`./relatorios/relatorio-${timestamp}.json`, JSON.stringify(relatorio, null, 2));


function convertRelatorioToCSV(relatorioData) {
  let csvContent = "Loja,Tempo total por loja,Tempo médio e variância por loja,Tempo médio e variância dos produtos,Tempo médio e variância para produtos que tiveram sucesso na coleta de preço,Tempo médio e variância para o restante dos produtos\n";
  const stores = Object.keys(relatorioData);
  let idx = 0
  for (const storeName in relatorioData[stores[idx]]) {
    const totalTime = relatorioData.tempo_total_por_loja[storeName];
    const averageAndVariance = relatorioData.tempo_medio_por_loja_e_variancia[storeName];
    const averageProducts = relatorioData.tempo_medio_por_produto_e_variancia[storeName];
    const averageSuccess = relatorioData.tempo_medio_por_produto_sucesso_e_variancia[storeName];
    const averageRest = relatorioData.tempo_medio_por_produto_resto_e_variancia[storeName];
    console.log(relatorioData.tempo_medio_por_produto_e_variancia[storeName])
 
    if(idx === 0){
      const row = `${storeName},${totalTime}`
      csvContent += row;
      csvContent += "\n";
    }
    const row = `${storeName},${totalTime},${averageAndVariance.media},${averageAndVariance.variancia},${averageProducts.media},${averageProducts.variancia},${averageSuccess.media},${averageSuccess.variancia},${averageRest.media},${averageRest.variancia}`;
    csvContent += row;
    csvContent += "\n";  
    idx += 1
  }

  
  return csvContent;
}

// Read the JSON data from relatorio.json
fs.readFile(`./relatorios/relatorio-${timestamp}.json`, 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading JSON file:", err);
    return;
  }

  const relatorioData = JSON.parse(data);
  const csvContent = convertRelatorioToCSV(relatorioData);

  // Write CSV content to a new file
  fs.writeFile('relatorio.csv', csvContent, (err) => {
    if (err) {
      console.error("Error writing CSV file:", err);
      return;
    }
    console.log("CSV file created successfully!");
  });
});
