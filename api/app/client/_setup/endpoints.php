<?php

if ( !defined( "root" ) || !defined( "bof_root" ) ) die;

// Global
bof()->object->endpoint->add( "404", array(
  "response_type" => "json",
  "response_data" => array(
    "message" => "404"
  ),
) );
bof()->object->endpoint->add( "no_access", array(
  "response_type" => "json",
  "response_data" => array(
    "message" => "403"
  ),
) );
bof()->object->endpoint->add( "client_config", array(
  "url" => "client_config",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/endpoint_client_config.php"
  )
) );
bof()->object->endpoint->add( "client_translations", array(
  "url" => "client_translations",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/endpoint_client_translations.php"
  )
) );
bof()->object->endpoint->add( "user_subs", array(
  "url" => "user_subs",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_subs.php"
  )
) );
bof()->object->endpoint->add( "change_language", array(
  "url" => "change_language",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/endpoint_change_language.php"
  )
) );
bof()->object->endpoint->add( "change_currency", array(
  "url" => "change_currency",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/endpoint_change_currency.php"
  )
) );
bof()->object->endpoint->add( "share", array(
  "url" => "share",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/endpoint_share.php"
  )
) );
bof()->object->endpoint->add( "payment_result_check", array(
  "url" => array(
    "regex" => "/^payment_result_check\/([a-zA-Z0-9\-_]){3,20}\/([a-zA-Z0-9\-_]){12}\/([a-zA-Z0-9\-_]){32}\/$/"
  ),
  "executers" => array(
    root . "/app/client/endpoints/endpoint_payment_check.php"
  ),
  "response_type" => "html",
  "response_data" => array(
  )
) );
bof()->object->endpoint->add( "email_unsubscribe", array(
  "url" => "email_unsubscribe",
  "executers" => array(
    root . "/app/client/endpoints/endpoint_email_unsubscribe.php"
  ),
  "response_type" => "html",
  "response_data" => array(
  )
) );
bof()->object->endpoint->add( "get_ads", array(
  "url" => "get_the_thingie",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/endpoint_get_ads.php"
  )
) );
bof()->object->endpoint->add( "view_bio", array(
  "url" => "view_bio",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/endpoint_view_bio.php"
  )
) );
bof()->object->endpoint->add( "click_ads", array(
  "url" => array(
    "regex" => "/^redirect_to\/([0-9]){1,6}\/$/"
  ),
  "executers" => array(
    root . "/app/client/endpoints/endpoint_click_ads.php"
  ),
  "response_type" => "html",
  "response_data" => array()
) );
bof()->object->endpoint->add( "bofInput", array(
  "skip_key_check" => true,
  "url" => array(
    "regex" => "/^bofInput\/([a-zA-Z0-9\-_]){1,20}\/$/"
  ),
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/bofAdmin/endpoint_bofInput.php"
  )
) );

// Guests
bof()->object->endpoint->add( "user_auth", array(
  "url" => "user_auth",
  "groups" => [ "guest" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_auth.php"
  )
) );
bof()->object->endpoint->add( "login_social_ini", array(
  "url" => "login_social_ini",
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_login_social_ini.php"
  ),
  "response_type" => "html",
  "response_data" => array(
  )
) );
bof()->object->endpoint->add( "login_social_get", array(
  "url" => "login_social_get",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_login_social_get.php"
  ),
) );

