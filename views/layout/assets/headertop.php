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
  <!-- Agregamos SheetJS desde un CDN, o podrías instalarlo con npm/yarn -->
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
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
  <input type="hidden" name="perfil_id" id="perfil_id" value="<?= $_SESSION["usuario"]["id_perfil"] ?>">
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
                    $tmpIdmenu = $_GET['idmenu'];
                  ?>

                    <!-- <li>
                      <a class="dropdown-item" href="<?php echo $subValue["enlace"] ?>/<?php echo $subValue["metodo"] ?>?idmenu=<?php echo $tmpIdmenu ?>/?submenu=<?php echo $subValue['submenu_id'] ?>"
                        data-id="<?php echo $subValue['submenu_id'] ?>">
                        <div class="dropdown-item-wrapper">
                          <span class="me-2 uil" data-feather="arrow-right-circle"></span>
                          <?php echo $subValue['titulo']; ?>
                        </div>
                      </a>
                    </li> -->
                    <li>
                      <a class="dropdown-item" href="<?php echo $subValue["enlace"] ?>/<?php echo $subValue["metodo"] ?>?idmenu=<?php echo $tmpIdmenu ?>&submenu=<?php echo $subValue['submenu_id'] ?>"
                        data-id="<?php echo $subValue['submenu_id'] ?>">
                        <div class="dropdown-item-wrapper">
                          <span class="me-2 uil" data-feather="arrow-right-circle"></span>
                          <?php echo $subValue['titulo']; ?>
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
    <ul class="navbar-nav navbar-nav-icons flex-row">
      <li class="nav-item">
        <div class="theme-control-toggle fa-ion-wait pe-2 theme-control-toggle-slim">
          <input class="form-check-input ms-0 theme-control-toggle-input" id="themeControlToggle" type="checkbox" data-theme-control="phoenixTheme" value="dark" />
          <label class="mb-0 theme-control-toggle-label theme-control-toggle-light" for="themeControlToggle" data-bs-toggle="tooltip" data-bs-placement="left" title="Switch theme"><span class="icon me-1 d-none d-sm-block" data-feather="moon"></span><span class="fs-9 fw-bold">Dark</span></label>
          <label class="mb-0 theme-control-toggle-label theme-control-toggle-dark" for="themeControlToggle" data-bs-toggle="tooltip" data-bs-placement="left" title="Switch theme"><span class="icon me-1 d-none d-sm-block" data-feather="sun"></span><span class="fs-9 fw-bold">Light</span></label>
        </div>
      </li>
      <!-- <li class="nav-item"> <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#searchBoxModal"><span data-feather="search" style="height:12px;width:12px;"></span></a></li>
      <li class="nav-item dropdown">
        <a class="nav-link" id="navbarDropdownNotification" href="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false"><span data-feather="bell" style="height:12px;width:12px;"></span></a>

        <div class="dropdown-menu dropdown-menu-end notification-dropdown-menu py-0 shadow border navbar-dropdown-caret" id="navbarDropdownNotfication" aria-labelledby="navbarDropdownNotfication">
          <div class="card position-relative border-0">
            <div class="card-header p-2">
              <div class="d-flex justify-content-between">
                <h5 class="text-body-emphasis mb-0">Notificatons</h5>
                <button class="btn btn-link p-0 fs-9 fw-normal" type="button">Mark all as read</button>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="scrollbar-overlay" style="height: 27rem;">
                <div class="px-2 px-sm-3 py-3 notification-card position-relative read border-bottom">
                  <div class="d-flex align-items-center justify-content-between position-relative">
                    <div class="d-flex">
                      <div class="avatar avatar-m status-online me-3"><img class="rounded-circle" src="../assets/img/team/40x40/30.webp" alt="" />
                      </div>
                      <div class="flex-1 me-sm-3">
                        <h4 class="fs-9 text-body-emphasis">Jessie Samson</h4>
                        <p class="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal"><span class='me-1 fs-10'>💬</span>Mentioned you in a comment.<span class="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">10m</span></p>
                        <p class="text-body-secondary fs-9 mb-0"><span class="me-1 fas fa-clock"></span><span class="fw-bold">10:41 AM </span>August 7,2021</p>
                      </div>
                    </div>
                    <div class="d-none d-sm-block">
                      <button class="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none notification-dropdown-toggle" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-ellipsis-h fs-10 text-body"></span></button>
                      <div class="dropdown-menu dropdown-menu-end py-2"><a class="dropdown-item" href="#!">Mark as unread</a></div>
                    </div>
                  </div>
                </div>
                <div class="px-2 px-sm-3 py-3 notification-card position-relative unread border-bottom">
                  <div class="d-flex align-items-center justify-content-between position-relative">
                    <div class="d-flex">
                      <div class="avatar avatar-m status-online me-3">
                        <div class="avatar-name rounded-circle"><span>J</span></div>
                      </div>
                      <div class="flex-1 me-sm-3">
                        <h4 class="fs-9 text-body-emphasis">Jane Foster</h4>
                        <p class="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal"><span class='me-1 fs-10'>📅</span>Created an event.<span class="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">20m</span></p>
                        <p class="text-body-secondary fs-9 mb-0"><span class="me-1 fas fa-clock"></span><span class="fw-bold">10:20 AM </span>August 7,2021</p>
                      </div>
                    </div>
                    <div class="d-none d-sm-block">
                      <button class="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none notification-dropdown-toggle" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-ellipsis-h fs-10 text-body"></span></button>
                      <div class="dropdown-menu dropdown-menu-end py-2"><a class="dropdown-item" href="#!">Mark as unread</a></div>
                    </div>
                  </div>
                </div>
                <div class="px-2 px-sm-3 py-3 notification-card position-relative unread border-bottom">
                  <div class="d-flex align-items-center justify-content-between position-relative">
                    <div class="d-flex">
                      <div class="avatar avatar-m status-online me-3"><img class="rounded-circle avatar-placeholder" src="../assets/img/team/40x40/avatar.webp" alt="" />
                      </div>
                      <div class="flex-1 me-sm-3">
                        <h4 class="fs-9 text-body-emphasis">Jessie Samson</h4>
                        <p class="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal"><span class='me-1 fs-10'>👍</span>Liked your comment.<span class="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">1h</span></p>
                        <p class="text-body-secondary fs-9 mb-0"><span class="me-1 fas fa-clock"></span><span class="fw-bold">9:30 AM </span>August 7,2021</p>
                      </div>
                    </div>
                    <div class="d-none d-sm-block">
                      <button class="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none notification-dropdown-toggle" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-ellipsis-h fs-10 text-body"></span></button>
                      <div class="dropdown-menu dropdown-menu-end py-2"><a class="dropdown-item" href="#!">Mark as unread</a></div>
                    </div>
                  </div>
                </div>
                <div class="px-2 px-sm-3 py-3 notification-card position-relative unread border-bottom">
                  <div class="d-flex align-items-center justify-content-between position-relative">
                    <div class="d-flex">
                      <div class="avatar avatar-m status-online me-3"><img class="rounded-circle" src="../assets/img/team/40x40/57.webp" alt="" />
                      </div>
                      <div class="flex-1 me-sm-3">
                        <h4 class="fs-9 text-body-emphasis">Kiera Anderson</h4>
                        <p class="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal"><span class='me-1 fs-10'>💬</span>Mentioned you in a comment.<span class="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10"></span></p>
                        <p class="text-body-secondary fs-9 mb-0"><span class="me-1 fas fa-clock"></span><span class="fw-bold">9:11 AM </span>August 7,2021</p>
                      </div>
                    </div>
                    <div class="d-none d-sm-block">
                      <button class="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none notification-dropdown-toggle" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-ellipsis-h fs-10 text-body"></span></button>
                      <div class="dropdown-menu dropdown-menu-end py-2"><a class="dropdown-item" href="#!">Mark as unread</a></div>
                    </div>
                  </div>
                </div>
                <div class="px-2 px-sm-3 py-3 notification-card position-relative unread border-bottom">
                  <div class="d-flex align-items-center justify-content-between position-relative">
                    <div class="d-flex">
                      <div class="avatar avatar-m status-online me-3"><img class="rounded-circle" src="../assets/img/team/40x40/59.webp" alt="" />
                      </div>
                      <div class="flex-1 me-sm-3">
                        <h4 class="fs-9 text-body-emphasis">Herman Carter</h4>
                        <p class="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal"><span class='me-1 fs-10'>👤</span>Tagged you in a comment.<span class="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10"></span></p>
                        <p class="text-body-secondary fs-9 mb-0"><span class="me-1 fas fa-clock"></span><span class="fw-bold">10:58 PM </span>August 7,2021</p>
                      </div>
                    </div>
                    <div class="d-none d-sm-block">
                      <button class="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none notification-dropdown-toggle" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-ellipsis-h fs-10 text-body"></span></button>
                      <div class="dropdown-menu dropdown-menu-end py-2"><a class="dropdown-item" href="#!">Mark as unread</a></div>
                    </div>
                  </div>
                </div>
                <div class="px-2 px-sm-3 py-3 notification-card position-relative read ">
                  <div class="d-flex align-items-center justify-content-between position-relative">
                    <div class="d-flex">
                      <div class="avatar avatar-m status-online me-3"><img class="rounded-circle" src="../assets/img/team/40x40/58.webp" alt="" />
                      </div>
                      <div class="flex-1 me-sm-3">
                        <h4 class="fs-9 text-body-emphasis">Benjamin Button</h4>
                        <p class="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal"><span class='me-1 fs-10'>👍</span>Liked your comment.<span class="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10"></span></p>
                        <p class="text-body-secondary fs-9 mb-0"><span class="me-1 fas fa-clock"></span><span class="fw-bold">10:18 AM </span>August 7,2021</p>
                      </div>
                    </div>
                    <div class="d-none d-sm-block">
                      <button class="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none notification-dropdown-toggle" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-ellipsis-h fs-10 text-body"></span></button>
                      <div class="dropdown-menu dropdown-menu-end py-2"><a class="dropdown-item" href="#!">Mark as unread</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer p-0 border-top border-translucent border-0">
              <div class="my-2 text-center fw-bold fs-10 text-body-tertiary text-opactity-85"><a class="fw-bolder" href="../pages/notifications.html">Notification history</a></div>
            </div>
          </div>
        </div>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link" id="navbarDropdownNindeDots" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false">
          <svg width="10" height="10" viewbox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="2" cy="2" r="2" fill="currentColor"></circle>
            <circle cx="2" cy="8" r="2" fill="currentColor"></circle>
            <circle cx="2" cy="14" r="2" fill="currentColor"></circle>
            <circle cx="8" cy="8" r="2" fill="currentColor"></circle>
            <circle cx="8" cy="14" r="2" fill="currentColor"></circle>
            <circle cx="14" cy="8" r="2" fill="currentColor"></circle>
            <circle cx="14" cy="14" r="2" fill="currentColor"></circle>
            <circle cx="8" cy="2" r="2" fill="currentColor"></circle>
            <circle cx="14" cy="2" r="2" fill="currentColor"></circle>
          </svg></a>

        <div class="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-nine-dots shadow border" aria-labelledby="navbarDropdownNindeDots">
          <div class="card bg-body-emphasis position-relative border-0">
            <div class="card-body pt-3 px-3 pb-0 overflow-auto scrollbar" style="height: 20rem;">
              <div class="row text-center align-items-center gx-0 gy-0">
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/behance.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Behance</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/google-cloud.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Cloud</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/slack.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Slack</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/gitlab.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Gitlab</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/bitbucket.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">BitBucket</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/google-drive.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Drive</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/trello.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Trello</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/figma.webp" alt="" width="20" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Figma</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/twitter.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Twitter</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/pinterest.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Pinterest</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/ln.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Linkedin</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/google-maps.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Maps</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/google-photos.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Photos</p>
                  </a></div>
                <div class="col-4"><a class="d-block bg-body-secondary-hover p-2 rounded-3 text-center text-decoration-none mb-3" href="#!"><img src="../assets/img/nav-icons/spotify.webp" alt="" width="30" />
                    <p class="mb-0 text-body-emphasis text-truncate fs-10 mt-1 pt-1">Spotify</p>
                  </a></div>
              </div>
            </div>
          </div>
        </div>
      </li> -->
      <li class="nav-item dropdown"><a class="nav-link lh-1 pe-0 white-space-nowrap" id="navbarDropdownUser" href="#!" role="button" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><?= $_SESSION['usuario']['nom_usuario']; ?> <span class="fa-solid fa-chevron-down fs-10"></span></a>
        <div class="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border" aria-labelledby="navbarDropdownUser">
          <div class="card position-relative border-0">
            <div class="card-body p-0">
              <div class="text-center pt-4 pb-3">
                <div class="avatar avatar-xl ">
                  <img class="rounded-circle " src="../assets/img/team/72x72/57.webp" alt="" />

                </div>
                <h6 class="mt-2 text-body-emphasis">Jerry Seinfield</h6>
              </div>
              <div class="mb-3 mx-3">
                <input class="form-control form-control-sm" id="statusUpdateInput" type="text" placeholder="Update your status" />
              </div>
            </div>
            <div class="overflow-auto scrollbar" style="height: 10rem;">
              <ul class="nav d-flex flex-column mb-2 pb-1">
                <li class="nav-item"><a class="nav-link px-3" href="#!"> <span class="me-2 text-body" data-feather="user"></span><span>Profile</span></a></li>
                <li class="nav-item"><a class="nav-link px-3" href="#!"><span class="me-2 text-body" data-feather="pie-chart"></span>Dashboard</a></li>
                <li class="nav-item"><a class="nav-link px-3" href="#!"> <span class="me-2 text-body" data-feather="lock"></span>Posts &amp; Activity</a></li>
                <li class="nav-item"><a class="nav-link px-3" href="#!"> <span class="me-2 text-body" data-feather="settings"></span>Settings &amp; Privacy </a></li>
                <li class="nav-item"><a class="nav-link px-3" href="#!"> <span class="me-2 text-body" data-feather="help-circle"></span>Help Center</a></li>
                <li class="nav-item"><a class="nav-link px-3" href="#!"> <span class="me-2 text-body" data-feather="globe"></span>Language</a></li>
              </ul>
            </div>
            <div class="card-footer p-0 border-top border-translucent">
              <ul class="nav d-flex flex-column my-3">
                <li class="nav-item"><a class="nav-link px-3" href="#!"> <span class="me-2 text-body" data-feather="user-plus"></span>Add another account</a></li>
              </ul>
              <hr />
              <div class="px-3"> <a class="btn btn-phoenix-secondary d-flex flex-center w-100" href="#!"> <span class="me-2" data-feather="log-out"> </span>Sign out</a></div>
              <div class="my-2 text-center fw-bold fs-10 text-body-quaternary"><a class="text-body-quaternary me-1" href="#!">Privacy policy</a>&bull;<a class="text-body-quaternary mx-1" href="#!">Terms</a>&bull;<a class="text-body-quaternary ms-1" href="#!">Cookies</a></div>
            </div>
          </div>
        </div>
      </li>
    </ul>
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