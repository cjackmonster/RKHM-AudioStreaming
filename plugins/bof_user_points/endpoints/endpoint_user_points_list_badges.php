<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_user_points_list_badges( $loader, $excuter, $args ){

  $hash = bof()->nest->user_input( "post", "hash", "md5" );

  if ( $hash ){
    $getUser = bof()->object->user->select(["hash"=>$hash]);
    if ( $getUser ){
      $badges = bof()->object->up_badge->select(
        array(
          "rel_user" => $getUser["ID"]
        ),
        array(
          "single" => false,
          "limit" => false,
          "order_by" => "priority",
          "order" => "ASC",
          "cleaner" => function( $item ){

            $name = $item["name"];
            $detail = $item["detail"];

            $lang = bof()->user->check()->language;
            if ( !empty( $item["translations_decoded"]["name_{$lang}"] ) )
            $name = $item["translations_decoded"]["name_{$lang}"];
            if ( !empty( $item["translations_decoded"]["detail_{$lang}"] ) )
            $detail = $item["translations_decoded"]["detail_{$lang}"];

            $icon = '<div class="user_name_wrapper"><div class="badges">' . bof()->object->up_badge->_bth( $item ) . "</div></div>";
            $html = "<div class='fBw'>{$icon}<span class='_nd'><span class='_n'>{$name}</span>";
            if ( $item["detail"] ) $html .= "<span class='_d'>{$detail}</span>";
            $html .= "</span></div>";
            return $html;
          }
        )
      );
      $loader->api->set_message( "ok", [ "badges" => $badges ] );
      return;
    }
  }

}

?>
