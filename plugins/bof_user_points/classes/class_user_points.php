<?php

if (!defined("bof_root")) die;

class user_points
{

	protected $PID = false;
	protected $GID = false;

	public function setup()
	{

		bof()->object->core_files->add_object("up_badge", bof_user_points . "/objects/object_badge.php");

		if (bof()->getName() == "bof_admin")
			$this->setup_admin();
		else
			$this->setup_client();

		$this->setup_cronjob();
		$this->modify_user_object();
	}

	protected function modify_user_object()
	{

		bof()->listen("object_user", "relations_after", function ($method_args, &$relations, $loader) {
			$relations["badges"] = array(

				"bofAdmin" => array(
					"objects" => array(
						"badges" => array(
							"label" => "Badges",
							"tip" => "Manual badges. Some badges will be assigned automatically",
							"bofInput" => array(
								"object",
								array(
									"type" => "up_badge",
									"multi" => true,
									"autoload" => false
								),
							),
							"bofAdmin" => array(
								"object" => array(
									// "group" => "manager",
								),

							)
						),
					),
					"filters" => array(
						"rel_badge" => array(
							"title" => "Has Badge",
							"bofInput" => array(
								"object",
								array(
									"type" => "up_badge",
									"multi" => true,
									"autoload" => false
								)
							)
						)
					),

				),
				"selectors" => array(
					"rel_badge" => ["ID", "parent_with_relations", "rel_parent" => "user", "hub_type" => "badge"],
					"up_unchecked" => function () {
						return array(
							"oper" => "OR",
							"cond" => array(
								["time_badge", "<", "SUBDATE( now(), INTERVAL " . bof()->object->db_setting->get("up_check_interval", 72) . " HOUR )", true],
								["time_badge", null, null, true]
							)
						);
					}
				),
				"exec" => array(
					"type" => "hub",
					"hub_type" => "badge",
					"parent_object" => "user",
					"child_object" => "up_badge",
				),

			);
		});
		bof()->listen("object_user", "stats_columns_after", function ($method_args, &$columns, $loader) {
			$columns["points"] = array(
				"label" => "Earned points",
			);
		});
		bof()->listen("object_user", "columns_after", function ($method_args, &$columns, $loader) {
			$columns["badges"] = array(
				"validator" => array(
					"json",
					array(
						"empty()",
						"encode" => true
					)
				)
			);
			$columns["time_badge"] = array(
				"validator" => array(
					"timestamp",
					array(
						"empty()",
					)
				)
			);
		});
		bof()->listen("object_user", "bofAdmin_object_be_renderer_after", function ($givenArgs, $_inputs) {

			if ($givenArgs["request"]["type"] == "multi")
				return;

			$getAutoBadges = bof()->user_points->assign_auto_badges($givenArgs["create_id"]);
			$givenBadges = !empty($_inputs["data"]["badges"]) ? explode(",", $_inputs["data"]["badges"]) : [];
			$allBadges = array_merge($givenBadges, !empty($getAutoBadges) ? array_keys($getAutoBadges) : []);
			bof()->object->_make_rels("user", $givenArgs["create_id"], $allBadges, "badge");

			$newBadgeData = array(
				"manual" => $givenBadges,
				"auto" => !empty($getAutoBadges) ? array_keys($getAutoBadges) : []
			);

			$newBadgeData["html"] = bof()->object->up_badge->cacheHTML($newBadgeData);

			bof()->object->user->update(
				array(
					"ID" => $givenArgs["create_id"]
				),
				array(
					"badges" => json_encode($newBadgeData)
				),
				array(
					"badges" => json_encode($newBadgeData)
				),
				false
			);
		});
		bof()->listen("object_user", "bofAdmin_object_item_renderer", function ($givenArgs, &$item_data) {

			list($item_name, $request, $object) = $givenArgs;

			if ($request["type"] != "single")
				return;

			if ($item_name == "badges") {

				$item_data["input"]["value"] = false;
				$item_data["input"]["value"] = !empty($request["content"][$request["IDS"][0]]["badges_decoded"]["manual"]) ? $request["content"][$request["IDS"][0]]["badges_decoded"]["manual"] : [];
				$item_data["input"] = bof()->bofInput->parse($item_data)["data"]["input"];
			}
		});
	}

