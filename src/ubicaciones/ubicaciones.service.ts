import { Injectable, NotFoundException } from "@nestjs/common";
import { EstadoConCiudadesDto, EstadoDto, CiudadDto } from "./ubicacion.dto";
import { ESTADOS_CIUDADES } from "./constants/estados-ciudades.constants";

@Injectable()
export class UbicacionesService {
  private readonly estados: EstadoConCiudadesDto[] = ESTADOS_CIUDADES;

  obtenerTodosLosEstados(): Promise<EstadoDto[]> {
    return Promise.resolve(
      this.estados.map((estado) => ({
        nombre: estado.nombre,
      }))
    );
  }

  obtenerCiudadesPorEstado(nombreEstado: string): Promise<CiudadDto[]> {
    const estado = this.estados.find((e) => e.nombre === nombreEstado);
    if (!estado) {
      throw new NotFoundException(`Estado ${nombreEstado} no encontrado`);
    }
    
    const ciudades = estado.ciudades.map(ciudad => ({
      nombre: ciudad.replace(' (capital)', ''),
    }));

    return Promise.resolve(ciudades);
  }
}