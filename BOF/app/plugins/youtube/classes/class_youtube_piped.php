<?php

if ( !defined( "bof_root" ) ) die;

class youtube_piped extends bof_type_class {

    protected $instance_urls = [];
    protected $preferred_type = null;

    public function set_setting(){

        if ( $this->instance_urls )
        return $this;

        $this->set_instance_urls( bof()->object->db_setting->get( "youtube_piped_iu", "https://pipedapi.darkness.services/" ) );
        $this->preferred_type = bof()->object->db_setting->get( "youtube_piped_st" );

        return $this;
    }
    public function set_instance_urls( $urls ){

        foreach( explode( PHP_EOL, $urls ) as $url ){
            $url = trim( $url );
            $url = $url . ( substr( $url, -1 ) == "/" ? "" : "/" );
            $this->instance_urls[] = $url;
        } 
        $this->instance_urls = array_unique( $this->instance_urls );
        return $this;

    }
    public function get_stream( $id ){
        
        $i=0;
        foreach ($this->instance_urls as $instance_url) {
            $i++;
            try {
                $data = $this->get_video_stream($id, $instance_url);
                $gotOne = true;
                break;    
            } catch (Exception | bofException $err) {
                $lastException = $err->getMessage();
                continue;
            }
        }

        if ( empty( $gotOne ) )
        throw new bofException( "yt_piped failed. searched {$i} intances" );

        $preferred_type = $this->preferred_type;
        list( $p_t, $p_q ) = explode( "_", $preferred_type );

        $chosenURL = null;
        $chosenMIME = null;
        $chosenURLScore = 0;

        $sources = $p_t == "audio" ? $data["audioStreams"] : $data["videoStreams"];
        foreach( $sources as $source ){

            if ( !empty( $source["videoOnly"] ) )
            continue;

            $choose = false;
            $score = $p_t == "audio" ? intval( $source["quality"] ) : $source["width"];

            if ( $chosenURL === null )
            $choose = true;
            elseif ( $p_q == "hq" && $score > $chosenURLScore )
            $choose = true;
            elseif ( $p_q == "lq" && $score < $chosenURLScore )
            $choose = true;

            if ( $choose ){
                $chosenURL = $source["url"];
                $chosenMIME = $source["mimeType"];
                $chosenURLScore = $score;
            }

        }

        if ( !$chosenURL )
        throw new bofException("No Valid Stream");
        
        return array(
            "url" => $chosenURL,
            "mime" => $chosenMIME,
            "type" => $p_t
        );

    }
    public function get_video_stream( $id, $instance_url ){

        $exe = bof()->curl->exe( array(
            "url" => $instance_url . "streams/{$id}",
            "cache" => false,
            "agent" => "chrome",
            "headers" => array(
                "Origin: " . web_address,
                "X-Requested-With: XMLHttpRequest"
            )
        ) );

        if ( $exe["http_code"] != 200 )
        throw new bofException( "Invalid http code {$exe["http_code"]}" );

        if ( empty( $exe["data"] ) )
        throw new bofException( "Invalid body" );

        if ( empty( $exe["data"]["videoStreams"] ) )
        throw new bofException( "No Video Streams" );

        return $exe["data"];

    }

    public function get_instances(){

        $exe = bof()->curl->exe(array(
            "url"   => "https://github.com/TeamPiped/Piped/wiki/Instances",
            "type"  => "web",
            "agent" => "chrome",
            "cache" => true,
            "cache_load" => true,
        ));

        $pattern = '/<td><a href="([^"]+)"[^>]*>([^<]+)<\/a><\/td>/';

        preg_match_all($pattern, $exe["body"], $matches);

        $urls = [];

        if ( !empty( $matches[1] ) ){
            foreach( array_intersect( $matches[1], $matches[2] ) as $_iurl ){
                $urls[] = $_iurl;
            }
        }

        return $urls;

    }

}

?>
