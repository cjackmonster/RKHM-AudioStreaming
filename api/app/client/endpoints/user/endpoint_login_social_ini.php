<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_login_social_ini( $loader, $excuter, $args ){

  if ( !$loader->object->db_setting->get( "sl" ) )
  return;

  $alert = $loader->nest->user_input( "get", "alert", "equal", [ "value" => "true" ] );
  $supported_social_login = $loader->object->core_setting->get( "supported_social_logins" );
  $target_name = $loader->nest->user_input( "get", "target", "in_array", [ "values" => array_keys( $supported_social_login ) ] );

  if ( !$target_name )
  return;

  $target_slang = $supported_social_login[ $target_name ][ "slang" ];
  $target_enabled = $loader->object->db_setting->get( "sl_{$target_slang}" );

  if ( !$target_enabled )
  return;

  $target_id = $loader->object->db_setting->get( "sl_{$target_slang}_id" );
  $target_secret = $loader->object->db_setting->get( "sl_{$target_slang}_secret" );

  if ( !$target_id || !$target_secret )
  return;

  if ( $alert ){

    echo '
    <style>
    .btn {
      display: inline-block;
      /* background: #000; */
      border: 1px solid rgb(0 0 0 / 23%);
      color: #4a4a4a;
      padding: 10px 15px;
      border-radius: 10px;
      font-size: 90%;
      cursor: pointer;
      width: auto;
      line-height: 1;
      position: relative;
      text-transform: capitalize;
      margin: 0 30px;
      display: block;
      font-weight: 600;
      transition: 200ms ease all;
      text-decoration: none
    }

    .btn:hover {
      border-color: rgb(0 0 0 / 53%);
      color: #000;
    }
    </style>
    <div style="
    font-family: sans-serif;
    max-width: 400px;
    margin: 0 auto;
    ">

    <div style="
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    text-align: center;
    border-bottom: 1px solid rgba(0,0,0,0.2);
    color: rgba(0,0,0,0.4);
    padding: 5px 0;
    ">'.bof()->object->language->turn( "social_login", [], [ "uc_first" => true, "lang" => "users" ] ).'</div>
    <div style="
    margin-top: 20vh;
    text-align: center;
    font-size: 180%;
    margin-bottom: 10vh;
    ">'.bof()->object->language->turn( "social_login_direct", [ "target_name" => ucfirst($target_name) ], [ "uc_first" => true, "lang" => "users" ] ).'</div>
    <div style="
    font-size: 90%;
    font-weight: 600;
    ">'.bof()->object->language->turn( "social_login_need", [], [ "uc_first" => true, "lang" => "users" ] ).':</div>
    <ul style="
    margin: 30px 0;
    ">
    <li style="
    /* margin-bottom: 15px; */
    ">'.bof()->object->language->turn( "social_login_mail", [], [ "uc_first" => true, "lang" => "users" ] ).'</i></li>';

    if ( $target_slang == "gg" ? $loader->object->db_setting->get("sl_gg_extra") : false)
    echo '<li style="
    margin-top: 20px;
    ">'.bof()->object->language->turn( "social_login_ytlike", [ "sitename" => $loader->object->db_setting->get("sitename") ], [ "uc_first" => true, "lang" => "users" ] ).'</li>';

    echo '</ul>
    <div style="
    font-size: 80%;
    line-height: 1;
    /* opacity: 0.6; */
    ">'.bof()->object->language->turn( "social_login_revoke", [ "target_name" => ucfirst($target_name) ], [ "uc_first" => true, "lang" => "users" ] ).'</div>
    <div style="
    text-align: center;
    margin-top: 30px;
    "><a class="btn" href="login_social_ini?target='.$target_name.'&confirm=true">'.bof()->object->language->turn( "continue", [], [ "uc_first" => true, "lang" => "users" ] ).'</a></div>

    </div>
    ';
    die;

  }

  $loader->social_login->ini( $target_name, $target_id, $target_secret );

}

?>
