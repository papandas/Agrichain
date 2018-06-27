
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
                    participant.cellnumber = req.body.cell;
                    participant.password = req.body.password;
                    participant.accountBalance = 0;

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