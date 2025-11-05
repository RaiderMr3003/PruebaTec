using System;
using System.Collections.Generic;

namespace PruebaTec.Models;

public partial class Trabajador
{
    public int Id { get; set; }

    public string Nombres { get; set; } = null!;

    public string Apellidos { get; set; } = null!;

    public int TipoDocumento { get; set; }

    public string NumeroDocumento { get; set; } = null!;

    public int Sexo { get; set; }

    public DateOnly FechaNacimiento { get; set; }

    public string? Foto { get; set; }

    public string? Direccion { get; set; }

    public bool? Activo { get; set; }

    public virtual Sexo SexoNavigation { get; set; } = null!;

    public virtual TipoDocumento TipoDocumentoNavigation { get; set; } = null!;
}
