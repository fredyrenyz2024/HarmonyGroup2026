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
</head>

<body class="nav-slim">
  <!-- ===============================================-->
  <!--    Main Content-->
  <!-- ===============================================-->
  <main class="main" id="top">
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
        <nav class="navbar navbar-vertical navbar-expand-lg">
          <script>
            var navbarStyle = window.config.config.phoenixNavbarStyle;
            if (navbarStyle && navbarStyle !== 'transparent') {
              document.querySelector('body').classList.add(`navbar-${navbarStyle}`);
            }
          </script>
          <div class="collapse navbar-collapse" id="navbarVerticalCollapse">
            <!-- scrollbar removed-->
            <div class="navbar-vertical-content">
              <ul class="navbar-nav flex-column" id="navbarVerticalNav">
                <li class="nav-item">
                  <!-- parent pages-->
                  <div class="nav-item-wrapper">
                    <a class="nav-link label-1" href="<?php echo BASE_URL; ?>" role="button" data-bs-toggle=""
                      aria-expanded="false">
                      <div class="d-flex align-items-center">
                        <span class="nav-link-icon">
                          <span data-feather="home"></span>
                        </span>
                        <span class="nav-link-text-wrapper">
                          <span class="nav-link-text">Dashboard</span>
                        </span>
                      </div>
                    </a>
                  </div>
                  <?php foreach ($_layoutParams['menu'] as $key => $value): ?>
                    <?php $menuId = "nv-" . str_replace(' ', '-', strtolower($key)); ?>
                    <!-- parent pages-->
                    <div class="nav-item-wrapper">
                      <a class="nav-link dropdown-indicator label-1" href="#<?php echo $menuId; ?>" role="button"
                        data-bs-toggle="collapse" aria-expanded="true" aria-controls="<?php echo $menuId; ?>">
                        <div class="d-flex align-items-center">
                          <div class="dropdown-indicator-icon">
                            <span class="fas fa-caret-right"></span>
                          </div>
                          <span class="nav-link-icon">
                            <!-- <span data-feather="pie-chart"></span>  -->
                            <span data-feather="layers"></span>
                          </span>
                          <span class="nav-link-text"><?php echo $key; ?></span>
                        </div>
                      </a>

                      <!-- Recorrer para armar el menu -->
                      <div class="parent-wrapper label-1">
                        <ul class="nav collapse parent show" data-bs-parent="#navbarVerticalCollapse" id="<?php echo $menuId; ?>">
                          <?php foreach ($value as $subKey => $subValue):
                            $tmpIdmenu = $_GET['idmenu']; ?>
                            <!-- <li class="collapsed-nav-item-title d-none">Homes</li> -->
                            <li class="nav-item">
                              <a class="nav-link active"
                                href="<?php echo $subValue["enlace"] ?>/<?php echo $value1["metodo"] ?>/?idmenu= <?php echo $tmpIdmenu ?>"
                                data-bs-toggle="" aria-expanded="false">
                                <div class="d-flex align-items-center">
                                  <span class="nav-link-text"><span class="text-body uil uil-circle"></span>
                                    <?php echo $subValue['titulo']; ?></span>
                                </div>
                              </a>
                              <!-- more inner pages-->
                            </li>
                          <?php endforeach; ?>
                        </ul>
                      </div>
                    <?php endforeach; ?>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="navbar-vertical-footer">
            <button
              class="btn navbar-vertical-toggle border-0 fw-semibold w-100 white-space-nowrap d-flex align-items-center"><span
                class="uil uil-left-arrow-to-left fs-8"></span><span class="uil uil-arrow-from-right fs-8"></span><span
                class="navbar-vertical-footer-text ms-2">Collapsed View</span></button>
          </div>
        </nav>
        <!-- Header navbar -->
        <?php require_once 'nabvar.php'; ?>
      <?php else: ?>
        <!-- Hola desde de le if de menu -->
      <?php endif; ?>
    <?php else:
      $menu = "";
      if (BASE_URL != ("http://" . $host . $url)) {
        if (empty($_REQUEST['k'])) {
          header('location:' . BASE_URL);
        }
      }
    endif; ?>
    <div class="content">
      <div class="pb-1">
        <div class="row g-4">
          <div class="col-12 col-xxl-12">

            <!-- <div class="container mt-5">
              <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="form1-tab" data-bs-toggle="tab" data-bs-target="#form1"
                    type="button" role="tab" aria-controls="form1" aria-selected="true">Formulario 1</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="form2-tab" data-bs-toggle="tab" data-bs-target="#form2" type="button"
                    role="tab" aria-controls="form2" aria-selected="false">Formulario 2</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="form3-tab" data-bs-toggle="tab" data-bs-target="#form3" type="button"
                    role="tab" aria-controls="form3" aria-selected="false">Formulario 3</button>
                </li>
              </ul>
              <div class="tab-content" id="myTabContent">
                Formulario 1
                <div class="tab-pane fade show active" id="form1" role="tabpanel" aria-labelledby="form1-tab">
                  <h3 class="mt-3">Formulario 1</h3>
                  <form id="formulario1">
                    <div class="mb-3">
                      <label for="nombre1" class="form-label">Nombre</label>
                      <input type="text" class="form-control" id="nombre1" required>
                    </div>
                    <div class="mb-3">
                      <label for="email1" class="form-label">Email</label>
                      <input type="email" class="form-control" id="email1" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Enviar</button>
                  </form>
                </div>
                Formulario 2
                <div class="tab-pane fade" id="form2" role="tabpanel" aria-labelledby="form2-tab">
                  <h3 class="mt-3">Formulario 2</h3>
                  <form id="formulario2">
                    <div class="mb-3">
                      <label for="direccion" class="form-label">Dirección</label>
                      <input type="text" class="form-control" id="direccion" required>
                    </div>
                    <div class="mb-3">
                      <label for="telefono" class="form-label">Teléfono</label>
                      <input type="tel" class="form-control" id="telefono" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Enviar</button>
                  </form>
                </div>
                Formulario 3
                <div class="tab-pane fade" id="form3" role="tabpanel" aria-labelledby="form3-tab">
                  <h3 class="mt-3">Formulario 3</h3>
                  <form id="formulario3">
                    <div class="mb-3">
                      <label for="edad" class="form-label">Edad</label>
                      <input type="number" class="form-control" id="edad" required>
                    </div>
                    <div class="mb-3">
                      <label for="ciudad" class="form-label">Ciudad</label>
                      <input type="text" class="form-control" id="ciudad" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Enviar</button>
                  </form>
                </div>
              </div>
            </div> -->