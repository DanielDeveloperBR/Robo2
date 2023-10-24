const { Firestore } = require('@google-cloud/firestore');
const { Builder, By, until, Key } = require('selenium-webdriver');

require('chromedriver');

// Configurando o Firestore
const firestore = new Firestore({
  projectId: 'dozero-9ea70',
  keyFilename: 'autentication.json'
});

// Obter todos os produtos do Firestore
async function getAllProductsFromFirestore() {
    const productsRef = firestore.collection('teste1');
    const snapshot = await productsRef.get();
    const products = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      products.push({
        URL: data.URL
       
      });
    });
  
    return products;
  }
  

// Usar o Selenium para digitar o nome do produto nas Lojas Americanas
async function searchProductOnAmericanas(produtos) {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get(produtos.URL)
    await driver.sleep(3000)
    const like = await driver.wait(until.elementLocated(By.xpath('//*[@id="title"]/h1')), 10000).getText()
    console.log("titulo do video: "+like)
    await driver.sleep(1000);
  } finally {
    await driver.quit();
  }
}

(async () => {
  const products = await getAllProductsFromFirestore();
  if (products && products.length > 0) {
    for (const product of products) {
      await searchProductOnAmericanas(product);
    }
  } else {
    console.log('Não foram encontrados produtos no Firestore.');
  }
})()
