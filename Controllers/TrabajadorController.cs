using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PruebaTec.Models;

namespace PruebaTec.Controllers
{
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

        [HttpGet]
        public IActionResult listarTrabajador()
        {
            var trabajadores = _DBContext.Trabajadors
            .Include(c => c.oTipoDocumento)
            .Include(c => c.oSexo)
            .ToList();
            return Ok(trabajadores);
        }
    }
}
