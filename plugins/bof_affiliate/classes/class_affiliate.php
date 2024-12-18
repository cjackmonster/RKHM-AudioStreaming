<?php

if (!defined("bof_root")) die;

class affiliate
{

	public $cache = [];
	public function set_cache($var, $val)
	{
		$this->cache[$var] = $val;
	}
	public function get_cache($var, $default_val = null, $resetAfter = false)
	{
		$val = in_array($var, array_keys($this->cache), true) ? $this->cache[$var] : $default_val;
		if ($resetAfter) $this->reset_cache();
		return $val;
	}
	public function reset_cache()
	{
		$this->cache = [];
	}

	public function setup()
	{

		if (bof()->getName() == "bof_admin")
			$this->setup_admin();

		else
			$this->setup_client();

		$this->setup_affiliate_role();
	}

	// both ends
	protected function setup_affiliate_role()
	{

		bof()->listen("object_user", "bof_admin_after", function ($method_args, &$bof_admin, $loader) {

			$bof_admin["filters"]["role_type"]["input"]["options"][] = ["affiliate", "Affiliate"];
			$bof_admin["filters"]["role_type"]["validator"][1]["values"][] = "affiliate";

			$groups = $bof_admin["object_groups"];
			foreach ($groups as $_g) {
				if ($_g[0] == "manager")
					$has_manager_group = true;
			}

			if (empty($has_manager_group))
				$bof_admin["object_groups"][] = ["manager", "Manager"];
		});
		bof()->listen("object_user", "select_role_type_after", function ($method_args, &$method_result, $loader) {

			$val = $method_args[0];

			if ($val == "affiliate")
				$method_result = ["s_affiliate", "=", "1"];
		});
		bof()->listen("object_user", "columns_after", function ($method_args, &$columns, $loader) {

			$columns["s_affiliate"] = array(
				"label" => "Affiliate",
				"validator" => array(
					"boolean",
					array(
						"empty()",
						"int" => true,
					)
				),
				"input" => array(
					"name" => "s_affiliate",
					"type" => "checkbox"
				),
				"bofAdmin" => array(
					"object" => array(
						"group" => "manager"
					)
				),
				"selectors" => array(
					"s_affiliate" => ["s_affiliate", "="]
				)
			);
			$columns["referrer_id"] = array(
				"label" => "Referrer",
				"tip" => "The affiliate who introduced this user and will make revenue when this user purchases an item",
				"bofInput" => array(
					"object",
					array(
						"type" => "user",
						"sub_type" => "affiliate"
					)
				),
				"bofAdmin" => array(
					"object" => array(
						"group" => "manager"
					)
				)
			);
			$columns["fund_by_referring"] = array(
				"label" => "Earnings through referral",
				"validator" => array(
					"float",
					array(
						"empty()",
						"min" => 0
					)
				),
				"bofAdmin" => array(
					"sortable" => true
				)
			);
		});

		bof()->listen("object_user_role", "parse_moderator_roles_pre", function (&$method_args, &$method_result, $loader) {

			list($roles, $user_id, $user_data) = $method_args;
			$roles = !empty($roles) ? $roles : [];

			$is_affiliate = !empty($user_data["s_affiliate"]);

			if ($is_affiliate) {

				$_moderator = array(
					"type" => "some",
					"objects" => array(),
					"objects_args" => array()
				);

				$roles[] = array(
					"ID" => "affiliate",
					"name" => "Affiliate",
					"comment" => "",
					"type" => "moderator",
					'bofAdmin_access' => json_encode($_moderator),
					'access' => null,
					'comparators' => null,
					'time_add' => null,
					'bofAdmin_access_decoded' => $_moderator
				);

				$method_args[0] = $roles;
			}
		});
		bof()->listen("object_user_role", "parse_users_after", function ($method_args, &$method_result, $loader) {

			$user_data = $method_args[0];
			$is_affiliate = !empty($user_data["s_affiliate"]);

			if ($is_affiliate) {

				$method_result["_raw"]["affiliate"] = array(
					'ID' => "affiliate",
					'name' => "Affiliate",
					'comment' => "",
					'type' => 'moderator',
					'bofAdmin_access' => null,
					'access' => null,
					'comparators' => null,
					'time_add' => null,
					'bofAdmin_access_decoded' => null
				);
			}
		});
		bof()->listen("object_user_role", "columns_after", function ($method_args, &$columns, $loader) {
			$columns["type"]["bofAdmin"]["filters"]["type"]["input"]["options"][] = ["affiliate", "Affiliate"];
			$columns["type"]["bofAdmin"]["filters"]["type"]["validator"][1]["values"][] = "affiliate";
			$columns["type"]["input"]["options"][] = ["affiliate", "Affiliate"];
			$columns["type"]["validator"][1]["values"][] = "affiliate";
		});
		bof()->listen("object_user_role", "parse_user_roles_get_map_after", function( $method_args, &$map, $loader ){
			$map[1][] = "verify_a";
			$map[1][] = "verify_a_aa";
		} );
		bof()->listen("object_user_role", "bof_admin_after", function ($method_args, &$bof_admin, $loader) {

			$bof_admin["object"]["a_hit_rew"] = array(
				"label" => "Pay per IP",
				"multi" => false,
				"display_on" => array(
					"type" => ["equal", "affiliate"]
				),
				"tip" => "Pay affiliate for every unique visitor ( based on IP ) they send to your app",
				"input" => array(
					"name" => "a_hit_rew",
					"type" => "text",
				),
				"validator" => array(
					"float",
					array(
						"empty()",
						"min" => 0,
					)
				)
			);
			$bof_admin["object"]["a_signup_rew"] = array(
				"label" => "Pay per signup",
				"multi" => false,
				"display_on" => array(
					"type" => ["equal", "affiliate"]
				),
				"tip" => "Pay affiliates everytime a visitor they send to your website signs up with a new account",
				"input" => array(
					"name" => "a_signup_rew",
					"type" => "text",
				),
				"validator" => array(
					"float",
					array(
						"empty()",
						"min" => 0,
					)
				)
			);
			$bof_admin["object"]["a_sale_rew"] = array(
				"label" => "Fixed transaction reward",
				"multi" => false,
				"display_on" => array(
					"type" => ["equal", "affiliate"]
				),
				"tip" => "Pay affiliates specific amount of money everytime a user they sent you purchases something",
				"input" => array(
					"name" => "a_sale_rew",
					"type" => "text",
				),
				"validator" => array(
					"float",
					array(
						"empty()",
						"min" => 0,
					)
				)
			);
			$bof_admin["object"]["a_sale_share"] = array(
				"label" => "Dynamic transaction reward",
				"multi" => false,
				"display_on" => array(
					"type" => ["equal", "affiliate"]
				),
				"tip" => "Pay affiliates a percentage of transaction's total price everytime a user they sent you purchases something",
				"input" => array(
					"name" => "a_sale_share",
					"type" => "digit",
				),
				"validator" => array(
					"float",
					array(
						"empty()",
						"min" => 0,
					)
				)
			);

			$_old = $bof_admin["object"];
			$bof_admin["object"] = [];
			foreach( $_old as $_k => $_v ){
				$bof_admin["object"][$_k] = $_v;
				if ( $_k == "user_verify" ){
					$bof_admin["object"]["user_verify_a"] = array(
						"label" => "Verification - Affiliate",
						"tip" => "Users belonging this user-role can submit their data to become affiliates",
						"multi" => false,
						"display_on" => array(
							"type" => [ "equal", "user" ],
							"user_verify" => [ "equal", 1 ]
						),
						"input" => array(
							"name" => "user_verify_a",
							"type" => "checkbox"
						),
						"validator" => array(
							"boolean",
							array(
								"empty()"
							)
						)
					);
					$bof_admin["object"]["user_verify_a_aa"] = array(
						"label" => "Verification - Affiliate - Auto approved",
						"tip" => "If checked, users will automatically get approved when they submit their documents",
						"multi" => false,
						"display_on" => array(
							"type" => [ "equal", "user" ],
							"user_verify" => [ "equal", 1 ],
							"user_verify_a" => [ "equal", 1 ],
						),
						"input" => array(
							"name" => "user_verify_a_aa",
							"type" => "checkbox"
						),
						"validator" => array(
							"boolean",
							array(
								"empty()"
							)
						)
					);
				}
			}

			bof()->affiliate->set_cache("ui_renderer", $bof_admin["object_ui_renderer"]);
			bof()->affiliate->set_cache("be_renderer", $bof_admin["object_be_renderer"]);

			$bof_admin["object_ui_renderer"] = function ($object, $parsed, $args, $request, &$_inputs, &$data) {

				$cache_ui_renderer_func = bof()->affiliate->get_cache("ui_renderer", null, true);
				$cache_ui_renderer_func($object, $parsed, $args, $request, $_inputs, $data);

				$_data = $request["type"] == "single" ? reset($request["content"]) : false;

				if (!empty($_data["data_decoded"]["affiliate"])) {
					$_inputs["m_hit_rew"]["input"]["value"] = !empty($_data["data_decoded"]["affiliate"]["hit_rew"]) ? $_data["data_decoded"]["affiliate"]["hit_rew"] : null;
					$_inputs["a_signup_rew"]["input"]["value"] = !empty($_data["data_decoded"]["affiliate"]["signup_rew"]) ? $_data["data_decoded"]["affiliate"]["signup_rew"] : null;
					$_inputs["a_sale_rew"]["input"]["value"] = !empty($_data["data_decoded"]["affiliate"]["sale_rew"]) ? $_data["data_decoded"]["affiliate"]["sale_rew"] : null;
					$_inputs["a_sale_share"]["input"]["value"] = !empty($_data["data_decoded"]["affiliate"]["sale_share"]) ? $_data["data_decoded"]["affiliate"]["sale_share"] : null;
				}
			};
			$bof_admin["object_be_renderer"] = function (&$_inputs, $request) {

				$cache_be_renderer_func = bof()->affiliate->get_cache("be_renderer", null, true);
				$cache_be_renderer_func($_inputs, $request);

				if (empty($_inputs["report"]["fail"])) {

					$_data = !empty($_inputs["set"]["data"]) ? json_decode($_inputs["set"]["data"], 1) : [];
					$_affiliate_data = [];
					if (!empty($_inputs["data"]["a_hit_rew"])) $_affiliate_data["hit_rew"] = $_inputs["data"]["a_hit_rew"];
					if (!empty($_inputs["data"]["a_signup_rew"])) $_affiliate_data["signup_rew"] = $_inputs["data"]["a_signup_rew"];
					if (!empty($_inputs["data"]["a_sale_rew"])) $_affiliate_data["sale_rew"] = $_inputs["data"]["a_sale_rew"];
					if (!empty($_inputs["data"]["a_sale_share"])) $_affiliate_data["sale_share"] = $_inputs["data"]["a_sale_share"];
					$_data["affiliate"] = $_affiliate_data;
					$_inputs["set"]["data"] = $_inputs["update"]["data"] = json_encode($_data);
				}
			};

		});

		bof()->listen("object_user_request", "_get_tabs_pre", function ($method_args, &$method_result, $loader) {
			$loader->object->user_request->_add_type("affiliate", "affiliate");
		});
		bof()->listen("object_ugc_property", "purchase_after", function ($method_args, $item_purchasable, $loader) {

			$user_id = !empty($method_args[2]) ? $method_args[2] : $loader->user->get()->ID;

			$user_data = $loader->object->user->select(
				array(
					"ID" => $user_id
				)
			);

			if (!empty($user_data["referrer_id"])) {

				$affiliate = $loader->object->user->select(
					array(
						"ID" => $user_data["referrer_id"],
						"role_type" => "affiliate"
					)
				);

				if ($affiliate) {

					$affiliate_roles = bof()->affiliate->parse_roles($affiliate);

					$fixed_rew = !empty($affiliate_roles["sale_rew"]) ? $affiliate_roles["sale_rew"] : 0;
					$dyna_rew  = !empty($affiliate_roles["sale_share"]) ? $affiliate_roles["sale_share"] : 0;

					$rew = $fixed_rew + ($dyna_rew ? ($dyna_rew / 100 * $item_purchasable["purchasable"]["price_d"]) : 0);
					$rew = round($rew, 1);

					bof()->object->user->add_fund(
						$affiliate["ID"],
						$rew,
						array(
							"type" => "commission",
							"object_type" => $item_purchasable["purchasable"]["ot"],
							"object_id" => $item_purchasable["purchasable"]["ID"],
							"revenue" => (-1 * $rew),
							"text" => "Share from user #{$user_id} purchase",
						)
					);
				}
			}
			
		});
	}

