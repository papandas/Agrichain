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

    let options = {};
    options.id = $('#members_list').find(':selected').val();
    options.email = $('#members_list').find(':selected').val();

    console.log("[Data Sent]", options)

    $.when($.post('/composer/admin/getMyOrders', options)).done(function (results){ 
      //console.log(results.orders);
      //console.log("-------------")
      let str = '';
      if (results.orders.length < 1){
        str += 'No records fround';
      }else{
        for (let each in results.orders){
          (function (idx, arr){
            //console.log(arr)
            str += '<ul>'
            str += '<li>Order Id: ' + arr[idx].agriAssetId;            ;
            str += '</li><li>Harvest Year: ' + arr[idx].harvestYear;
            str += '</li><li>created: ' + arr[idx].created;
            str += '</li><li>commodity: ' + arr[idx].commodity;
            str += '</li><li>status: ' + arr[idx].status;
            str += '</li><li>totalAcer: ' + arr[idx].totalAcer;
            str += '</li><li>averageYield: ' + arr[idx].averageYield;
            str += '</li><li>estimatedBasic: ' + arr[idx].estimatedBasic;
            str += '</li><li>cropInsuranceCoverage: ' + arr[idx].cropInsuranceCoverage;
            str += '</li><li>productCost: ' + arr[idx].productCost;
            str += '</li><li>producer: ' + (arr[idx].producer).split('#')[1];
            str += '</li><li>distributor: ' + (arr[idx].distributor).split('#')[1];
            str += '</li><li>unitCount: ' + arr[idx].unitCount;
            str += '<li>unitPrice: ' + arr[idx].unitPrice;
            str += '</li></ul><hr/>'
          })(each, results.orders)
        }
      }

      $('#AllOrderList').empty();
      $('#AllOrderList').append(str)
    })



  });


}