// Content
bof()->object->endpoint->add( "bofClient_list", array(
  "url" => array(
    "regex" => "/^bofClient\/list\/([a-zA-Z0-9\-_]){1,20}\/$/"
  ),
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/bofClient/endpoint_bofClient_list.php"
  )
) );
bof()->object->endpoint->add( "bofClient_browse", array(
  "url" => array(
    "regex" => "/^bofClient\/browse\/([a-zA-Z0-9\-_]){1,20}\/$/"
  ),
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/bofClient/endpoint_bofClient_browse.php"
  )
) );
bof()->object->endpoint->add( "bofClient_single", array(
  "url" => array(
    "regex" => "/^bofClient\/single\/([a-zA-Z0-9\-_]){1,20}\/$/",
    "function" => function( $url ){
      $slug = bof()->nest->user_input( "get", "slug", "string" );
      return $slug ? $slug : true;
    }
  ),
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/bofClient/endpoint_bofClient_single.php"
  )
) );
bof()->object->endpoint->add( "bofClient_buttons", array(
  "url" => array(
    "regex" => "/^bofClient\/buttons\/([a-zA-Z0-9\-_]){1,20}\/$/"
  ),
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/bofClient/endpoint_bofClient_buttons.php"
  )
) );
bof()->object->endpoint->add( "search", array(
  "url" => "search",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/endpoint_search.php"
  )
) );
bof()->object->endpoint->add( "searchSuggs", array(
  "url" => "searchSuggs",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/endpoint_searchSuggs.php"
  )
) );
bof()->object->endpoint->add( "searchSubmit", array(
  "url" => "searchSubmit",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/endpoint_searchSubmit.php"
  )
) );
bof()->object->endpoint->add( "external_music", array(
  "url" => "external_music",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/endpoint_external_music.php"
  )
) );

// Muse
bof()->object->endpoint->add( "muse_stream_heads", array(
  "url" => "muse_stream_heads",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/muse/endpoint_muse_stream_heads.php"
  )
) );
bof()->object->endpoint->add( "muse_request_source", array(
  "url" => "muse_request_source",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/muse/endpoint_muse_request_source.php"
  )
) );
bof()->object->endpoint->add( "muse_request_download", array(
  "url" => "muse_request_download",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/muse/endpoint_muse_request_download.php"
  )
) );
bof()->object->endpoint->add( "muse_unlock_solution", array(
  "url" => "muse_unlock_solution",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/muse/endpoint_muse_unlock_solution.php"
  )
) );

bof()->object->endpoint->add( "muse_solve_raaz", array(
  "url" => "muse_solve_raaz",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/muse/endpoint_muse_solve_raaz.php"
  )
) );

bof()->object->endpoint->add( "muse_check_focus_status", array(
  "url" => "muse_check_focus_status",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/muse/endpoint_muse_check_focus_status.php"
  )
) );
bof()->object->endpoint->add( "muse_record", array(
  "url" => "muse_record",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/muse/endpoint_muse_record.php"
  )
) );
bof()->object->endpoint->add( "muse_infinite", array(
  "skip_key_check" => true,
  "url" => "muse_infinite",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/muse/endpoint_muse_infinite.php"
  )
) );
bof()->object->endpoint->add( "muse_fetch_lyrics", array(
  "skip_key_check" => true,
  "url" => "muse_fetch_lyrics",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/muse/endpoint_muse_fetch_lyrics.php"
  )
) );
bof()->object->endpoint->add( "muse_report", array(
  "url" => "muse_report",
  "groups" => [ "api" ],
  "executers" => array(
    root . "/app/client/endpoints/muse/endpoint_muse_report.php"
  )
) );
bof()->object->endpoint->add( "muse_embed", array(
  "url" => "muse_embed",
  "url" => array(
    "regex" => "/^muse_embed\/([a-z_]{1,30})\/([a-zA-Z0-9\-_]{32})\/$/"
  ),
  "executers" => array(
    root . "/app/client/endpoints/muse/endpoint_muse_embed.php"
  ),
  "response_type" => "html",
  "response_data" => []
) );
bof()->object->endpoint->add( "muse_preview_no_ff", array(
  "url" => "muse_preview_no_ff",
  "executers" => array(
    root . "/app/client/endpoints/muse/endpoint_muse_preview_no_ff.php"
  ),
  "response_type" => "json",
) );

