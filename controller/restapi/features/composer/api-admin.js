
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


'use strict';
const fs = require('fs');
const path = require('path');
const _home = require('os').homedir();
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const infuraURL = 'https://rinkeby.infura.io/v3/14470f78e2cc459d877bb629fdc5703a'
const web3 = new Web3(infuraURL);

const hlc_idCard = require('composer-common').IdCard;
const composerAdmin = require('composer-admin');
const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const config = require('../../../env.json');
const NS = 'org.acme.AgrichainNetwork';


/**
 * display the admin and network info
 * @constructor
 */

exports.getCreds = function(req, res, next) {
    res.send(config);
};

/**
 * Create an instance of the AdminConnection class (currently a no-op)
 * @constructor
 */
exports.adminNew = function() {

};



exports.getAssetsById = function (req, res, next) {

    let method = 'getAssetsById';
    console.log(method+' req.body.email is: '+req.body.email );
    let allOrders = new Array();
    let businessNetworkConnection;
    //if (svc.m_connection === null) {svc.createMessageSocket();}
    let serializer;
    let factory;
    let archiveFile = fs.readFileSync(path.join(path.dirname(require.main.filename),'network','dist','agrichain-network.bna'));
    businessNetworkConnection = new BusinessNetworkConnection();
    return BusinessNetworkDefinition.fromArchive(archiveFile)
    .then((bnd) => {
        serializer = bnd.getSerializer();

        //console.log(method+' req.body.email is: '+req.body.email );
        return businessNetworkConnection.connect(req.body.email)
        .then(() => {
            //return businessNetworkConnection.query('selectAssets')
            return businessNetworkConnection.query('selectAssetsById', {aid:req.body.agriAssetId} )
            .then((orders) => {
                allOrders = new Array();
                for (let each in orders)
                    { (function (_idx, _arr){    
                        let _jsn = serializer.toJSON(_arr[_idx]);
                        _jsn.id = _arr[_idx].agriAssetId;
                        allOrders.push(_jsn);
                    })(each, orders);
                }
                res.send({'result': 'success', 'orders': allOrders});
            })
            .catch((error) => {console.log('selectOrders failed ', error);
                res.send({'result': 'failed', 'error': 'selectOrders: '+error.message});
            });
        })
        .catch((error) => {console.log('businessNetwork connect failed ', error);
            res.send({'result': 'failed', 'error': 'businessNetwork: '+error.message});
        });
    })
    .catch((error) => {console.log('create bnd from archive failed ', error);
        res.send({'result': 'failed', 'error': 'create bnd from archive: '+error.message});
    });

}


/**
 * get all orders
 * @param {express.req} req - the inbound request object from the client
 *  req.body.id - the id of the buyer making the request
 *  req.body.email - the user id of the buyer in the identity table making this request
 *  req.body.secret - the pw of this user.
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Array} an array of assets
 * @function
 */
exports.getMyAssets = function (req, res, next) {
    // connect to the network
    let method = 'getMyAssets';
    console.log(method+' req.body.email is: '+req.body.email );
    let allOrders = new Array();
    let businessNetworkConnection;
    //if (svc.m_connection === null) {svc.createMessageSocket();}
    let serializer;
    let factory;
    let archiveFile = fs.readFileSync(path.join(path.dirname(require.main.filename),'network','dist','agrichain-network.bna'));
    businessNetworkConnection = new BusinessNetworkConnection();
    return BusinessNetworkDefinition.fromArchive(archiveFile)
    .then((bnd) => {
        serializer = bnd.getSerializer();

        //console.log(method+' req.body.email is: '+req.body.email );
        return businessNetworkConnection.connect(req.body.email)
        .then(() => {
            return businessNetworkConnection.query('selectAssets')
            .then((orders) => {
                allOrders = new Array();
                for (let each in orders){ 
                    console.log("==========================");
                    console.log(orders);
                    (function (_idx, _arr){    
                        let _jsn = serializer.toJSON(_arr[_idx]);
                        _jsn.id = _arr[_idx].agriAssetId;
                        allOrders.push(_jsn);
                    })(each, orders);
                }
                res.send({'result': 'success', 'orders': allOrders});
            })
            .catch((error) => {console.log('selectOrders failed ', error);
                res.send({'result': 'failed', 'error': 'selectOrders: '+error.message});
            });
        })
        .catch((error) => {console.log('businessNetwork connect failed ', error);
            res.send({'result': 'failed', 'error': 'businessNetwork: '+error.message});
        });
    })
    .catch((error) => {console.log('create bnd from archive failed ', error);
        res.send({'result': 'failed', 'error': 'create bnd from archive: '+error.message});
    });
};


