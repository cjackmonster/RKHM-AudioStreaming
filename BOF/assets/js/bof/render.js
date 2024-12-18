"use strict";

window.render = {

  mix: function( HtmlData, DataBecli, $args ){

    $args = $args ? $args : {};
    var promise = $.Deferred();

    window.render._exe.run(
      HtmlData,
      DataBecli,
      promise,
      {
        Becli: DataBecli,
        Bof: {
          device_width: $(window).width()
        },
        Config: window.app.config,
        UrlData: $args.urlData
      }
    );

    return promise;

  },

  _exe: {

    has: function( string ){
      if ( typeof( string ) === "undefined" ) return false;
      return string.indexOf( "$bof" ) > -1;
    },

    readTheCommandArgs: function( String, DataPool, Args ){

      var command_args = [];
      var command_e_args = {};
      if ( String.split(" ").length > 3 ){

        var command_args_raw_string = String.split(" ").splice(3).join(" ");

        // get escpaed args
        var command_args_escaped_strings = command_args_raw_string.match( new RegExp( '"(.*?)"', 'g' ) );
        if ( command_args_escaped_strings ? command_args_escaped_strings.length : false ){

          // replace " " with special chars in escaped words
          for( var i=0; i<command_args_escaped_strings.length; i++ ){
            var command_args_escaped_string = command_args_escaped_strings[i];
            var new_command_args_escaped_string = window.general.replace( command_args_escaped_string, " ", "BOFBOFBOFBOFBOF" );
            command_args_raw_string = command_args_raw_string.replace( command_args_escaped_string, new_command_args_escaped_string.substr( 1, new_command_args_escaped_string.length-2 ) );
          }

          // split by space
          var command_args_with_unedited_escpaed_args = command_args_raw_string.split( " " );
          for ( var i=0; i<command_args_with_unedited_escpaed_args.length; i++ ){
            command_args_with_unedited_escpaed_args[i] = window.general.replace( command_args_with_unedited_escpaed_args[i], "BOFBOFBOFBOFBOF", " " );
          }

          // set as command
          command_args = command_args_with_unedited_escpaed_args;

        }
        else {
          command_args = command_args_raw_string.split(" ");
        }

        if ( command_args ){
          for ( var i=0; i<command_args.length; i++ ){

            var _dyna_args = command_args[i].match( new RegExp( "\#bof (.*?)\#", "g" ) );
            if ( _dyna_args ){
              for ( var z=0; z<_dyna_args.length; z++ ){

                var _dyna_arg_pointer = _dyna_args[z].substr( 5, _dyna_args[z].length-6 ).split("^");
                var _dyna_arg_pointer_data = _dyna_arg_pointer.reduce(function(prev, curr) {
                  return curr == "?" ? prev : ( prev ? prev[curr] : null );
                }, DataPool );

                command_args[i] = command_args[i].replace( _dyna_args[z], _dyna_arg_pointer_data );

              }
            }

            if ( command_args[i].split("=").length != 2 ) continue;
            var _arg_k = command_args[i].split("=")[0];
            var _arg_v = command_args[i].split("=")[1];
            if ( _arg_k && _arg_v )
            command_e_args[ _arg_k ] = _arg_v;

          }
        }

      }

      return {
        Args: command_args,
        Args_e: command_e_args
      }

    },
    readTheBlock: function( String, DataPool, Args ){

      // command string
      var command_start = String.indexOf("$bof");
      var command_length = String.substr( command_start + 1 ).indexOf( "$" ) + 2;
      var command_string_raw = String.substr( command_start, command_length );
      var command_string = String.substr( command_start+1, command_length-2 ); // without $ in begining/end
      var command_end = command_start + command_length;
      // command string->data ( type, data_pointer )
      var command_type = command_string.split(" ")[1];
      var command_data_pointer_string = command_string.split(" ")[2];
      var command_data_pointer_array = command_data_pointer_string.split( "^" );
      // command string->data ( args )
      var command_args_and_argse =
      window.render._exe.readTheCommandArgs( command_string, DataPool, Args );
      var command_args = command_args_and_argse["Args"];
      var command_args_e = command_args_and_argse["Args_e"]

      // block data
      var block_start = command_start;
      var block_end = null;
      var block_string = null;

      if ( command_type == "?" || command_type == "html" ){
        block_end = command_end;
      }
      else {
        var command_end_string_raw = "$!" + command_string + "$";
        var command_end_start = String.indexOf( command_end_string_raw );
        var command_end_end = command_end_start + command_end_string_raw.length;
        block_end = command_end_end;
        block_string = String.substr( command_end, command_end_start - command_end )
      }

      var block_before = String.substr( 0, block_start );
      var block_after = String.substr( block_end );

      return {
        command: {
          type: command_type,
          pointer: command_data_pointer_array,
          string: command_string,
          args: command_args,
          args_e: command_args_e
        },
        block: {
          start: block_start,
          end: block_end,
          before: block_before,
          inside: block_string,
          after: block_after,
        }
      };

    },
    getPointerData: function( Source, Pointer, rawPool ){

      var requested_arg = [ "Bof", "Becli", "Block", "Command", "Parent", "Shared", "DataPool", "UrlData", "Lang", "Config" ].includes( Pointer[0] ) ? Pointer[0] : false;
      var dataPool = requested_arg !== false || rawPool === true ? Source : Source[ "DataPool" ];
      if ( Pointer[0] == "Lang" && window.lang ? window.lang.cache : false ) dataPool.Lang = window.lang.cache;

      if ( typeof( dataPool ) != "object" ){
        if ( Pointer[0] == "?" )
        return dataPool;
      }

      if ( Pointer[0] == "Lang" & 1==2 ){
        window.becli.exe({
          endpoint: "client_translations_record",
          post: {
            hook: Pointer[1]
          }
        })
      }

      var pointer_data = Pointer.reduce(function(prev, curr) {
        return curr == "?" ? prev : ( prev ? prev[curr] : null );
      }, dataPool );

      return pointer_data;

    },

    run: function( HtmlPartial, DataPool, Promise, Args ){

      var promise_toFinish_allRuns = Promise;
      var promise_toFinish_thisRun = $.Deferred();

      promise_toFinish_thisRun.done( function( _renderedHtml ){

        if ( window.render._exe.has( _renderedHtml ) ){
          window.render._exe.run( _renderedHtml, DataPool, Promise, Args );
        }
        else {
          promise_toFinish_allRuns.resolve( _renderedHtml );
        }

      } );

      if ( !window.render._exe.has( HtmlPartial ) ){
        promise_toFinish_thisRun.resolve( HtmlPartial );
      } else {

        var blockData = window.render._exe.readTheBlock( HtmlPartial, DataPool, Args );
        Args.Block = blockData.block;
        Args.Command = blockData.command;
        Args.DataPool = DataPool;
        Args.Shared = Args.Shared ? Args.Shared : {};
        var pointerData = window.render._exe.getPointerData( Args, blockData.command.pointer );
        Args.Pointer = pointerData;

        window.render._exe.runTheBlock( pointerData, Args ).done(function(_renderedBlock){
          promise_toFinish_thisRun.resolve( _renderedBlock );
        });

      }

      return promise_toFinish_thisRun;

    },
    runTheBlock: function( PointerData, Args ){

      var promise_toFinish_block = $.Deferred();
      var promise_toFinish_command = null;

      if ( Args.Command.type == "?" )
      promise_toFinish_command = window.render._exe.runTheBlock_basic( PointerData, Args );

      else if ( Args.Command.type == "foreach" )
      promise_toFinish_command = window.render._exe.runTheBlock_foreach( PointerData, Args );

      else if ( Args.Command.type == "if" )
      promise_toFinish_command = window.render._exe.runTheBlock_if( PointerData, Args );

      else if ( Args.Command.type == "html" )
      promise_toFinish_command = window.render._exe.runTheBlock_html( PointerData, Args );

      var ID = window._g._mt();
      promise_toFinish_command.done(function(_renderedCommand){
        var newBlockData = Args.Block.before + _renderedCommand + Args.Block.after;
        window.testt = window.testt + window._g.passed_time( ID );
        promise_toFinish_block.resolve( newBlockData.trim() );
      });

      return promise_toFinish_block;

    },
    runTheBlock_basic: function( PointerData, Args ){

      var promise = $.Deferred();
      var _args = Args.Command.args_e;

      var displayData = false;
      if ( typeof( PointerData ) == "object" ){
        displayData = JSON.stringify( PointerData );
      }
      else{

        displayData = PointerData;
        if ( _args.__turn && displayData && typeof( displayData ) == "string" )
        displayData = window.lang.return( displayData )

        if ( _args.__uc && displayData && typeof( displayData ) == "string" )
        displayData = displayData.charAt(0).toUpperCase() + displayData.slice(1);

      }

      if ( ( displayData && PointerData ) || ( displayData == 0 && PointerData == 0 ) ){
        promise.resolve( displayData );
      } else {
        promise.resolve( "" );
      }
      return promise;

    },
    runTheBlock_foreach: function( PointerData, Args ){

      var promise = $.Deferred();
      var promiseEachs = [];

      if ( PointerData ){
        PointerData = Object.values( PointerData );
        for ( var i=0; i<PointerData.length; i++ ){

          var promiseEach = $.Deferred();
          var eachData = PointerData[i];
          window.render._exe.run(
            Args.Block.inside,
            eachData,
            promiseEach,
            {
              Becli: Args.Becli,
              Bof: Args.Bof,
              Parent: Args,
              Shared: Object.keys(Args.Command.args_e).length ? $.extend( Args.Shared, Args.Command.args_e ) : Args.Shared
            }
          );
          promiseEachs.push( promiseEach );

        }

        $.when.apply( $, promiseEachs ).done( function( ){

          var foreachs_results = Array.prototype.slice.call( arguments, 0 );
          promise.resolve( promiseEachs.length == 1 ? foreachs_results : foreachs_results.join( "\n" ) )

        } )

      }
      else {
        promise.resolve( "" );
      }


      return promise;

    },
    runTheBlock_if: function( PointerData, Args ){

      var promise = $.Deferred();
      var _cond = Args.Command.args[0] ? Args.Command.args[0] : "exists";
      var _eval = Args.Command.args[1];

      if ( _eval ? _eval.substr( 0, 4 ) == "BOF_" : false ){
        _eval = window.render._exe.getPointerData( Args, _eval.substr( 4 ).split("^"), true );
      }

      var checkedOut = false;

      if ( _cond == "=" ){
        if ( _eval == PointerData )
        checkedOut = true;
      }

      if ( _cond == "!=" ){
        if ( _eval != PointerData )
        checkedOut = true;
      }

      if ( _cond == "+" ){
        if ( PointerData ){
          if ( typeof( PointerData ) == "object" )
          checkedOut = Object.keys( PointerData ).length > 0
          else if ( PointerData != 0 && PointerData != "0" )
          checkedOut = true;
        }
      }

      if ( _cond == "-" ){
        if ( !PointerData ){
          checkedOut = true;
        }
      }

      if ( _cond == "in_array" ){
        if ( typeof( _eval ) === "string" ) _eval = [ _eval ];
        if ( _eval ? _eval.indexOf( PointerData ) > -1 : false )
        checkedOut = true;
      }

      if ( _cond == "false" ){
        if ( PointerData == false || PointerData === undefined )
        checkedOut = true;
      }

      if ( _cond == "exists" ){
        if ( PointerData ){
          if ( typeof( PointerData ) == "object" )
          checkedOut = Object.keys( PointerData ).length > 0
          else
          checkedOut = true;
        }
      }

      if ( checkedOut ){
        window.render._exe.run(
          Args.Block.inside,
          PointerData,
          promise,
          {
            Becli: Args.Becli,
            Bof: Args.Bof,
            Parent: Args,
            Shared: Object.keys(Args.Command.args_e).length ? $.extend( Args.Shared, Args.Command.args_e ) : Args.Shared
          }
        );
      } else {
        promise.resolve( "" )
      }
      return promise;

    },
    runTheBlock_html: function( PointerData, Args ){

      var promise = $.Deferred();
      var _args = Args.Command.args_e;

      var base = $_bof_config.assets_address;
      if ( _args["__base"] == "endpoint" )
      base = $_bof_config.endpoint_address;
      else if ( _args["__base"] )
      base = _args["__base"];

      window.ui.theme.part(
        _args["__path"] ? _args["__path"] : "parts/" + _args["__name"],
        {
          target: false,
          dir: _args["__dir"] == "no" ? false : "theme",
          base: base,
          use_base: _args["__use_base"] === "no" ? false : true
        }
      ).done(function( _htmlData ){

        window.render._exe.run(
          _htmlData,
          PointerData,
          promise,
          {
            Becli: Args.Becli,
            Bof: Args.Bof,
            Parent: Args,
            Shared: Object.keys(Args.Command.args_e).length ? $.extend( Args.Shared, Args.Command.args_e ) : Args.Shared
          }
        )

      }).fail(function( err ){
        window.bof.log( "Render.BlockHTML Failure" );
        console.log( err );
      });

      return promise;

    }

  }

};
