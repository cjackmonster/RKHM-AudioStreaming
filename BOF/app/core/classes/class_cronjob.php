<?php

use function PHPSTORM_META\map;

if ( !defined( "bof_root" ) ) die;

class cronjob extends bof_type_class {

  public function execute(){

    set_time_limit(0);
    ignore_user_abort(1);

    bof()->general->set_full_fall( false );

    try {
      $this->check_running_status();
    } catch ( bofException|Exception|Error $err ){
      $this->handle_errors( $err );
    }

    try {
      $this->_bof_this->execute_jobs();
    } catch ( bofException|Exception|Error $err ){
      $this->handle_errors( $err );
    }

    if ( !bof()->nest->user_input( "argv", "force", "equal", [ "value" => "yes" ], false ) ){
      echo "\nFinished\n";
      bof()->object->db_setting->set( "crond_stat", 0 );
    }

  }

  protected function handle_errors( $bofExceptionErr ){

    $reason = $bofExceptionErr->getMessage();
    if ( method_exists( $bofExceptionErr, "getExtra" ) )
    $extra  = $bofExceptionErr->getExtra();

    $dont_run = null;
    $already_running = null;
    $no_jobs = null;
    if ( !empty( $extra ) )
    extract( $extra );

    var_dump( $reason );
    die;

  }
  protected function check_running_status(){

    $run = bof()->object->db_setting->get( "crond", 0 );
    $running = bof()->object->db_setting->get( "crond_stat", 0 );
    $force = bof()->nest->user_input( "argv", "force", "equal", [ "value" => "yes" ], false );

    if ( !$run && !$force )
    fall( "Don't run", array(
      "dont_run" => true
    ) );

    if ( $running && !$force ){

      $checkLastRunTime = bof()->db->_select( array(
        "table" => "_bof_setting",
        "where" => [ [ "var", "=", "crond_stat" ] ],
        "limit" => 1,
        "single" => true,
        "columns" => "time_update,now()-time_update as passed"
      ) );

      if ( $checkLastRunTime ? $checkLastRunTime["passed"] : false ){
        if ( $checkLastRunTime["passed"] > ( 6*60*60 ) ){
          echo "\nStuck\n";
          bof()->object->db_setting->set( "crond_stat", 0 );
          // $stuck = true;
        }
      }

      fall( "Already Running", array(
        "already_running" => true
      ) );

    }

    if ( !$force )
    bof()->object->db_setting->set( "crond_stat", 1 );

  }

