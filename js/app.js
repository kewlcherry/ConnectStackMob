/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var myapp = {};

   StackMob.init({
    appName: "connectstackmob",
    clientSubdomain: "stackmob339",
    apiVersion: 0
  });

(function($){
    
     myapp.Todo = StackMob.Model.extend({
        schemaName: 'todo'
    });

    
    myapp.Todos = StackMob.Collection.extend({
        model: myapp.Todo
    });

    myapp.ListHeader = Backbone.View.extend({            
        el: "#listHeader",
        events: {
            "click #addBtn" : "add"
        },
        
        add : function(e) {
            e.preventDefault();

             FB.getLoginStatus(function(response) {
              if (response.status === 'connected') {
             
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
                console.log(accessToken);
             
              } else if (response.status === 'not_authorized') {
                console.log('not_authorized');
                
                $.mobile.changePage("#fb","'pop",true, true);          
                // the user is logged in to Facebook, 
                // but has not authenticated your app
              } else {
                console.log('not_logged in');
                 $.mobile.changePage("#fb","'pop",true, true); 
                
                // the user isn't logged in to Facebook.
              }
             });
        
      
        }

    });


    myapp.ListView = Backbone.View.extend({
        tagName: 'ul',
        id: 'list',
        attributes: {"data-role": 'listview', "data-inset": "true", "data-theme" : "c", "data-divider-theme" :"e"},
            
        
        initialize: function() {
            console.log('init');
            //this.collection.bind('change', this.changeItem, this);
            //this.collection.bind('reset', this.render, this);
         
            //this.template = _.template($('#veggie-list-item-template').html());
        },
        
        render: function() {
		
            var container = this.options.listContainer,
                todos = this.collection,
                template = this.template,
                listView = $(this.el);
            
            container.html($(this.el));

            var q = new StackMob.Collection.Query();
            //q.mustBeNearMi('latlon', new StackMob.GeoPoint(37.797306,-122.456703), 25);
            //q.isWithinMi('latlon', new StackMob.GeoPoint(37.797306,-122.456703), 25);
             
            //var nearGarden = new garden.Veggies();
            /*
            nearGarden.query(q,
                {success: function(veggies) {
                   
                    var divider = true;
                    var miles = 0;
                    veggies.each(function(veggie){
                        
                        distance = garden.getDistance(veggie.toJSON().latlon.lat, veggie.toJSON().latlon.lon, garden.getLat(), garden.getLon());

                        if (Math.round(distance) > miles)
                        {
                            divider = true;
                        }
                        
                        miles = Math.round(distance);

                        if(divider === true) {
                            listView.append("<li data-role='listdivider' data-theme='e'>around " + miles + " mile(s) away</li>");
                            divider = false;
                        }


                        listView.append(template(veggie.toJSON()));
                    });

                    container.trigger('create');
                    container.trigger('updateLayout');

                   
                }
            });
            */
          	
            return this;
        },

      
        
        share : function(e) {
           
            e.preventDefault();
            id = $(e.currentTarget).data("id");
            item = this.collection.get(id);
            name = item.get("name");
            total = item.get("total");

            FB.ui(
               {
                method: 'stream.publish',
                name : 'My Connect StackMob app',
                caption: 'harvested',
                picture: 'https://www.stackmob.com/resources/images/logo.png',
                description:  total + ' ' + name,
                link: 'https://www.stackmob.com/',
                 user_prompt_message: 'Intentionally left blank - for Chuck Norris'
               },
               function(response) {
                 if (response && response.post_id) {
                   alert('Post was published.');
                 } else {
                   alert('Post was not published.');
                 }
               }
             );  

           
  
        },

     
    });

    myapp.AddView = Backbone.View.extend({

        el: "#addPage",
        events: {
                "click #addVeggie": "add"
        },
       
        add: function() {
            var list = $('#list'),
                template = _.template($('#veggie-list-item-template').html()),
                item = $('#addForm').serializeObject();
    

            var todo = new myapp.Todo(item);

            todo.create({
                success: function(model) {
                
                    veggiesList = $("#veggies-list");
                    veggiesList.append(template(model.toJSON()));

                    veggiesList.listview('refresh');
                    veggiesList.trigger('create');
                    $.mobile.changePage('#veggies','slideleft','true','true');
            
                }
              });

         
            return this;
        }
       
  
    });



    myapp.FBLoginView = Backbone.View.extend({

        el: "#fb",
        events: {
                "click #fbConnect": "connect",
                "click #fbLogin": "login", 
                "click #fbLogout": "logout",
                "click #fbStatus": "status",
                "click #fbMe": "me",
                "click #fbMsg": "msg"
        },
       
        connect: function() {
            
            console.log('login');
            
            FB.login(function(response) {
                if (response.authResponse) {
                  var accessToken = response.authResponse.accessToken;
             
                  FB.api('/me', function(response) {
                    var user = new StackMob.User({ username: response.email });
                    user.createUserWithFacebook(accessToken);
                  });
             
                } else {
                  console.log('User cancelled login or did not fully authorize.');
                }
              }, {scope: 'email'});FB.login(function(response) {
                if (response.authResponse) {
                  var accessToken = response.authResponse.accessToken;
             
                  FB.api('/me', function(response) {
                    var user = new StackMob.User({ username: response.email });
                    user.createUserWithFacebook(accessToken);
                  });
             
                } else {
                  console.log('User cancelled login or did not fully authorize.');
                }
              }, {scope: 'email'});
            

            return this;
        },
        login: function() {

             FB.login(function(response) {
                if (response.authResponse) {
             
                  var accessToken = response.authResponse.accessToken;
                  var user = new StackMob.User();
                  user.loginWithFacebookToken(accessToken, false);
                    console.log(user);
                } else {
                  console.log('User cancelled login or did not fully authorize.');
                }
              }, {scope: 'email'});
        },

        logout: function() {

            FB.logout(function(response) {
                alert('you are logged out');
            });
        },

        status: function() {

            console.log('hello');
             FB.getLoginStatus(function(response) {
                console.log(response.authResponse.userID);
              if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token 
                // and signed request each expire
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
              } else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook, 
                // but has not authenticated your app
              } else {
                // the user isn't logged in to Facebook.
              }
             });
        },

        me: function() {

            FB.api('/me', function(response) {
              alert('Your name is ' + response.name);
            });

        },

        msg: function() {

             FB.ui(
               {
                method: 'stream.publish',
                name : 'Chuck N.',
                caption: 'Chuck Norris hearts StackMob',
                picture: 'https://www.stackmob.com/resources/images/logo.png',
                description: 'Bad ass',
                link: 'https://www.stackmob.com/',
                 user_prompt_message: 'Intentionally left blank - for Chuck Norris'
               },
               function(response) {
                 if (response && response.post_id) {
                   alert('Post was published.');
                 } else {
                   alert('Post was not published.');
                 }
               }
             );  


        }

    });






    myapp.initData = function(){
        myapp.todos = new myapp.Todos();
        myapp.todos.fetch({async: false});
    };

    
    
}(jQuery));


$('#list').live('pageinit', function(event){

    var listContainer = $('#list').find(":jqmData(role='content')"),
    listView;

    myapp.initData();

    listHeader = new myapp.ListHeader();
    listView = new myapp.ListView({collection: myapp.todos, viewContainer: listContainer});
    listView.render();

    addView = new myapp.AddView();


});

$(document).bind("mobileinit", function(){
    $.mobile.page.prototype.options.addBackBtn= true;
 });


$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
