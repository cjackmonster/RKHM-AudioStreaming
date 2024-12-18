<?php

define( "bof_installer", true );

require_once( bof_root . "/loader.php" );
$bof_instance = new BusyOwlFramework(array(
  "name" => "rkh_installer",
  "plugins" => array(
    "youtube" => [],
    "ffmpeg" => [],
    "google" => [],
    "social_login" => [],
    "id3" => []
  )
));

function bof(){
  global $bof_instance;
  return $bof_instance;
}

bof()->__setup();

// bof()->general->set_full_fall( false );
bof()->curl->set_args(array(
  "cache" => false,
  "cache_load" => false
));

class installer {

  public function __construct(){
  }

  public function detect_step(){

    $purchase_code_available = !empty( purchase_code );
    $database_cred_available = !empty( db_user );
    $setup_ready = $this->check_server() && isset( $_REQUEST["server"] );

    $step = 1;

    if ( $purchase_code_available && $database_cred_available && ( in_array( api_send_diagnostics, [ "basic", "none", "advanced" ], true ) || isset( $_REQUEST["all_done"] ) ) )
    $step = 7;

    elseif ( ( $purchase_code_available && $database_cred_available && $setup_ready ) || ( !empty( $_REQUEST["server_status"] ) ? $_REQUEST["server_status"] == "ok" : false ) )
    $step = 6;

    elseif ( ( $purchase_code_available && $database_cred_available ) || isset( $_REQUEST["database_imported"] ) )
    $step = 5;

    elseif ( $purchase_code_available || isset( $_REQUEST["purchase_code_validated"] ) )
    $step = 4;

    elseif ( isset( $_REQUEST["agree_with_terms"] ) && isset( $_REQUEST["confirmed_extensions"] ) && $this->check_extensions()["all_ready"] )
    $step = 3;

    elseif ( isset( $_REQUEST["agree_with_terms"] ) )
    $step = 2;

    return $step;

  }
  public function ui(){

    $step = $this->detect_step();
    $step_content = $this->step_ui( $step );

    $frame_html = file_get_contents( installer_root . "/template/frame.html" );
    $frame_html = str_replace( "%STEP%", $step, $frame_html );
    $frame_html = str_replace( "%RANDOM%", uniqid(), $frame_html );
    $frame_html = str_replace( "%STEP_HTML%", $step_content, $frame_html );
    die( $frame_html );

  }
  protected function step_ui( $i ){

    $step_html = file_get_contents( installer_root . "/template/step_{$i}.html" );
    $step_content = "";

    if ( $i == 2 ){
      $checkExtensions = $this->check_extensions();
      $step_content .= "<div class='extensions' data-all-ok='".($checkExtensions["all_ready"]?"ok":"nope")."'>";
      foreach( $checkExtensions["functions"] as $_eN => $_eE ){
        $step_content .= "<div class='extension'>
          <div class='name'>{$_eN}</div>
          <div class='sta ".($_eE?"ok":"nok")."'>".($_eE?"Enabled":"Not Enabled")."</div>
        </div>";
      }
      $step_content .= "</div>";
    }
    elseif ( $i == 5 ){

      try {
        $this->check_crond();
      } catch( bofException|Exception $err ){
        $check_crond_err = $err->getMessage();
      }

      try {
        $this->check_htaccess_files();
      } catch( bofException|Exception $err ){
        $check_htaccess_err = $err->getMessage();
      }

      try {
        $this->check_htaccess_work();
      } catch( bofException|Exception $err ){
        $check_htaccess2_err = $err->getMessage();
      }

      try {
        $valid_timezones = $this->check_timezone();
        foreach( $valid_timezones as $valid_timezone )
        $valid_timezones_options[] = "<option value='{$valid_timezone}'>{$valid_timezone}</option>";
      } catch( bofException|Exception $err ){
        $check_timezone_err = $err->getMessage();
      }

      $step_html = str_replace( "%CROND_STA_TEXT%", !empty( $check_crond_err ) ? "failed" : "ok", $step_html );
      $step_html = str_replace( "%CROND_COMMAND%", "php -f " . ( realpath( base_root . "/api/admin.php" ) . " bof_cronjobs=yes" ), $step_html );
      $step_html = str_replace( "%HTACCESS_STA_TEXT%", !empty( $check_htaccess_err ) ? "failed" : "ok", $step_html );
      $step_html = str_replace( "%HTACCESS2_STA_TEXT%", !empty( $check_htaccess2_err ) ? "failed" : "ok", $step_html );
      $step_html = str_replace( "%HTACCESS_ERROR%", !empty( $check_htaccess_err ) ? $check_htaccess_err : "", $step_html );
      $step_html = str_replace( "%HTACCESS2_ERROR%", !empty( $check_htaccess2_err ) ? $check_htaccess2_err : "", $step_html );
      $step_html = str_replace( "%TIMEZONE_STA_TEXT%", !empty( $check_timezone_err ) ? "failed" : "ok", $step_html );
      $step_html = str_replace( "%TIMEZONE_ERROR%", !empty( $check_timezone_err ) ? $check_timezone_err : "", $step_html );
      $step_html = str_replace( "%TIMEZONE_OPTIONS%", !empty( $valid_timezones_options ) ? implode( "", $valid_timezones_options ) : null, $step_html );

    }

    $step_html = str_replace( "%CONTENT%", $step_content, $step_html );

    return $step_html;

  }

