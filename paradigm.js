function openConnection(rootUrl, id, key){
  const connection = new BigchainDB.Connection(
      rootUrl,
      {
        app_id : id,
        app_key : key
      });

  return connection;
}

function keyPair(){
  const pair = new BigchainDB.Ed25519Keypair();
  return {
    'pub' : pair.publicKey,
    'priv' : pair.privateKey
  }
}

function makeOrder(data, metadata, pubKey){
  const ed25519cond = BigchainDB.Transaction.makeEd25519Condition(pubKey);
  const ed25519out = BigchainDB.Transaction.makeOutput(ed25519cond);
  const newOrder = BigchainDB.Transaction.makeCreateTransaction(
      data,
      metadata,
      [ed25519out],
      pubKey);

  return newOrder;
}

function signOrder(rawOrder, privKey){
  const signedOrder = BigchainDB.Transaction.signTransaction(
    rawOrder,
    privKey);

    return signedOrder;
}

function sendOrder(ntl, signedOrder){
  const sentOrder = ntl.postTransactionCommit(signedOrder);
  return signedOrder.id;
}

function writeOrder(intList, addrList, maker, signature){
  const orderData = {
    'order' : {
      'maker' : [maker],
      'sig' : signature,
      'timestamp' : Math.floor(Date.now()/1000),
      'fields' : {
        'intList' : intList,
        'addrList' : addrList
      }
    }
  }

  const orderMetaData = {
    'filled' : false,
    'valid' : true,
    'updated' : Math.floor(Date.now()/1000)
  }

  return {
    'data' : orderData,
    'metadata' : orderMetaData
  }
}

function submitOrder(){
  const ntl = openConnection(
    'https://test.bigchaindb.com/api/v1/',
    '', # testnet app-id goes here
    ''); # testnet app-key goes here

  let intList = [];
  let addrList = [];

  intList.push(document.getElementById("uint1").value);
	intList.push(document.getElementById("uint2").value);
	intList.push(document.getElementById("uint3").value);

	addrList.push(document.getElementById("addr1").value);
	addrList.push(document.getElementById("addr2").value);
	addrList.push(document.getElementById("addr3").value);

  const alice = keyPair();

  const order = writeOrder(intList, addrList, alice['pub'], 'na');

  const readyOrder = makeOrder(order['data'], order['metadata'], alice['pub']);

  const signedOrder = signOrder(readyOrder, alice['priv']);

  const orderID = sendOrder(ntl, signedOrder);

  console.log(orderID);
  console.log(intList);
  console.log(signedOrder);
}
