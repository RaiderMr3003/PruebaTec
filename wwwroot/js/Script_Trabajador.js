$(document).ready(function () {
    $('#tablaTrabajadores').DataTable({
        ajax: {
            url: '/Trabajador/ListarTrabajador',
            type: 'GET',
            dataSrc: ''
        },
        columns: [
            { data: 'nombres' },
            { data: 'apellidos' },
            { data: 'tipoDocumento' },
            { data: 'numeroDocumento' },
            { data: 'sexo' },
            { data: 'fechaNacimiento', render: d => new Date(d).toLocaleDateString() },
            { data: 'direccion' },
            {
                data: 'idTrabajador',
                render: function (id) {
                    return `
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-warning btn-editar" data-id="${id}">
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${id}">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                `;
                },
                orderable: false,
                searchable: false
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