  public function be(){

    bof()->response->set( "json", array() );

    try {
      $do = $this->be_exe();
    } catch( Warning|Error|Exception|bofException $err ){
      bof()->api->set_message( $err->getMessage(), [], false );
    }

    bof()->response->display();

  }
  protected function be_exe(){

    $endpoint = bof()->nest->user_input( "get", "endpoint", "in_array", [ "values" => [ "check_purchase_code", "submit_purchase_code", "submit_db_cred", "server_check", "set_diagnostics" ] ] );

    if ( !$endpoint )
    throw new bofException( "invalid endpoint" );

    if ( $endpoint == "check_purchase_code" ){

      $code = bof()->nest->user_input( "post", "code", "string", array(
        "strict" => true,
        "strict_regex" => "/^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i",
        "strict_regex_raw" => true
      ) );

      if ( !$code )
      throw new bofException( "invalid purchase code" );

      $verify_code_by_api = bof()->boac->check_spc( $code );

      if ( !empty( $verify_code_by_api["license"] ) ){
        header("HTTP/1.1 201 OK");
        bof()->api->set_message( "ok", array(
          "license" => $verify_code_by_api["license"],
          "server_ip" => $verify_code_by_api["user_server_ip"],
          "server_name" => !empty( $_SERVER["SERVER_NAME"] ) ? "https://" . $_SERVER["SERVER_NAME"] : null
        ) );
      }

    }
    elseif ( $endpoint == "submit_purchase_code" ){

      $code = bof()->nest->user_input( "post", "code", "string", array(
        "strict" => true,
        "strict_regex" => "/^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i",
        "strict_regex_raw" => true
      ) );

      $email = bof()->nest->user_input( "post", "email", "email" );

      $domain = bof()->nest->user_input( "post", "domain", "url", array(
        "remove_fragment" => true,
        "remove_query" => true,
        "accept_port" => true,
        "accept_auth" => true,
        "default_scheme_add" => true
      ) );

      $web_address = $domain . ( substr( $domain, -1 ) == "/" ? "" : "/" );

      if ( !$code )
      throw new bofException( "invalid purchase code" );

      if ( !$email )
      throw new bofException( "invalid email" );

      if ( !$domain )
      throw new bofException( "invalid domain" );

      $verify_code_by_api = bof()->boac->submit_spc( $code, $email, parse_url( $domain, PHP_URL_HOST ) );

      if ( !empty( $verify_code_by_api["sign"] ) ){

        $this->write_config_file( "license", array(
          "purchase_code" => $code,
          "sign_code" => $verify_code_by_api["sign"],
          "owner" => $email,
          "vapid_public" => $verify_code_by_api["vapid_public"],
          "vapid_private" => $verify_code_by_api["vapid_private"],
          "sign_key" => $verify_code_by_api["sign_key"]
        ) );

        $this->write_config_file( "user", array(
          "web_address" => $web_address,
        ) );

        header("HTTP/1.1 201 OK");
        bof()->api->set_message( "ok" );

      }

    }
    elseif ( $endpoint == "submit_db_cred" ){

      $host = bof()->nest->user_input( "post", "host", "string" );
      $user = bof()->nest->user_input( "post", "user", "string" );
      $pass = bof()->nest->user_input( "post", "pass", "raw" );
      $name = bof()->nest->user_input( "post", "name", "string" );
      $a_email = bof()->nest->user_input( "post", "a_email", "email" );
      $a_pass = bof()->nest->user_input( "post", "a_pass", "password" );

      if ( !$host || !$user || !$pass || !$name || !$a_email || !$a_pass )
      throw new bofException( "Fill all inputs" );

      function warning_handler( $errno, $errstr ) {
        throw new ErrorException( $errstr, 0, $errno );
        return false;
      }
      set_error_handler( 'warning_handler', E_WARNING );

      try {

        $db = bof()->define_db( "db", array(
          "host" => $host,
          "user" => $user,
          "pass" => $pass,
          "name" => $name
        ) );

        $db->__connect();

      } catch ( Error|Warning|bofException|Exception $err ){
        bof()->api->set_error( "Database connection failed, reason: <br><br><i>" . $err->getMessage() . "</i><br><br>Fix this problem then retry" );
        return;
      }

      bof()->plug->import_sql( installer_root . "/__raw.sql" );

      $this->write_config_file( "user", array(
        "db_host" => $host,
        "db_user" => $user,
        "db_pass" => $pass,
        "db_name" => $name,
        "web_address" => web_address
      ) );

      bof()->object->user->create(
        array(),
        array(
          "email" => $a_email,
          "password" => $a_pass,
          "username" => "admin",
          "time_verify" => bof()->general->mysql_timestamp(),
          "role_ids" => "2,4"
        ),
        array(
          "email" => $a_email,
          "password" => $a_pass,
          "username" => "admin",
          "time_verify" => bof()->general->mysql_timestamp(),
          "role_ids" => "2,4"
        ),
        false,
        false
      );

      header("HTTP/1.1 201 OK");
      bof()->api->set_message( "ok" );

    }
    elseif ( $endpoint == "server_check" ){

      $timezone = bof()->nest->user_input( "post", "timezone", "in_array", [ "values" => timezone_identifiers_list() ] );

      if ( !$timezone )
      throw new bofException( "invalid timezone" );

      $this->write_config_file( "user", array(
        "db_host" => db_host,
        "db_user" => db_user,
        "db_pass" => db_pass,
        "db_name" => db_name,
        "web_address" => web_address,
        "timezone" => $timezone
      ) );

      header("HTTP/1.1 201 OK");
      bof()->api->set_message( "ok" );

    }
    elseif ( $endpoint == "set_diagnostics" ){

      $level = bof()->nest->user_input( "post", "level", "in_array", [ "values" => [ "none", "basic", "advanced" ] ], "basic" );
      $this->write_config_file( "user", array(
        "db_host" => db_host,
        "db_user" => db_user,
        "db_pass" => db_pass,
        "db_name" => db_name,
        "web_address" => web_address,
        "timezone" => date_default_timezone_get(),
        "diagnostics" => $level
      ) );

      header("HTTP/1.1 201 OK");
      bof()->api->set_message( "ok" );

    }

  }

