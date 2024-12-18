<?php

if ( !defined( "root" ) ) die;

class chapar_push extends bof_type_class {

  public function exe( $args ){

    $target_push_ids = null;
    $message_title = null;
    $message_content = null;
    $message_image = null;
    extract( $args );

    require_once( chapar_plugin_root . "/third/minishlink_web-push_v7.0.0/autoload.php" );

    $notifications = [];
    foreach( $target_push_ids as $target_push_id ){
      $notifications[] = array(
        "subscription" => Minishlink\WebPush\Subscription::create( $target_push_id ),
        "payload" => json_encode(array(
          "title" => $message_title,
          "content" => $message_content,
          "image" => $message_image
        ))
      );
    }

    $webPush = new Minishlink\WebPush\WebPush([
      'VAPID' => [
        'subject' => web_address,
        'publicKey' => vapid_public,
        'privateKey' => vapid_private,
      ],
    ]);

    foreach ($notifications as $notification) {
      $webPush->queueNotification(
        $notification['subscription'],
        $notification['payload']
      );
    }

    foreach ($webPush->flush() as $report) {
      $endpoint = $report->getRequest()->getUri()->__toString();
      if ($report->isSuccess()) {
      } else {
      }
    }

  }

}

?>
