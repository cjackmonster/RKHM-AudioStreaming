<?php

if ( !defined( "root" ) || !defined( "bof_root" ) ) die;

// CronRunner
bof()->object->endpoint->add( "bot", array(
  "url" => true,
  "response_type" => "cli",
  "comparators" => array(
    array(
      "userInput",
      array(
        "type" => "argv",
        "name" => "bof_cronjobs",
        "validator" => "equal",
        "validator_args" => array(
          "value" => "yes"
        )
      )
    ),
  ),
  "executers" => array(
    root . "/app/job_runner.php"
  )
) );

// All
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
    root . "/app/admin/endpoints/endpoint_client_config.php"
  )
) );

// Guests
bof()->object->endpoint->add( "login", array(
  "url" => "login",
  "groups" => [ "guest" ],
  "executers" => array(
    root . "/app/admin/endpoints/endpoint_login.php"
  )
) );

// General
bof()->object->endpoint->add( "check_version", array(
  "url" => "check_version",
  "groups" => [ "moderator" ],
  "executers" => array(
    root . "/app/admin/endpoints/endpoint_check_version.php"
  )
) );
bof()->object->endpoint->add( "highlights", array(
  "url" => "highlights",
  "groups" => [ "moderator" ],
  "executers" => array(
    root . "/app/admin/endpoints/endpoint_highlights.php"
  )
) );
bof()->object->endpoint->add( "stats", array(
  "url" => "stats",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/endpoint_stats.php"
  )
) );
bof()->object->endpoint->add( "dashboard_highlights", array(
  "url" => "dashboard_highlights",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/endpoint_dashboard_highlights.php"
  )
) );
bof()->object->endpoint->add( "ffmpeg_test", array(
  "url" => "ffmpeg_test",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/tests/endpoint_ffmpeg_test.php"
  )
) );
bof()->object->endpoint->add( "openai_test", array(
  "url" => "openai_test",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/tests/endpoint_openai_test.php"
  )
) );
bof()->object->endpoint->add( "youtube_test", array(
  "url" => "youtube_test",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/tests/endpoint_youtube_test.php"
  )
) );
bof()->object->endpoint->add( "storage_test", array(
  "url" => "storage_test",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/tests/endpoint_storage_test.php"
  )
) );
bof()->object->endpoint->add( "email_test", array(
  "url" => "email_test",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/tests/endpoint_email_test.php"
  )
) );
bof()->object->endpoint->add( "youtube_piped_test_instance", array(
  "url" => "youtube_piped_test_instance",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/tests/endpoint_youtube_piped_test_instance.php"
  )
) );

// PageBuilder
bof()->object->endpoint->add( "pageBuilder_widget_verify", array(
  "url" => "pageBuilder_widget_verify",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pageBuilder/endpoint_pageBuilder_widget_verify.php"
  )
) );
bof()->object->endpoint->add( "pageBuilder_widget_edit", array(
  "url" => "pageBuilder_widget_edit",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pageBuilder/endpoint_pageBuilder_widget_edit.php"
  )
) );
bof()->object->endpoint->add( "pageBuilder_widget_delete", array(
  "url" => "pageBuilder_widget_delete",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pageBuilder/endpoint_pageBuilder_widget_delete.php"
  )
) );
bof()->object->endpoint->add( "pageBuilder_widget_order", array(
  "url" => "pageBuilder_widget_order",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pageBuilder/endpoint_pageBuilder_widget_order.php"
  )
) );
bof()->object->endpoint->add( "pageBuilder_import", array(
  "url" => "pageBuilder_import",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pageBuilder/endpoint_pageBuilder_import.php"
  )
) );
bof()->object->endpoint->add( "pageBuilder_pre_design", array(
  "url" => "pageBuilder_pre_design",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pageBuilder/endpoint_pageBuilder_pre_design.php"
  )
) );


// MenuBuilder
bof()->object->endpoint->add( "menuBuilder_save_structure", array(
  "url" => "menuBuilder_save_structure",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/menuBuilder/endpoint_menuBuilder_save_structure.php"
  )
) );
bof()->object->endpoint->add( "menuBuilder_get_link", array(
  "url" => "menuBuilder_get_link",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/menuBuilder/endpoint_menuBuilder_get_link.php"
  )
) );
bof()->object->endpoint->add( "menuBuilder_get_inputs", array(
  "url" => "menuBuilder_get_inputs",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/menuBuilder/endpoint_menuBuilder_get_inputs.php"
  )
) );


// Pluger
bof()->object->endpoint->add( "plugin_list", array(
  "url" => "plugin_list",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pluger/endpoint_plugin_list.php"
  )
) );
bof()->object->endpoint->add( "extension", array(
  "url" => "extension",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pluger/endpoint_extension.php"
  )
) );
bof()->object->endpoint->add( "extension_process_exe", array(
  "url" => "extension_process_exe",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pluger/endpoint_extension_process_exe.php"
  )
) );
bof()->object->endpoint->add( "extension_process_logs", array(
  "url" => "extension_process_logs",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pluger/endpoint_extension_process_logs.php"
  )
) );
bof()->object->endpoint->add( "theme_list", array(
  "url" => "theme_list",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pluger/endpoint_theme_list.php"
  )
) );
bof()->object->endpoint->add( "theme_activate", array(
  "url" => "theme_activate",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pluger/endpoint_theme_activate.php"
  )
) );
bof()->object->endpoint->add( "extension_submit_ppc", array(
  "url" => "extension_submit_ppc",
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/pluger/endpoint_extension_submit_ppc.php"
  )
) );

// BofAdmin
bof()->object->endpoint->add( "bofAdmin_list", array(
  "url" => array(
    "regex" => "/^bofAdmin\/list\/([a-zA-Z0-9\-_]){1,20}\/$/"
  ),
  "groups" => [ "moderator" ],
  "executers" => array(
    root . "/app/admin/endpoints/bofAdmin/endpoint_bofAdmin_list.php"
  )
) );
bof()->object->endpoint->add( "bofAdmin_object", array(
  "url" => array(
    "regex" => "/^bofAdmin\/object\/([a-zA-Z0-9\-_]){1,20}\/$/"
  ),
  "groups" => [ "moderator" ],
  "executers" => array(
    root . "/app/admin/endpoints/bofAdmin/endpoint_bofAdmin_object.php"
  )
) );
bof()->object->endpoint->add( "bofAdmin_setting", array(
  "url" => array(
    "regex" => "/^bofAdmin\/setting\/([a-zA-Z0-9\-_]){1,20}\/$/"
  ),
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/bofAdmin/endpoint_bofAdmin_setting.php"
  )
) );
bof()->object->endpoint->add( "bofAdmin_stats", array(
  "url" => array(
    "regex" => "/^bofAdmin\/stats\/([a-zA-Z0-9\-_]){1,20}\/$/"
  ),
  "groups" => [ "admin" ],
  "executers" => array(
    root . "/app/admin/endpoints/bofAdmin/endpoint_bofAdmin_stats.php"
  )
) );

// BofInput
bof()->object->endpoint->add( "bofInput", array(
  "url" => array(
    "regex" => "/^bofInput\/([a-zA-Z0-9\-_]){1,20}\/$/"
  ),
  "groups" => [ "moderator" ],
  "executers" => array(
    root . "/app/admin/endpoints/bofAdmin/endpoint_bofInput.php"
  )
) );


bof()->endpoint->set_landing( "no_access" );
bof()->endpoint->set_404( "no_access" );

?>
