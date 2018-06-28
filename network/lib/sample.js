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


/**
 * create an shipping product
 * @param {org.acme.AgrichainNetwork.CreateAssets} product - the product to be shipped
 * @transaction
 *   
 *   
 */

function CreateAssets(product) {
    product.agriasset.producer = product.producer;
    product.agriasset.distributor = product.distributor;
    product.agriasset.created = new Date().toISOString();
    product.agriasset.status = 'CREATED'
    return getAssetRegistry('org.acme.AgrichainNetwork.AgriAsset')
        .then(function (assetRegistry) {
            return assetRegistry.update(product.agriasset);
        });
}

function ReceivedAssets(product) {
    product.agriasset.producer = product.producer;
    product.agriasset.distributor = product.distributor;
    product.agriasset.status = 'IN_TRANSIT'
    return getAssetRegistry('org.acme.AgrichainNetwork.AgriAsset')
        .then(function (assetRegistry) {
            return assetRegistry.update(product.agriasset);
        });
}


function SellingAssets(product) {
    product.agriasset.consumer = product.consumer;
    product.agriasset.distributor = product.distributor;
    product.order.status = 'SELLING'
    product.order.distributor = product.distributor;
    return getAssetRegistry('org.acme.AgrichainNetwork.AgriAsset')
        .then(function (assetRegistry) {
            return assetRegistry.update(product.order);
        });
}