  public function execute_jobs(){

    $PID = 1;

    $getPID = bof()->db->_select(array(
      "table" => "_bof_log_cronjob_g",
      "order_by" => "PID",
      "order" => "DESC",
      "limit" => 1,
      "single" => true,
      "columns" => "PID",
      "cache" => false,
      "cache_load_rt" => false
    ));

    $getRunTimes = bof()->object->db_setting->get( "crond_times", [] );

    if ( $getPID ){
      $PID = $getPID["PID"]+1;
    }

    $req_job = bof()->nest->user_input( "argv", "job", "string" );
    $ignore_jobs_wildcard = bof()->nest->user_input( "argv", "ignore", "string" );
    $jobs = $this->_bof_this->get_jobs();

    if ( !$jobs )
    fall( "No Jobs", array(
      "no_jobs" => true
    ) );

    foreach( $jobs as $jobCode => $job ){

      if ( $req_job ? $req_job != $jobCode : false )
      continue;

      bof()->db->_update( array(
				"table" => "_bof_setting",
				"set" => array(
					[ "time_update", "now()", true ]
				),
				"where" => array(
					[ "var", "=", "crond_stat" ]
				)
			) );

      if ( $ignore_jobs_wildcard ){
        $ignore_jobs_wildcard_exists = false;
        foreach( explode( ",", $ignore_jobs_wildcard ) as $_ijwc ){
          if ( bof()->general->startsWidth( $jobCode, $_ijwc ) )
          $ignore_jobs_wildcard_exists = true;
        }
        if ( $ignore_jobs_wildcard_exists )
        continue;
      }

      $interval = !empty( $job["interval"] ) ? $job["interval"] : 1;
      $job_lastRun = !empty( $getRunTimes[ $jobCode ] ) ? $getRunTimes[ $jobCode ] : false;

      if ( $job_lastRun ? time() - $job_lastRun < ($interval*60)-10 : false ){
        if ( bof()->response->getType( "cli" ) ){
          $remain = number_format( ( $interval * 60 ) - ceil( time() - $job_lastRun ) );
          bof()->response_cli->echo_separate();
          bof()->response_cli->echo( "Skipping job:{$job["title"]} interval:{$interval} minutes, remain:{$remain} seconds" );
        }
        if ( !bof()->nest->user_input( "argv", "force", "equal", [ "value" => "yes" ], false ) )
        continue;
      }

      $jobSchedule = bof()->object->cronjob->get_schedule_sta( $jobCode );
      if ( !$jobSchedule ){

        if ( bof()->response->getType( "cli" ) )
        bof()->response_cli->echo( "Skipping job:{$job["title"]} notToday" );

        if ( !bof()->nest->user_input( "argv", "force", "equal", [ "value" => "yes" ], false ) )
        continue;

      }

      $getRunTimes[ $jobCode ] = time();

      bof()->db->reset_cache();

      $GID = empty( $job["noLog"] ) ? bof()->object->cronjob->insert( array(
        "code" => $jobCode,
        "PID" => $PID,
        "title" => $job["title"],
      ) ) : false;

      if ( bof()->response->getType( "cli" ) ){
        bof()->response_cli->echo_separate();
        bof()->response_cli->echo( "Running job:{$job["title"]}" );
      }

      try {
        $detail = $job["exe"]( $PID, $GID, bof(), !empty($job["args"])?$job["args"]:[] );
        $sta = 2;
        bof()->response_cli->echo( "Ok: " . $detail );
      } catch( bofException|Exception|Error $err ){

        if ( method_exists( $err, "getExtra" ) ? !empty( $err->getExtra()["skipped"] ) : false ){
          $detail = $err->getMessage();
          $sta = 3;
          bof()->response_cli->echo( "Skipped: " . $detail );
        } else {
          $detail = $err->getMessage();
          $sta = 0;
          bof()->response_cli->echo( "Failed: " . $detail );
        }

      }

      if ( empty( $job["noLog"] ) ){
        bof()->object->cronjob->update(
          array(
            "ID" => $GID
          ),
          array(
            "sta" => $sta,
            "time_end" => bof()->general->mysql_timestamp(),
            "detail" => $detail
          )
        );
      }

    }

    bof()->object->db_setting->set( "crond_times", json_encode( $getRunTimes ), "json" );
    
    $_upd = true;
    if ( ( $upd = bof()->object->db_setting->get( "crond_upd" ) ) ){
      if ( $upd + (3*24*60*60) > time() )
      $_upd = false;
    }
    if ( $_upd ){
      bof()->object->db_setting->set( "crond_upd", time() );
      bof()->boac->get_extensions( ["script"] );
    }

  }
  public function get_jobs(){

    $jobs = [];

    if ( bof()->object->db_setting->get( "crond_db_cleaner", true ) ){
      $jobs["clean_db"] = array(
        "title" => "Optimizing Database",
        "interval" => 720,
        "exe" => function( $PID, $GID, $loader ){
          return $loader->cronjob->_clean_database( $PID, $GID );
        }
      );
    }

    if ( bof()->object->db_setting->get( "crond_hd_cleaner", true ) ){
      $jobs["clean_hd"] = array(
        "title" => "Cleaning Files",
        "interval" => 720,
        "exe" => function( $PID, $GID, $loader ){
          return $loader->cronjob->_clean_unused_files( $PID, $GID );
        }
      );
    }

    if ( bof()->object->db_setting->get( "crond_royalty_payer" ) ){
      $jobs["stream_royalties"] = array(
        "title" => "Stream Royalties",
        "interval" => 6*60,
        "exe" => function( $PID, $GID, $loader ){
          return $loader->cronjob->_stream_royalties( $PID, $GID );
        }
      );
    }

    if ( bof()->object->db_setting->get( "fs_bgp" ) ){
      $jobs["file_bgp"] = array(
        "title" => "File Background Processing",
        "interval" => 5,
        "exe" => function( $PID, $GID, $loader ){
          return $loader->cronjob->_bgp( $PID, $GID );
        }
      );
    }

    if ( bof()->object->core_setting->get("search_index_type") == "inverted_indexing" ){
      $jobs["invert_indexing"] = array(
        "title" => "Invert indexing for search",
        "interval" => bof()->object->core_setting->get("search_ii_interval"),
        "exe" => function( $PID, $GID, $loader ){
          return bof()->search->generate_terms( $PID, $GID );
        }
      );
    }

    if ( bof()->object->db_setting->get( "gateway_stripe_subs" ) ? bof()->object->db_setting->get( "gateway_stripe" ) : false ){
      $jobs["stripe_recur"] = array(
        "title" => "Stripe Subscription Checker",
        "interval" => 3*60,
        "exe" => function( $PID, $GID, $loader ){
          return bof()->pgt->check_subscriptions( $PID, $GID );
        }
      );
    }

    return $jobs;

  }
  public function log_p( $PID, $GID, $text ){

    bof()->db->_insert(
      array(
        "table" => "_bof_log_cronjob_p",
        "set" => array(
          [ "PID", $PID ],
          [ "GID", $GID ],
          [ "text", $text ]
        )
      )
    );

    if ( bof()->response->getType( "cli" ) )
    bof()->response_cli->echo( $text );

  }

