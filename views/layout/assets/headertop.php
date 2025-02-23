<!DOCTYPE html>
<html data-navigation-type="default" data-navbar-horizontal-shape="default" lang="en-US" dir="ltr">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- ===============================================-->
  <!--    Document Title-->
  <!-- ===============================================-->
  <title><?php echo APP_COMPANY; ?></title>

  <!-- ===============================================-->
  <!--    Favicons-->
  <!-- ===============================================-->
  <link rel="apple-touch-icon" sizes="180x180"
    href="<?php echo BASE_URL ?>public/assets/img/favicons/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32"
    href="<?php echo BASE_URL ?>public/assets/img/favicons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16"
    href="<?php echo BASE_URL ?>public/assets/img/favicons/favicon-16x16.png">
  <link rel="shortcut icon" type="image/x-icon" href="<?php echo BASE_URL ?>public/assets/img/favicons/favicon.ico">
  <link rel="manifest" href="<?php echo BASE_URL ?>public/assets/img/favicons/manifest.json">
  <meta name="msapplication-TileImage" content="<?php echo BASE_URL ?>public/assets/img/favicons/mstile-150x150.png">
  <meta name="theme-color" content="#ffffff">
  <script src="<?php echo BASE_URL ?>public/vendors/simplebar/simplebar.min.js"></script>
  <script src="<?php echo BASE_URL ?>public/assets/js/config.js"></script>


  <!-- ===============================================-->
  <!--    Stylesheets-->
  <!-- ===============================================-->
  <link href="<?php echo BASE_URL ?>public/vendors/choices/choices.min.css" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800;900&amp;display=swap"
    rel="stylesheet">
  <link href="<?php echo BASE_URL ?>public/vendors/simplebar/simplebar.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.8/css/line.css">
  <link href="<?php echo BASE_URL ?>public/assets/css/theme-rtl.min.css" type="text/css" rel="stylesheet"
    id="style-rtl">
  <link href="<?php echo BASE_URL ?>public/assets/css/theme.min.css" type="text/css" rel="stylesheet"
    id="style-default">
  <link href="<?php echo BASE_URL ?>public/assets/css/user-rtl.min.css" type="text/css" rel="stylesheet"
    id="user-style-rtl">
  <link href="<?php echo BASE_URL ?>public/assets/css/user.min.css" type="text/css" rel="stylesheet"
    id="user-style-default">
  <script>
    var phoenixIsRTL = window.config.config.phoenixIsRTL;
    if (phoenixIsRTL) {
      var linkDefault = document.getElementById('style-default');
      var userLinkDefault = document.getElementById('user-style-default');
      linkDefault.setAttribute('disabled', true);
      userLinkDefault.setAttribute('disabled', true);
      document.querySelector('html').setAttribute('dir', 'rtl');
    } else {
      var linkRTL = document.getElementById('style-rtl');
      var userLinkRTL = document.getElementById('user-style-rtl');
      linkRTL.setAttribute('disabled', true);
      userLinkRTL.setAttribute('disabled', true);
    }
    window.config.set({
      phoenixNavbarTopShape: 'slim'
    });
  </script>
  <link href="<?php echo BASE_URL ?>public/vendors/leaflet/leaflet.css" rel="stylesheet">
  <link href="<?php echo BASE_URL ?>public/vendors/leaflet.markercluster/MarkerCluster.css" rel="stylesheet">
  <link href="<?php echo BASE_URL ?>public/vendors/leaflet.markercluster/MarkerCluster.Default.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.datatables.net/2.2.2/css/dataTables.bootstrap5.min.css" />
  <!-- <style>
    .select2-sm .select2-selection--multiple {
      min-height: calc(1.8em + 0.5rem + 2px);
      /* Ajusta la altura */
      padding: 0.25rem 0.5rem;
      /* Ajusta el padding */
      font-size: 0.875rem;
      /* Ajusta el tamaño de la fuente */
    }

    .select2-sm .select2-dropdown {
      font-size: 0.875rem;
      /* Tamaño de fuente pequeño */
    }
  </style> -->

  <style>
    /* Estilos para el contenedor del select */
    .select2-sm .select2-selection--single,
    .select2-sm .select2-selection--multiple {
      min-height: calc(1.8em + 0.5rem + 2px);
      /* Altura reducida */
      padding: 0.25rem 0.5rem;
      /* Padding reducido */
      font-size: 0.875rem;
      /* Tamaño de fuente pequeño */
      line-height: 1.5;
      /* Ajuste de la altura de línea */
    }

    /* Estilos para el dropdown (desplegable) */
    .select2-sm .select2-dropdown {
      font-size: 0.875rem;
      /* Tamaño de fuente pequeño */
    }

    /* Estilos para los elementos dentro del dropdown */
    .select2-sm .select2-results__option {
      padding: 0.25rem 0.5rem;
      /* Padding reducido */
    }

    /* Estilos para el placeholder */
    .select2-sm .select2-selection__placeholder {
      font-size: 0.875rem;
      /* Tamaño de fuente pequeño */
    }

    /* Estilos para el contenedor de selección múltiple */
    .select2-sm .select2-selection--multiple .select2-selection__choice {
      font-size: 0.875rem;
      /* Tamaño de fuente pequeño */
      padding: 0.1rem 0.5rem;
      /* Padding reducido */
      margin: 0.1rem;
      /* Margen reducido */
    }

    /* Estilos para el botón de eliminar en selección múltiple */
    .select2-sm .select2-selection--multiple .select2-selection__choice__remove {
      margin-right: 0.25rem;
      /* Margen reducido */
    }

    /* Estilos personalizados para SweetAlert2 */
    .custom-swal-popup {
      font-size: 14px;
      /* Tamaño de fuente más pequeño */
    }

    .custom-swal-title {
      text-align: center;
      /* Centrar el título */
      font-size: 16px;
      /* Tamaño de fuente del título */
    }

    .custom-swal-html-container {
      text-align: left;
      /* Alinear el mensaje a la izquierda */
      font-size: 14px;
      /* Tamaño de fuente del mensaje */
    }

    #loading-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    #loading-overlay-nexosapp {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    #loading-overlay-oet {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    #loading-overlay-rndc {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    #loading-overlay-mensaje_carga {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    #loading-spinner {
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid #ffffff;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }
  </style>