/**
 * get all assets
 * @param {express.req} req - the inbound request object from the client
 *  req.body.id - the id of the buyer making the request
 *  req.body.email - the user id of the buyer in the identity table making this request
 *  req.body.registry - the pw of this user.
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Array} an array of assets
 * @function
 */
exports.getAssetsByParticipant = function (req, res, next) {
    // connect to the network
    let method = 'getAssetsByParticipant';
    console.log(method+' req.body.email is: '+req.body.email );
    let allOrders = new Array();
    let businessNetworkConnection;
    //if (svc.m_connection === null) {svc.createMessageSocket();}
    let serializer;
    let factory;
    let archiveFile = fs.readFileSync(path.join(path.dirname(require.main.filename),'network','dist','agrichain-network.bna'));
    businessNetworkConnection = new BusinessNetworkConnection();
    return BusinessNetworkDefinition.fromArchive(archiveFile)
    .then((bnd) => {
        serializer = bnd.getSerializer();

        console.log(method+' req.body.email is: '+req.body.email);
        //config.composer.adminCard
        return businessNetworkConnection.connect(req.body.email)
        .then(() => {
            
            factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            const participant = factory.newRelationship(NS, req.body.registry, req.body.email);
            console.log('resource:' + participant.$namespace + '.' + participant.$type + '#'+ participant.$identifier);
            
            const data = 'resource:' + participant.$namespace + '.' + participant.$type + '#'+ participant.$identifier;
            const email = 'email';

            let queryStr = '';
            if(req.body.registry == 'Producer'){
                queryStr = 'selectAssetsByProducer';
            }else{
                queryStr = 'selectAssetsByDistributor';
            }

            console.log(queryStr)

            return businessNetworkConnection.query(queryStr,{email:data} ) 
            .then((orders)=>{
                //console.log(orders);
                allOrders = new Array();
                for (let each in orders){
                    (function (_idx, _arr){
                        let _jsn = serializer.toJSON(_arr[_idx]);
                        _jsn.id = _arr[_idx].agriAssetId;
                        allOrders.push(_jsn);
                    })(each, orders);
                }
                res.send({'result': 'success', 'orders': allOrders});
            }).catch((error)=>{
                console.log('error while query : ', error)
                res.send({'result': 'failed', 'error': 'query not found: '+error.message});
            })

        }).catch((error)=>{
            console.log('Business Network Count not be connected: ', error)
            res.send({'result': 'failed', 'error': 'business network can not be connected: '+error.message});
        })
    }).catch((error) => {console.log('create bnd from archive failed ', error);
        res.send({'result': 'failed', 'error': 'create bnd from archive: '+error.message});
    });
};



/**
 * adds an asset to the blockchain
 * @param {express.req} req - the inbound request object from the client
 * req.body.producer - string with producer id
 * req.body.distributor - string with distributor id
 * req.body.items - array with items for asset
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Array} an array of assets
 * @function
 */
