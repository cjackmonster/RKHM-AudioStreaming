<?php

if ( !defined( "bof_root" ) ) die;

class response_json {

  public function set( $args ){

    if ( $args )
    bof()->execute->set_data( "json", $args );

  }
  public function get(){

    return bof()->execute->get_data( "json" );

  }
  public function display(){

    if ( !headers_sent() )
    header('Content-Type: application/json');

    $json = bof()->execute->get_data( "json", array(
      "success" => false,
      "messages" => [ "Unkown error" ]
    ) );

    $json["messages"] = !isset( $json["messages"] ) ? [] : $json["messages"];

    if ( !empty( $json["message"] ) ){
      $json["messages"][] = $json["message"];
      unset( $json["message"] );
    }

    echo json_encode( $json, JSON_PRETTY_PRINT );

  }

}

?>
