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

  SetupLogin();

  SetupSignUp();

  // LOAD REGISTRY-MEMBERS LIST IN THE FRONT LIST

  

  let _loadRegistry = $('#load_registry');
  _loadRegistry.on('click', function(){
    var d_prompts = $.Deferred();
    var options = {};
    options.registry = $('#load_registry_type').find(':selected').text();
    $.when($.post('/composer/admin/getMembers', options)).done(function (results)
    { 

      console.log(results.result);

      var _str = '';
      for (each in results.members){
          (function(_idx, _arr){
              console.log(_arr[_idx].email)
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
  })


}