	// admin
	protected function setup_admin()
	{
		$this->setup_bofAdmin();
		$this->setup_admin_highlights();
	}
	protected function setup_bofAdmin()
	{

		bof()->listen("object_menu", "get_app_pages_after", function ($args, &$pages) {
			$pages["affiliate"] = "Affiliate Page";
		});
	}
	protected function setup_admin_highlights()
	{

		bof()->listen("highlights", "display_pre", function ($method_args, $method_result, $loader) {

			$sb_family = $method_args[0];

			$highlights = bof()->highlights->getData();
			$highlights["users_links"]["items"]["users_links"]["args"]["childs"][] = array(
				"icon"  => "hub",
				"title" => "Affiliates",
				"link"  => "user_list?role_type=affiliate"
			);
			$highlights["users_links"]["items"]["users_requests"]["args"]["childs"][] = array(
				"icon"  => "hub",
				"title" => "Affiliate Requests",
				"link"  => "user_requests?type=affiliate"
			);
			bof()->highlights->setData($highlights);
		});
	}

	// client
	protected function setup_client()
	{
		$this->setup_client_pages();
		$this->setup_client_endpoints();
		$this->setup_bofClient();
		$this->setup_assets();
		$this->setup_signup();
	}
	protected function setup_client_pages()
	{

		bof()->client_config->add_page("affiliate", array(
			"title_hook" => "affiliate",
			"url" => "^affiliate$",
			"theme_file" => endpoint_address . "affiliate",
			"theme_args" => (object) array(
				"use_base" => false,
			),
			"extenders" => (object) array(
				"affiliate_css" => (object) array(
					"type" => "css",
					"name" => "affiliate_css",
					"path" => endpoint_address . (bof()->object->core_setting->get("nginx_server") ? "affiliate_css" : "affiliate.css"),
					"dir" => false,
					"version" => bof()->plug->read("plugin", "bof_affiliate")["version"]
				),
				"affiliate_js" => (object) array(
					"type" => "js",
					"name" => "bof_affiliate_js",
					"path" => endpoint_address . (bof()->object->core_setting->get("nginx_server") ? "affiliate_js" : "affiliate.js"),
					"dir" => false,
					"version" => bof()->plug->read("plugin", "bof_affiliate")["version"]
				)
			),
			"body_class" => [],
			"becli" => array(
				array(
					"key" => "single",
					"endpoint" => "affiliate?\$bof ? urlData^url^query_s\$"
				)
			),
			"events" => (object) array(
				"ready" => "bof_affiliate_js.ready",
				"unloading" => "bof_affiliate_js.unloading",
			),
		));
	}
	protected function setup_client_endpoints()
	{

		// Files
		bof()->object->endpoint->add("affiliate_html", array(
			"url" => "affiliate.html",
			"response_type" => "file",
			"response_data" => array(
				"path" => bof_affiliate_root . "/theme/affiliate.html"
			),
		));
		bof()->object->endpoint->add("affiliate_css", array(
			"url" => (bof()->object->core_setting->get("nginx_server") ? "affiliate_css" : "affiliate.css"),
			"response_type" => "file",
			"response_data" => array(
				"path" => bof_affiliate_root . "/theme/affiliate.css",
			),
		));
		bof()->object->endpoint->add("affiliate_js", array(
			"url" => (bof()->object->core_setting->get("nginx_server") ? "affiliate_js" : "affiliate.js"),
			"response_type" => "file",
			"response_data" => array(
				"path" => bof_affiliate_root . "/theme/affiliate.js"
			),
		));

		// Actions
		bof()->object->endpoint->add("affiliate", array(
			"url" => "affiliate",
			"groups" => ["user"],
			"executers" => array(
				bof_affiliate_root . "/endpoints/endpoint_affiliate.php"
			)
		));
	}
	protected function setup_bofClient()
	{
	}
	protected function setup_assets()
	{

		bof()->listen("theme", "get_after", function ($method_args, &$themeData, $loader) {

			$themeData["assets"]["js"][] = array(
				"name" => "bof_affiliate_hook_js",
				"path" => "affiliate_hook.js",
				"base" => web_address . "/plugins/bof_affiliate/theme/",
				"dir"  => false
			);
		});
	}
	protected function setup_signup()
	{

		bof()->listen("user_auth", "submit_signup_after", function ($method_args, &$method_result, $loader) {

			$ref_code = $loader->nest->user_input("http_header", "x_bof_ref_code", "md5");

			if (!$method_result || !$ref_code)
				return;

			$check_ref_code = $loader->object->user->select(
				array(
					"hash" => $ref_code,
					"s_affiliate" => 1
				)
			);

			if ($check_ref_code) {
				$loader->object->user->update(
					array(
						"ID" => $method_result["id"]
					),
					array(
						"referrer_id" => $check_ref_code["ID"]
					)
				);
			}
		});
	}

	public function parse_roles($affiliate)
	{

		$this_affiliate_roles = explode(",", $affiliate["role_ids"]);
		$default_affiliate_role = bof()->object->user_role->select(["type" => "affiliate", "def" => 1])["ID"];
		$all_roles = array_merge($this_affiliate_roles, [$default_affiliate_role]);
		foreach ($all_roles as $p_roll) {

			$get_role = bof()->object->user_role->select(["ID" => $p_roll]);
			if ($get_role["type"] != "affiliate") continue;
			if (empty($get_role["data_decoded"]["affiliate"])) continue;

			$affiliate_roles[] = $get_role["data_decoded"]["affiliate"];
		}

		if (!empty($affiliate_roles)) {

			foreach (["hit_rew", "signup_rew", "sale_rew", "sale_share"] as $_k) {
				foreach ($affiliate_roles as $affiliate_role) {
					if (!empty($affiliate_role[$_k]))
						$_ks[$_k][] = $affiliate_role[$_k];
				}
				if (!empty($_ks[$_k]))
					$_ks[$_k] = max($_ks[$_k]);
			}
		}

		return !empty($_ks) ? $_ks : [];
	}
}
