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

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;

const hlc_idCard = require('composer-common').IdCard;
const path = require('path');
const _home = require('os').homedir();
const config = require('../../controller/env.json');

require('chai').should();

const network = 'agrichain-network';
const _timeout = 90000;
const NS = 'org.acme.AgrichainNetwork';
//const ShippingID = '12345';
let rand = 1;
const producerID = 'producter'+rand+'@agrichain.com';
const distributorID = 'distributor'+rand+'@agrichain.com';
const consumerID = 'consumer'+rand+'@agrichain.com';
const contractID = 'CON_00'+rand;
const shippingID = 'SHIP_00'+rand;

// Seting up express js server

//Require the dev-dependencies


// end express js server


describe('Agriculture Blockchain Network', function () {
    this.timeout(_timeout);
    let businessNetworkConnection;
    before(function () {
        businessNetworkConnection = new BusinessNetworkConnection();
        return businessNetworkConnection.connect(config.composer.adminCard);
    });

    describe('#createOrder', () => {

        it('Should be able to create order now.', () => {
            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            const producer = factory.newResource(NS, 'Producer', producerID);
            producer.fullname = 'Producer FullName';
            producer.cellnumber = '1111111111';
            producer.password = 'password';
            producer.accountBalance = 0;

            const distributor = factory.newResource(NS, 'Distributor', distributorID);
            distributor.fullname = 'Distributor FullName';
            distributor.cellnumber = '2222222222';
            distributor.password = 'password';
            distributor.accountBalance = 0;

            const consumer = factory.newResource(NS, 'Consumer', consumerID);
            consumer.fullname = 'Consumner FullName';
            consumer.cellnumber = '3333333333';
            consumer.password = 'password';
            consumer.accountBalance = 0;

            const agriAsset = factory.newResource(NS, 'AgriAsset', contractID);
            agriAsset.harvestYear = '2018';
            agriAsset.created = new Date().toISOString();
            agriAsset.commodity = 'POTATO';
            agriAsset.status = 'IN_TRANSIT';
            agriAsset.totalAcer = '100 acer';
            agriAsset.averageYield = '35';
            agriAsset.estimatedBasic = 111;
            agriAsset.cropInsuranceCoverage = 'PAPAN INSURANCE COMPLAY';
            agriAsset.productCost = 1000;
            agriAsset.producer = factory.newRelationship(NS, 'Producer', producer.$identifier);
            agriAsset.distributor = factory.newRelationship(NS, 'Distributor', distributor.$identifier);
            agriAsset.unitCount = 900
            agriAsset.unitPrice = 9

            /*const contract = factory.newResource(NS, 'Contract', contractID);
            contract.producer = factory.newRelationship(NS, 'Producer', producer.$identifier);
            contract.distributor = factory.newRelationship(NS, 'Distributor', distributor.$identifier);
            contract.consumer = factory.newRelationship(NS, 'Consumer', consumer.$identifier);
            contract.unitPrice = 0.5; 


            const shipment = factory.newResource(NS, 'Shipment', shippingID);
            shipment.type = '';
            shipment.status = 'IN_TRANSIT';
            shipment.unitCount = 5000;
            shipment.contract = factory.newRelationship(NS, 'Contract', contract.$identifier);*/

            return businessNetworkConnection.getAssetRegistry(NS + '.AgriAsset')
            .then((assetRegistry)=>{
                return assetRegistry.add(agriAsset)
                .then(()=>{
                    return businessNetworkConnection.getParticipantRegistry(NS + '.Consumer')
                    .then((assetRegistry)=>{
                        return assetRegistry.addAll([consumer])
                        .then(()=>{
                            return businessNetworkConnection.getParticipantRegistry(NS + '.Producer')
                            .then((participantRegistry)=>{
                                return participantRegistry.addAll([producer])
                                .then(()=>{
                                    return businessNetworkConnection.getParticipantRegistry(NS + '.Distributor')
                                    .then((participantRegistry)=>{
                                        return participantRegistry.addAll([distributor])
                                        .then(()=>{
                                            return businessNetworkConnection.getAssetRegistry(NS + '.AgriAsset')
                                            .then((assetRegistry)=>{
                                                return assetRegistry.get(contractID)
                                                .then((asset)=>{
                                                    asset.$identifier.should.equal(contractID, 'Has correct shipping id');
                                                    asset.commodity.should.equal('POTATO', 'Has correct producer type.');
                                                    console.log(asset);
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        });


        it('Check the auth.', () => {
            
        });


    });
});

/**
 * display using console.log the properties of the inbound object
 * @param {displayObjectProperties} _name - string name of object
 * @param {displayObjectProperties}  _obj - the object to be parsed
 * @utility
 */
/*
function displayObjectProperties(_name, _obj)
{
    for(let propt in _obj){ console.log(_name+' object property: '+propt ); }
}
*/
/**
 * display using console.log the properties of each property in the inbound object
 * @param {displayObjectProperties} _string - string name of object
 * @param {displayObjectProperties}  _object - the object to be parsed
 * @utility
 */
/*
function displayObjectValues (_string, _object)
{
    for (let prop in _object){
        console.log(_string+'-->'+prop+':\t '+(((typeof(_object[prop]) === 'object') || (typeof(_object[prop]) === 'function'))  ? typeof(_object[prop]) : _object[prop]));
    }
}
*/
