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

// z2c-initiate.js
var connectionProfileName = "z2b-test-profile";
var networkFile = "agrichain-network.bna"
var businessNetwork = "agrichain-network";

var producer, distributor, consumer;
var pro_string, dis_string, con_string;

/**
* standard home page initialization routine
* Refer to this by {@link initPage()}.
*/
  function initPage ()
{
  console.log("Initial Page.")

  $('#addAssetBox').hide();
  $('#consumerBuyBox').hide();

  SetupLogin();

  SetupSignUp();

  // LOAD REGISTRY-MEMBERS LIST IN THE FRONT LIST

  LoadMemberToCreateAssets()

  LoadMemberDistributersForForm();


  let SaveAssets = $('#SaveAssets');
  SaveAssets.on('click', function(){

    var options = {};
    options.harvestYear = $('#harvestYear').val();
    options.created = new Date().toISOString();
    options.commodity = $('#commodity').find(':selected').val();
    options.status = 'IN_TRANSIT';
    options.totalAcer = $('#totalAcer').val();
    options.averageYield = $('#averageYield').val();
    options.estimatedBasic = $('#estimatedBasic').val();
    options.cropInsuranceCoverage = $('#cropInsuranceCoverage').val();
    options.productCost = $('#productCost').val();
    options.producer = $('#members_list').val();
    options.distributor = $('#members_list_2').val();
    options.unitCount = 0
    options.unitPrice = 0
    //console.log(options);

    $.when($.post('/composer/admin/addOrder', options)).done(function (results){ 
      console.log(results);
    })

  })


  let members_load_assets = $('#members_load_assets');
  members_load_assets.on('click', function(){

    $('#AllOrderList').empty();

    let isProducer = false;
    let isDistributer = false;
    let isConsumer = false;

    switch($('#load_registry_type').find(':selected').val()){
      case 'Producer':
        isProducer = true;
        break;
      case 'Distributor':
        // Allowing Distributer to input order id and change the status of the Order
        $('#AllOrderList').append('<input type="text" id="order_id_received" placeholder="Order Id"><button id="RECEIVED">Received</button>')
        $('#RECEIVED').on('click', function(){
          //console.log();

          let options = {};
          options.participant = $('#members_list').find(':selected').val(); // Email of the Distributer 
          options.agriAssetId = $('#order_id_received').val() // Order Id 
          options.action = 'SELLING' // Chaing state to Selling
          $.when($.post('/composer/admin/orderAction', options)).done(function (results){ 

            console.log(results);

          })

        })
        isDistributer = true;
        break;
      case 'Consumer':
        isConsumer = true;
        break;
      default:
        isProducer = false;
        isDistributer = false;
        isConsumer = false;
        break;
    }

    let options = {};
    options.id = $('#members_list').find(':selected').val();
    options.email = $('#members_list').find(':selected').val();

    //console.log("[Data Sent]", options)

    $.when($.post('/composer/admin/getMyOrders', options)).done(function (results){ 
      //console.log(results.orders);
      //console.log("-------------")
      let str = '';
      if (results.orders.length < 1){
        str += 'No records fround';
      }else{
        for (let each in results.orders){
          (function (idx, arr){
            
            

            if(isProducer){

              if(options.email == (arr[idx].producer).split('#')[1]){
                
                str += '<ul>'
                str += '<li>Order Id: ' + arr[idx].agriAssetId;            ;
                str += '</li><li>Created On: ' + arr[idx].created;
                str += '</li><li>Status: ' + arr[idx].status;
                str += '</li><li>Harvest Year: ' + arr[idx].harvestYear;
                str += '</li><li>Commodity: ' + arr[idx].commodity;
                str += '</li><li>Total Acer: ' + arr[idx].totalAcer;
                str += '</li><li>Average Yield: ' + arr[idx].averageYield;
                str += '</li><li>Estimated Basic: ' + arr[idx].estimatedBasic;
                str += '</li><li>Crop Insurance Coverage: ' + arr[idx].cropInsuranceCoverage;
                str += '</li><li>Product Cost: ' + arr[idx].productCost;
                str += '</li><li>Producer: ' + (arr[idx].producer).split('#')[1];
                str += '</li><li>Distributor: ' + (arr[idx].distributor).split('#')[1];
                if(arr[idx].consumer){
                  for (let each in arr[idx].consumer){
                    (function (_idx, _arr){
                      str += '</li><li>Customer: ' + (_arr[_idx]).split('#')[1];
                    })(each, arr[idx].consumer)
                  }
                }
                //str += '</li><li>Unit Count: ' + arr[idx].unitCount;
                //str += '</li><li>Unit Price: ' + arr[idx].unitPrice;
                str += '</li></ul><hr/>'

              }
              

            }else if(isDistributer == true){
              
              if(options.email == (arr[idx].distributor).split('#')[1]){
                
                str += '<ul>'
                
                str += '<li>Order Id: ' + arr[idx].agriAssetId;            ;
                str += '</li><li>Created On: ' + arr[idx].created;
                str += '</li><li>Status: ' + arr[idx].status;
                str += '</li><li>Harvest Year: ' + arr[idx].harvestYear;
                str += '</li><li>Commodity: ' + arr[idx].commodity;
                str += '</li><li>Total Acer: ' + arr[idx].totalAcer;
                str += '</li><li>Average Yield: ' + arr[idx].averageYield;
                str += '</li><li>Estimated Basic: ' + arr[idx].estimatedBasic;
                str += '</li><li>Crop Insurance Coverage: ' + arr[idx].cropInsuranceCoverage;
                str += '</li><li>Product Cost: ' + arr[idx].productCost;
                str += '</li><li>Producer: ' + (arr[idx].producer).split('#')[1];
                str += '</li><li>Distributor: ' + (arr[idx].distributor).split('#')[1];
                if(arr[idx].consumer){
                  for (let each in arr[idx].consumer){
                    (function (_idx, _arr){
                      str += '</li><li>Customer: ' + (_arr[_idx]).split('#')[1];
                    })(each, arr[idx].consumer)
                  }
                }
                //str += '</li><li>Unit Count: ' + arr[idx].unitCount;
                //str += '</li><li>Unit Price: ' + arr[idx].unitPrice;
                str += '</li></ul><hr/>'

              }
            }else if(isConsumer == true){
              
              if(arr[idx].consumer){
                for (let each in arr[idx].consumer){
                  (function (_idx, _arr){
                    if(options.email == (_arr[_idx]).split('#')[1]){

                      str += '<ul>'
                      str += '<li>Order Id: ' + arr[idx].agriAssetId;            ;
                      str += '</li><li>Created On: ' + arr[idx].created;
                      str += '</li><li>Status: ' + arr[idx].status;
                      str += '</li><li>Harvest Year: ' + arr[idx].harvestYear;
                      str += '</li><li>Commodity: ' + arr[idx].commodity;
                      str += '</li><li>Total Acer: ' + arr[idx].totalAcer;
                      str += '</li><li>Average Yield: ' + arr[idx].averageYield;
                      str += '</li><li>Estimated Basic: ' + arr[idx].estimatedBasic;
                      str += '</li><li>Crop Insurance Coverage: ' + arr[idx].cropInsuranceCoverage;
                      str += '</li><li>Product Cost: ' + arr[idx].productCost;
                      str += '</li><li>Producer: ' + (arr[idx].producer).split('#')[1];
                      str += '</li><li>Distributor: ' + (arr[idx].distributor).split('#')[1];
                      str += '</li><li>Customer: ' + (_arr[_idx]).split('#')[1];
                      str += '</li></ul><hr/>'
                      
                    }
                  })(each, arr[idx].consumer)
                }
              }
              

            }else{

            }
            //console.log(arr)
            
            

            console.log("[Consumer]", arr[idx].consumer)
            
          })(each, results.orders)

          
        }

      }

      

      
      $('#AllOrderList').append(str)
    })



  });


}


