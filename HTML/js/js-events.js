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
 * load all of the members in the network for use in the different user experiences. This is a synchronous routine and is executed autormatically on web app start. 
 * However, if this is a newly created network, then there are no members to retrieve and this will create four empty arrays
 */

 function getCred(){
    $.when($.get('/composer/admin/getCreds')).done(function(result){
        console.log("GetCred", result)
    })
 }

function memberLoad(){

    var d_prompts = $.Deferred();


  var options = {};
  options.registry = 'Producer';
  var options2 = {};
  options2.registry = 'Distributor';
  var options3 = {};
  options3.registry = 'Consumer';
  $.when($.post('/composer/admin/getMembers', options2), $.post('/composer/admin/getMembers', options3),
      $.post('/composer/admin/getMembers', options)).done(function (_producer, _distributor, _consumer)
    { 
      
     console.log("[GetMembers]", _producer, _distributor, _consumer);
      
      /*producer = _producer[0].members;
      pro_string = _getMembers(producer);

      distributor = _distributor[0].members
      dis_string = _getMembers(distributor);

      consumer = _consumer[0].members
      con_string = _getMembers(consumer);*/

      d_prompts.resolve();

    }).fail(d_prompts.reject);
    return d_prompts.promise(); 
}


/**
 * return an option list for use in an HTML <select> element from the provided member array.
 * @param {Array} _members - array of members
 */


function _getMembers(_members)
{
    var _str = '';
    for (each in _members){
        (function(_idx, _arr){
            console.log(_arr[_idx].email)
            if (_arr[_idx].email != 'noop@dummy'){
                _str +='<option value="'+_arr[_idx].email+'">' +_arr[_idx].fullname + '</option>';
            }
        })(each, _members)
    }
    _str += '<option value="Producer12121">Producer</option></select>';
    return _str;
}

function SetupLogin(){
    let _loginBtn = $('#LoginSubmit');
  _loginBtn.on('click', function(){
    //console.log($('#li_username').val(), $('#li_password').val());
    var options = {};
    options.email = $('#li_username').val();
    options.pass = $('#li_password').val();

    $('#loginReplyMessage').empty()
    console.log("waiting for signin message")

    $.when($.post('/composer/admin/signin', options)).done(function (results){ 

      console.log(results);
      $('loginReplyMessage').empty();
      if(results.result === 'success'){
        $('#loginReplyMessage').append(results.members.fullname + ' is a ' + results.members.registry );
      }else{
        $('#loginReplyMessage').append(results.result);
      }
      

    })
  })
}


function SetupSignUp(){
    let _signupBtn = $('#SignUpSubmit');
    _signupBtn.on('click', function(){

        var options = {};
        options.registry = 'Producer';
        options.email = $('#email').val();
        options.fullname = $('#email').val();
        options.cellnumber = $('#email').val();
        options.password = $('#email').val();
        options.accountBalance = "0";
        options.SubCategory = $('#email').val();
        options.Locale = $('#email').val();
        options.UserRole = $('#email').val();

        console.log("waiting for signup message")

        $.when($.post('/composer/admin/signup', options)).done(function (results){ 

            console.log(results);

        })
    })

}


function LoadMemberToCreateAssets(){
    let _loadRegistry = $('#load_registry');
    _loadRegistry.on('click', function(){
        // Empty the order display list
        $('#AllOrderList').empty();

        var d_prompts = $.Deferred();
        var options = {};
        options.registry = $('#load_registry_type').find(':selected').text();

        $('#addAssetBox').hide();
        $('#consumerBuyBox').hide();

        switch(options.registry){
            case 'Producer':
                $('#addAssetBox').show();
                break;
            case 'Distributor':
                break;
            case 'Consumer':
                $('#consumerBuyBox').show();
                LoadDistributersOnly()
                break;
            default:
        }

        $.when($.post('/composer/admin/getMembers', options)).done(function (results)
        { 

        //console.log(results.result);

        var _str = '';
        for (each in results.members){
            (function(_idx, _arr){
                //console.log(_arr[_idx].email)
                if (_arr[_idx].email != 'noop@dummy'){
                    _str +='<option value="'+_arr[_idx].email+'">' +_arr[_idx].email + '</option>';
                }
            })(each, results.members)
        }
        _str += '</select>';
        
        $('#members_list').empty();
        $('#members_list').append(_str);

        d_prompts.resolve();
        }).fail(d_prompts.reject);
        return d_prompts.promise(); 
    });
}


function LoadMemberDistributersForForm(){
    let sell_to_distributer = $('#sell_to_distributer');
    sell_to_distributer.on('click', function(){
        var d_prompts = $.Deferred();
        var options = {};
        options.agriAssetId = $('#assetId_to_sell').val();
        options.action = 'SELLING'
        options.distributorID = $('#members_list_2').find(':selected').text();
        options.participant = $('#members_list').find(':selected').val();
        options.quantity = "2222222";

        $.when($.post('/composer/admin/assetsAction', options)).done(function (results){
            console.log(resuols);
        })

    })


    let _loadRegistry = $('#load_distributer_members');
    _loadRegistry.on('click', function(){
        var d_prompts = $.Deferred();
        var options = {};
        options.registry = 'Distributor';
        $.when($.post('/composer/admin/getMembers', options)).done(function (results)
        { 

        //console.log(results.result);

        var _str = '';
        for (each in results.members){
            (function(_idx, _arr){
                //console.log(_arr[_idx].email)
                if (_arr[_idx].email != 'noop@dummy'){
                    _str +='<option value="'+_arr[_idx].email+'">' +_arr[_idx].email + '</option>';
                }
            })(each, results.members)
        }
        _str += '</select>';
        
        $('#members_list_2').empty();
        $('#members_list_2').append(_str);

        d_prompts.resolve();
        }).fail(d_prompts.reject);
        return d_prompts.promise(); 
    });
}


function LoadDistributersOnly(){

    var d_prompts = $.Deferred();
    var options = {};
    options.registry = 'Distributor';   

    $.when($.post('/composer/admin/getMembers', options)).done(function (results)
    { 

        var _str = '';
        for (each in results.members){
            (function(_idx, _arr){
                //console.log(_arr[_idx].email)
                if (_arr[_idx].email != 'noop@dummy'){
                    _str +='<option value="'+_arr[_idx].email+'">' +_arr[_idx].email + '</option>';
                }
            })(each, results.members)
        }
        _str += '</select>';
        
        $('#members_list_3').empty();
        $('#members_list_3').append(_str);

        d_prompts.resolve();

    }).fail(d_prompts.reject);

    return d_prompts.promise(); 
    //});

}