using System;
using System.Collections.Generic;

namespace PruebaTec.Models;

public partial class TipoDocumento
{
    public int Id { get; set; }

    public string Descripcion { get; set; } = null!;

    public virtual ICollection<Trabajador> Trabajadors { get; set; } = new List<Trabajador>();
}
