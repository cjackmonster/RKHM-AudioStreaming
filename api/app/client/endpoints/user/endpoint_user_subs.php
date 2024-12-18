<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_user_subs( $loader, $excuter, $args ){

  $plans = $loader->object->user_subs_plan->select(
    array(
      "active" => 1
    ),
    array(
      "single" => false,
      "limit" => false,
      "public" => true,
      "order_by" => "priority",
      "select_cleaner" => function( $items, $loader ){

        $new_items = [];
        foreach( $items as $item ){

          if ( empty( $item["_prices"]["min"] ) && empty( $item["free"] ) ) continue;

          $item = array(
            "name" => $item["name"],
            "comment" => $item["comment"],
            "periods" => !empty( $item["_prices"]["original"] ) ? array_keys( $item["_prices"]["original"] ) : null,
            "period_first" => !empty( $item["_prices"]["original"] ) ? array_keys( $item["_prices"]["original"] )[0] : null,
            "prices" => $item["_prices"],
            "hash" => $item["hash"],
            "discount" => $item["discount"],
            "html" => $item["detail_html"],
          );

          $new_items[ $item["hash"] ] = $item;

        }

        if ( ( $reqed_plan_k = $loader->nest->user_input( "get", "plan", "md5" ) ) ){
          if ( in_array( $reqed_plan_k, array_keys( $new_items ), true ) ){
            $reqed_plan = $new_items[ $reqed_plan_k ];
            unset( $new_items[ $reqed_plan_k ] );
            $new_items = array_merge( [ $reqed_plan_k => $reqed_plan ], $new_items );
          }
        }

        return $new_items;

      }
    )
  );

  if ( !$plans )
  return;

  $loader->api->set_message( "ok", array(
    "plans" => $plans,
    "plans_count" => count( $plans ),
    "seo" => array(
      "title" => bof()->object->language->turn( "user_subs_plan", [], [ "uc_first" => true, "lang" => "users" ] )
    )
  ) );

}

?>
