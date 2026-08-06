// spaces-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sensor {
  id: string;
  type: 'temp' | 'humidity' | 'light' | 'noise' | 'co2' | 'pressure' | 'custom';
  name: string;
  unit: string;
  mqttTopic?: string;
  currentValue?: number | null;
  minValue?: number;
  maxValue?: number;
  alertThreshold?: number;
  enabled: boolean;
  icon?: string;
}

export interface Space {
  id: string;
  name: string;
  type: string;
  position: { x: number; z: number };
  size: { width: number; depth: number };
  color: number;
  icon?: string;
  mqttTopic?: string;
  sensors: Sensor[];
  error?: boolean;
  showFloorOnly?: boolean;
}

export interface UpdateSpaceDto {
  name?: string;
  type?: string;
  color?: number;
  icon?: string;
  mqttTopic?: string;
}

export interface CreateSensorDto {
  type: string;
  name: string;
  unit: string;
  mqttTopic?: string;
  minValue?: number;
  maxValue?: number;
  alertThreshold?: number;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SpacesApiService {
  private apiUrl = '/api/spaces'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los espacios
   */
  getAllSpaces(): Observable<Space[]> {
    return this.http.get<Space[]>(this.apiUrl);
  }

  /**
   * Obtener un espacio específico por ID
   */
  getSpaceById(id: string): Observable<Space> {
    return this.http.get<Space>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualizar información de un espacio
   */
  updateSpace(id: string, data: UpdateSpaceDto): Observable<Space> {
    return this.http.put<Space>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Agregar un sensor a un espacio
   */
  addSensor(spaceId: string, sensor: CreateSensorDto): Observable<Sensor> {
    return this.http.post<Sensor>(`${this.apiUrl}/${spaceId}/sensors`, sensor);
  }

  /**
   * Actualizar un sensor
   */
  updateSensor(spaceId: string, sensorId: string, sensor: Partial<Sensor>): Observable<Sensor> {
    return this.http.put<Sensor>(
      `${this.apiUrl}/${spaceId}/sensors/${sensorId}`,
      sensor
    );
  }

  /**
   * Eliminar un sensor
   */
  deleteSensor(spaceId: string, sensorId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${spaceId}/sensors/${sensorId}`
    );
  }
}