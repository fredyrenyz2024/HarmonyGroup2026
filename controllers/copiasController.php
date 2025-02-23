<?php

class copiasController extends Controller
{
    private $_modelo;
    private $_copia;
    private $_listar;
    public function __construct()
    {
        parent::__construct();
        $this->_modelo = $this->loadModel('copias');
    }

    public function index()
    {
        $this->_view->titulo = 'Copias de Seguridad';
        $this->_view->renderizar('index', 'Copias');
    }

    public function Crear_copias_mysql()
    {
        $this->_copia = $this->_modelo->Crear_copia_mysql();
        echo json_encode($this->_copia);
    }

    public function Listar_copias_mysql()
    {
        // $this->_listar = $this->_modelo->Listar_Copias();
        // echo json_encode($this->_listar);

        $directorio = './backups/';
        $contenido = scandir($directorio);
        $elementos = array();

        foreach ($contenido as $elemento) {
            if ($elemento != '.' && $elemento != '..') {
                if (is_dir($directorio . '/' . $elemento)) {
                    $elementos[] = array(
                        'tipo' => 'carpeta',
                        'nombre' => $elemento,
                    );
                } else {
                    $elementos[] = array(
                        'tipo' => 'archivo',
                        'nombre' => $elemento,
                    );
                }
            }
        }
        echo json_encode($elementos);
    }

}
