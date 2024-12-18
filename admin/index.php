<?php

require_once( dirname(dirname(__FILE__)) . "/api/app/config.php" );

require_once( bof_root . "/loader.php" );
require_once( root . "/app/admin/loader.php" );

$pages = bof()->client_config->get_pages();
$match = bof()->request->match_page( $pages );
$link = ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] === 'on' ? "https" : "http" ) . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
if ( substr( $link, 0, strlen( admin_web_address ) ) == admin_web_address ) $link = substr( $link, strlen( admin_web_address ) );

?>
<!DOCTYPE html>
<html>
  <head>

    <base href="<?php echo admin_web_address; ?>">
    <meta charset="utf-8">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">
    <meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover">
    <meta name="color-scheme" content="light dark">

    <title>Admin Area</title>

    <link rel="icon" type="image/png" href="../api/assets/images/icon_128.png" />

    <link rel="stylesheet" href="theme/assets/css/loader.css?t=<?php echo microtime(); ?>">
    <link rel="stylesheet" href="theme/assets/css/base.css?t=<?php echo microtime(); ?>">
    <link rel="stylesheet" href="theme/assets/css/grid.css?t=<?php echo microtime(); ?>">
    <link rel="stylesheet" href="theme/assets/css/theme.css?t=<?php echo microtime(); ?>">
    <link rel="stylesheet" href="theme/assets/css/dark.css?t=<?php echo microtime(); ?>">
    <link rel="stylesheet" href="theme/assets/css/content.css?t=<?php echo microtime(); ?>">
    <link rel="stylesheet" href="js/third/shalinguyen-socialicious/css/socialicious.css?t=<?php echo microtime(); ?>">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Teko:wght@300;400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">


  </head>
  <body class="splash unloaded noParts noPaddings">

    <div id="main">

      <div class="content"></div>
      <div class="loader"></div>

    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script>
    var $_bof_config = {
      production: false,
      version: <?php echo bof_version; ?>,
      web_address: "<?php echo admin_web_address; ?>",
      endpoint_address: "<?php echo admin_endpoint_address; ?>",
      assets_address: "<?php echo admin_web_address; ?>",
      bof_assets_address: "<?php echo bof_assets_address; ?>",
      requested_page: "<?php echo !empty( $match[0] ) ? $match[0] : ""; ?>",
      requested_url: "<?php echo $link; ?>",
      sign_key: "<?php echo sign_key; ?>",
      cfc: <?php echo defined("cf_cache") ? ( cf_cache ? "true" : "false" ) : "false" ?>
    };
    </script>
    <script src="<?php echo bof_assets_address; ?>js/bof/bof.js"></script>

  </body>
</html>
