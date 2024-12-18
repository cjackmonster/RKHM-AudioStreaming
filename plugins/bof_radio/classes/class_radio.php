<?php

if ( !defined( "bof_root" ) ) die;

class radio {

	protected $PID = null;
	protected $GID = null;

	public function setup(){

		bof()->object->core_files->add_object( "r_category", bof_radio_root . "/objects/object_category.php" );
		bof()->object->core_files->add_object( "r_city", bof_radio_root . "/objects/object_city.php" );
		bof()->object->core_files->add_object( "r_country", bof_radio_root . "/objects/object_country.php" );
		bof()->object->core_files->add_object( "r_region", bof_radio_root . "/objects/object_region.php" );
		bof()->object->core_files->add_object( "r_language", bof_radio_root . "/objects/object_language.php" );
		bof()->object->core_files->add_object( "r_station", bof_radio_root . "/objects/object_station.php" );
		bof()->object->core_files->add_object( "r_station_source", bof_radio_root . "/objects/object_station_source.php" );

		if ( bof()->getName() == "bof_admin" )
		$this->setup_admin();

		else
		$this->setup_client();

		$this->setup_cronjob();

	}

	protected function setup_admin(){

		$this->setup_bofAdmin();
		$this->setup_admin_app_pages();
		$this->setup_admin_highlights();

		bof()->listen( "bofAdmin", "setting_pre", function( $method_args ){
			$setting_name = $method_args[0];
			if ( $setting_name == "radio_automation" || $setting_name == "radio_setting" )
			$this->setup_admin_settings();
		} );

		$this->setup_admin_stats();
		$this->setup_admin_endpoints();

	}
	protected function setup_bofAdmin(){

		bof()->bofAdmin->_add_object( "r_category" );
		bof()->bofAdmin->_add_object( "r_city" );
		bof()->bofAdmin->_add_object( "r_country" );
		bof()->bofAdmin->_add_object( "r_station_source", [ "seo" => false ] );
		bof()->bofAdmin->_add_object( "r_region" );
		bof()->bofAdmin->_add_object( "r_language" );
		bof()->bofAdmin->_add_object( "r_station" );

	}
	protected function setup_admin_endpoints(){
		bof()->object->endpoint->add( "bof_api_filters_load", array(
			"url" => "bof_api_filters_load",
			"groups" => [ "admin" ],
			"executers" => array(
				bof_radio_root . "/endpoints/endpoint_bof_api_filters_load.php"
			)
		) );
	}
	protected function setup_admin_app_pages(){
		bof()->listen( "client_config", "get_pages_after", function( $method_args, &$method_result, $loader ){

			if ( is_array( $method_result ) ){

				$method_result[ "radio_setting" ] = array(
				  "title" => "Radio Setting",
				  "url" => "^radio_setting$",
				  "link" => "radio_setting",
				  "theme_file" => "parts/content_setting",
				  "becli" => array(
				    (object) array(
				      "endpoint" => "bofAdmin/setting/radio_setting/",
				      "key" => "setting"
				    )
				  ),
				  "__sb_family" => "content",
				);

				$method_result[ "radio_automation" ] = array(
					"title" => "Radio Automation",
					"url" => "^radio_automation$",
					"link" => "radio_automation",
					"theme_file" => "parts/content_setting",
					"extenders" => (object) array(
						"bof_api_automation_filters" => (object) array(
							"type" => "js",
							"name" => "bof_api_automation_filters",
							"path" => web_address . "/plugins/bof_radio/assets/bof_api_automation_filters.js",
							"dir" => false
						),
						"bof_api_automation_filters_css" => (object) array(
							"type" => "css",
							"name" => "bof_api_automation_filters",
							"path" => web_address . "/plugins/bof_radio/assets/bof_api_automation_filters.css",
							"dir" => false
						),
					),
					"events" => (object) array(
						"displaying" => "bof_api_automation_filters.displaying",
						"ready" => "bof_api_automation_filters.ready",
						"unloading" => "bof_api_automation_filters.unloading",
					),
					"becli" => array(
						(object) array(
							"endpoint" => "bofAdmin/setting/radio_automation/",
							"key" => "setting"
						)
					),
					"__sb_family" => "content",
				);

				foreach( array(
					"station" => array(
						"title" => "Station"
					),
					"station_source" => array(
						"title" => "Stream Source"
					),
					"city" => array(
						"title" => "City"
					),
					"country" => array(
						"title" => "Country"
					),
					"region" => array(
						"title" => "Region"
					),
					"language" => array(
						"title" => "Language"
					),
					"category" => array(
						"title" => "Category"
					)
				) as $object_k => $object_as ){

					$_p_title = substr( $object_as["title"], -1 ) == "y" ?  substr( $object_as["title"], 0, -1 ) . "ies" : $object_as["title"] . "s";
					$_p_link = substr( $object_k, -1 ) == "y" ?  substr( $object_k, 0, -1 ) . "ies" : $object_k . "s";

					$method_result[ "radio_{$object_k}s" ] = array(
						"title" => "Radio {$_p_title}",
						"url" => "^radio_{$_p_link}$",
						"link" => "radio_{$_p_link}",
						"theme_file" => "parts/content_table",
						"becli" => array(
							(object) array(
								"endpoint" => "bofAdmin/list/r_{$object_k}/?\$bof ? urlData^url^query_s\$",
								"key" => "content",
							)
						),
						"__sb_family" => "content",
					);

					$method_result[ "radio_{$object_k}" ] = array(
						"title" => "Radio {$object_as["title"]}",
						"url" => "^radio_{$object_k}\/(.*?)$",
						"link" => "radio_{$object_k}",
						"link_par" => "radio_{$_p_link}",
						"theme_file" => "parts/content_single",
						"becli" => array(
							(object) array(
								"endpoint" => "bofAdmin/object/r_{$object_k}/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$",
								"key" => "entity",
							)
						),
						"__sb_family" => "content",
					);

				}

			}

		} );
	}
	protected function setup_admin_highlights(){

		bof()->listen( "highlights", "display_pre", function( $method_args, $method_result, $loader ){

			$sb_family = $method_args[0];

			$highlights = bof()->highlights->getData();
			$highlights[ "setting_links" ][ "items" ][ "cronjob_links" ][ "args" ][ "childs" ] = array_merge(
				array_slice( $highlights[ "setting_links" ][ "items" ][ "cronjob_links" ][ "args" ][ "childs" ], 0, 1 ),
				array(
					array(
						"title" => "Radio - Automation",
						"icon" => "radio",
						"link" => "radio_automation"
					),
			  ),
				array_slice( $highlights[ "setting_links" ][ "items" ][ "cronjob_links" ][ "args" ][ "childs" ], 1 ),
		  );
			bof()->highlights->setData( $highlights );

			if ( $sb_family == "content" ){
				bof()->highlights
				->new_item( "content_stats", array(
					"icon" => "radio",
					"title" => "Stations",
					"tip" => "Radio Stations",
					"value" => number_format( $loader->object->r_station->count( [], [] ) )
				) );
			}

			bof()->highlights
			->new_item( "content_links", array(
				"icon" => "radio",
				"ID" => "radio",
				"title" => "Radio",
				"childs" => array(
					array(
						"title" => "List Stations",
						"icon" => "radio",
						"link" => "radio_stations"
					),
					array(
						"title" => "List Sources",
						"icon" => "save",
						"link" => "radio_station_sources"
					),
					array(
						"title" => "List Categories",
						"icon" => "category",
						"link" => "radio_categories"
					),
					array(
						"title" => "List Languages",
						"icon" => "translate",
						"link" => "radio_languages"
					),
					array(
						"title" => "List Regions",
						"icon" => "public",
						"link" => "radio_regions"
					),
					array(
						"title" => "List Countries",
						"icon" => "flag",
						"link" => "radio_countries"
					),
					array(
						"title" => "List Cities",
						"icon" => "location_city",
						"link" => "radio_cities"
					),
					array(
						"title" => "Setting",
						"icon" => "settings",
						"link" => "radio_setting"
					),
					array(
						"title" => "Automation",
						"icon" => "smart_toy",
						"link" => "radio_automation"
					),
				)
			), false );

		} );
		bof()->listen( "bofAdmin", "dash_cards", function( $method_args, &$method_result, $loader ){
		} );

	}
	protected function setup_admin_settings(){

		$r_langs = bof()->boac->varys_filters( "radio" );

		$total_a_que = bof()->db->query("SELECT COUNT(*) as c FROM _c_r_automate_cache",null,true)->fetch_assoc()["c"];
		$total_ad_que = bof()->db->query("SELECT COUNT(*) as c FROM _c_r_automate_cache WHERE sta IS NULL",null,true)->fetch_assoc()["c"];
		$total_ac_que = bof()->db->query("SELECT COUNT(*) as c FROM _c_r_automate_cache WHERE sta IS NOT NULL",null,true)->fetch_assoc()["c"];

		$queue_string = "<br><br><b style='color:rgb(var(--c_red));font-size:120%;margin-bottom:4px;display:inline-block'>Queue status:</b><br>
		Total: <b>{$total_a_que}</b><br>
		Waiting: <b>{$total_ad_que}</b><br>
		Done: <b>{$total_ac_que}</b> <a href='cronjobs?code=radio'>Cronjob logs</a><br>";

		bof()->bofAdmin->_add_setting( "radio_automation", array(
	    "groups" => array(
				"busyowl" => array(

		      "title" => "Busyowl",
		      "icon" => "source",

		      "inputs" => array(

		        "busyowl_r_auto" => array(
							"title" => "Sync Stations",
							"tip" => "Script will sync stations with Busyowl's API server. There are over 50,000 stations ready on API server. {$queue_string}",
							"col_name" => "busyowl_r_auto",
		          "input" => array(
		            "name" => "busyowl_r_auto",
								"type" => "checkbox",
		          ),
							"validator" => array(
                "boolean",
                array(
                  "empty()"
                )
              )
		        ),
						"busyowl_r_auto_ls" => array(
							"title" => "Filter: Language",
							"col_name" => "busyowl_r_auto_ls",
							"input" => array(
								"name" => "busyowl_r_auto_ls",
								"type" => "select_m",
								"options" => array_merge( [ [ "__all__", "All" ] ], $r_langs["radio_langs"] )
							),
							"validator" => array(
								"in_array",
								array(
									"values" => array_merge( [ "__all__" ], array_map( function( $item ){
										return $item[0];
									}, $r_langs["radio_langs"] ) )
								)
							)
						),
						"busyowl_r_auto_cs" => array(
							"title" => "Filter: Category",
							"col_name" => "busyowl_r_auto_cs",
							"input" => array(
								"name" => "busyowl_r_auto_cs",
								"type" => "select_m",
								"options" => array_merge( [ [ "__all__", "All" ] ], $r_langs["radio_cats"] )
							),
							"validator" => array(
								"in_array",
								array(
									"values" => array_merge( [ "__all__" ], array_map( function( $item ){
										return $item[0];
									}, $r_langs["radio_cats"] ) )
								)
							)
						),

		      )
		    ),
			),
			"functions" => array(
				"be_after" => function( $groups, $inputs ){

					if ( !empty( $inputs["data"]["busyowl_r_auto_ls"] ) && !empty( $inputs["data"]["busyowl_r_auto_cs"] ) ){
						bof()->boac->varys_filters_check( "radio", array(
							"cs" => $inputs["data"]["busyowl_r_auto_cs"] == "__all__" ? "all" : $inputs["data"]["busyowl_r_auto_cs"],
							"ls" => $inputs["data"]["busyowl_r_auto_ls"] == "__all__" ? "all" : $inputs["data"]["busyowl_r_auto_ls"],
						), true );
					}

					return $inputs;

				}
			)
	  ) );

		bof()->bofAdmin->_add_setting( "radio_setting", array(
	    "groups" => array(
				"busyowl" => array(

		      "title" => "Setting",
		      "icon" => "settings",

		      "inputs" => array(

						"radio_fav_as_icon" => array(
							"title" => "Fav as cover",
							"tip" => "Use website's favicon as cover if cover doesn't exists",
							"col_name" => "radio_fav_as_icon",
		          "input" => array(
		            "name" => "radio_fav_as_icon",
								"type" => "checkbox",
		          ),
							"validator" => array(
                "boolean",
                array(
                  "empty()"
                )
              )
		        ),

						"radio_del_failures" => array(
							"title" => "Deactivate broken stations",
							"tip" => "If enabled, script will automatically disable stations that have failures above 3 ( by default ). Once a station gets reactivated by an admin, failure count goes back to zero",
							"col_name" => "radio_del_failures",
		          "input" => array(
		            "name" => "radio_del_failures",
								"type" => "checkbox",
		          ),
							"validator" => array(
                "boolean",
                array(
                  "empty()"
                )
              )
		        ),

						"radio_del_failures_m" => array(
							"title" => "Deactivate broken stations - Failure threshold",
							"tip" => "Set the threshold for the number of reported failures a station can accumulate before it is automatically disabled. Minimum 3",
							"col_name" => "radio_del_failures_m",
		          "input" => array(
		            "name" => "radio_del_failures_m",
								"type" => "digit",
								"value" => 3
		          ),
							"validator" => array(
                "int",
                array(
									"min" => 3,
                )
              )
		        ),

		      )
		    ),
			),
	  ) );

	}
	protected function setup_admin_stats(){

		bof()->listen( "bofAdmin", "_get_stats_after", function( $method_args, &$list ){
			$list["radio"] = array(
				"title" => "Radio",
				"icon" => "radio",
				"functions" => array(
					"exe_item" => function( $stats_name, $item_type, $item_name, $item_data ){

						if ( $item_name == "cards" ){

							$cards = array();
							$cards[] = array(
								"icon" => "radio",
								"title" => "Stations",
								"value" => bof()->object->r_station->count([],[])
							);
							$cards[] = array(
								"icon" => "radio",
								"title" => "Stations Sources",
								"value" => bof()->object->r_station_source->count([],[])
							);
							$cards[] = array(
								"icon" => "category",
								"title" => "Categories",
								"value" => bof()->object->r_category->count([],[])
							);
							$cards[] = array(
								"icon" => "language",
								"title" => "Languages",
								"value" => bof()->object->r_language->count([],[])
							);
							$cards[] = array(
								"icon" => "map",
								"title" => "Regions",
								"value" => bof()->object->r_region->count([],[])
							);
							$cards[] = array(
								"icon" => "map",
								"title" => "Countries",
								"value" => bof()->object->r_country->count([],[])
							);
							$cards[] = array(
								"icon" => "map",
								"title" => "Cities",
								"value" => bof()->object->r_city->count([],[])
							);

							$item_data["cards"] = $cards;

						}

						return $item_data;

					}
				),
				"rows" => array(
					array(
						"cards" => array(
							"size" => "12",
							"id" => "cards"
						)
					),
					array(
						"new_stations" => array(
							"size" => "6",
							"id" => "new_stations"
						),
						"new_station_sources" => array(
							"size" => "6",
							"id" => "new_station_sources"
						),
					),
				),
				"items" => array(
					"cards" => array(
						"col" => "cards",
						"type" => "cards",
						"cards" => array()
					),

					"new_stations" => array(
						"col" => "new_stations",
						"type" => "graph",
						"title" => "New Stations",
						"graph" => array(
							"type" => "xy_basic",
							"table" => "_c_r_stations",
							"xy_basic_time_col" => "time_add",
							"xy_basic_val_col" => "COUNT(*)",
						),
					),
					"new_station_sources" => array(
						"col" => "new_station_sources",
						"type" => "graph",
						"title" => "New Station Sources",
						"graph" => array(
							"type" => "xy_basic",
							"table" => "_c_r_stations_sources",
							"xy_basic_time_col" => "time_add",
							"xy_basic_val_col" => "COUNT(*)",
						),
					),

				),
			);
		} );


	}