  protected function check_extensions(){

    $functions = [
      "curl"     => false,
      "mysqli"   => false,
      "mbstring" => false,
      "gd"       => false,
      "php_ver7" => false,
      "url_open" => false,
      "zip"      => false
    ];

    if ( function_exists( "curl_init" ) )
    $functions["curl"] = true;

    if ( function_exists( "mysqli_connect" ) )
    $functions["mysqli"] = true;

    if ( extension_loaded( "mbstring" ) )
    $functions["mbstring"] = true;

    if ( extension_loaded( "zip" ) )
    $functions["zip"] = true;

    if ( extension_loaded( "gd" ) || function_exists( "gd_info" ) )
    $functions["gd"] = true;

    if ( version_compare( PHP_VERSION, '7.0.33', '>=' ) )
    $functions["php_ver7"] = true;

    if ( ini_get('allow_url_fopen') )
    $functions["url_open"] = true;

    return array(
      "all_ready" => count( $functions ) == array_sum( $functions ),
      "functions" => $functions
    );

  }

  protected function check_server(){

    try {
      $this->check_crond();
      $crond = true;
    } catch( bofException|Exception $err ){
    }

    try {
      $this->check_htaccess_files();
      $htaccess = true;
    } catch( bofException|Exception $err ){
    }

    try {
      $this->check_htaccess_work();
      $htaccess2 = true;
    } catch( bofException|Exception $err ){
    }

    if ( !empty( $crond ) && !empty( $htaccess ) && !empty( $htaccess2 ) )
    return true;

    return false;

  }
  protected function check_htaccess_files(){

    $valid_htaccess_hashes = json_decode( '{"_root_\/.htaccess":"0ad7b85167211aabc463216947da42fe","_root_\/api\/.htaccess":"5a09e553fe3fabedb76227b53baf09c7","_root_\/admin\/.htaccess":"b9253d07a7e15bd7d6011280e59811fe","_root_\/api\/app\/.htaccess":"15f001d2daa8e48280d59307b3fa9241","_bof_root_\/app\/core\/.htaccess":"15f001d2daa8e48280d59307b3fa9241","_bof_root_\/app\/plugins\/ffmpeg\/.htaccess":"15f001d2daa8e48280d59307b3fa9241","_bof_root_\/app\/plugins\/google\/.htaccess":"15f001d2daa8e48280d59307b3fa9241","_bof_root_\/app\/plugins\/google-translate\/.htaccess":"15f001d2daa8e48280d59307b3fa9241"}', true );

    foreach( array_keys( $valid_htaccess_hashes ) as $file ){

      $filePath = str_replace( [ "_bof_root_", "_root_" ], [ bof_root, base_root ], $file );

      if ( !is_file( $filePath ) )
      throw new bofException( "A file is missing: {$filePath}<br><br>You can fix this problem by re-uploading missing file. Alternatively, we suggest that you remove all files, re-upload the script in form of a zip file and then extracting it on your server to avoid missing anything" );

      $fileHash = hash_file( "md5", $filePath );
      $filePath = realpath( $filePath );

      if ( $fileHash !== $valid_htaccess_hashes[ $file ] )
      throw new bofException( "A file is corrupted: {$filePath}<br><br>You can fix this problem by re-uploading corrupted file. Alternatively, we suggest that you remove all files, re-upload the script in form of a zip file and then extracting it on your server to avoid missing anything" );

    }

    return true;

  }
  protected function check_htaccess_work(){

    $test = bof()->curl->exe(array(
      "url" => web_address . "api/client_config",
      "headers" => array(
        "X-Bof-Platform: web",
        "X-Bof-Request-Code: BusyOwlFrameWorkVersion201",
        "X-Bof-Version: 2038"
      ),
      "cache" => false
    ));

    if ( empty( $test["http_code"] ) )
    throw new bofException( "Failed to execute curl. Make sure it is allowed" );

    if ( $test["http_code"] != 200 || empty( $test["data"] ) || !isset( $test["data"]["mobile"] ) )
    throw new bofException( ".htaccess file is not working. Make sure your webserver reads the .htaccess files. If you are using Nginx, read <a href='https://support.busyowl.co/documentation/nginx'>this doc</a>" );

    return true;

  }
  protected function check_crond(){

    if ( !db_host )
    throw new bofException("Cronjob is not set yet");

    $db = bof()->define_db( "db", array(
      "host" => db_host,
      "user" => db_user,
      "pass" => db_pass,
      "name" => db_name
    ) );

    $q = $db->query('SELECT TIMESTAMPDIFF( SECOND, time_update, CURRENT_TIMESTAMP() ) as t FROM `_bof_setting` WHERE `var` = "crond_stat"');
    $t = $q->fetch_assoc()["t"];

    if ( $t === null || $t === false || ( !is_numeric( $t ) && !is_int( $t ) ) )
    throw new bofException("Cronjob is not set yet");

    return true;

  }
  protected function check_timezone(){

    if ( !db_host )
    throw new bofException("Server is not setup yet");

    $db = bof()->define_db( "db", array(
      "host" => db_host,
      "user" => db_user,
      "pass" => db_pass,
      "name" => db_name
    ) );

    $q = $db->query('SELECT now() as t');
    $db_cur_time = $q->fetch_assoc()["t"];
    $db_cur_sec = strtotime( $db_cur_time );

    $d_timezone = date_default_timezone_get();
    $timezones = timezone_identifiers_list();

    foreach( $timezones as $timezone ){

      $date = new DateTime( "now", new DateTimeZone( $timezone ) );
      $timezone_cur_time = $date->format('Y-m-d H:i:s');
      $timezone_cur_sec = strtotime( $timezone_cur_time );

      if ( abs( $timezone_cur_sec - $db_cur_sec ) < 10 ){
        $matching_timezones[] = $timezone;
      }

    }

    if ( empty( $matching_timezones ) )
    throw new bofException("We failed to find a valid timezone that matches your MySQL timezone");

    return $matching_timezones;

  }