exports.addAssets = function (req, res, next) {
    let method = 'addAssets';
    console.log(method+' req.body.producer is: '+req.body.producer );
    let businessNetworkConnection;
    let factory;
    let ts = Date.now();
    let agriAssetId = req.body.producer.replace(/@/, '').replace(/\./, '')+ts;
    //if (svc.m_connection === null) {svc.createMessageSocket();}
    businessNetworkConnection = new BusinessNetworkConnection();
    return businessNetworkConnection.connect(req.body.producer)
    .then(() => {

        //const producer = factory.newResource(NS, 'Producer', req.body.producer);
        //producer.accountBalance = "100";

        //console.log(producer);

        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        let order = factory.newResource(NS, 'AgriAsset', agriAssetId);
        order.created = req.body.created;
        order.status = req.body.status
        order.harvestSession = req.body.harvestSession;
        order.productName = req.body.productName;
        order.productType = req.body.productType;
        order.productDescription = req.body.productDescription;
        order.HarvestArea = req.body.HarvestArea;
        order.unitPrice = req.body.unitPrice;
        order.TotalYieldProduced = req.body.TotalYieldProduced;
        order.YieldBalance = req.body.YieldBalance;
        order.InsuranceCost = req.body.InsuranceCost;
        order.TotalProductCost = req.body.TotalProductCost;
        order.producer = factory.newRelationship(NS, 'Producer', req.body.producer);
        //order.distributor = factory.newRelationship(NS, 'Distributor', req.body.distributor);
        order.unitCount = req.body.unitCount;

        
        const createNew = factory.newTransaction(NS, 'CreateAssets');
        createNew.agriasset = factory.newRelationship(NS, 'AgriAsset', order.$identifier);
        createNew.producer = factory.newRelationship(NS, 'Producer', req.body.producer);
        //createNew.distributor = factory.newRelationship(NS, 'Distributor', req.body.distributor);
        
        // add the order to the asset registry.
        return businessNetworkConnection.getAssetRegistry(NS+'.AgriAsset')
        .then((assetRegistry) => {
            return assetRegistry.add(order)
                .then(() => {
                    return businessNetworkConnection.submitTransaction(createNew)
                    .then(() => {console.log('asset '+agriAssetId+' successfully added');
                        res.send({'result': 'asset '+agriAssetId+' successfully added'});
                    })
                    .catch((error) => {
                        if (error.message.search('MVCC_READ_CONFLICT') !== -1)
                            {console.log(agriAssetId+' retrying assetRegistry.add for: '+agriAssetId);
                            //loadTransaction(createNew, agriAssetId, businessNetworkConnection);
                        }
                        else
                        {console.log(agriAssetId+' submitTransaction failed with text: ',error.message);}
                    });
                })
                .catch((error) => {
                    if (error.message.search('MVCC_READ_CONFLICT') !== -1)
                        {console.log(agriAssetId+' retrying assetRegistry.add for: '+agriAssetId);
                        //loadTransaction(createNew, orderNo, businessNetworkConnection);
                    }
                    else
                    {
                        console.log(agriAssetId+' assetRegistry.add failed: ',error.message);
                        res.send({'result': 'failed', 'error':' order '+agriAssetId+' getAssetRegistry failed '+error.message});
                    }
                });
        })
        .catch((error) => {
            console.log(agriAssetId+' getAssetRegistry failed: ',error.message);
            res.send({'result': 'failed', 'error':' order '+agriAssetId+' getAssetRegistry failed '+error.message});
        });
    })
    .catch((error) => {
        console.log(agriAssetId+' business network connection failed: text',error.message);
        res.send({'result': 'failed', 'error':' order '+agriAssetId+' add failed on on business network connection '+error.message});
    });
};



/**
 * orderAction - act on an order 
 * @param {express.req} req - the inbound request object from the client
 * req.body.accountHash - string with 
 * req.body.privateKeyHash - string with 
 * req.body.accountHastTo
 * req.body.action - string with 
 * req.body.distributorID - (optional, only required during the time of selling to asset to distributor)while selling to distributor
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Array} an array of assets
 * @function
 */
