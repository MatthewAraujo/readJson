const fs = require('fs');

// Function to read a JSON file
function readJsonFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// Compare two JSON files and accumulate differences
function compareAndAccumulateDifference(file1, file2, accumulatedDifference) {
  const dataDict1 = readJsonFile(`./logs/${file1}`);
  const dataDict2 = readJsonFile(`./logs/${file2}`);

  dataDict1.stores.forEach(store1 => {
    const storeId = store1.store;
    const matchingStore2 = dataDict2.stores.find(store2 => store2.store === storeId);
    if (matchingStore2) {
      store1.products.forEach(product1 => {
        const productId = product1.id;
        const matchingProduct2 = matchingStore2.products.find(product2 => product2.id === productId);
        if (matchingProduct2 && product1.finalStatus !== matchingProduct2.finalStatus) {
          if (!accumulatedDifference[storeId]) {
            accumulatedDifference[storeId] = {
              "store": store1.name,
              "products": []
            };
          }
          const existingProductIndex = accumulatedDifference[storeId].products.findIndex(prod => prod.id === productId);
          if (existingProductIndex !== -1) {
            accumulatedDifference[storeId].products[existingProductIndex].status.push(product1.finalStatus);
          } else {
            accumulatedDifference[storeId].products.push({
              "id": productId,
              "status": [product1.finalStatus]
            });
          }
        }

        if (matchingProduct2 && product1.crawlingEnd && product1.crawlingStart && matchingProduct2.crawlingEnd && matchingProduct2.crawlingStart) {
          const diff1 = product1.crawlingEnd - product1.crawlingStart;
          const diff2 = matchingProduct2.crawlingEnd - matchingProduct2.crawlingStart;
          const diff = diff2 - diff1;

          if (diff !== 0) {
            if (!accumulatedDifference[storeId]) {
              accumulatedDifference[storeId] = {
                "store": store1.name,
                "products": []
              };
            }
            const existingProductIndex = accumulatedDifference[storeId].products.findIndex(prod => prod.id === productId);
            if (existingProductIndex !== -1) {
              accumulatedDifference[storeId].products[existingProductIndex].difference = diff;
            } else {
              accumulatedDifference[storeId].products.push({
                "id": productId,
                "difference": diff
              });
            }
          }
        }
      });
    }
  });
}


// Read the JSON files from the 'logs' directory
const files = fs.readdirSync('./logs');
let accumulatedDifference = { "difference": {} };

// Iterate over files and compare them in pairs
for (let i = 0; i < files.length - 1; i += 2) {
  const file1 = files[i];
  const file2 = files[i + 1];
  compareAndAccumulateDifference(file1, file2, accumulatedDifference);
}

// Write the accumulated difference to a new JSON file
const differenceJson = JSON.stringify(accumulatedDifference, null, 2);
fs.writeFileSync(`./difference/accumulated_difference.json`, differenceJson, 'utf8');