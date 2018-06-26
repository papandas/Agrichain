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

  memberLoad();

  let _loginBtn = $('#LoginSubmit');
  _loginBtn.on('click', function(){
    console.log($('#li_username').val(), $('#li_password').val());
    var options = {};
    options.email = $('#li_username').val();
    options.pass = $('#li_password').val();

    console.log("message sent to API")
    console.log("waiting for signin message")

    $.when($.post('/composer/admin/signin', options)).done(function (results){ 

      console.log(results);

    })
  })


  let _signupBtn = $('#SignUpSubmit');
  _signupBtn.on('click', function(){

    var options = {};
    options.registry = $('#registry').find(':selected').text();
    options.fullname = $('#fullname').val();
    options.email = $('#email').val();
    options.cell = $('#cell').val();
    //options.pass = '';

    console.log("message sent to API")
    console.log("waiting for signup message")

    $.when($.post('/composer/admin/signup', options)).done(function (results){ 

      console.log(results);

    })
  })


}