exports.assetsAction = function (req, res, next) {
    let method = 'assetsAction';
    console.log(method+' req.body.participant is: '+req.body.participant );
    
    
    let businessNetworkConnection;
    let updateOrder;
    let accountHashFrom = req.body.accountHashFrom;
    let privateKeyHashFrom = req.body.privateKeyHashFrom;
    let accountHastTo = req.body.accountHastTo;

    businessNetworkConnection = new BusinessNetworkConnection();
    
    return businessNetworkConnection.connect(req.body.participant)
    .then(() => {
        return businessNetworkConnection.getAssetRegistry(NS+'.AgriAsset')
        .then((assetRegistry) => {
            return assetRegistry.get(req.body.agriAssetId)
            .then((order) => {

                let factory = businessNetworkConnection.getBusinessNetwork().getFactory();

                console.log("Asset Processing.. Please Wait..")

                web3.eth.getBalance(accountHashFrom, (err, res) => {
                    if(err != null){
                        if(parseInt(res) > 0){
                            console.log('Eth Balance Available: ', web3.utils.fromWei(res, 'ether'))

                            const privateKey = Buffer.from(privateKeyHashFrom.substr(2), 'hex');
                            const payableAmt = ( parseFloat(order.unitPrice) * parseFloat(req.body.YieldBalance) ).toString;

                            console.log("Eth payable:", "(" + order.unitPrice + " X " + req.body.YieldBalance + ")", payableAmt)

                            web3.eth.getTransactionCount(accountHashFrom, (err, txCount) => {
                                const txObject = {
                                    nonce: web3.utils.toHex(txCount),
                                    to: accountHastTo,
                                    value: web3.utils.toHex(web3.utils.toWei(payableAmt, 'ether')),
                                    gasLimit: web3.utils.toHex(21000),
                                    gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
                                }
                                
                                const tx = new Tx(txObject);
                                tx.sign(privateKey);

                                const serializedTransaction = tx.serialize();
                                const raw = '0x' + serializedTransaction.toString('hex');

                                web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                                    console.log('txHash:', txHash);

                                    updateOrder = order;
                                    updateOrder.YieldBalance = req.body.YieldBalance;
                                    switch (req.body.action)
                                    {
                                        case 'SELLING':
                                            updateOrder.status = req.body.action;
                                            const distributor = factory.newRelationship(NS, 'Distributor', req.body.distributorID);
                                            distributor.accountBalance = ( parseFloat(order.YieldBalance) - parseFloat(req.body.YieldBalance) ).toString;
                                            updateOrder.distributor = distributor;

                                            break;
                                        case 'SELL':
                                            const consumer = factory.newRelationship(NS, 'Consumer', req.body.customerID);
                                            consumer.unitPurchased = parseInt(req.body.unitPurchased);

                                            if (updateOrder.consumer) {
                                                updateOrder.consumer.push(consumer);
                                            } else {
                                                updateOrder.consumer = [consumer];
                                            }
                                            break;
                                    }

                                    return businessNetworkConnection.getAssetRegistry(NS+'.AgriAsset')
                                    .then((assetRegistry) => {
                                        return assetRegistry.update(updateOrder)
                                        .then(()=>{
                                            console.log("Updated");
                                            res.send({'result': 'success'});
                                        })
                                    })
                                    
                                })
                            })

                            

                        }else{
                            console.log('Insufficient account balance.');
                            res.send({'result': 'failed', 'error': 'Insufficient account balance.'});
                        }
                    }
                    //web3.utils.fromWei(res, 'ether')
                });
            
                

            })
            .catch((error) => {
                console.log('Registry Get Order failed: '+error.message);
                res.send({'result': 'failed', 'error': 'Registry Get Order failed: '+error.message});
            });
        })
        .catch((error) => {console.log('Get Asset Registry failed: '+error.message);
            res.send({'result': 'failed', 'error': 'Get Asset Registry failed: '+error.message});
        });
    })
    .catch((error) => {console.log('Business Network Connect failed: '+error.message);
        res.send({'result': 'failed', 'error': 'Get Asset Registry failed: '+error.message});
    });
};



/**
 * retrieve array of members from specified registry type
 * @param {express.req} req - the inbound request object from the client
 *  req.body.registry: _string - type of registry to search; e.g. 'Producer', 'Distributor', 'Consumer'.
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Object} an array of members
 * @function
 */
exports.getMembers = function(req, res, next) {
    //console.log("Admin -> getMembers", req.body.registry)
    // connect to the network
    // let method = 'getMembers';
    let allMembers = new Array();
    let businessNetworkConnection;
    businessNetworkConnection = new BusinessNetworkConnection();
    // connection prior to V0.15
    // return businessNetworkConnection.connect(config.composer.connectionProfile, config.composer.network, config.composer.adminID, config.composer.adminPW)
    // connection in v0.15
    return businessNetworkConnection.connect(config.composer.adminCard)
        .then(() => {
            return businessNetworkConnection.getParticipantRegistry(NS+'.'+req.body.registry)
            .then(function(registry){
                return registry.getAll()
                .then ((members) => {
                    for (let each in members)
                        { (function (_idx, _arr)
                            { let _jsn = {};
                            _jsn.type = req.body.registry;
                            _jsn.fullname = _arr[_idx].fullname;
                            //console.log(_arr[_idx].email, _arr[_idx].fullname, req.body.registry)
                            switch (req.body.registry)
                            {
                            case 'Producer':
                                _jsn.email = _arr[_idx].email;
                                break;
                            case 'Distributor':
                                _jsn.email = _arr[_idx].email;
                                break;
                            case 'Consumer':
                                _jsn.email = _arr[_idx].email;
                                break;
                            default:
                                _jsn.email = _arr[_idx].email;
                            }
                            allMembers.push(_jsn); })(each, members);
                    }
                    res.send({'result': 'success', 'members': allMembers});
                })
                .catch((error) => {console.log('error with getAllMembers', error);
                    res.send({'result': 'failed '+error.message, 'members': []});});
            })
        .catch((error) => {console.log('error with getRegistry', error);
            res.send({'result': 'failed '+error.message, 'members': []});});
        })
        .catch((error) => {console.log('error with business network Connect', error.message);
            res.send({'result': 'failed '+error.message, 'members': []});});
};




