<?php

if ( !defined( "bof_root" ) ) die;

class object_r_region extends bof_type_object_child {

  public $sample_parent = "tag";
  public function child(){
    return (object) array(
      "bof_admin_edit_url" => "radio_region",
      "bof_admin_list_url" => "radio_regions",
      "bof_client_single_url" => "radio/region",
      "bof_client_list_url" => "radio/region",
      "relations" => array(
        "r_station" => array(
          "stat" => "stations",
          "selector" => "region_id",
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
        "name" => "r_region",
        "label" => "Radio Region",
        "db_table_name" => "_c_r_regions",
      )
    );
  }

  public function stats_columns(){

    return $this->_parent->stats_columns(
      $this->_bof_this,
      array(
        "countries" => array(
          "label" => "countries"
        ),
      )
    );

  }

  public function relations(){

    return $this->_parent->relations(
      $this->_bof_this,
      array(
        "countries" => array(
          "exec" => array(
            "type" => "direct",
            "parent_object" => "r_region",
            "parent_object_stats_column" => "s_countries",
            "child_object" => "r_country",
            "child_object_selector_column" => "region_id",
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
