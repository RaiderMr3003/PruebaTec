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

    $('#add-foto').on('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#add-previewFoto').attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    $('#btnAddTrabajador').on('click', function () {
        agregarTrabajador();
    });

    $(document).on('click', '.btn-editar', function () {
        const id = $(this).data('id');
        cargarDatosTrabajador(id);
    });

    $('#edit-foto').on('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#edit-previewFoto').attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    $('#editTrabajadorModal').on('hidden.bs.modal', function () {
        $('#formEditTrabajador')[0].reset();
        $('#edit-previewFoto').attr('src', '/images/default-user.png');
    });

    $('#btnEditTrabajador').on('click', function () {
        editarTrabajador();
    });

    $(document).on('click', '.btn-eliminar', function () {
        const id = $(this).data('id');

        Swal.fire({
            position: 'top',
            title: 'Cuidado',
            text: "¿Está seguro de eliminar el registro?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTrabajador(id);
            }
        });
    });
}

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
            const $selectAdd = $('#add-tipoDocumento');
            $selectAdd.empty();
            $selectAdd.append('<option value="">Seleccione...</option>');

            const $selectEdit = $('#edit-tipoDocumento');
            $selectEdit.empty();
            $selectEdit.append('<option value="">Seleccione...</option>');

            data.forEach(function (item) {
                $selectAdd.append(`<option value="${item.id}">${item.descripcion}</option>`);
                $selectEdit.append(`<option value="${item.id}">${item.descripcion}</option>`);
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
            const $selectAdd = $('#add-sexo');
            $selectAdd.empty();
            $selectAdd.append('<option value="">Seleccione...</option>');

            const $selectEdit = $('#edit-sexo');
            $selectEdit.empty();
            $selectEdit.append('<option value="">Seleccione...</option>');

            data.forEach(function (item) {
                $selectAdd.append(`<option value="${item.id}">${item.descripcion}</option>`);
                $selectEdit.append(`<option value="${item.id}">${item.descripcion}</option>`);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener los sexos:", error);
            alert('Error al cargar los datos.');
        }
    });
}

function agregarTrabajador() {
    const nombres = $('#add-nombres').val();
    const apellidos = $('#add-apellidos').val();
    const tipoDocumento = $('#add-tipoDocumento').val();
    const sexo = $('#add-sexo').val();
    const numeroDocumento = $('#add-numeroDocumento').val();
    const fechaNacimiento = $('#add-fechaNacimiento').val();
    const direccion = $('#add-direccion').val();

    if (!nombres || !apellidos || !tipoDocumento || !sexo || !numeroDocumento || !fechaNacimiento || !direccion) {
        Swal.fire({
            position: 'top',
            icon: 'warning',
            title: 'Campos Incompletos',
            text: 'Por favor, complete todos los campos requeridos.'
        });
        return;
    }

    const formData = new FormData();
    formData.append('Nombres', nombres.toUpperCase());
    formData.append('Apellidos', apellidos.toUpperCase());
    formData.append('TipoDocumento', parseInt(tipoDocumento));
    formData.append('Sexo', parseInt(sexo));
    formData.append('NumeroDocumento', numeroDocumento.toUpperCase());
    formData.append('FechaNacimiento', fechaNacimiento);
    formData.append('Direccion', direccion.toUpperCase());

    const fotoInput = document.getElementById('add-foto');
    if (fotoInput.files.length > 0) {
        formData.append('foto', fotoInput.files[0]);
    }

    $.ajax({
        url: '/Trabajador/AgregarTrabajador',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                $('#addTrabajadorModal').modal('hide');
                $('#tablaTrabajadores').DataTable().ajax.reload();

                $('#formAddTrabajador')[0].reset();
                $('#add-previewFoto').attr('src', '/images/default-user.png');

                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    title: 'Error',
                    text: response.message
                });
            }
        },
        error: function (xhr, status, error) {
            let mensaje = 'Ocurrió un error al guardar el trabajador.';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                mensaje = xhr.responseJSON.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensaje
            });
        }
    });
}

function cargarDatosTrabajador(id) {
    $.ajax({
        url: '/Trabajador/ObtenerTrabajador/' + id,
        type: 'GET',
        success: function (trabajador) {
            $('#edit-id').val(trabajador.id);
            $('#edit-fotoActual').val(trabajador.foto || '');

            $('#edit-nombres').val(trabajador.nombres);
            $('#edit-apellidos').val(trabajador.apellidos);
            $('#edit-tipoDocumento').val(trabajador.tipoDocumento);
            $('#edit-numeroDocumento').val(trabajador.numeroDocumento);
            $('#edit-sexo').val(trabajador.sexo);
            $('#edit-fechaNacimiento').val(trabajador.fechaNacimiento.split('T')[0]);
            $('#edit-direccion').val(trabajador.direccion);

            if (trabajador.foto) {
                const timestamp = new Date().getTime();
                $('#edit-previewFoto').attr('src', trabajador.foto + '?t=' + timestamp);
            } else {
                $('#edit-previewFoto').attr('src', '/images/default-user.png');
            }

            $('#editTrabajadorModal').modal('show');
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la información del trabajador.'
            });
        }
    });
}

function editarTrabajador() {
    const id = $('#edit-id').val();
    const nombres = $('#edit-nombres').val();
    const apellidos = $('#edit-apellidos').val();
    const tipoDocumento = $('#edit-tipoDocumento').val();
    const sexo = $('#edit-sexo').val();
    const numeroDocumento = $('#edit-numeroDocumento').val();
    const fechaNacimiento = $('#edit-fechaNacimiento').val();
    const direccion = $('#edit-direccion').val();

    if (!nombres || !apellidos || !tipoDocumento || !sexo || !numeroDocumento || !fechaNacimiento) {
        Swal.fire({
            position: 'top',
            icon: 'warning',
            title: 'Campos Incompletos',
            text: 'Por favor, complete todos los campos requeridos.'
        });
        return;
    }

    const formData = new FormData();
    formData.append('Id', id);
    formData.append('Nombres', nombres.toUpperCase());
    formData.append('Apellidos', apellidos.toUpperCase());
    formData.append('TipoDocumento', parseInt(tipoDocumento));
    formData.append('Sexo', parseInt(sexo));
    formData.append('NumeroDocumento', numeroDocumento.toUpperCase());
    formData.append('FechaNacimiento', fechaNacimiento);
    formData.append('Direccion', direccion.toUpperCase());
    formData.append('FotoActual', $('#edit-fotoActual').val());

    const fotoInput = document.getElementById('edit-foto');
    if (fotoInput.files.length > 0) {
        formData.append('foto', fotoInput.files[0]);
    }

    $.ajax({
        url: '/Trabajador/EditarTrabajador',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                $('#editTrabajadorModal').modal('hide');
                $('#tablaTrabajadores').DataTable().ajax.reload();
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    title: 'Error',
                    text: response.message
                });
            }
        },
        error: function (xhr, status, error) {
            let mensaje = 'Ocurrió un error al actualizar el trabajador.';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                mensaje = xhr.responseJSON.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensaje
            });
        }
    });
}

function eliminarTrabajador(id) {
    $.ajax({
        url: '/Trabajador/EliminarTrabajador/' + id,
        type: 'POST',
        success: function (response) {
            if (response.success) {
                $('#tablaTrabajadores').DataTable().ajax.reload();

                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message
                });
            }
        },
        error: function (xhr, status, error) {
            let mensaje = 'Ocurrió un error al eliminar el trabajador.';

            if (xhr.responseJSON && xhr.responseJSON.message) {
                mensaje = xhr.responseJSON.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensaje
            });
        }
    });
}