/**
 * retrieve array of members from specified registry type
 * @param {express.req} req - the inbound request object from the client
 *  req.body.email: _string - the username or email of the member.
 *  req.body.pass: _string - the password string of the member 
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Object} an array of members
 * @function
 */

exports.SignIn = function(req, res, next) {
    let Members = {};
    let businessNetworkConnection;
    let factory;
    businessNetworkConnection = new BusinessNetworkConnection();

    //console.log(req.body);

    return businessNetworkConnection.connect(config.composer.adminCard)
    .then(() => {
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        /*return businessNetworkConnection.getAllParticipantRegistry()
        .then((participantRegistry)=>{
            return participantRegistry.get(req.body.email)
            .then((_res)=>{
                console.log(_res)
            })
            .catch((_res) => {
                console.log('Member do not exist');
            })
        })*/
        return businessNetworkConnection.getParticipantRegistry(NS + '.Producer')
        .then((participantRegistry)=>{
            return participantRegistry.get(req.body.email)
            .then((_res) => { 
                
                Members.registry = 'Producer';
                Members.email = _res.email;
                Members.fullname = _res.fullname;
                Members.cellnumber = _res.cellnumber;
                Members.password = _res.password;
                Members.accountBalance = _res.accountBalance;
                Members.accountHash = _res.accountHash;
                Members.privateKeyHash = _res.privateKeyHash;
                Members.SubCategory = res.SubCategory;
                Members.Locale = res.Locale;
                Members.UserRole = res.UserRole;
                
                res.send({'result': 'success', 'members': Members})
            })
            .catch((_res) => {


                return businessNetworkConnection.getParticipantRegistry(NS + '.Distributor')
                .then((participantRegistry)=>{
                    return participantRegistry.get(req.body.email)
                    .then((_res) => { 
                        //console.log("second check ",_res)
                        Members.registry = 'Distributor';
                        Members.email = _res.email;
                        Members.fullname = _res.fullname;
                        Members.cellnumber = _res.cellnumber;
                        Members.password = _res.password;
                        Members.accountBalance = _res.accountBalance;
                        Members.accountHash = _res.accountHash;
                        Members.privateKeyHash = _res.privateKeyHash;
                        Members.SubCategory = res.SubCategory;
                        Members.Locale = res.Locale;
                        Members.UserRole = res.UserRole;

                        res.send({'result': 'success', 'members': Members})
                    
                    })
                    .catch((_res) => {

                        return businessNetworkConnection.getParticipantRegistry(NS + '.Consumer')
                        .then((participantRegistry)=>{
                            return participantRegistry.get(req.body.email)
                            .then((_res) => { 
                               // console.log("third check ",_res)

                                Members.registry = 'Consumer';
                                Members.email = _res.email;
                                Members.fullname = _res.fullname;
                                Members.cellnumber = _res.cellnumber;
                                Members.password = _res.password;
                                Members.accountBalance = _res.accountBalance;
                                Members.accountHash = _res.accountHash;
                                Members.privateKeyHash = _res.privateKeyHash;
                                Members.SubCategory = res.SubCategory;
                                Members.Locale = res.Locale;
                                Members.UserRole = res.UserRole;

                                res.send({'result': 'success', 'members': Members})             
                            
                            })
                            .catch((_res) => {
                                console.log('Member do not exist');
                                res.send({'result': 'failed'})
                            })
                        }).catch((error) => {console.log('error with getParticipantRegistry::Consumer', error); res.send(error);});
                    })
                }).catch((error) => {console.log('error with getParticipantRegistry::Distributor', error); res.send(error);});
            })
        }).catch((error) => {console.log('error with getParticipantRegistry::Producer', error); res.send(error);});
    }).catch((error) => {console.log('error with businessNetworkConnection', error); res.send(error);});

};


