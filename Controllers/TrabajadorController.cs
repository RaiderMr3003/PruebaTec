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

        [HttpPost("AgregarTrabajador")]
        public async Task<IActionResult> AgregarTrabajador([FromForm] Trabajador trabajador, IFormFile? foto)
        {
            var existe = _DBContext.Trabajadors
                .Any(t => t.NumeroDocumento == trabajador.NumeroDocumento
                && t.TipoDocumento == trabajador.TipoDocumento
                && t.Activo == true);

            if (existe)
            {
                return BadRequest(new { success = false, message = "Ya existe un trabajador con ese tipo y número de documento" });
            }

            try
            {
                trabajador.Activo = true;

                if (foto != null && foto.Length > 0)
                {
                    var extensionesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                    var extension = Path.GetExtension(foto.FileName).ToLowerInvariant();

                    if (!extensionesPermitidas.Contains(extension))
                    {
                        return BadRequest(new { success = false, message = "Solo se permiten imágenes (jpg, jpeg, png, gif)" });
                    }

                    if (foto.Length > 5 * 1024 * 1024)
                    {
                        return BadRequest(new { success = false, message = "La imagen no debe superar los 5MB" });
                    }

                    var nombreBase = trabajador.NumeroDocumento;
                    var nombreArchivo = $"{nombreBase}{extension}";

                    var carpetaFotos = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "fotos");

                    if (!Directory.Exists(carpetaFotos))
                    {
                        Directory.CreateDirectory(carpetaFotos);
                    }

                    var rutaCompleta = Path.Combine(carpetaFotos, nombreArchivo);

                    using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                    {
                        await foto.CopyToAsync(stream);
                    }

                    trabajador.Foto = $"/images/fotos/{nombreArchivo}";
                }
                else
                {
                    trabajador.Foto = null;
                }

                _DBContext.Trabajadors.Add(trabajador);
                await _DBContext.SaveChangesAsync();

                return Ok(new { success = true, message = "Trabajador agregado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "Error al guardar: " + ex.Message });
            }
        }

        [HttpGet("ObtenerTrabajador/{id}")]
        public async Task<IActionResult> ObtenerTrabajador(int id)
        {
            try
            {
                var trabajador = await _DBContext.Trabajadors
                    .Include(t => t.oTipoDocumento)
                    .Include(t => t.oSexo)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (trabajador == null)
                {
                    return NotFound(new { success = false, message = "Trabajador no encontrado" });
                }

                return Ok(trabajador);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "Error al obtener trabajador: " + ex.Message });
            }
        }

        [HttpPost("EditarTrabajador")]
        public async Task<IActionResult> EditarTrabajador([FromForm] Trabajador trabajador, IFormFile? foto, string? fotoActual)
        {
            try
            {
                var trabajadorExistente = await _DBContext.Trabajadors.FindAsync(trabajador.Id);

                if (trabajadorExistente == null)
                {
                    return NotFound(new { success = false, message = "Trabajador no encontrado" });
                }

                var existe = _DBContext.Trabajadors
                    .Any(t => t.NumeroDocumento == trabajador.NumeroDocumento
                           && t.TipoDocumento == trabajador.TipoDocumento
                           && t.Id != trabajador.Id
                           && t.Activo == true);

                if (existe)
                {
                    return BadRequest(new { success = false, message = "Ya existe otro trabajador con ese tipo y número de documento" });
                }

                trabajadorExistente.Nombres = trabajador.Nombres;
                trabajadorExistente.Apellidos = trabajador.Apellidos;
                trabajadorExistente.TipoDocumento = trabajador.TipoDocumento;
                trabajadorExistente.NumeroDocumento = trabajador.NumeroDocumento;
                trabajadorExistente.Sexo = trabajador.Sexo;
                trabajadorExistente.FechaNacimiento = trabajador.FechaNacimiento;
                trabajadorExistente.Direccion = trabajador.Direccion;

                if (foto != null && foto.Length > 0)
                {
                    var extensionesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                    var extension = Path.GetExtension(foto.FileName).ToLowerInvariant();

                    if (!extensionesPermitidas.Contains(extension))
                    {
                        return BadRequest(new { success = false, message = "Solo se permiten imágenes (jpg, jpeg, png, gif)" });
                    }

                    if (foto.Length > 5 * 1024 * 1024)
                    {
                        return BadRequest(new { success = false, message = "La imagen no debe superar los 5MB" });
                    }

                    if (!string.IsNullOrEmpty(fotoActual))
                    {
                        var rutaFotoAnterior = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", fotoActual.TrimStart('/'));
                        if (System.IO.File.Exists(rutaFotoAnterior))
                        {
                            System.IO.File.Delete(rutaFotoAnterior);
                        }
                    }

                    var nombreBase = trabajador.NumeroDocumento;
                    var nombreArchivo = $"{nombreBase}{extension}";
                    var carpetaFotos = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "fotos");

                    if (!Directory.Exists(carpetaFotos))
                    {
                        Directory.CreateDirectory(carpetaFotos);
                    }

                    var rutaCompleta = Path.Combine(carpetaFotos, nombreArchivo);

                    using (var stream = new FileStream(rutaCompleta, FileMode.Create))
                    {
                        await foto.CopyToAsync(stream);
                    }

                    trabajadorExistente.Foto = $"/images/fotos/{nombreArchivo}";
                }
                else
                {
                    trabajadorExistente.Foto = fotoActual;
                }

                _DBContext.Trabajadors.Update(trabajadorExistente);
                await _DBContext.SaveChangesAsync();

                return Ok(new { success = true, message = "Trabajador actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "Error al actualizar: " + ex.Message });
            }
        }
    }
}