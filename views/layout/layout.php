<?php

$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

$parsedUrl = parse_url($url);

$path = explode('/', $parsedUrl['path']); // Esto devuelve: /mvcLuisMiguel/serviciocliente/cotizaciones_nuevo
// print_r($parsedUrl['path']);

$pathParts = explode('/', trim($parsedUrl['path'], '/'));

// Convertir todos los elementos del array a minúsculas
$pathParts = array_map('strtolower', $pathParts);

$desiredPart = $pathParts[1]; // Posición 1 corresponde a "torrecontrol"

// Extraer la parte de la consulta (query)
$query_string = parse_url($url, PHP_URL_QUERY);

// Reemplazar "/?" por "&" para corregir el formato
$query_string = str_replace('/?', '&', $query_string);

// Parsear los parámetros
parse_str($query_string, $query_params);

// Obtener los valores de idmenu y submenu
$idmenu_encrypted = $query_params['idmenu'] ?? null;
$submenu_encrypted = $query_params['submenu'] ?? null;

// Descifrar los valores
// $idmenu = decrypt($idmenu_encrypted);
// $submenu = decrypt($submenu_encrypted);
// Verificar si el submenu está definido y es válido
if (!empty($submenu_encrypted)) : ?>

  <?php
  // Obtener la cadena de menu_pantallas desde la sesión
  $menu_pantallas = $_SESSION['usuario']['menu_pantallas'];

  // Convertir la cadena en un array
  // $menu_pantallas_array = explode('|', $menu_pantallas);
  $menu_pantallas_array =  $menu_pantallas;

  // Recorrer el array para encontrar la pantalla correcta
  foreach ($menu_pantallas_array as $item) :
    // Verificar si $item tiene el formato esperado
    if (substr_count($item, ':') === 2) {
      list($pantalla_id, $menu_id, $pantalla) = explode(':', $item);
    } else {
      // Manejar el caso en que el formato no sea el esperado
      $menu_id = null;
      $pantalla = 'Pantalla desconocida';
      error_log("Formato incorrecto para el ítem del menú: " . $item);
      continue; // Saltar a la siguiente iteración
    }
  ?>

    <?php if ($menu_id == $submenu_encrypted) : ?>

      <?php
      // Verificar si $pantalla tiene el formato esperado
      // if (strpos($pantalla, ':') !== false) {
      //   list($pantalla_id, $nombre_pantalla) = explode(':', $pantalla);
      // } else {
      //   // Manejar el caso en que el formato no sea el esperado
      //   $pantalla_id = null;
      //   $nombre_pantalla = 'Pantalla desconocida';
      //   error_log("Formato incorrecto para la pantallas: " . $pantalla);
      // }

      // Obtener las ventanas asociadas a la pantalla actual
      $ventanas_array = $_SESSION['usuario']['ventanas']; // Formato: id_ventana:nombre_ventana:orden_ventana:pantalla_id
      $ventanas_filtradas = [];

      // Filtrar las ventanas por pantalla_id
      foreach ($ventanas_array as $ventana) {
        // Verificar si $ventana tiene el formato esperado
        if (substr_count($ventana, ':') === 3) {
          list($ventana_id, $nombre_ventana, $orden_ventana, $ventana_pantalla_id) = explode(':', $ventana);

          if ($ventana_pantalla_id == $pantalla_id) {
            $ventanas_filtradas[] = [
              'id' => $ventana_id,
              'nombre' => $nombre_ventana,
              'orden' => $orden_ventana
            ];
          }
        } else {
          // Manejar el caso en que el formato no sea el esperado
          error_log("Formato incorrecto para la ventana: " . $ventana);
        }
      }

      // Ordenar las ventanas por su orden
      usort($ventanas_filtradas, function ($a, $b) {
        return $a['orden'] <=> $b['orden'];
      });
      ?>
      <!-- <div class="overflow-x-hidden">...</div> -->
      <div class="content">
        <div class="widgets-scrollspy-nav mt-n5 bg-body-emphasis z-5 mx-n4 mx-lg-n6 border-bottom">
          <nav class="simplebar-scrollspy navbar py-0 scrollbar-overlay" id="widgets-scrollspy">
            <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
              <?php foreach ($ventanas_filtradas as $ventana) : ?>
                <li class="nav-item" role="presentation">
                  <a class="nav-link" data-controlador="<?= $path[2] ?>" data-metodo="<?= $ventana['nombre'] ?>" data-id="<?= $ventana['id'] ?>" id="ventana-<?= $ventana['id'] ?>-tab" data-bs-toggle="tab" href="#ventana-<?= $ventana['id'] ?>" role="tab" aria-controls="ventana-<?= $ventana['id'] ?>" aria-selected="false">
                    <?= $ventana['nombre'] ?>
                  </a>
                </li>
              <?php endforeach; ?>
            </ul>
          </nav>
        </div>

        <div class="mb-9" data-bs-target="#widgets-scrollspy">
          <div class="tab-content bg-success-white" id="myTabContent">
            <?php foreach ($ventanas_filtradas as $ventana) : ?>
              <div class="tab-pane fade mt-3" id="ventana-<?= $ventana['id'] ?>" role="tabpanel" aria-labelledby="ventana-<?= $ventana['id'] ?>-tab">
                <!-- Contenedor de campos específico para esta ventana -->
                <div class="card border border-body-secondary">
                  <div class="card-header p-1 bg-body-secondary d-flex justify-content-between align-items-center">
                    <!-- <h6 class="card-title m-0" style="padding-left: 10px;">Pantalla de trabajo <?= $desiredPart ?> <span style="color: #e5780b;"><?= $ventana['nombre'] ?> </span> <?= isset($_SESSION['usuario']['razon_social']) || $_SESSION['usuario']['razon_social'] !== ""  ? ' - Proveedor -   <span style="color: #e5780b;">' . $_SESSION['usuario']['razon_social'] . '</span>'  : "" ?></h6> -->
                    <h6 class="card-title m-0" style="padding-left: 10px;">Pantalla de trabajo <?= $desiredPart ?> <span style="color: #e5780b;"><?= $ventana['nombre'] ?> </span></h6>
                    <div id="contenedor-campo-<?= $ventana['id'] ?>" class="d-flex flex-nowrap gap-2">
                    </div>
                  </div>
                  <div class="card-body p-1">
                    <div id="contenido_ventana-<?= $ventana['id'] ?>"></div>
                  </div>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      </div>
    <?php endif; ?>
  <?php endforeach; ?>
<?php else :
// echo "No se ha seleccionado un menú.";
endif;
?>