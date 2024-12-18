<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_radio_fav_catcher( $loader, $excuter, $args ){

  $hash = bof()->nest->user_input( "get", "hash", "md5" );
  if ( !$hash ) dreturn;

  if ( !bof()->object->db_setting->get( "radio_fav_as_icon" ) )
  return;

  $station = bof()->object->r_station->shash( $hash );
  if ( !$station ) return;

  // if ( $station["website_fav_time"] ? bof()->general->timestamp_difference( $station["website_fav_time"], "-", 7*24*60*60 ) : false )
  // die("4444");

  if ( empty( $station["website"] ) )
  return;

  $_ws = str_replace( [ "https://", "http://" ], "", $station["website"] );
  $_gl = "https://www.google.com/s2/favicons?domain={$_ws}&sz=256";

  $_get = bof()->curl->exe(array(
    "url" => $_gl,
    "type" => "image",
    "cache" => true
  ));

  if ( $_get["http_code"] == 200 ){
    $fav_img = imagecreatefromstring( $_get["body"] );
    if ( imagesx( $fav_img ) > 100 )
    $fav = 1;
    else
    $fav = 0;
    imagedestroy( $fav_img );
  } else {
    $fav = 0;
  }

  bof()->object->r_station->update(
    array(
      "ID" => $station["ID"]
    ),
    array(
      "website_fav" => $fav,
      "website_fav_time" => bof()->general->mysql_timestamp()
    )
  );

  if ( $fav ){
    try { ob_end_clean(); } catch( Exception $err ){}
    header('Content-Type:image/jpeg');
    echo $_get["body"];
  }
  else {
    $placeholder = bof()->object->db_setting->get("placeholder");
    if ( $placeholder ){
      $placeholder_file = bof()->object->file->sid( $placeholder );
      if ( $placeholder_file ){

        try { ob_end_clean(); } catch( Exception $err ){}

        if ( $placeholder_file["extension"] == "jpg" || $placeholder_file["extension"] == "jpeg" )
        header('Content-Type:image/jpeg');
        elseif( $placeholder_file["extension"] == "gif" )
        header('Content-Type:image/gif');
        else
        header('Content-Type:image/png');

        echo file_get_contents( $placeholder_file["web_address"] );

      }
    }
  }

}

?>
