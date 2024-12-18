<?php

header( "HTTP/1.0 404 Not Found" );



?>
<!DOCTYPE html>
<html>
<head>

  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;500;900&display=swap" rel="stylesheet">
  <title>Not found</title>

</head>
<style>
body {
  background: #101210 !important;
  font-family: 'Roboto', cursive;
  color: #fff;
}

.wrapper {
  position: absolute;
  height: fit-content;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  margin: auto;
  text-align: center;
}

.wrapper .title {
  font-size: 20vw;
  filter: hue-rotate(283deg);
  color: #fff;
  font-weight: 900;
  margin-bottom: 50px;
}


.wrapper .title span {
  text-shadow: 1vmin 1vmin rgb(204 0 255), 1.5vmin 1.5vmin rgb(255 255 255 / 90%);
  animation: colorrize 14s infinite
}


.wrapper .tip {
  font-weight: 500;
  margin-bottom: 10px;
  font-size: 18pt;
}

.wrapper a {
  font-weight: 300;
  font-size: 10pt;
  opacity: 0.6;
  /* text-decoration: underline; */
  color: #fff;
}


@keyframes colorrize {
  0% {
    filter: hue-rotate(0deg)
  }
  50% {
    filter: hue-rotate(360deg)
  }
}
</style>
<body class="noParts noPaddings n404">
  <div class="wrapper">
    <div class="title">Error <span>404</span></div>
    <div class="tip">Page not found</div>
    <a href="<?php echo web_address; ?>">Sorry, click here to go back home</a>
  </div>
</body>
</html>
