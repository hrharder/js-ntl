/*
	NTL Tester Program (v0.1.3c)
	NetworkTransportLayerJS

	@version-date: 18 April 2018
	@author: Henry R Harder

	Written for Paradigm, 2018

	Description:
		This class provides complete functionality for demonstrating
		creation and broadcast of a sample order to a BigchainDB cluster
		specified in the constructor. You must fill in the 'app_id' and
		'app_key' fields with actual BigchainDB credentials if you wish
		to use the testnet.

		This script is designed to be run in a browser where the
		bigchain-db-js driver is already loaded.
*/

class NetworkTransportLayer{
 	/*
	This is the main NTL class that communicates with BigchainDB
	and facilitates the creation, signing, and broadcast of orders.
	It must be supplied with credentials for accessing a BigchainDB
	cluster.
	*/

	constructor(rootUrl){
		this.connection = new BigchainDB.Connection(rootUrl, {
			app_id : 'fd3fc431',
			app_key : '13a76a6f7cacf18f9b3d775cf179dcf6'
		});
	}

	makeOrder(data, metadata, publicKey){
		const newOrder = BigchainDB.Transaction.makeCreateTransaction(
			data, metadata,
			[BigchainDB.Transaction.makeOutput(
				BigchainDB.Transaction.makeEd25519Condition(publicKey))
			], publicKey);

		return newOrder;
	}

	signOrder(unsignedOrder, privateKey){
		const signedOrder = BigchainDB.Transaction.signTransaction(
			unsignedOrder, privateKey);

		return signedOrder;
	}

	sendOrder(signedOrder){
		this.connection.postTransactionCommit(signedOrder);
		return signedOrder.id;
	}

}

class KeyPairGenerator{
	/*
	This class creates a public/private key pair that can be
	used for testing purposes, and provides methods to access
	the public and private keys. Should not be used for real
	key generation, meerly for testing purposes.
	*/

	constructor(){
		this.pair = new BigchainDB.Ed25519Keypair();
	}

	getPublicKey(){
		return this.pair.publicKey;
	}

	getPrivateKey(){
		return this.pair.privateKey;
	}
}

class OrderMaker{
	/*
	This class takes a list of uints, a list of hex
	addresses, and a maker address, and provides
	methods for returning a formatted order and order
	metadata ready for broadcast to BigchainDB
	*/

	constructor(intList, addrList, maker, signature){
		this.orderData = {
			'order':{
				"maker" : [],
				"sig" : signature,
				"timestamp" : Math.floor(Date.now()/1000),
				"fields" : {
					"intList" : intList,
					"addrList" : addrList }}};

		this.orderMetaData = {
			"filled" : false,
			"valid" : true,
			"updated" : Math.floor(Date.now()/1000)};
		}

	getOrderData(){
		return this.orderData;
	}

	getOrderMetadata(){
		return this.orderMetaData;
	}
}

function submitOrder(){
	testntl = new NetworkTransportLayer('http://test.bigchaindb.com:9984/api/v1/');

 	intList = [];
	addrList = [];

	intList.push(document.getElementById("uint1").value);
	intList.push(document.getElementById("uint2").value);
	intList.push(document.getElementById("uint3").value);

	addrList.push(document.getElementById("addr1").value);
	addrList.push(document.getElementById("addr2").value);
	addrList.push(document.getElementById("addr3").value);

	alice = new BigchainDB.Ed25519Keypair();
	order = new OrderMaker(
		intList,
		addrList,
		alice.publicKey,
		"not used in testing");

	newOrder = testntl.makeOrder(order.getOrderData(), order.getOrderMetadata(), alice.publicKey);

	signedOrder = testntl.signOrder(newOrder, alice.privateKey);

	orderID = testntl.sendOrder(signedOrder);
	console.log(orderID);
}
