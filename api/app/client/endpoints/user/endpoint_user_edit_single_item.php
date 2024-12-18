<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_user_edit_single_item( $loader, $excuter, $args ){

  $object_name = $loader->nest->user_input( "post", "object_type", "bofClient_object" );
  $object_hash = $loader->nest->user_input( "post", "object_hash", "md5" );

  if ( $object_name && $object_hash ){

    $content_types = $loader->upload->setup()->get_c_types();
    if ( $content_types ){
      foreach( $content_types as $content_type ){
        if ( $content_type["single_object"] == $object_name ){
          $_type = "single";
          $_content = $content_type;
          break;
        }
        elseif ( $content_type["group_object"] == $object_name ){
          $_type = "group";
          $_content = $content_type;
          break;
        }
      }
    }

    if ( !empty( $_type ) ){

      $object_item = bof()->object->__get( $object_name )->select( array(
        "hash" => $object_hash,
        "uploader_id" => bof()->user->get()->ID
      ) );

      if ( $object_item && $_type == "single" ){

        $inputs = $_content["get_item_inputs"]();
        $inputs_filled = $_content["fill_item_inputs"]( $inputs, $object_name, $object_hash );

        try {
          $inputs_parsed = $loader->bofForm->validate( [ "inputs" => $inputs_filled["inputs"] ], true );
          if ( !empty( $inputs_parsed["description"] ) )
          $inputs_parsed["description"] = bof()->editorjs->editorjsize( $inputs_parsed["description"] );
          $u = bof()->object->__get( $object_name )->update(
            array(
              "ID" => $object_item["ID"],
            ),
            $inputs_parsed
          );
          $loader->api->set_message( "ok" );

        } catch( bofException|exception $err ){
          $loader->api->set_error( $err->getMessage() );
        }


      }
      else {

        $ginputs = $_content["get_group_inputs"](null,"studio");
        $ginputs_filled = $_content["fill_group_inputs"]( $ginputs, $object_name, $object_hash );

        try {
          $ginputs_parsed = $loader->bofForm->validate( [ "inputs" => $ginputs_filled["inputs"] ], true );
          if ( !empty( $ginputs_parsed["description"] ) )
          $ginputs_parsed["description"] = bof()->editorjs->editorjsize( $ginputs_parsed["description"] );
          bof()->object->__get( $object_name )->update(
            array(
              "ID" => $object_item["ID"],
            ),
            $ginputs_parsed
          );
          $loader->api->set_message( "ok" );

        } catch( bofException|exception $err ){
          $loader->api->set_error( $err->getMessage() );
        }


      }

    }

  }

}

?>