	protected function setup_client(){

		$this->setup_bofClient();
		$this->setup_client_endpoints();

	}
	protected function setup_bofClient(){

		bof()->bofClient->_add_object( "r_station" );
		bof()->bofClient->_add_object( "r_language" );
		bof()->bofClient->_add_object( "r_region" );
		bof()->bofClient->_add_object( "r_country" );
		bof()->bofClient->_add_object( "r_city" );
		bof()->bofClient->_add_object( "r_category" );

	}
	protected function setup_client_endpoints(){
		bof()->object->endpoint->add( "radio_fav_catcher", array(
      "url" => "radio_fav_catcher",
			"response_type" => "raw",
      "executers" => array(
        bof_radio_root . "/endpoints/endpoint_radio_fav_catcher.php"
      )
    ) );
	}

	protected function _cli( $string ){
		bof()->cronjob->log_p( $this->PID, $this->GID, $string );
	}
	protected function setup_cronjob(){

		bof()->listen( "cronjob", "_clean_database_get_map_after", function( $method_args, &$map, $loader ){

			$map["_c_r_langs"] = [];
			$map["_c_r_countries"] = [];
			$map["_c_r_cities"] = [];
			$map["_c_r_categories"] = [];
			$map["_c_r_regions"] = [];
			$map["_c_r_stations"] = [];
			$map["_c_r_stations_relations"] = [];
			$map["_c_r_stations_sources"] = [];

		} );


		bof()->listen( "cronjob", "get_jobs_after", function( $method_args, &$jobs, $loader ){

			if ( $loader->object->db_setting->get( "busyowl_r_auto" ) ){
				$jobs["radio"] = array(
					"title" => "Radio Plugin",
					"interval" => 5,
					"exe" => function( $PID, $GID, $loader ){
						return $loader->radio->job_runner( $PID, $GID );
					}
				);
			}

			if ( $loader->object->db_setting->get( "radio_del_failures" ) ){
				$jobs["radio_cleaner"] = array(
					"title" => "Radio Plugin - Cleaner",
					"interval" => 30,
					"exe" => function( $PID, $GID, $loader ){
						return $loader->radio->job_cleaner_runner( $PID, $GID );
					}
				);
			}

		} );

	}
	public function job_runner( $PID, $GID ){
		$this->PID = $PID;
		$this->GID = $GID;
		return $this->get_stations();
	}
	protected function get_stations(){

		$stations = bof()->boac->varys_radio();

		if ( !$stations ){
			fall( "Failed to pull radio list / Nothing in the queue" );
		}

		$stats = [ "ok" => 0, "nok" => 0 ];

		foreach( $stations as $station ){

			$dataArray = array(
				"code" => $station["code"],
				"title" => $station["title"],
				"seo_url" => bof()->object->r_station->get_free_url( $station["title"] ),
				"sources" => [],
				"category_string_array" => $station["categories"]
			);

			if ( !empty( $station["website"] ) ? bof()->nest->validate( $station["website"], "url", array(
				"accept_auth" => true,
        "accept_port" => true,
        "default_scheme" => false,
			) ) : false ) $dataArray["website"] = $station["website"];

			if ( !empty( $station["sources"] ) ){
				foreach( $station["sources"] as $_s ){
					if ( $_s["stream_able"] )
					$dataArray["sources"][] = $_s;
				}
			}

			if ( !empty( $station["language"] ) )
			$dataArray["language_id"] = bof()->object->r_language->get_id( $station["language"]["name"], [ "iso2" => $station["language"]["iso2"] ] );

			if ( !empty( $station["region"] ) )
			$dataArray["region_id"] = bof()->object->r_region->get_id( $station["region"]["name"] );

			if ( !empty( $dataArray["region_id"] ) && !empty( $station["country"]["name"] ) )
			$dataArray["country_id"] = bof()->object->r_country->get_id( $station["country"]["name"], [ "iso2" => $station["country"]["iso2"], "region_id" => $dataArray["region_id"] ] );

			if ( !empty( $dataArray["country_id"] ) && !empty( $station["city"] ) )
			$dataArray["city_id"] = bof()->object->r_city->get_id( $station["city"]["name"], [ "la" => $station["city"]["la"], "lo" => $station["city"]["lo"], "country_id" => $dataArray["country_id"] ] );

			try {
				$create = bof()->object->r_station->create(
					array(
						"code" => $station["code"]
					),
					$dataArray,
					[]
				);
			} catch( Exception $err ){
				$create = false;
			}

			if ( $create ){
				$this->_cli( "Created {$station["title"]}" );
				$stats["ok"]++;
			}
			else{
				$this->_cli( "Failed to create {$station["title"]}" );
				$stats["nok"]++;
			}

		}

		return "Created {$stats["ok"]} station(s), failed to create {$stats["nok"]} station(s)";

	}
	public function job_cleaner_runner( $PID, $GID ){

		$this->PID = $PID;
		$this->GID = $GID;

		$broken_stations = bof()->object->r_station->select(
			array(
				"active" => 1,
				[ "s_muse_report", ">=", bof()->object->db_setting->get( "radio_del_failures_m", 3 ) ]
			),
			array(
				"limit" => false,
				"single" => false,
				"clean" => false
			)
		);

		if ( !$broken_stations )
		throw new Exception( "No broken station found" );

		bof()->object->r_station->update(
			array(
				"ID_in" => array_map( function( $item ){
					return $item["ID"];
				}, $broken_stations )
			),
			array(
				"active" => 0
			)
		);

		return "Deactivated ".count($broken_stations)." broken station(s)";

	}


}

?>
