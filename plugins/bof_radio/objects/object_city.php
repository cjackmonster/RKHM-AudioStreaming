<?php

if ( !defined( "bof_root" ) ) die;

class object_r_city extends bof_type_object_child {

  public $sample_parent = "tag";
  public function child(){
    return (object) array(
      "bof_admin_edit_url" => "radio_city",
      "bof_admin_list_url" => "radio_cities",
      "bof_client_single_url" => "radio/city",
      "bof_client_list_url" => "radio/city",
      "relations" => array(
        "r_station" => array(
          "stat" => "stations",
          "selector" => "city_id",
          "bof_admin_list_url" => "radio_stations",
          "label" => bof()->object->language->turn( "stations",[],["uc_first"=>true,"lang"=>"users"] ),
        ),
      ),
    );
  }

  // BusyOwlFramework handshake
  public function bof(){
    return $this->_parent->bof(
      $this->_bof_this,
      array(
        "name" => "r_city",
        "label" => "Radio City",
        "db_table_name" => "_c_r_cities",
      )
    );
  }

  public function columns(){

    return $this->_parent->columns(
      $this->_bof_this,
      array(
        "country_id" => array(
          "label" => "Country",
          "bofInput" => array(
            "object",
            array(
              "type" => "r_country"
            )
          ),
          "bofAdmin" => array(
            "object" => array(
              "required" => true
            )
          ),
          "relations" => array(
            "country" => array(
              "exec" => array(
                "type" => "direct",
                "parent_object" => "r_country",
                "parent_object_stats_column" => "s_cities",
                "child_object" => "r_city",
                "child_object_selector_column" => "country_id",
                "delete_child_too" => true
              )
            )
          ),
          "selectors" => array(
            "country_id" => [ "country_id", "=" ],
            "col_country" => [ "country_id", "by_column" ],
          )
        ),
        "lo" => array(
          "public" => true,
          "label" => "Longitude",
          "validator" => array(
            "float",
            array(
              "empty()",
              "min" => false
            )
          )
        ),
        "la" => array(
          "public" => true,
          "label" => "Latitude",
          "validator" => array(
            "float",
            array(
              "empty()",
              "min" => false
            )
          )
        ),
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
