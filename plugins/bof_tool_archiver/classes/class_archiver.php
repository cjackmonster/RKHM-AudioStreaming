<?php

if ( !defined( "bof_root" ) ) die;

class archiver {

	public function setup(){
		if ( bof()->getName() == "bof_admin" )
		$this->setup_admin();
		$this->setup_cronjob();

	}
	protected function setup_admin(){

		bof()->object->endpoint->add( "bof_archiver_css", array(
			"url" => "bof_archiver.css",
			"response_type" => "file",
			"response_data" => array(
				"path" => bof_archiver . "/assets/admin.css",
				"mime_type" => "text/css; charset=utf-8"
			),
		) );

		bof()->object->endpoint->add( "bof_archiver_js", array(
			"url" => "bof_archiver.js",
			"response_type" => "file",
			"response_data" => array(
				"path" => bof_archiver . "/assets/admin.js"
			),
		) );

		bof()->object->endpoint->add( "archiver_mysqldump_path_test", array(
      "url" => "archiver_mysqldump_path_test",
      "groups" => [ "admin" ],
      "executers" => array(
        bof_archiver . "/endpoints/endpoint_archiver_mysqldump_path_test.php"
      )
    ) );

		bof()->object->endpoint->add( "archiver_execute", array(
      "url" => "archiver_execute",
      "groups" => [ "admin" ],
      "executers" => array(
        bof_archiver . "/endpoints/endpoint_archiver_execute.php"
      )
    ) );

		bof()->object->endpoint->add( "archiver_cancel", array(
      "url" => "archiver_cancel",
      "groups" => [ "admin" ],
      "executers" => array(
        bof_archiver . "/endpoints/endpoint_archiver_cancel.php"
      )
    ) );

		bof()->listen( "highlights", "display_pre", function( $method_args, $method_result, $loader ){
			bof()->highlights
			->new_item( "setting_links", array(
        "ID" => "zzz2",
				"icon" => "archive",
				"title" => "Archiver",
				"childs" => array(
					array(
						"icon" => "tune",
						"title" => "Setting",
						"link" => "archiver_setting"
					),
					array(
						"icon" => "precision_manufacturing",
						"title" => "Cronjob logs",
						"link" => "cronjobs?code=archiver"
					)
				)
			), false );
		} );
		bof()->listen( "client_config", "get_pages_after", function( $method_args, &$method_result, $loader ){

			if ( is_array( $method_result ) ){
				$method_result[ "archiver" ] = array(
					"title" => "Archiver Setting",
					"url" => "^archiver_setting$",
					"link" => "archiver_setting",
					"theme_file" => "parts/content_setting",
					"extenders" => (object) array(
						"bof_archiver_css" => (object) array(
							"type" => "css",
							"name" => "bof_archiver",
							"path" => admin_endpoint_address . "bof_archiver.css",
							"dir" => false
						),
						"bof_archiver_js" => (object) array(
							"type" => "js",
							"name" => "bof_archiver",
							"path" => admin_endpoint_address . "bof_archiver.js",
							"dir" => false
						)
					),
					"becli" => array(
						(object) array(
							"endpoint" => "bofAdmin/setting/archiver/",
							"key" => "setting"
						)
					),
					"events" => (object) array(
						"ready" => "bof_archiver.set",
						"unloading" => "bof_archiver.unset",
					),
					"__sb_family" => "setting",
				);
			}

		} );
		bof()->bofAdmin->_add_setting( "archiver", array(
			"functions" => array(
				"ui_pre" => function( $groups ){

					$tables = bof()->cronjob->_clean_database_get_map();
					$db_setting = bof()->object->db_setting->get( "arch_db_map", [] );

					$tables_html = [];
					foreach( $tables as $tableName => $tableArgs ){

						$tableActive = $db_setting ? ( in_array( $tableName, array_keys( $db_setting ), true ) ? $db_setting[ $tableName ] : true ) : false;

						$_d = "??";

						$query = bof()->db->query("SELECT ROUND((DATA_LENGTH + INDEX_LENGTH) ) AS size FROM information_schema.TABLES WHERE TABLE_SCHEMA = \"".db_name."\" AND TABLE_NAME = \"{$tableName}\" ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC");
						if ( $query ? $query->num_rows : false ){
							$_d = "<b>" . bof()->general->filesize_hr( $query->fetch_assoc()["size"] ) . "</b>";
						}

						$tables_html[] = "<div class='table_cleaner_wrapper'>
							<div class='input_wrapper'>
								<div class='checkbox_wrapper'>
									<input type='checkbox' class='bof_input' name='archive_table_{$tableName}' ".($tableActive?"checked='checked'":"").">
									<span class='checkbox_mask'><span></span></span>
								</div>
							</div>
							<name>{$tableName}</name>
							{$_d}
						</div>";

					}

					$available_hd_size = disk_free_space( base_root ) ? bof()->general->filesize_hr( disk_free_space( base_root ) ) : "?";
					$localhost_data = bof()->general->filesize_hr( bof()->object->storage->sid(1)["s_files_size"] );

					$groups["db"]["inputs"]["archive_db_tables"]["html"] = "<div class='archive_tables_wrapper crond_tables_wrapper'><btitle>Tables</btitle>".implode( "", $tables_html )."</div>";
					$groups["file"]["inputs"]["arch_file_active"]["tip"] = "Required space on localhost: <b style='color:rgb(var(--c_red))'>{$localhost_data}</b>. Available size on disk: <b style='color:rgb(var(--c_green))'>{$available_hd_size}</b>";
					return $groups;

				},
				"ui_after" => function( $groups, &$_output ){

					$_output["state"] = bof()->object->db_setting->get( "arch_state" );
					if ( $_output["state"] == 2 ){
						$arch_state = bof()->object->db_setting->select(["var"=>"arch_state"]);
						if ( !empty( $arch_state["time_update"] ) ? ( time() - strtotime( $arch_state["time_update"] ) > 6*60*60 ) : false ){
							$_output["state"] = 0;
							bof()->object->db_setting->set( "arch_state", 0 );
						}
					}

				},
				"be_pre" => function( $groups ){

					$tables = bof()->cronjob->_clean_database_get_map();
					$tableSetting = [];
					foreach( $tables as $tableName => $tableArgs ){
						$tableSetting[ $tableName ] = bof()->nest->user_input( "post", "archive_table_{$tableName}", "boolean", [ "empty()" => true ] );
					}

					bof()->object->db_setting->set( "arch_db_map", json_encode( $tableSetting ), "json" );
					return $groups;

				}
			),
			"groups" => array(
				"db" => array(
					"title" => "Database backup",
					"tip" => "Archiver can backup your database tables using <b>mysqldump</b> command. Both table strcuture & values will be exported. On import, table will be dropped, recreated and data will be re-imported",
					"icon" => "table_chart",
					"inputs" => array(
						"arch_db_active" => array(
							"title" => "Active",
							"col_name" => "arch_db_active",
							"input" => array(
								"name" => "arch_db_active",
								"type" => "checkbox",
							),
							"validator" => array(
								"boolean",
								array(
									"empty()",
									"int" => true
								)
							)
						),
						"arch_db_path" => array(
							"title" => "mysqldump path",
							"tip" => "It can usually be accessed by `mysqldump` command simply. If you have installed it elsewhere, enter the absolute path to mysqldump on your server <div class='btn btn-primary' id='mysqldump_test'>Test path</div><br><br>Possible paths:<br><br<ul id='p_ps'><li>mysqldump</li><li>/usr/bin/mysqldump</li><li>/usr/local/bin/mysqldump</li><li>/usr/share/mysqldump</li><li>/opt/local/bin/mysqldump</li><li>/opt/homebrew/bin/mysqldump</li><li>C:\\Program Files\\wampserver\\bin\\mysqldump.exe</li><li>/snap/bin/mysqldump</li></ul>",
							"col_name" => "arch_db_path",
							"input" => array(
								"name" => "arch_db_path",
								"type" => "text",
								"value" => "mysqldump",
							),
							"validator" => array(
								"string",
								array(
									"empty()",
									"strict" => true,
									"strict_regex" => "[a-zA-Z0-9_.\-\/\:\\\ ]"
								)
							)
						),
						"archive_db_tables" => array(
							"html" => ""
						)
					)
				),
				"file" => array(
					"title" => "File backup",
					"tip" => "Archiver can zip and backup all of your <b>local files</b>. This excludes files uploaded to secondary storages. Requires php zip extension which is ".(extension_loaded('zip')?"<b style='color:rgb(var(--c_green))'>installed</b>":"<b style='color:rgb(var(--c_red))'>installed</b>")." on your server",
					"icon" => "save",
					"inputs" => array(
						"arch_file_active" => array(
							"title" => "Active",
							"col_name" => "arch_file_active",
							"input" => array(
								"name" => "arch_file_active",
								"type" => "checkbox",
							),
							"validator" => array(
								"boolean",
								array(
									"empty()",
									"int" => true
								)
							)
						),
					)
				),
				"storage" => array(
					"title" => "Save destionation",
					"tip" => "Archiver saves backups in a protected folder that is not accessible to everyone. You can set up a secondary storage for archiver, which will save backups on a server other than your own",
					"icon" => "cable",
					"inputs" => array(
						"arch_storage" => array(
							"title" => "Storage",
							"col_name" => "arch_storage",
							"input" => array(
								"name" => "arch_storage",
								"value" => 1
							),
							"bofInput" => array(
								"object",
								array(
									"type" => "storage",
									"multi" => false
								)
							),
							"validator" => array(
								"int",
								array(
									"empty()"
								)
							)
						),
						"arch_storage_path" => array(
							"title" => "Storage subfolder",
							"col_name" => "arch_storage_path",
							"tip" => "Enter subfolder name. For example <b>backups</b> or <b>private/backups</b>",
							"input" => array(
								"name" => "arch_storage_path",
								"type" => "text"
							),
							"validator" => array(
								"string",
								array(
									"empty()"
								)
							)
						),
					)
				),
				"cronjob" => array(
					"title" => "Schedule",
					"tip" => "Take advantage of cronjob to make backup from your app, in background & regulary",
					"icon" => "schedule",
					"inputs" => array(
						"arch_cronjob" => array(
							"title" => "Active",
							"col_name" => "arch_cronjob",
							"input" => array(
								"name" => "arch_cronjob",
								"type" => "checkbox",
							),
							"validator" => array(
								"boolean",
								array(
									"empty()",
									"int" => true
								)
							)
						),
						"arch_cronjob_i" => array(
							"title" => "Interval",
							"tip" => "This setting controls how often Archiver creates backups. If you set it to 1, Archiver will create a backup every hour. If you set it to 48, Archiver will create a backup every 48 hours (which is the same as every two days)",
							"col_name" => "arch_cronjob_i",
							"input" => array(
								"name" => "arch_cronjob_i",
								"type" => "digit",
								"value" => 48
							),
							"validator" => array(
								"int",
								array(
									"min" => 1,
									"max" => 2*31*24*60*60
								)
							)
						),
					)
				),
			),
			"action_btn_title" => "Save"
		) );

	}
	protected function setup_cronjob(){
		bof()->listen( "cronjob", "get_jobs_after", function( $method_args, &$jobs, $loader ){

			$state = bof()->object->db_setting->get( "arch_state" );
			$cronjob = bof()->object->db_setting->get( "arch_cronjob" );

			if ( $cronjob ){
				$cronjob_i = bof()->object->db_setting->get( "arch_cronjob_i" );
				$cronjob_r =  bof()->object->db_setting->get( "arch_cronjob_r" );
				$cronjob_run_state = $cronjob_r && $cronjob_i ? time() - $cronjob_r > $cronjob_i * 60 * 60 : $cronjob_i;
			}

			if ( $state === 1 || $state === "1" || !empty( $cronjob_run_state ) ){

				$jobs["archiver"] = array(
					"title" => "Archiver",
					"interval" => 1,
					"exe" => function( $PID, $GID ){

						bof()->object->db_setting->set( "arch_state", 2 );
						bof()->object->core_files->add_key( "class", "archiver_core", bof_archiver . "/classes/class_archiver_core.php" );
						try {
							$backup = bof()->archiver_core->exe( $PID, $GID );
						} catch( Exception|bofException|Warning|Error $err ){
							$err = $err->getMessage();
							bof()->cronjob->log_p( $PID, $GID, "Failed: " . $err );
						}
						bof()->archiver_core->rm_tmp_dir();
						bof()->object->db_setting->set( "arch_state", "0" );
						bof()->object->db_setting->set( "arch_cronjob_r", time() );

						if ( !empty( $err ) )
						fall( "Failed: {$err}" );

						return "Backed up to {$backup}";

					}
				);

			}

		} );
	}

}

?>
