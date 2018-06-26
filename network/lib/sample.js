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


var shipmentStatus = {
    Created: {code: 1, text: 'Shipping Created'},
    IN_TRANSIT: {code: 2, text: 'Shipping in transit'},
    ARRIVED: {code: 3, text: 'Shipping Arrived'}
};

/**
 * create an shipping product
 * @param {org.acme.AgrichainNetwork.CreateOrder} product - the product to be shipped
 * @transaction
 *   
 *   
 */

function CreateOrder(product) {
    product.order.shipment = product.shipment;
    product.order.amount = product.amount;
    product.order.producer = product.producer;
    product.order.distributed = product.distributed;
    product.order.consumer = product.consumer;
    return getAssetRegistry('org.acme.AgrichainNetwork.Shipment')
        .then(function (assetRegistry) {
            return assetRegistry.update(product.order);
        });
}