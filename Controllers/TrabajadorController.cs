using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PruebaTec.Models;

namespace PruebaTec.Controllers
{
    [Route("[controller]")]
    public class TrabajadorController : Controller
    {
        private readonly TrabajadoresPruebaContext _DBContext;

        public TrabajadorController(TrabajadoresPruebaContext context)
        {
            _DBContext = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("ListarTrabajador")]
        public IActionResult ListarTrabajador()
        {
            var trabajadores = _DBContext.Trabajadors
            .Include(t => t.oTipoDocumento)
            .Include(t => t.oSexo)
            .Where(t => t.Activo == true)
            .OrderBy(t => t.Id)
            .ToList();
            return Ok(trabajadores);
        }

        [HttpGet("ListarTipoDocumento")]
        public IActionResult ListarTipoDocumento()
        {
            var tiposDocumento = _DBContext.TipoDocumentos.ToList();
            return Ok(tiposDocumento);
        }

        [HttpGet("ListarSexo")]
        public IActionResult ListarSexo()
        {
            var sexo = _DBContext.Sexos.ToList();
            return Ok(sexo);
        }
    }
}
