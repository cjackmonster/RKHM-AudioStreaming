<?php

if ( !defined( "bof_root" ) ) die;

class object_r_country extends bof_type_object_child {

  public $sample_parent = "tag";
  public function child(){
    return (object) array(
      "bof_admin_edit_url" => "radio_country",
      "bof_admin_list_url" => "radio_countries",
      "bof_client_single_url" => "radio/country",
      "bof_client_list_url" => "radio/country",
      "relations" => array(
        "r_station" => array(
          "stat" => "stations",
          "selector" => "country_id",
          "bof_admin_list_url" => "radio_stations",
          "label" => bof()->object->language->turn( "stations",[],["uc_first"=>true,"lang"=>"users"] ),
          "display" => array(
            "limit" => 25,
            "slider_mason" => true,
            "link_on_bottom" => true,
          )
        ),
      ),
    );
  }

  // BusyOwlFramework handshake
  public function bof(){
    return $this->_parent->bof(
      $this->_bof_this,
      array(
        "name" => "r_country",
        "label" => "Radio Country",
        "db_table_name" => "_c_r_countries",
      )
    );
  }

  public function columns(){

    return $this->_parent->columns(
      $this->_bof_this,
      array(
        "iso2" => array(
          "public" => true,
          "label" => "ISO code",
          "tip" => "ISO 3166 country code. Example: US, NG",
          "validator" => array(
            "string",
            array(
              "empty()"
            )
          ),
          "input" => array(
            "type" => "text"
          ),
          "bofAdmin" => array(
            "object" => array(
              "required" => true
            )
          )
        ),
        "region_id" => array(
          "label" => "Region",
          "bofInput" => array(
            "object",
            array(
              "type" => "r_region"
            )
          ),
          "bofAdmin" => array(
            "object" => array(
              "required" => true
            )
          ),
          "relations" => array(
            "region" => array(
              "exec" => array(
                "type" => "direct",
                "parent_object" => "r_region",
                "parent_object_stats_column" => "s_countries",
                "child_object" => "r_country",
                "child_object_selector_column" => "region_id",
                "delete_child_too" => true
              )
            )
          ),
          "selectors" => array(
            "region_id" => [ "region_id", "=" ],
            "col_region" => [ "region_id", "by_column" ],
          )
        ),
      )
    );

  }

  public function stats_columns(){

    return $this->_parent->stats_columns(
      $this->_bof_this,
      array(
        "cities" => array(
          "label" => "Cities"
        )
      )
    );

  }

  public function relations(){

    return $this->_parent->relations(
      $this->_bof_this,
      array(
        "cities" => array(
          "exec" => array(
            "type" => "direct",
            "parent_object" => "r_country",
            "parent_object_stats_column" => "s_cities",
            "child_object" => "r_city",
            "child_object_selector_column" => "country_id",
            "delete_child_too" => true
          )
        )
      )
    );

  }

  public function clean_search_terms( $item ){

    $o = array(
      $item["name"] => 1,
    );

    return $o;

  }

}

?>