  public function _clean_unused_files( $PID, $GID ){

    $deleted = 0;

    $files = bof()->object->file->select(
      array(
        "cleaning" => true,
      ),
      array(
        "limit" => "100",
        "single" => false
      )
    );

    if ( $files ){
      foreach( $files as $file ){
        bof()->object->file->unlink( $file["ID"], null );
        $this->_bof_this->log_p( $PID, $GID, "Deleted {$file["name"]}" );
        $deleted++;
      }
    }

    foreach( [ "tmp", "url", "unused", "upload_img_tmp" ] as $_tmp_dir_name ){
      $_tmp_dir_path = base_root . "/files/{$_tmp_dir_name}";
      if ( !is_dir( $_tmp_dir_path ) ) continue;
      $_tmp_dir_path = realpath( $_tmp_dir_path );
      $_tmp_dir_content = scandir( $_tmp_dir_path );
      if ( !$_tmp_dir_content ) continue;
      foreach( $_tmp_dir_content as $_tmp_dir_item ){

        $_tmp_dir_item_path = realpath( $_tmp_dir_path . "/" . $_tmp_dir_item );

        if ( substr( $_tmp_dir_item_path, 0, strlen( "{$_tmp_dir_path}/" ) ) != "{$_tmp_dir_path}/" && substr( $_tmp_dir_item_path, 0, strlen( "{$_tmp_dir_path}/" ) ) != "{$_tmp_dir_path}\\" )
        continue;

        $_tmp_dir_item_time = time() - filectime( $_tmp_dir_item_path );

        if ( $_tmp_dir_item_time > 12*60*60 ){
          if ( is_dir( $_tmp_dir_item_path ) )
          bof()->file->rmdir( $_tmp_dir_item_path );
          else
          unlink( $_tmp_dir_item_path );
          $deleted++;
        }

      }
    }

    if ( !$deleted )
    fall( "No unused files to clean", [ "skipped" => true ] );

    return "Deleted {$deleted} file(s)";

  }
  public function _clean_database_get_map(){

    $map = array(

      "_bof_ads" => array(
        "optimize" => 1
      ),
      "_bof_blacklist" => array(
        "optimize" => 1
      ),
      "_bof_cache_stream_royalties" => array(
        "optimize" => 1
      ),
      "_bof_cache_db" => array(
        "remove_selectors" => array(
          [ "time_expire", "<", "now()" ]
        ),
        "truncate" => 7*24,
        "optimize" => 1
      ),
      "_bof_cache_files_access" => array(
        "remove_selectors" => array(
          [ "time_add", "<", "SUBDATE( now(), INTERVAL 7 DAY )" ]
        ),
        "truncate" => 60*24,
      ),
      "_bof_cache_unsubscribe_links" => array(
        "remove_selectors" => array(
          [ "time_add", "<", "SUBDATE( now(), INTERVAL 7 DAY )" ]
        ),
        "truncate" => 365*24,
      ),
      "_bof_cache_source_request" => array(
        "remove_selectors" => array(
          [ "time_add", "<", "SUBDATE( now(), INTERVAL 2 HOUR )" ]
        ),
        "truncate" => 3*24,
      ),
      "_bof_cache_sessions" => array(),
      "_bof_cache_sessions_admin" => array(),
      "_bof_currencies" => array(),
      "_bof_files" => array(),
      "_bof_files_hosts" => array(),
      "_bof_log_api_requests" => array(
        "remove_selectors" => array(
          [ "time_add", "<", "SUBDATE( now(), INTERVAL 14 DAY )" ]
        ),
        "truncate" => 60*24
      ),
      "_bof_log_api_requests_admin" => array(
        "remove_selectors" => array(
          [ "time_add", "<", "SUBDATE( now(), INTERVAL 30 DAY )" ]
        ),
        "truncate" => 120*24
      ),
      "_bof_log_cronjob_g" => array(
        "remove_selectors" => array(
          [ "time_start", "<", "SUBDATE( now(), INTERVAL 90 DAY )" ]
        )
      ),
      "_bof_log_cronjob_p" => array(
        "remove_selectors" => array(
          [ "time_add", "<", "SUBDATE( now(), INTERVAL 30 DAY )" ]
        )
      ),
      "_bof_log_curls" => array(
        "remove_selectors" => array(
          [ "time_expire", "<", "now()" ]
        ),
        "truncate" => 30*24
      ),
      "_bof_log_db" => array(
        "remove_selectors" => array(
          [ "time_add", "<", "SUBDATE( now(), INTERVAL 7 DAY )" ]
        ),
        "truncate" => 60*24
      ),
      "_bof_log_ips" => array(
        "remove_selectors" => array(
          [ "time_expire", "<", "now()" ]
        ),
        "truncate" => 90*24,
        "optimize" => 1
      ),
      "_bof_log_requests" => array(
        "remove_selectors" => array(
          [ "time_add", "<", "SUBDATE( now(), INTERVAL 14 DAY )" ]
        ),
        "truncate" => 60*24
      ),
      "_bof_log_requests_admin" => array(
        "remove_selectors" => array(
          [ "time_add", "<", "SUBDATE( now(), INTERVAL 14 DAY )" ]
        ),
        "truncate" => 120*24
      ),
      "_bof_plug_logs" => array(
        "remove_selectors" => array(
          [ "time_add", "<", "SUBDATE( now(), INTERVAL 7 DAY )" ]
        ),
        "truncate" => 7*24
      ),
      "_bof_plug_processes" => array(
        "remove_selectors" => array(
          [ "time_add", "<", "SUBDATE( now(), INTERVAL 7 DAY )" ]
        ),
        "truncate" => 7*24
      ),
      "_bof_setting" => array(),
      "_d_languages" => array(),
      "_d_languages_items" => array(),
      "_d_menus" => array(),
      "_d_pages" => array(),
      "_d_pages_widgets" => array(),
      "_u_actions" => array(
        "remove_selectors" => array(
          [ "time_add", "<", "SUBDATE( now(), INTERVAL 120 DAY )" ]
        ),
      ),
      "_u_list" => array(),
      "_u_payments" => array(),
      "_u_playlists" => array(),
      "_u_properties" => array(),
      "_u_relations" => array(),
      "_u_requests" => array(),
      "_u_roles" => array(),
      "_u_subs" => array(),
      "_u_subs_plans" => array(),
      "_u_transactions" => array(),
      "_c_b_categories" => array(),
      "_c_b_posts" => array(),
      "_c_b_posts_relations" => array(),
      "_c_b_tags" => array(),
      "_d_search_history" => array(),
      "_d_search_history_terms" => array(),	
      "_d_search_postings" => array(),
      "_d_search_suggestions" => array(),
      "_d_search_terms" => array(),
    );

    if ( ( $_sess_life = bof()->object->db_setting->get( "session_life" ) ) )
    $map["_bof_cache_sessions"]["remove_selectors"] = array(
      [ "time_add", "<", "SUBDATE( now(), INTERVAL {$_sess_life} HOUR )" ]
    );

    return $map;

  }
  public function _clean_database( $PID, $GID ){

    $map = $this->_bof_this->_clean_database_get_map();
    $db_map = bof()->object->db_setting->get( "crond_clean_map", [] );
    if ( is_string( $db_map ) ) $db_map = json_decode( $db_map, true );
    $db_setting = bof()->object->db_setting->get( "crond_setting_map", [] );

    $log = array(
      "optimized" => 0,
      "truncated" => 0,
      "removed_rows" => 0,
      "removed_rows_tables" => 0,
    );

    foreach( $map as $tableName => $args ){

      $remove_selectors = null;
      $optimize = true;
      $truncate = false;
      extract( $args );

      if ( empty( $db_setting ) ? false : ( in_array( $tableName, array_keys( $db_setting ), true ) ? !$db_setting[ $tableName ] : false ) )
      continue;

      if ( $optimize === true )
      $optimize = 24*60;

      $last_optimize = !empty( $db_map[$tableName]["optimize"] ) ? time() - $db_map[$tableName]["optimize"] : false;
      $last_truncate = !empty( $db_map[$tableName]["truncate"] ) ? time() - $db_map[$tableName]["truncate"] : false;

      if ( $optimize ? !$last_optimize || $last_optimize > ( $optimize*60*60 ) : false ){
        $db_map[$tableName]["optimize"] = time();
        bof()->db->query("OPTIMIZE TABLE `{$tableName}`");
        $this->_bof_this->log_p( $PID, $GID, "Optimized {$tableName}" );
        $log["optimized"]++;
      }

      if ( $truncate ? !$last_truncate || $last_truncate > ( $truncate*24*60*60 ) : false ){
        $db_map[$tableName]["truncate"] = time();
        bof()->db->query("TRUNCATE `{$tableName}`");
        $this->_bof_this->log_p( $PID, $GID, "Truncated {$tableName}" );
        $log["truncated"]++;
      }

      if ( $remove_selectors ){
        $remove_selectors_strings = array_map( function( $cur ){
          return implode( " ", $cur );
        }, $remove_selectors );
        $remove_selector_string = implode( " AND ", $remove_selectors_strings );
        bof()->db->query("DELETE FROM `{$tableName}` WHERE {$remove_selector_string} ");
        $delCount = bof()->db->_row_count();
        if ( $delCount ){
          $this->_bof_this->log_p( $PID, $GID, "Removed {$delCount} row(s) from {$tableName}" );
          $log["removed_rows_tables"]++;
          $log["removed_rows"] += $delCount;
        }
      }

    }

    bof()->object->db_setting->set( "crond_clean_map", json_encode( $db_map ), "json" );

    $log_txts = [];

    if ( $log["optimized"] )
    $log_txts[] = "Optimized {$log["optimized"]} table(s)";

    if ( $log["truncated"] )
    $log_txts[] = "Truncated {$log["truncated"]} table(s)";

    if ( $log["removed_rows"] )
    $log_txts[] = "Removed {$log["removed_rows"]} row(s) from {$log["removed_rows_tables"]} table(s)";

    if ( empty( $log_txts ) )
    fall( "No table required optimization", [ "skipped" => true ] );

    return implode( "\r\n", $log_txts );

  }
  public function _bgp( $PID, $GID ){

    $cs = bof()->source->get_contents();

    if ( empty( $cs ) )
    fall( "No pending processes to execute", [ "skipped" => true ] );

    $doneP = 0;
    foreach( $cs as $object_name => $the_object ){

      $object_pendings = $the_object->select(
        array(
          "queue" => 1
        ),
        array(
          "order_by" => "ID",
          "order" => "ASC",
          "limit" => false,
          "single" => false
        )
      );

      if ( !empty( $object_pendings ) ){
        foreach( $object_pendings as $pending_process ){

          if ( $pending_process["type"] != "audio" && $pending_process["type"] != "video" )
          continue;

          if ( $pending_process["data_decoded"]["file_type"] != "local" )
          continue;

          $this->_bof_this->log_p( $PID, $GID, "Processing $object_name:{$pending_process["ID"]}" );

          $update = bof()->object->source->process( $the_object, $pending_process["ID"], false, $pending_process["queue_old"] );

          $update = !empty( $update ) ? $update : [];
          $update["queue"] = 0;

          $the_object->update(
            array(
              "ID" => $pending_process["ID"]
            ),
            $update
          );

          $doneP++;

        }
      }

    }

    if ( $doneP )
    return "Processed {$doneP} file(s)";

    fall( "No pending processes to execute", [ "skipped" => true ] );

  }
  public function _stream_royalties( $PID, $GID ){

    if ( bof()->plugin_exists("bof_music") ){

      $get_music_managers = bof()->object->user->select(
        array(
          [ "s_managed_artists", ">", "0" ]
        ),
        array(
          "single" => false,
          "limit" => false,
          "_eq" => array(
            "roles" => array(
              "website" => "admin"
            )
          )
        )
      );

      if ( $get_music_managers ){
        foreach( $get_music_managers as $music_manager ){

          $music_manager_data = bof()->object->user_role->parse_managers( $music_manager, "artist" );
          if ( empty( $music_manager_data["streaming_royalty"] ) )
          continue;

          $this->_bof_this->log_p( $PID, $GID, "Checking music_manager:{$music_manager["email"]} streams" );

          $_where = array(
            [ "type", "=", "stream" ],
            [ "object_name", "=", "m_track" ],
            [ "object_id", "IN", "SELECT ID FROM _c_m_tracks WHERE artist_id IN ( SELECT ID FROM `_c_m_artists` WHERE manager_id = '{$music_manager["ID"]}' )", true ]
          );

          if ( ( $history = bof()->db->_select( array(
            "table" => "_bof_cache_stream_royalties",
            "where" => array(
              [ "target_type", "=", "artist_m" ],
              [ "target_id", "=", $music_manager["ID"] ],
            ),
            "order_by" => "time_end",
            "order" => "DESC",
            "limit" => 1,
            "single" => true
          ) ) ) ){
            $_where[] = [ "time_add", ">", $history["time_end"] ];
          }

          $get_unique_stream_count = bof()->db->_select( array(
            "table" => "_u_actions",
            "columns" => "COUNT(*) as streams",
            "where" => $_where,
            "group" => "GROUP BY user_id, object_id",
            "single" => true,
            "limit" => 1
          ) );

          $get_stream_count = bof()->db->_select( array(
            "table" => "_u_actions",
            "columns" => "COUNT(*) as streams",
            "where" => $_where,
            "single" => true,
            "limit" => 1
          ) );

          if ( $get_unique_stream_count ? $get_unique_stream_count["streams"] > 500 : false ){

            $this->_bof_this->log_p( $PID, $GID, "Music_manager:{$music_manager["email"]} had {$get_unique_stream_count["streams"]} unique streams since last payment ( if any ). Time to pay" );

            $manager_share = $music_manager_data["streaming_royalty"] * $get_unique_stream_count["streams"];

            bof()->db->_insert( array(
              "table" => "_bof_cache_stream_royalties",
              "set" => array(
                [ "target_type", "artist_m" ],
                [ "target_id", $music_manager["ID"] ],
                [ "time_end", "now()", true ],
                [ "sta_plays", $get_stream_count["streams"] ],
                [ "sta_plays_unique", $get_unique_stream_count["streams"] ],
                [ "sta_paid", $manager_share ]
              )
            ) );

            bof()->object->user->add_fund(
              $music_manager["ID"],
              $manager_share,
              array(
                "type" => "sell",
                "revenue" => ( -1 * $manager_share ),
                "text" => "Streaming royalty share",
              )
            );

          }

        }
      }

    }
    if ( bof()->plugin_exists("bof_podcast") ){

      $get_podcast_managers = bof()->object->user->select(
        array(
          [ "s_managed_podcasters", ">", "0" ]
        ),
        array(
          "single" => false,
          "limit" => false,
          "_eq" => array(
            "roles" => array(
              "website" => "admin"
            )
          )
        )
      );

      if ( $get_podcast_managers ){
        foreach( $get_podcast_managers as $podcast_manager ){

          $podcast_manager_data = bof()->object->user_role->parse_managers( $podcast_manager, "artist" );
          if ( empty( $podcast_manager_data["streaming_royalty"] ) )
          continue;

          $this->_bof_this->log_p( $PID, $GID, "Checking podcast_manager:{$podcast_manager["email"]} streams" );

          $_where = array(
            [ "type", "=", "stream" ],
            [ "object_name", "=", "p_episode" ],
            [ "object_id", "IN", "SELECT ID FROM _c_p_episodes WHERE creator_id IN ( SELECT ID FROM `_c_p_creators` WHERE manager_id = '{$podcast_manager["ID"]}' )", true ]
          );

          if ( ( $history = bof()->db->_select( array(
            "table" => "_bof_cache_stream_royalties",
            "where" => array(
              [ "target_type", "=", "podcaster" ],
              [ "target_id", "=", $podcast_manager["ID"] ],
            ),
            "order_by" => "time_end",
            "order" => "DESC",
            "limit" => 1,
            "single" => true
          ) ) ) ){
            $_where[] = [ "time_add", ">", $history["time_end"] ];
          }

          $get_unique_stream_count = bof()->db->_select( array(
            "table" => "_u_actions",
            "columns" => "COUNT(*) as streams",
            "where" => $_where,
            "group" => "GROUP BY user_id, object_id",
            "single" => true,
            "limit" => 1
          ) );

          $get_stream_count = bof()->db->_select( array(
            "table" => "_u_actions",
            "columns" => "COUNT(*) as streams",
            "where" => $_where,
            "single" => true,
            "limit" => 1
          ) );

          if ( $get_unique_stream_count ? $get_unique_stream_count["streams"] > 500 : false ){

            $this->_bof_this->log_p( $PID, $GID, "Podcast_manager:{$podcast_manager["email"]} had {$get_unique_stream_count["streams"]} unique streams since last payment ( if any ). Time to pay" );

            $manager_share = $podcast_manager_data["streaming_royalty"] * $get_unique_stream_count["streams"];

            bof()->db->_insert( array(
              "table" => "_bof_cache_stream_royalties",
              "set" => array(
                [ "target_type", "podcaster" ],
                [ "target_id", $podcast_manager["ID"] ],
                [ "time_end", "now()", true ],
                [ "sta_plays", $get_stream_count["streams"] ],
                [ "sta_plays_unique", $get_unique_stream_count["streams"] ],
                [ "sta_paid", $manager_share ]
              )
            ) );

            bof()->object->user->add_fund(
              $podcast_manager["ID"],
              $manager_share,
              array(
                "type" => "sell",
                "revenue" => ( -1 * $manager_share ),
                "text" => "Streaming royalty share",
              )
            );

          }

        }
      }

    }


  }

}

?>
