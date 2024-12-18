<?php

require_once( dirname(__FILE__) . "/api/app/config.php" );

require_once( bof_root . "/loader.php" );
require_once( root . "/app/client/loader.php" );

$pages = bof()->client_config->get_pages();
$match = bof()->request->match_page( $pages, true );
$seo = bof()->seo->fetch( !empty( $match[1] ) ? $match[1] : null, true );

$link = false;

if ( !empty( $_SERVER['HTTP_HOST'] ) ){
  $link = ( substr( web_address, 0, strlen("https") ) == "https" ? "https" : "http" ) . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
  if ( substr( $link, 0, strlen( web_address ) ) == web_address ) $link = substr( $link, strlen( web_address ) );
}

if ( !$match ){
  if ( !empty( parse_url( $link, PHP_URL_PATH ) ) ){
    require_once( dirname(__FILE__) . "/404.php" );
    return;
  }
}

if ( count( explode( "?", $link ) ) > 1 ){
  $_l = explode( "?", $link );
  if ( 
    substr( $_l[0], -8 ) != "userAuth" && 
    substr( $_l[0], -9 ) != "user_edit" && 
    substr( $_l[0], -12 ) != "user_library" && 
    substr( $_l[0], -6 ) != "search" && 
    substr( $_l[0], 0, 5 ) != "list/" 
  )
  $link = $_l[0];
}

?>
<!DOCTYPE html>
<html>
  <head>

    <base href="<?php echo web_address; ?>">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=0">
    <meta name="HandheldFriendly" content="True">
    <meta name="MobileOptimized" content="360">
    <meta name="color-scheme" content="light dark">
    <link rel="manifest" href="manifest.json">
    <link rel="icon" type="image/png" href="api/assets/images/icon_128.png" />


    <title><?php echo $seo["title"]; ?></title>

    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css">
    <link href='https://fonts.googleapis.com/css2?family=<?php echo bof()->object->db_setting->get("font_name") ?>:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300&family=Almarai:wght@300;400;700&display=swap' rel='stylesheet' media='all' type='text/css'>

    <meta name="twitter:title" content="<?php echo $seo["title"]; ?>" />
    <meta property="og:title" content="<?php echo $seo["title"]; ?>" />
    <meta property="og:site_name" content="<?php echo bof()->object->db_setting->get( "sitename" ); ?>" />
    <?php if ( !empty( $seo["description"] ) ) : ?>
    <meta name='description' content='<?php echo $seo["description"]; ?>' >
    <meta name="twitter:description" content="<?php echo $seo["description"]; ?>" />
    <meta property="og:description" content="<?php echo $seo["description"]; ?>" />
    <?php endif; ?><?php if ( !empty( $seo["tags"] ) ) : ?>
    <meta name="keywords" content="<?php echo $seo["tags"]; ?>">
    <?php endif; ?><?php if ( !empty( $seo["image"] ) ) : ?>
    <meta property="og:image" content="<?php echo $seo["image"]; ?>" />
    <meta name="twitter:image" content="<?php echo $seo["image"]; ?>" />
    <?php endif; ?>
    <meta property="og:url" content="<?php echo web_address . $link ?>" />
    <meta name="twitter:card" content="summary_large_image" />

  </head>
  <style>

  body {
    --theme_color: <?php echo bof()->object->db_setting->get("theme_color_rgb"); ?>;
    font-family: "<?php echo bof()->object->db_setting->get("font_name") ?>" !important
  }
  body.splash {
    background: #101210 !important
  }
  body.splash .loader > div {
    width: 48px;
    height: 48px;
    border: 5px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: splash_loader_rotation 2s linear infinite;
  }
  body.splash .loader > .bof_part {
    display: none
  }
  body.splash .loader {
    position: fixed;
    height: fit-content;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    opacity: 0.1
  }
  @keyframes splash_loader_rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .bof_part {
    display: none
  }

  </style>
  <body class="splash unloaded noParts noPaddings">

    <div id="main">

      <div class="content"></div>
      <div class="loader"><div></div></div>

    </div>

    <?php echo bof()->object->db_setting->get("custom_js") . bof()->object->db_setting->get("ads_google_auto_code"); ?>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script>
    var $_bof_config = {
      production: <?php echo production ? "true" : "false"; ?>,
      version: <?php echo bof_version; ?>,
      web_address: "<?php echo web_address; ?>",
      endpoint_address: "<?php echo endpoint_address; ?>",
      assets_address: "<?php echo endpoint_address; ?>assets/",
      bof_assets_address: "<?php echo bof_assets_address; ?>",
      requested_page: "<?php echo $match[0]; ?>",
      requested_url: "<?php echo $link; ?>",
      sign_key: "<?php echo sign_key; ?>",
      cfc: <?php echo defined("cf_cache") ? ( cf_cache ? "true" : "false" ) : "false" ?>
    };
    </script>
    <script src="<?php echo bof_assets_address; ?>js/bof/bof<?php echo production ? "_mini" : "" ?>.js?bof_version=<?php echo bof_version; ?>"></script>

  </body>
</html>
