$(document).ready(function () {
    init();
    event();
});

function init() {
    listarTipoDocumento();
    listarSexo();
    initTable();
}

function event() {
    $('#btnAddModalTrabajador').on('click', function () {
        $('#formAddTrabajador')[0].reset()
        $('#addTrabajadorModal').modal('show');
    });

    $('#addTrabajadorModal').on('hidden.bs.modal', function () {
        console.log('El modal se cerró');
    });

function initTable() {
    $('#tablaTrabajadores').DataTable({
        ajax: {
            url: '/Trabajador/ListarTrabajador',
            type: 'GET',
            dataSrc: ''
        },
        order: [],
        columns: [
            { data: 'nombres', width: '20%' },
            { data: 'apellidos', width: '20%' },
            { data: 'oTipoDocumento.descripcion', width: '10%' },
            { data: 'numeroDocumento', width: '10%' },
            { data: 'oSexo.abrev', width: '5%' },
            { data: 'fechaNacimiento', width: '10%' },
            { data: 'direccion', width: '20%' },
            {
                data: 'id',
                render: function (id) {
                    return `
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-warning btn-editar" data-id="${id}">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                `;
                },
                orderable: false,
                searchable: false,
                width: '5%'
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',
            search: "",
            searchPlaceholder: "Buscar..."
        }
    });
}

function listarTipoDocumento() {
    $.ajax({
        url: '/Trabajador/ListarTipoDocumento',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const $select = $('#add-tipoDocumento');
            $select.empty(); 

            $select.append('<option value="">Seleccione...</option>');

            data.forEach(function (item) {
                $select.append(`<option value="${item.id}">${item.descripcion}</option>`);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener los tipos de documento:", error);
            alert('Error al cargar los datos.');
        }
    });
}

function listarSexo() {
    $.ajax({
        url: '/Trabajador/ListarSexo',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const $select = $('#add-sexo');
            $select.empty();

            $select.append('<option value="">Seleccione...</option>');

            data.forEach(function (item) {
                $select.append(`<option value="${item.id}">${item.descripcion}</option>`);
            });
            },
        error: function (xhr, status, error) {
            console.error("Error al obtener los tipos de documento:", error);
            alert('Error al cargar los datos.');
        }
    });
}

    $('#btnAddModalTrabajador').on('click', function () {
        $('#addTrabajadorModal').modal('show');
    });

    $('#addTrabajadorModal').on('hidden.bs.modal', function () {
        console.log('El modal se cerró');
    });
});