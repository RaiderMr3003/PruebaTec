$(document).ready(function () {
    $('#tablaTrabajadores').DataTable({
        ajax: {
            url: '/Trabajador/ListarTrabajador',
            type: 'GET',
            dataSrc: ''
        },
        columns: [
            { data: 'nombres', width: '20%' },
            { data: 'apellidos', width: '20%' },
            { data: 'oTipoDocumento.descripcion', width: '10%' },
            { data: 'numeroDocumento', width: '10%' },
            { data: 'oSexo.abrev', width: '5%' },
            {
                data: 'fechaNacimiento',
                width: '10%'
            },
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
            },
        ]
    });

    $('#btnAddModalTrabajador').on('click', function () {
        $('#addTrabajadorModal').modal('show');
    });

    $('#addTrabajadorModal').on('hidden.bs.modal', function () {
        console.log('El modal se cerró');
    });
});