// User
bof()->object->endpoint->add( "playlist_extend", array(
  "url" => "playlist_extend",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_playlist_extend.php"
  )
) );
bof()->object->endpoint->add( "playlist_create", array(
  "url" => "playlist_create",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_playlist_create.php"
  )
) );
bof()->object->endpoint->add( "playlist_remove", array(
  "url" => "playlist_remove",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_playlist_remove.php"
  )
) );
bof()->object->endpoint->add( "playlist_edit_ini", array(
  "url" => "playlist_edit_ini",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_playlist_edit_ini.php"
  )
) );
bof()->object->endpoint->add( "playlist_edit", array(
  "url" => "playlist_edit",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_playlist_edit.php"
  )
) );
bof()->object->endpoint->add( "playlist_keep", array(
  "url" => "playlist_keep",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_playlist_keep.php"
  )
) );
bof()->object->endpoint->add( "playlist_lose", array(
  "url" => "playlist_lose",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_playlist_lose.php"
  )
) );
bof()->object->endpoint->add( "playlist_shorten", array(
  "url" => "playlist_shorten",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_playlist_shorten.php"
  )
) );
bof()->object->endpoint->add( "like", array(
  "url" => "like",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_like.php"
  )
) );
bof()->object->endpoint->add( "unlike", array(
  "url" => "unlike",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_unlike.php"
  )
) );
bof()->object->endpoint->add( "subscribe", array(
  "url" => "subscribe",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_subscribe.php"
  )
) );
bof()->object->endpoint->add( "unsubscribe", array(
  "url" => "unsubscribe",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_unsubscribe.php"
  )
) );
bof()->object->endpoint->add( "purchase", array(
  "url" => "purchase",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_purchase.php"
  )
) );
bof()->object->endpoint->add( "purchase_subs_plan", array(
  "url" => "purchase_subs_plan",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_purchase_subs_plan.php"
  )
) );
bof()->object->endpoint->add( "cancel_subs_plan", array(
  "url" => "cancel_subs_plan",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/UGC/endpoint_cancel_subs_plan.php"
  )
) );
bof()->object->endpoint->add( "user_library", array(
  "url" => "user_library",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_library.php"
  )
) );
bof()->object->endpoint->add( "user_verify", array(
  "url" => "user_verify",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_verify.php"
  )
) );
bof()->object->endpoint->add( "user_edit", array(
  "url" => "user_edit",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_edit.php"
  )
) );
bof()->object->endpoint->add( "user_logout", array(
  "url" => "user_logout",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_logout.php"
  )
) );
bof()->object->endpoint->add( "user_pay_ini", array(
  "url" => "user_pay_ini",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_pay_ini.php"
  )
) );
bof()->object->endpoint->add( "user_withdrawal_ini", array(
  "url" => "user_withdrawal_ini",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_withdrawal_ini.php"
  )
) );
bof()->object->endpoint->add( "user_withdrawal", array(
  "url" => "user_withdrawal",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_withdrawal.php"
  )
) );
bof()->object->endpoint->add( "user_pay_get_link", array(
  "url" => "user_pay_get_link",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_pay_get_link.php"
  )
) );
bof()->object->endpoint->add( "user_upload_config", array(
  "url" => "user_upload_config",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_upload_config.php"
  )
) );
bof()->object->endpoint->add( "user_upload_verify_sources", array(
  "url" => "user_upload_verify_sources",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_upload_verify_sources.php"
  )
) );
bof()->object->endpoint->add( "user_upload_verify_group", array(
  "skip_key_check" => true,
  "url" => "user_upload_verify_group",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_upload_verify_group.php"
  )
) );
bof()->object->endpoint->add( "user_upload_submit", array(
  "skip_key_check" => true,
  "url" => "user_upload_submit",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_upload_submit.php"
  )
) );
bof()->object->endpoint->add( "user_edit_single_item_ini", array(
  "url" => "user_edit_single_item_ini",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_edit_single_item_ini.php"
  )
) );
bof()->object->endpoint->add( "user_edit_single_item_rem", array(
  "url" => "user_edit_single_item_rem",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_edit_single_item_rem.php"
  )
) );
bof()->object->endpoint->add( "user_edit_single_item", array(
  "url" => "user_edit_single_item",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_edit_single_item.php"
  )
) );
bof()->object->endpoint->add( "user_push_register", array(
  "url" => "user_push_register",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_push_register.php"
  )
) );
bof()->object->endpoint->add( "user_chapar", array(
  "url" => "user_chapar",
  "groups" => [ "user" ],
  "executers" => array(
    root . "/app/client/endpoints/user/endpoint_user_chapar.php"
  )
) );

bof()->endpoint->set_landing( "no_access" );
bof()->endpoint->set_404( "no_access" );

?>
