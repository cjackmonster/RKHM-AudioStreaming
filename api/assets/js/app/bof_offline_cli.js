"use strict";

window.bof_offline_cli = {

  running: false,
  running_cache: {},

  _markStart: function(){
    window.bof_offline_cli.running = true;
    window.bof_offline_cli.running_cache = {
      item: {}
    };
    window.ui.body.addClass( "bof_offline_downloading", true );
  },
  _markStop: function(){
    window.bof_offline_cli.running = false;
    window.ui.body.removeClass( "bof_offline_downloading", true );
  },

  _getWorker:function(){

    var promise = $.Deferred();

    window.bof._loadExtension({
      name: "bof_offline_sw",
      path: "app/bof_offline_sw.js",
    }).done( () => {
      promise.resolve( window.bof_offline_sw );
    } );

    return promise;

  },

  exe: function(){

    if ( window.bof_offline_cli.running ) return;
    window.bof_offline_cli._markStart();

    window.bof_offline.db.get_first_pending()
    .done( item => {

      window.bof_offline_cli.running_cache.item = item;
      window.bof_offline_cli._getWorker().done( core => {
        core.set( item );
        core.start();
      } );

    } )
    .fail( () => {
      window.bof_offline_cli._markStop();
    } )

  },
  delete: function( item ){

    window.bof_offline_cli._getWorker().done( core => {
      core.delete( item );
    } );

    window.bof_offline.db.delete( item.key );

  },
  pause: function(){

    window.bof_offline_cli._getWorker().done( core => {
      core.pause();
    } );

  },

  getRunning: function(){

    var promise = $.Deferred();
    window.bof_offline.db.get(
      window.bof_offline_cli.running_cache.item.key
    ).then( item_w => {
      promise.resolve( item_w.item );
    } );
    return promise;

  },
  updateRunning: {
    getItem: function(){

      var dl_db = window.bof_offline.db._get();
      return dl_db.getItem( window.bof_offline_cli.running_cache.item.key )

    },
    item: function( data ){

      return window.bof_offline.db.update(
        window.bof_offline_cli.running_cache.item.key,
        data
      )

    },
    dled: function( dl_size ){

      dl_size = parseInt( dl_size );
      window.bof_offline_cli.updateRunning.getItem().then( item => {

        item.data.size_dled = item.data.size_dled ? parseInt( item.data.size_dled ) : 0;
        item.data.size_dled = item.data.size_dled + dl_size

        var donePercentage = item.data.size_dled  && item.data.size ? ( Math.round( item.data.size_dled / item.data.size * 100 ) ) : 0;
        donePercentage = donePercentage > 100 ? 100 : donePercentage;
        $(document).find(".file.key_"+window.bof_offline_cli.running_cache.item.key).find(".progress_t").text(donePercentage+"%");
        $(document).find(".file.key_"+window.bof_offline_cli.running_cache.item.key).find(".progress_e").css("width",donePercentage+"%");

        item.data.percentage_dled = donePercentage;

        window.bof_offline_cli.updateRunning.item( item )

      } );

    },
    state: function( state ){

      if ( window.bof_offline_cli.running_cache.item )
      $(document).find(".file.key_"+window.bof_offline_cli.running_cache.item.key).removeClass("sta_done sta_failed sta_pending sta_downloading sta_paused").addClass("sta_"+state);

      window.bof_offline_cli.updateRunning.getItem().then( item => {
        item.state = state;
        window.bof_offline_cli.updateRunning.item( item ).then( () => {

          if ( state == "done" ){
            window.bof_offline_cli._markStop();
            window.bof_offline_cli.exe();
          }

        } );
      } );

    },
  },

}