	protected function setup_admin()
	{

		$this->setup_bofAdmin();
		$this->setup_admin_app_pages();
		$this->setup_admin_highlights();

		bof()->listen("bofAdmin", "setting_pre", function ($method_args) {
			$this->setup_admin_settings();
		});
	}
	protected function setup_bofAdmin()
	{
		bof()->bofAdmin->_add_object("up_badge", ["seo" => false]);
	}
	protected function setup_admin_app_pages()
	{

		bof()->listen("client_config", "get_pages_after", function ($method_args, &$method_result, $loader) {
			if (is_array($method_result)) {
				$method_result["up_setting"] = array(
					"title" => "User-Points Setting",
					"url" => "^up_setting$",
					"link" => "up_setting",
					"theme_file" => "parts/content_setting",
					"becli" => array(
						(object) array(
							"endpoint" => "bofAdmin/setting/up_setting/",
							"key" => "setting"
						)
					),
					"__sb_family" => "users",
				);
				$method_result["up_badges"] = array(
					"title" => "User Badges",
					"url" => "^up_badges$",
					"link" => "up_badges",
					"theme_file" => "parts/content_table",
					"becli" => array(
						(object) array(
							"endpoint" => "bofAdmin/list/up_badge/?\$bof ? urlData^url^query_s\$",
							"key" => "content",
						)
					),
					"__sb_family" => "users",
				);
				$method_result["up_badge"] = array(
					"title" => "User Badge",
					"url" => "^up_badge\/(.*?)$",
					"link" => "up_badge",
					"link_par" => "up_badges",
					"theme_file" => "parts/content_single",
					"becli" => array(
						(object) array(
							"endpoint" => "bofAdmin/object/up_badge/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$",
							"key" => "entity",
						)
					),
					"__sb_family" => "users",
				);
			}
		});
	}
	protected function setup_admin_highlights()
	{

		bof()->highlights
			->new_item("users_links", array(
				"ID" => "zzzz",
				"icon" => "hotel_class",
				"title" => "User Points",
				"childs" => array(
					array(
						"title" => "Badges",
						"icon" => "military_tech",
						"link" => "up_badges"
					),
					array(
						"title" => "Setting",
						"icon" => "manage_accounts",
						"link" => "up_setting"
					),
				)
			), false);
	}
	protected function setup_admin_settings()
	{

		$pointingRules = bof()->user_points->get_pointing_rules();

		$setting = array(
			"functions" => array(
				"ui_pre" => function (&$groups) {

					$uprs = bof()->object->db_setting->get("up_rules");

					if (!empty($groups)) {
						foreach ($groups as &$group) {
							if (!empty($group["inputs"])) {
								foreach ($group["inputs"] as &$input) {
									if (!empty($input["input"]["name"]) ? substr($input["input"]["name"], 0, 4) == "upr_" : false) {
										$upr_name = substr($input["input"]["name"], 4);
										if (!empty($uprs[$upr_name])) $input["input"]["value"] = $uprs[$upr_name];
									}
								}
							}
						}
					}

					return $groups;
				},
				"be_after" => function ($groups, $_inputs) {

					if (!empty($_inputs["data"]) && empty($_inputs["report"]["fail"])) {
						$uprs = [];
						foreach ($_inputs["data"] as $_k => $_v) {
							if (substr($_k, 0, 4) == "upr_" && $_v)
								$uprs[substr($_k, 4)] = $_v;
						}
						$uprs = json_encode($uprs);
						bof()->object->db_setting->set("up_rules", $uprs, "json");
					}

					return $_inputs;
				}
			),
			"groups" => array(
				"badges" => array(
					"title" => "Setting",
					"icon" => "military_tech",
					"inputs" => array(
						"up_live" => array(
							"col_name" => "up_live",
							"title" => "Badges - Real-time query",
							"tip" => "User-points can take advantage of RKHM's cronjob to store and cache user badges and refresh them once in a while in background instead of checking for badges in real-time. <b style='color:rgb(var(--c_red))'>This query is expensive in terms of server-usage, we highly suggest turning this input off</b> after testing phase",
							"input" => array(
								"name" => "up_live",
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
						"up_limit" => array(
							"col_name" => "up_limit",
							"title" => "Badges - Display Limit",
							"tip" => "How many badges should be displayed for user? Maximum: <b>15</b> Note that themes might have their own limits",
							"input" => array(
								"name" => "up_limit",
								"type" => "digit",
								"value" => 5
							),
							"validator" => array(
								"int",
								array(
									"min" => 1,
									"max" => 15
								)
							)
						),
						"up_check_interval" => array(
							"col_name" => "up_check_interval",
							"title" => "Cronjob execution interval",
							"tip" => "How often should script re-check <b>100 users</b> badges & re-calculate users points? Enter in hour. For example, if you set 48, script will refresh automatically assigned badgse & recalculate user-points for 100 users every 2 days",
							"input" => array(
								"name" => "up_check_interval",
								"type" => "digit",
								"value" => 72
							),
							"validator" => array(
								"int",
								array(
									"min" => 1,
									"max" => 30 * 24
								)
							)
						),
					)
				)
			)
		);

		foreach ($pointingRules["groups"] as $gCode => $gLabel) {

			$setting["groups"][$gCode] = array(
				"title" => $gLabel . " - Points",
				"icon" => "source",
				"inputs" => []
			);

			foreach ($pointingRules["items"] as $itemName => $itemArgs) {
				if ($itemArgs["group"] !== $gCode) continue;
				$setting["groups"][$gCode]["inputs"][$itemName] = array(
					"title" => "{$itemArgs["label"]}",
					"tip" => (!empty($itemArgs["tip"]) ? $itemArgs["tip"] . "<br>" : "") . "Provide the number of points that should be allocated to users upon completion of this specific action",
					"input" => array(
						"name" => "upr_{$itemName}",
						"type" => "digit",
					),
					"validator" => array(
						"int",
						array(
							"min" => 0,
							"max" => 200,
							"empty()"
						)
					)
				);
			}
		}

		bof()->bofAdmin->_add_setting("up_setting", $setting);
	}

	protected function setup_client()
	{

		$this->setup_hooks();

		bof()->listen("theme", "get_after", function ($method_args, &$config) {

			if (empty($config["assets"])) $config["assets"] = [];
			if (empty($config["assets"]["js"])) $config["assets"]["js"] = [];
			if (empty($config["assets"]["css"])) $config["assets"]["css"] = [];

			$version = bof()->plug->read("plugin", "user_points")["version"];

			$config["assets"]["js"][] = array(
				"name" => "bof_user_points_mini_js",
				"path" => "user_points_mini.js?bof_version=" . (!production ? "dont_cache" : $version),
				"base" => web_address . "plugins/bof_user_points/assets/",
				"dir" => false,
				"version" => bof()->plug->read("plugin", "user_points")["version"]
			);
		});

		/*bof()->object->endpoint->add( "user_points_mini_js", array(
      "url" => ( bof()->object->core_setting->get( "nginx_server" ) ? "user_points_mini_js" : "user_points_mini.js" ),
      "response_type" => "file",
      "response_data" => array(
        "path" => bof_user_points . "/assets/user_points_mini.js"
      ),
    ) );*/

		bof()->object->endpoint->add("user_points_list_badges", array(
			"url" => "user_points_list_badges",
			"groups" => ["api"],
			"executers" => array(
				bof_user_points . "/endpoints/endpoint_user_points_list_badges.php"
			)
		));
	}
	protected function setup_hooks()
	{

		bof()->listen("object_user", "clean_after", function ($method_args, &$user) {

			if (!empty($user["name_styled"]) && !empty($user["badges_decoded"]["html"]) && !bof()->user_points->get_display_setting()["live"]) {
				$countAll = count(array_merge(
					!empty($user["badges_decoded"]["auto"]) ? $user["badges_decoded"]["auto"] : [],
					!empty($user["badges_decoded"]["manual"]) ? $user["badges_decoded"]["manual"] : [],
				));
				$countAll = $countAll > bof()->user_points->get_display_setting()["max"] ? bof()->user_points->get_display_setting()["max"] : $countAll;
				$user["name_styled"] = '<div class="user_name_wrapper c' . ($countAll) . '" data-user-id="' . $user["hash"] . '">' . $user["name_styled"] . '<div class="badges">' . $user["badges_decoded"]["html"] . '</div></div>';
			} elseif (!empty($user["name_styled"]) && bof()->user_points->get_display_setting()["live"]) {

				$getAutoBadges = bof()->user_points->assign_auto_badges($user);
				$givenBadges = !empty($user["badges_decoded"]["manual"]) ? $user["badges_decoded"]["manual"] : [];
				$allBadges = array_merge($givenBadges, !empty($getAutoBadges) ? array_keys($getAutoBadges) : []);
				bof()->object->_make_rels("user", $user["ID"], $allBadges, "badge");

				$badges = bof()->object->up_badge->select(
					array(
						"rel_user" => $user["ID"]
					),
					array(
						"single" => false,
						"limit" => bof()->user_points->get_display_setting()["max"],
						"order_by" => "priority",
						"order" => "ASC"
					)
				);

				if ($badges) {
					$countAll = $badges ? count($badges) : 0;
					$user["name_styled"] = '<div class="user_name_wrapper c' . ($countAll) . '" data-user-id="' . $user["hash"] . '">' . $user["name_styled"] . '<div class="badges">' . bof()->object->up_badge->htmlize($badges) . '</div></div>';
				}
			}
		});
	}

	public function get_display_setting()
	{
		return array(
			"live" => bof()->object->db_setting->get("up_live", false),
			"max" => bof()->object->db_setting->get("up_limit", 5)
		);
	}
	public function get_pointing_rules()
	{

		$defaultCurrencyCode = bof()->object->currency->get_default()["iso_code"];

		$rules = array(
			"groups" => array(
				"general" => "General",
				"transaction" => "Transactions",
				"payment" => "Payments",
				"properties" => "Properties",
				"blog" => "Blog",
			),
			"items" => array(
				"api_requests" => array(
					"group" => "general",
					"label" => "API requests",
					"tip" => "Number of requests user sends to your app ( general activity )",
					"query" => "SELECT COUNT(*) FROM `_bof_log_api_requests` WHERE user_id = %_ui% ^^AND time_add > %_tb%^^"
				),
				"files" => array(
					"group" => "general",
					"label" => "Uploaded files",
					"tip" => "Number of uploaded files by users ( including images, audio, etc )",
					"query" => "SELECT COUNT(*) FROM `_bof_files` WHERE user_id = %_ui% AND dest_host_id = 0 ^^AND time_add > %_tb%^^"
				),
				"blog_posts" => array(
					"group" => "blog",
					"label" => "Blog posts",
					"query" => "SELECT COUNT(*) FROM `_c_b_posts` WHERE user_id = %_ui% ^^AND time_add > %_tb%^^"
				),
				"deposit_transaction" => array(
					"group" => "transaction",
					"label" => "Deposit Transaction",
					"query" => "SELECT COUNT(*) FROM `_u_transactions` WHERE user_id = %_ui% AND type = 'deposit' ^^AND time_add > %_tb%^^"
				),
				"commission_transaction" => array(
					"group" => "transaction",
					"label" => "Commission Transaction",
					"query" => "SELECT COUNT(*) FROM `_u_transactions` WHERE user_id = %_ui% AND type = 'commission' ^^AND time_add > %_tb%^^"
				),
				"sale_transaction" => array(
					"group" => "transaction",
					"label" => "Sale Transaction",
					"query" => "SELECT COUNT(*) FROM `_u_transactions` WHERE user_id = %_ui% AND type = 'sale' ^^AND time_add > %_tb%^^"
				),
				"buy_transaction" => array(
					"group" => "transaction",
					"label" => "Buy Transaction",
					"query" => "SELECT COUNT(*) FROM `_u_transactions` WHERE user_id = %_ui% AND type = 'buy' ^^AND time_add > %_tb%^^"
				),
				"plan_subs" => array(
					"group" => "payment",
					"label" => "Subscriptions ( to premium plans )",
					"query" => "SELECT COUNT(*) FROM `_u_subs` WHERE user_id = %_ui% ^^AND time_purchased > %_tb%^^"
				),
				"payments_count" => array(
					"group" => "payment",
					"label" => "Approved Payments - by count",
					"query" => "SELECT COUNT(*) FROM `_u_payments` WHERE user_id = %_ui% AND approved = 1 ^^AND time_pay > %_tb%^^"
				),
				"payments_sum" => array(
					"group" => "payment",
					"label" => "Approved Payments - by amount",
					"tip" => "<b>Points are based on the total amount spent</b>. For example, with <b>5</b> set as points, if user makes a 100 in {$defaultCurrencyCode} payment, they'll receive 500 points",
					"query" => "SELECT SUM(amount) FROM `_u_payments` WHERE user_id = %_ui% AND approved = 1 ^^AND time_pay > %_tb%^^"
				),
				"likes" => array(
					"group" => "properties",
					"label" => "Performed Likes",
					"query" => "SELECT COUNT(*) FROM `_u_properties` WHERE user_id = %_ui% AND type = 'like' ^^AND time_add > %_tb%^^"
				),
				"subscribes" => array(
					"group" => "properties",
					"label" => "Performed Subscribes ( to users & artists )",
					"query" => "SELECT COUNT(*) FROM `_u_properties` WHERE user_id = %_ui% AND type = 'subscribe' ^^AND time_add > %_tb%^^"
				),
				"uploads" => array(
					"group" => "properties",
					"label" => "Uploads",
					"query" => "SELECT COUNT(*) FROM `_u_properties` WHERE user_id = %_ui% AND type = 'upload' ^^AND time_add > %_tb%^^"
				),
				"playlists" => array(
					"group" => "properties",
					"label" => "Playlist",
					"query" => "SELECT COUNT(*) FROM `_u_playlists` WHERE user_id = %_ui% ^^AND time_add > %_tb%^^"
				),
				"playlist_items" => array(
					"group" => "properties",
					"label" => "Extending playlist",
					"tip" => "Executed when a user adds a new item to a playlist",
					"query" => "SELECT COUNT(*) FROM `_u_properties` WHERE user_id = %_ui% AND type = 'playlist' ^^AND time_add > %_tb%^^"
				),
				"followers" => array(
					"group" => "properties",
					"label" => "Followers",
					"query" => "SELECT COUNT(*) FROM `_u_properties` WHERE object_id = %_ui% AND object_name = 'user' AND type = 'subscribe' ^^AND time_add > %_tb%^^"
				),
				"streams" => array(
					"group" => "properties",
					"label" => "Streams",
					"query" => "SELECT COUNT(*) FROM `_u_actions` WHERE user_id = %_ui% AND type = 'stream' ^^AND time_add > %_tb%^^"
				),
				"streams_u" => array(
					"group" => "properties",
					"label" => "Streams - Unique",
					"tip" => "Count every art ( track, podcast, etc ) just once in `Cronjob execution interval` period",
					"query" => "SELECT COUNT(*) FROM ( SELECT 1 FROM `_u_actions` WHERE user_id = %_ui% AND type = 'stream' ^^AND time_add > %_tb%^^ GROUP BY object_name, object_id ) as xx"
				),
				"downloads" => array(
					"group" => "properties",
					"label" => "Downloads",
					"query" => "SELECT COUNT(*) FROM `_u_actions` WHERE user_id = %_ui% AND type = 'download' ^^AND time_add > %_tb%^^"
				),
				"downloads_u" => array(
					"group" => "properties",
					"label" => "Downloads - Unique",
					"tip" => "Count every art ( track, podcast, etc ) just once in `Cronjob execution interval` period",
					"query" => "SELECT COUNT(*) FROM ( SELECT 1 FROM `_u_actions` WHERE user_id = %_ui% AND type = 'download' ^^AND time_add > %_tb%^^ GROUP BY object_name, object_id ) as xx"
				),
			)
		);

		if (bof()->plugin_exists("bof_music")) {
			$rules["groups"]["music"] = "Music";
			$rules["items"]["tracks_uploaded"] = array(
				"group" => "music",
				"label" => "Uploaded Tracks - Count",
				"query" => "SELECT COUNT(*) FROM `_c_m_tracks` WHERE uploader_id = %_ui% ^^AND time_add > %_tb%^^"
			);
			$rules["items"]["albums_uploaded"] = array(
				"group" => "music",
				"label" => "Uploaded Albums - Count",
				"query" => "SELECT COUNT(*) FROM `_c_m_albums` WHERE uploader_id = %_ui% ^^AND time_add > %_tb%^^"
			);
			$rules["items"]["tracks_streams"] = array(
				"group" => "music",
				"label" => "Uploaded Tracks - Stream Count",
				"query" => "SELECT COUNT(*) FROM `_u_actions` WHERE object_name = 'm_track' and type = 'stream' and object_id IN ( SELECT ID FROM _c_m_tracks WHERE uploader_id = %_ui% ) ^^AND time_add > %_tb%^^"
			);
			$rules["items"]["tracks_streams_u"] = array(
				"group" => "music",
				"label" => "Uploaded Tracks - Stream Count - Unique",
				"tip" => "Points given to user every time a new user ( a user that has not been counted during Cronjob execution interval ) stream one of their uploaded tracks",
				"query" => "SELECT COUNT(*) FROM ( SELECT 1 FROM `_u_actions` WHERE object_name = 'm_track' and type = 'stream' and object_id IN ( SELECT ID FROM _c_m_tracks WHERE uploader_id = %_ui% ) ^^AND time_add > %_tb%^^ GROUP BY user_id, object_name, object_id ) as xx"
			);
			$rules["items"]["tracks_playlisted"] = array(
				"group" => "music",
				"label" => "Uploaded Tracks - Playlisted Count",
				"query" => "SELECT COUNT(*) FROM `_u_properties` WHERE object_name = 'm_track' and type = 'playlist' and object_id IN ( SELECT ID FROM _c_m_tracks WHERE uploader_id = %_ui% ) ^^AND time_add > %_tb%^^"
			);
		}

		return $rules;
	}

	protected function setup_cronjob()
	{

		bof()->listen("cronjob", "get_jobs_after", function ($method_args, &$jobs, $loader) {
			$jobs["user_points"] = array(
				"title" => "User-Point Plugin",
				"interval" => (bof()->object->db_setting->get("up_check_interval", 72) * 60),
				"exe" => function ($PID, $GID, $loader) {
					$this->PID = $PID;
					$this->GID = $GID;
					return $loader->user_points->job_runner($PID, $GID);
				}
			);
		});
	}
	public function _cli($string)
	{
		if ($this->PID && $this->GID)
			bof()->cronjob->log_p($this->PID, $this->GID, $string);
	}
	public function job_runner($PID, $GID)
	{

		$points = bof()->object->db_setting->get("up_rules");
		$users = bof()->object->user->select(
			array(),
			array(
				"limit" => 100,
				"single" => false,
				"order_by" => "time_badge",
				"order" => "ASC",
				"clean" => false,
				"empty_select" => true,
				"empty_select()"
			)
		);
		$badges = bof()->object->up_badge->select(
			array(
				"has_aas" => true,
			),
			array(
				"limit" => false,
				"single" => false
			)
		);

		$__s = 0;
		foreach ($users as $user) {

			$userPoints = $this->calculate_points($user, $points);
			$userBadges = $this->assign_auto_badges($user, $badges);
			$newBadgeData = false;

			if ($userBadges) {

				$oldBadgeData = $user["badges"] ? json_decode($user["badges"], true) : false;
				$givenBadges = array_keys($userBadges);
				$allBadges = array_merge($givenBadges, !empty($oldBadgeData["manual"]) ? $oldBadgeData["manual"] : []);
				bof()->object->_make_rels("user", $user["ID"], $allBadges, "badge");

				$newBadgeData = array(
					"auto" => $givenBadges,
					"manual" => !empty($oldBadgeData["manual"]) ? $oldBadgeData["manual"] : []
				);
				$newBadgeData["html"] = bof()->object->up_badge->cacheHTML($newBadgeData);
			}

			$updateArray = array(
				"time_badge" => bof()->general->mysql_timestamp()
			);

			if (!empty($userPoints) || !empty($newBadgeData)) {

				if (!empty($userPoints))
					$updateArray["s_points"] = $user["s_points"] + $userPoints;

				if (!empty($newBadgeData))
					$updateArray["badges"] = json_encode($newBadgeData);

				$__s++;
			}

			bof()->object->user->update(
				array(
					"ID" => $user["ID"]
				),
				$updateArray,
				$updateArray,
				false
			);
		}

		return "Checked " . count($users) . " users, updated {$__s}";
	}
	public function calculate_points($user, $points = false)
	{

		// get rules & given points to rules
		$points = $points ? $points : bof()->object->db_setting->get("up_rules");
		if (empty($points)) return;
		$points_rules = bof()->user_points->get_pointing_rules();

		// fetch user
		$user = is_array($user) ? $user : bof()->object->user->sid($user, ["clean" => false]);
		$earnedPoints = [];

		foreach ($points as $pointKey => $point) {

			if (empty($points_rules["items"][$pointKey]) || empty($point))
				continue;

			$args = $points_rules["items"][$pointKey];

			// We have a point-rule with positive points, check if user has done of it
			$performedAction = 0;
			$lastCheck = $user["time_badge"] ? $user["time_badge"] : false;
			$query = str_replace(["%_ui%", "COUNT(*)", "SUM(*)", "AVG(*)"], [$user["ID"], "COUNT(*) as _v", "SUM(*) as _v", "AVG(*) as _v"], $args["query"]);

			preg_match("/\^\^(.*?)\^\^/", $query, $m);
			if (!empty($m)) {
				$replacement = "";
				if ($lastCheck)
					$replacement = str_replace("%_tb%", "'{$lastCheck}'", $m[1]);
				$query = trim(str_replace($m[0], $replacement, $query));
			}

			$runQuery = bof()->db->query($query, null, true);

			if ($runQuery) {
				$fetch = $runQuery->fetch_assoc();
				if (!empty($fetch) ? !empty($fetch["_v"]) : false) {
					$performedAction = $fetch["_v"];
				}
			}
			// End of check

			if ($performedAction) {
				$earnedPoint = round($performedAction * $point);
				$earnedPoints[$args["label"]] = $earnedPoint;
			}
		}

		$earnedPointsSum = $earnedPoints ? array_sum(array_values($earnedPoints)) : 0;

		$this->_cli(
			"User:{$user["ID"]}:{$user["username"]} earned {$earnedPointsSum} points" .
				($lastCheck ? " since {$lastCheck}" : "") .
				($earnedPointsSum ? " " . json_encode($earnedPoints) : "")
		);

		return $earnedPointsSum;
	}
	public function assign_badges($user) {}
	public function assign_auto_badges($user, $badges = false)
	{

		if (!$badges)
			$badges = bof()->object->up_badge->select(
				array(
					"has_aas" => true,
				),
				array(
					"limit" => false,
					"single" => false
				)
			);

		if (!$badges)
			return;

		$assignBadges = [];

		if (!is_array($user))
			$user = bof()->object->user->sid($user, ["clean" => false]);

		$subscriptions = bof()->object->user_subs->select(
			array(
				"user_id"  => $user["ID"],
				"has_time" => 1
			),
			array(
				"limit"  => false,
				"single" => false,
				"clean" => false
			)
		);

		if ( $subscriptions ){
			foreach( $subscriptions as $subscription ){
				$subscription_user_role = bof()->object->user_subs_plan->sid( $subscription["subs_plan_id"], [ "clean" => false ] );
				$user["role_ids"] .=  "," . $subscription_user_role["target_role_id"];
			}
		}

		foreach ($badges as $badge) {

			$meet_conditions_condition = "all";
			$met_one = false;
			$met_all = true;

			if (!empty($badge["aas_decoded"])) {
				foreach ($badge["aas_decoded"] as $aaK => $aaV) {

					$aaMet = false;
					if ($aaK == "aa_by_role") {
						foreach (explode(",", $user["role_ids"]) as $userRole) {
							if (in_array($userRole, explode(",", $aaV), true))
								$aaMet = true;
						}
					} elseif ($aaK == "aa_by_age") {
						$accountAge = ceil((time() - strtotime($user["time_add"])) / (365 * 24 * 60 * 60));
						if ($accountAge == $aaV)
							$aaMet = true;
					} elseif (substr($aaK, 0, strlen("aa_by_s_")) == "aa_by_s_") {

						$aa_s_cond = substr($aaK, -3) == "_gt" ? "greater" : "lesser";
						$aa_s_lesser = empty($user[substr($aaK, 6, -3)]) ? true : $user[substr($aaK, 6, -3)] <= $aaV;
						$aa_s_greater = empty($user[substr($aaK, 6, -3)]) ? false : $user[substr($aaK, 6, -3)] >= $aaV;
						if (($aa_s_cond == "greater" && $aa_s_greater) || ($aa_s_cond == "lesser" && $aa_s_lesser))
							$aaMet = true;
					}

					if ($aaMet)
						$met_one = true;
					else
						$met_all = false;
				}
			}

			$assign = false;
			if ($meet_conditions_condition == "all" && $met_all && $met_one)
				$assign = true;
			elseif ($meet_conditions_condition == "one" && $met_one)
				$assign = true;

			if ($assign)
				$assignBadges[$badge["ID"]] = $badge;
		}

		return $assignBadges;
	}
}