</head>

<!-- <body class="nav-slim"> -->

<!-- <body class="overflow-x-hidden bg-white"> -->

<body class="overflow-x-hidden">
  <!-- URL PARA CARGAR -->
  <input type="hidden" name="base_url" id="base_url" value="<?php echo BASE_URL ?>">
  <nav class="navbar navbar-vertical navbar-expand-lg" style="display: none;"></nav>
  <nav class="navbar navbar-top navbar-slim justify-content-between fixed-top navbar-expand-lg" id="navbarTopSlim" style="display:none;">
    <div class="navbar-logo">
      <button class="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent" type="button"
        data-bs-toggle="collapse" data-bs-target="#navbarTopCollapse" aria-controls="navbarTopCollapse"
        aria-expanded="false" aria-label="Toggle Navigation">
        <span class="navbar-toggle-icon">
          <span class="toggle-line"></span>
        </span>
      </button>
      <a class="navbar-brand navbar-brand" href="<?php echo BASE_URL ?>">
      <span class="fw-bold">Harmony </span> <span class="text-body-highlight d-none d-sm-inline">Group</span>
      </a>
    </div>
    <div class="collapse navbar-collapse navbar-top-collapse order-1 order-lg-0 justify-content-center"
      id="navbarTopCollapse">
      <ul class="navbar-nav navbar-nav-top" data-dropdown-on-hover="data-dropdown-on-hover">
        <li class="nav-item dropdown">
          <!-- <li class="nav-item"> </li></li> -->
          <!-- <a class="nav-link lh-1" href="<?php echo BASE_URL; ?>" role="button" data-bs-toggle="dropdown"
            data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
            <span data-feather="home" class="me-2"></span> Dashboard
          </a> -->
          <a class="nav-link dropdown-toggle lh-1" href="<?= BASE_URL; ?>" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false"><span class="uil fs-8 me-2 uil-create-dashboard text-danger"></span>Dashboard</a>
        </li>
        <!-- Crear menu -->
        <?php
        /***** SE CREA MENU PRINCIPAL *****/
        $host = $_SERVER["HTTP_HOST"];
        $url = $_SERVER["REQUEST_URI"];
        // Se valida si el usuario está logueado
        if (isset($_SESSION['usuario']) == true):
          $_url_preticion = $host . $url;
          // Se valida el acceso a la pagina es correcta
          if (BASE_URL == ("http://" . $_url_preticion)) {
            header('location:' . BASE_URL . 'index/lanzador');
          }
        ?>

          <?php if (isset($_layoutParams['menu'])):
            $_get = new Request(); ?>
            <?php foreach ($_layoutParams['menu'] as $key => $value): ?>
              <?php $menuId = "nv-" . str_replace(' ', '-', strtolower($key)); ?>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle lh-1" href="#!" role="button" data-bs-toggle="dropdown"
                  data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
                  <span data-feather="layers" class="me-2 text-danger"></span><?php echo $key; ?></a>
                <ul class="dropdown-menu navbar-dropdown-caret">
                  <?php foreach ($value as $subKey => $subValue):
                    // $url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

                    // // Extraer la parte de la consulta (query)
                    // $query_string = parse_url($url, PHP_URL_QUERY);

                    // // Reemplazar "/?" por "&" para corregir el formato
                    // $query_string = str_replace('/?', '&', $query_string);

                    // // Parsear los parámetros
                    // parse_str($query_string, $query_params);

                    // // Obtener los valores de idmenu y submenu
                    // $idmenu_encrypted = $query_params['idmenu'] ?? null;
                    // $submenu_encrypted = $query_params['submenu'] ?? null;

                    // // Descifrar los valores
                    // $idmenu = decrypt($idmenu_encrypted);
                    // $submenu = decrypt($submenu_encrypted);
                    // $tmpIdmenu =  $idmenu;
                    $tmpIdmenu = $_GET['idmenu'];
                  ?>

                    <li>
                      <a class="dropdown-item" href="<?php echo $subValue["enlace"] ?>/<?php echo $subValue["metodo"] ?>?idmenu=<?php echo $tmpIdmenu ?>/?submenu=<?php echo $subValue['submenu_id'] ?>"
                        data-id="<?php echo $subValue['submenu_id'] ?>">
                        <div class="dropdown-item-wrapper">
                          <span class="me-2 uil" data-feather="arrow-right-circle"></span>
                          <?php echo $subValue['titulo']; ?>
                          <!-- <?php echo $subValue['submenu_id']; ?> -->
                        </div>
                      </a>
                    </li>
                  <?php endforeach; ?>
                </ul>
              </li>
            <?php endforeach; ?>
          <?php else: ?>
            <!-- Hola desde de el if de menu -->
          <?php endif; ?>
        <?php else:
          $menu = "";
          if (BASE_URL != ("http://" . $host . $url)) {
            if (empty($_REQUEST['k'])) {
              header('location:' . BASE_URL);
            }
          }
        endif; ?>
      </ul>
    </div>
  </nav>
  <script>
    var navbarVertical = document.querySelector('.navbar-vertical');
    var navbarTopSlim = document.querySelector('#navbarTopSlim');
    var body = document.querySelector('body');
    navbarVertical.remove()
    navbarTopSlim.removeAttribute('style');
    document.documentElement.setAttribute('data-navbar-horizontal-shape', 'slim');
  </script>
  <main class="main" id="top">
    <?php require_once "./views/layout/layout.php"; ?>