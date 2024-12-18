<?php

if ( !defined( "bof_root" ) ) die;

class object_r_station_source extends bof_type_object_child {

  public $sample_parent = "source";
  public function child(){
    return (object) array(
      "bof_admin_edit_url" => "radio_station_source",
      "bof_admin_list_url" => "radio_station_sources",
      "types" => [ "audio", "video", "youtube" ],
      "live" => true
    );
  }

  // BusyOwlFramework handshake
  public function bof(){
    return $this->_parent->bof(
      $this->_bof_this,
      array(
        "name" => "r_station_source",
        "label" => "Radio Station Source",
        "db_table_name" => "_c_r_stations_sources",
      )
    );
  }
  public function columns(){

    return $this->_parent->columns(
      $this->_bof_this,
      array(
        "target_id" => array(
          "label" => "Target",
          "bofInput" => array(
            "object",
            array(
              "type" => "r_station"
            )
          ),
          "bofAdmin" => array(
            "object" => array(
              "required" => true
            ),
            "list" => array(
              "type" => "simple",
              "renderer" => function( $displayItem, $item, $displayData ){
                $displayData["data"] = $item["bof_dir_target"]["title"];
                $displayData["data"] .= "<span class='sub'>";
                $displayData["data"] .= ucfirst( $item["_title"] );
                $displayData["data"] .= "</span>";
                return $displayData;
              },
            ),
            "filters" => array(
              "col_station" => array(
                "title" => "Station",
                "input" => array(
                  "name" => "col_station",
                ),
                "bofInput" => array(
                  "object",
                  array(
                    "type" => "r_station",
                    "multi" => true,
                    "autoload" => false
                  )
                )
              ),
            )
          ),
          "relations" => array(
            "target" => array(
              "exec" => array(
                "type" => "direct",
                "parent_object" => "r_station",
                "child_object" => "r_station_source",
                "child_object_selector_column" => "target_id",
                "delete_child_too" => true,
                "limit" => 1
              )
            )
          ),
          "selectors" => array(
            "target_id" => [ "target_id", "=" ],
            "station_id" => [ "target_id", "=" ],
            "col_station" => [ "target_id", "by_column" ],
            "col_target" => [ "target_id", "by_column" ],
          )
        ),
      )
    );

  }

  public function fetch_file_data( $target_id ){

    $station = bof()->object->r_station->select(
      array(
        "ID" => $target_id
      ),
      array(
        "_eq" => array()
      )
    );

    return array(
      "premium" => false,
      "new_name" => $station["title"],
      "new_id3_tags" => array(
        "title"        => [ $station["title"] ],
      )
    );

  }

}

?>
