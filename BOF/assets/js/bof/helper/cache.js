
window.cache = {

  set: function( name, value, acceptZero ){

    if ( !value )
    return window.cache.remove( name );

    //if ( config.platform == "web" )
    //return Cookies.set( name , value )

    return window.localStorage.setItem( window.config.cache_prefix + name, value )


  },
  get: function( name, defaultValue ){

    defaultValue = defaultValue ? defaultValue : false;
    var output = false;

    // if ( config.platform == "web" )
    // output = Cookies.get( name )

    // else
    output = window.localStorage.getItem( window.config.cache_prefix + name );

    if ( output ) return output;
    return defaultValue;

  },
  remove: function( name ){

    // if ( config.platform == "web" )
    // return Cookies.remove( name )
    return window.localStorage.removeItem( window.config.cache_prefix + name );

  },
  removeAll: function(){

    return window.localStorage.clear();

  }

};
