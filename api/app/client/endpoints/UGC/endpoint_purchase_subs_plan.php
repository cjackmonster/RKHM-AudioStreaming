<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_purchase_subs_plan( $loader, $excuter, $args ){

  $plan_hash = $loader->nest->user_input( "post", "hash", "md5" );
  $plan_period = $loader->nest->user_input( "post", "period", "in_array", [ "values" => [ "weekly", "monthly", "3months", "6months", "yearly", "2years" ] ] );

  if ( !$plan_hash || !$plan_period )
  return false;

  $plan = $loader->object->user_subs_plan->select(
    array(
      "hash" => $plan_hash,
      "active" => 1
    ),
    [ "purchase" => true, "purchase_check" => true, "_eq" => [ "cover" => [] ] ]
  );

  if ( empty( $plan ) )
  return false;

  if ( empty( $plan["_prices"] ) )
  return false;

  if ( !in_array( $plan_period, array_keys( $plan["_prices"]["final"] ), true ) )
  return false;

  $plan_period_price = $plan["_prices"]["final"][ $plan_period ];

  $plan["ot"] = "user_subs_plan";
  $plan["price_d"] = $plan_period_price;
  $plan["period"] = $plan_period;

  if ( bof()->object->db_setting->get( "gateway_stripe_subs" ) && bof()->object->db_setting->get( "gateway_stripe" ) ){
    try {
      $purchase_link = bof()->object->ugc_property->purchase_subs_plan_recurring( $plan );
    } catch( Exception $err ){
      $loader->api->set_error( "failed", [ "more" => bof()->object->language->turn( $err->getMessage() . "_tip", [], [ "lang" => "users" ] ) , "output_args" => [ "uc_first" => true ], "hook" => $err->getMessage() ] );
      return;
    }
    $loader->api->set_message( "success", [ "link" => $purchase_link, "output_args" => [ "uc_first" => true ], "hook" => "subscribe_link" ] );
    return;
  }

  try {
    $_rid = $loader->object->ugc_property->purchase( "user_subs_plan", $plan );
  } catch( Exception $err ){
    $loader->api->set_error( "failed", [ "more" => bof()->object->language->turn( $err->getMessage() . "_tip", [], [ "lang" => "users" ] ) , "output_args" => [ "uc_first" => true ], "hook" => $err->getMessage() ] );
    return;
  }

  bof()->user->save_session();
  $loader->api->set_message( "success", [ "more" => bof()->object->language->turn( "purchase_ok_tip", [], [ "lang" => "users" ] ) , "output_args" => [ "uc_first" => true ] ] );

}

?>