/**
 * SignUp for the new participant
 * @param {express.req} req - the inbound request object from the client
 *  req.body.email: _string - the username or email of the member.
 *  req.body.pass: _string - the password string of the member 
 *  req.body.cell: _string - cell numbr of the particapent
 *  req.body.fullname: _string - the full name of the particapent
 *  req.body.registry: _string - type of registry to search; e.g. 'Producer', 'Distributor', 'Consumer'.
 *  req.body.SubCategory
 *  req,body.Locale
 *  req.body.UserRole
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Object} an array of members
 * @function
 */

exports.SignUp = function(req, res, next) {
    //let memberTable = new Array();
    let businessNetworkConnection;
    let factory;
    let participant;
    var accounts = web3.eth.accounts.create();
    let adminConnection = new AdminConnection();
    adminConnection.connect(config.composer.adminCard)
    .then(()=>{
        businessNetworkConnection = new BusinessNetworkConnection();
        return businessNetworkConnection.connect(config.composer.adminCard)
        .then(() => {
            factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            return businessNetworkConnection.getParticipantRegistry(NS+'.'+req.body.registry)
            .then((participantRegistry)=>{
                return participantRegistry.get(req.body.email)
                .then((_res) => { res.send('member already exists. add cancelled');})
                .catch((_res) => {
                    //console.log(req.body.email+' not in '+req.body.registry+' registry. ');
                    
                    const participant = factory.newResource(NS, req.body.registry, req.body.email);
                    participant.fullname = req.body.fullname;
                    participant.cellnumber = req.body.cellnumber;
                    participant.password = req.body.password;
                    participant.accountBalance = "0";
                    participant.accountHash = accounts.address;
                    participant.privateKeyHash = accounts.privateKey;
                    participant.SubCategory = req.body.SubCategory;
                    participant.Locale = req.body.Locale;
                    participant.UserRole = req.body.UserRole;

                    return participantRegistry.add(participant)
                    .then(() => {
                        console.log(req.body.fullname+' successfully added as a ' + req.body.registry ); 
                        res.send(req.body.fullname+' successfully added');
                    })
                    .then(() => {
                        // an identity is required before a member can take action in the network.
                        console.log('issuing identity for:'+ NS +'.'+req.body.registry+'#'+req.body.email);
                        return businessNetworkConnection.issueIdentity(NS+'.'+req.body.registry+'#'+req.body.email, req.body.email)
                        .then((result) => {
                            //console.log(result)
                            //console.log('Email: '+req.body.email, 'Return-Email:', result.userID);
                            
                            let _meta = {};
                            for (each in config.composer.metaData){
                                (function(_idx, _obj) {
                                    _meta[_idx] = _obj[_idx]; 
                                })(each, config.composer.metaData); 
                            }
                            _meta.businessNetwork = config.composer.network;
                            _meta.userName = result.userID;
                            _meta.enrollmentSecret = result.userSecret;
                            config.connectionProfile.keyValStore = _home+config.connectionProfile.keyValStore;
                            //console.log(".keyValStore", config.connectionProfile.keyValStore)
                            let tempCard = new hlc_idCard(_meta, config.connectionProfile);

                            return adminConnection.importCard(result.userID, tempCard)
                            .then ((_res) => { 
                                if (_res) {
                                    console.log('card updated');
                                } else {
                                    console.log('card imported');
                                } 
                            })
                            .catch((error) => {
                                console.error('adminConnection.importCard failed. ',error.message);
                            });
                        })
                    })
                    .catch((error) => {
                        console.log(req.body.fullname+' add failed', error); 
                        res.send(error);
                    });
                });
            }).catch((error) => {console.log('error with getParticipantRegistry', error); res.send(error);});
        }).catch((error) => {console.log('error with businessNetworkConnection', error); res.send(error);});
    }).catch((error) => {console.log('error with adminConnect', error.message); res.send(error);});
};