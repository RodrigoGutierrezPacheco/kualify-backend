import { Controller, Get, Param } from "@nestjs/common";
import { UbicacionesService } from "./ubicaciones.service";
import { EstadoDto, CiudadDto } from "./ubicacion.dto";
import { Public } from "src/auth/decorators/public.decorator";

@Controller("ubicaciones")
export class UbicacionesController {
  constructor(private readonly ubicacionesService: UbicacionesService) {}

  @Public()
  @Get("/estados")
  async obtenerEstados(): Promise<EstadoDto[]> {
    const estados = await this.ubicacionesService.obtenerTodosLosEstados();
    return estados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  @Public()
  @Get("/estados/:nombreEstado/ciudades")
  async obtenerCiudadesDeEstado(
    @Param("nombreEstado") nombreEstado: string
  ): Promise<CiudadDto[]> {
    const ciudades = await this.ubicacionesService.obtenerCiudadesPorEstado(nombreEstado);
    return ciudades.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
}