  protected function write_config_file( $name, $data ){

		// Update the config file
		$sample = file_get_contents( installer_root . "/__config_{$name}_sample.txt" );
    $sample_lined = bof()->general->explode_by_line( $sample );

    if ( empty( $sample ) )
    throw new bofException( "Failed to read <i>" . installer_root . "/__config_{$name}_sample.txt</i>. It's a server-related issue, give your webserver write/read access to rkh-music's files" );

    foreach( $sample_lined as &$sample_line ){
      foreach( $data as $k => $v ){
        $k = strtoupper( $k );
        $sample_line = str_replace( "%{$k}%", addslashes( $v ), $sample_line );
        if ( $k == "DB_PASS" ) $sample_line = str_replace( "\'", "'", $sample_line );
      }
    }

    $new_sample = implode( PHP_EOL, $sample_lined );

    $new_sample = str_replace( "%TIMEZONE%", "Australia/Perth", $new_sample );
    $new_sample = str_replace( "%PURCHASE_CODE%", "", $new_sample );
    $new_sample = str_replace( "%SIGN_CODE%", "", $new_sample );
    $new_sample = str_replace( "%SIGN_KEY%", "", $new_sample );
    $new_sample = str_replace( "%VAPID_PUBLIC%", "", $new_sample );
    $new_sample = str_replace( "%VAPID_PRIVATE%", "", $new_sample );
    $new_sample = str_replace( "%OWNER%", "", $new_sample );
    $new_sample = str_replace( "%DB_HOST%", "", $new_sample );
    $new_sample = str_replace( "%DB_USER%", "", $new_sample );
    $new_sample = str_replace( "%DB_PASS%", "", $new_sample );
    $new_sample = str_replace( "%DB_NAME%", "", $new_sample );
    $new_sample = str_replace( "%DIAGNOSTICS%", "", $new_sample );

		$write = file_put_contents( dirname(installer_root) . "/api/app/config_{$name}.php", $new_sample );

    if ( !$write )
    throw new bofException( "Failed to write <i>" . installer_root . "/__config_{$name}_sample.txt</i>. It's a server-related issue, give your webserver write/read access to rkh-music's files" );

	}

}

?>
