using System;
using System.Collections.Generic;

namespace PruebaTec.Models;

public partial class Sexo
{
    public int Id { get; set; }

    public string Descripcion { get; set; } = null!;

    public string Abrev { get; set; } = null!;

    public virtual ICollection<Trabajador> Trabajadors { get; set; } = new List<Trabajador>();
}
