import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

interface ProfessionData {
  standardized: string;
  tags: string[];
  category?: string;
}

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name);
  private openai: OpenAI;
  private readonly defaultCategories = [
    'Salud',
    'Educación',
    'Tecnología',
    'Construcción',
    'Arte',
    'Legal',
    'Finanzas'
  ];

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY no está configurada');
    }

    this.openai = new OpenAI({
      apiKey,
      timeout: 15000, // 15 segundos de timeout
    });
  }

  async standardizeProfession(profession: string): Promise<ProfessionData> {
    if (!profession || profession.trim().length === 0) {
      throw new Error('La profesión no puede estar vacía');
    }

    const requestId = uuidv4();
    this.logger.log(`[${requestId}] Procesando profesión: "${profession}"`);

    const prompt = `Como experto en clasificación de profesiones:
1. Estandariza este término al nombre formal en español
2. Genera 3-5 tags relevantes en minúsculas
3. Asigna una categoría principal

Reglas:
- Usa máximo 3 palabras para el nombre estandarizado
- Los tags deben ser sustantivos simples
- La categoría debe ser una de estas: ${this.defaultCategories.join(', ')}

Respuesta en JSON exactamente con este formato:
{
  "standardized": "string",
  "tags": ["string"],
  "category": "string"
}

Ejemplo completo para "arregla cañerías":
{
  "standardized": "Fontanero",
  "tags": ["fontanería", "plomería", "reparaciones"],
  "category": "Construcción"
}

Input a clasificar: "${profession}"`;

    try {
      const startTime = Date.now();
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5, // Más determinista
        max_tokens: 150,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Respuesta vacía de OpenAI');
      }

      const result: ProfessionData = JSON.parse(content);
      this.validateOutput(result);

      const duration = Date.now() - startTime;
      this.logger.log(`[${requestId}] Procesado en ${duration}ms: ${JSON.stringify(result)}`);

      return result;
    } catch (error) {
      this.logger.error(`[${requestId}] Error al procesar "${profession}": ${error.message}`);
      throw new Error(`No se pudo estandarizar la profesión: ${error.message}`);
    }
  }

  private validateOutput(data: ProfessionData): void {
    if (!data.standardized || typeof data.standardized !== 'string') {
      throw new Error('Formato inválido: standardized debe ser un string');
    }

    if (!Array.isArray(data.tags) || data.tags.some(t => typeof t !== 'string')) {
      throw new Error('Formato inválido: tags debe ser un array de strings');
    }

    if (data.category && !this.defaultCategories.includes(data.category)) {
      throw new Error(`Categoría inválida. Use una de: ${this.defaultCategories.join(', ')}`);
    }
  }
}