/********************************** CONSUMER SECTION *************************/


let loadAssetFromDistributer = $('#loadAssetFromDistributer');
loadAssetFromDistributer.on('click', function(){
  $('#AllOrderList').empty();

  $('#AllOrderList').append('<input type="text" id="order_id_purchase" placeholder="Order Id"><input type="text" id="order_id_quantity" placeholder="Quantity"><button id="PURCHASE">PURCHASE</button>')
  $('#PURCHASE').on('click', function(){
    //order_id_quantity | order_id_purchase | 

    let options = {};
    options.participant = $('#members_list').find(':selected').val(); // Email of the Consumer 
    options.agriAssetId = $('#order_id_purchase').val() // Order Id 
    options.action = 'SELL' // Chaing state to Selling
    options.unitPurchased = parseInt($('#order_id_quantity').val());
    $.when($.post('/composer/admin/orderAction', options)).done(function (results){ 

      console.log(results);

    })

  })

  let options = {};
    options.id = $('#members_list_3').find(':selected').val();
    options.email = $('#members_list_3').find(':selected').val();

    //console.log("[Data Sent]", options)

    $.when($.post('/composer/admin/getMyOrders', options)).done(function (results){ 
      let str = '';
      if (results.orders.length < 1){
        str += 'No records fround';
      }else{
        for (let each in results.orders){
          (function (idx, arr){

            if(options.email == (arr[idx].distributor).split('#')[1] && arr[idx].status == 'SELLING'){
              str += '<ul>'
              str += '<li>Order Id: ' + arr[idx].agriAssetId;            ;
              str += '</li><li>Created On: ' + arr[idx].created;
              str += '</li><li>Status: ' + arr[idx].status;
              str += '</li><li>Harvest Year: ' + arr[idx].harvestYear;
              str += '</li><li>Commodity: ' + arr[idx].commodity;
              str += '</li><li>Total Acer: ' + arr[idx].totalAcer;
              str += '</li><li>Average Yield: ' + arr[idx].averageYield;
              str += '</li><li>Estimated Basic: ' + arr[idx].estimatedBasic;
              str += '</li><li>Crop Insurance Coverage: ' + arr[idx].cropInsuranceCoverage;
              str += '</li><li>Product Cost: ' + arr[idx].productCost;
              str += '</li><li>Producer: ' + (arr[idx].producer).split('#')[1];
              str += '</li><li>Distributor: ' + (arr[idx].distributor).split('#')[1];
              str += '</li></ul><hr/>'
            }

          })(each, results.orders)
        }
      }
      $('#AllOrderList').append(str);
    })
})
