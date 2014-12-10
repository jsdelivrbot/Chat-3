// Generated by CoffeeScript 1.7.1
(function() {
  if (localStorage["version"] == null) {
    localStorage["version"] = "google";
    window.location.reload();
  }

  foundry.angular.dependency = [];

  define('config', function() {
    var config;
    config = {};
    config.appName = 'Chat';
    config.plugins = {
      user: 'app/plugins/user',
      workspaces: 'app/plugins/workspaces',
      support: 'core/plugins/support',
      chat: 'app/plugins/chat'
    };
    return config;
  });

  foundry.load_plugins();

  Nimbus.Auth.setup({
    'GDrive': {
      'app_id' : '696230129324',
      'key': '696230129324-k4g89ugcu02k5obu9hs1u5tp3e54n02u.apps.googleusercontent.com',
      "scope": "openid https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/plus.me"
    },
    "Firebase": {
      key: 'amber-torch-4018',
      app_name: 'Foundry',
      anonymous : true
    },
    "app_name": "Foundry",
    'synchronous': true
  });

  Nimbus.Auth.authorized_callback = function() {
    $("#login_buttons").addClass("redirect");
  };

  foundry.plugin_load_completed = function(){
    foundry._plugins.workspaces.title = 'Manage Rooms';
  }

  foundry.ready(function() {
    if (Nimbus.Auth.authorized()) {
      $('#loading .identity-form').slideUp('fast');
      $("#login_buttons").addClass("redirect");

      foundry.init(function() {
        $('#loading').addClass('loaded');
        return $("#login_buttons").removeClass("redirect");
      });
    }
  });

  $(document).ready(function() {
    $('.register-form-toggle').on('click', function(evt){
      evt.preventDefault();
      $('.l-form-container').animate({top:'-146px'})
      return false;
    });

    $('.login-form-toggle').on('click', function(evt){
      evt.preventDefault();
      $('.l-form-container').animate({top:'0px'});
      return false;
    });

    $('.anonymous-toggle').on('click', function(evt){
      evt.preventDefault();

      Nimbus.Auth.authorize('Firebase',{
        'provider' : 'anonymous'
      });
      return false;
    });

    $('#firebase_login_btn').on('click', function(evt) {
      evt.preventDefault();
      // check email and password
      if(!$('.identity-form input[name="email"]').val() || !$('.identity-form input[name="passwd"]').val()){
        return false;
      }

      Nimbus.Auth.authorize('Firebase', {
        'email' : $('.identity-form input[name="email"]').val(),
        'password': $('.identity-form input[name="passwd"]').val(),
        'provider': 'password'
      });
      return false;
    });

    $('#firebase_register_btn').on('click', function(evt) {
      evt.preventDefault();

      if(!$('.identity-form input[name="register"]').val() || !$('.identity-form input[name="password"]').val()){
        return false;
      }

      // setup first
      Nimbus.Auth.sync_services.Firebase.service = 'Firebase';
      Nimbus.Auth.setup(JSON.stringify(Nimbus.Auth.sync_services.Firebase));

      // register
      (function(){
        var server = Nimbus.Firebase.server,
            data = {
              'email' : $('.identity-form input[name="register"]').val(),
              'password' : $('.identity-form input[name="password"]').val()
            }

        server.createUser(data, function(err){
          if (!err) {
            bootbox.alert('Your account has been created, you can sign in now.', function(){
              // try login directly
              console.log('login');
              Nimbus.Auth.authorize('Firebase', {
                'email' : data.email,
                'password': data.password,
                'provider': 'password'
              });
            });
          }else{
            bootbox.alert('Register Error: '+err.message);
          };
        });
      })()
      return false;
    });
    $('.logout_btn').on('click', function(evt) {
      foundry.logout();
      return location.reload();
    });
  });

}).call(this);
