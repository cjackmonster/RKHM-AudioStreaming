"use strict";

window.bof_content_stats = {

  displaying: function(){

    var graphPromise = $.Deferred();
    window.app._extension("bof_graph").done(function(){
      window.bof_graph.load_am5chart().done(function(){
        graphPromise.resolve();
      });
    });

    var promise = $.Deferred();
    $.when( graphPromise, window.app._extension( "daterangepicker", true ) ).done(function(){
      promise.resolve();
    });

    return promise;

  },
  ready: function(){

    var p = $.Deferred();
    p.resolve();

    var _items = window.ui.page.curr().data.becli.stats.structure_items;
    for ( var i=0; i<Object.keys(_items).length; i++ ){
      var _item_key = Object.keys(_items)[i];
      var _item = _items[ _item_key ];

      if ( _item.type == "graph" && _item.graph_parsed ? _item.graph_parsed.items : false ){
        window.bof_graph[ _item.graph_parsed.type ]( _item.ID, _item.graph_parsed.items, _item )
      }

    }

    $(document).on("click","body.p_content_stats .content .stats_head ._fs ._f.sfr span._face",function(){
      $(document).find("body.p_content_stats .content .stats_head ._fs ._f.sfr input").click();
    });
    $(document).on("click","body.p_content_stats .daterangepicker .drp-buttons .btn-primary",function(){
      window.ui.link.navigate( "stat/" + window.ui.page.curr().args.urlData.url.match[0] + "?range=" + $(document).find("body.p_content_stats .content .stats_head ._fs ._f.sfr input").val()  )
    })

    return p;

  },
  unloading: function(){

    $(document).off("click","body.p_content_stats .content .stats_head ._fs ._f.sfr span._face");
    $(document).off("click","body.p_content_stats .daterangepicker .drp-buttons .btn-primary");

    var p = $.Deferred();
    p.resolve();
    return p;

  },

}
