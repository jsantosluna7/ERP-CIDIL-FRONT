// floor-plan-3d.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ConstructorIconos3dService } from './constructor-iconos3d.service';
import {
  Sensor,
  Space,
  SpacesApiService,
} from '../../../../../../services/Dashboard/spaces-api.service';

interface RoomData {
  id?: string;
  name: string;
  type: string;
  position: { x: number; z: number };
  size: { width: number; depth: number };
  color: number;
  icon?: string;
  error?: boolean;
  showFloorOnly?: boolean;
  mqttTopic?: string;
  sensors: {
    temp?: number | null;
    humidity?: number | null;
    light?: number | null;
    noise?: number | null;
    [key: string]: number | null | undefined;
  };
}

@Component({
  selector: 'app-plano3d-pisos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plano3d-pisos.component.html',
  styleUrl: './plano3d-pisos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Plano3dPisosComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: false }) canvasContainer!: ElementRef;

  // Three.js variables
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private raycaster!: THREE.Raycaster;
  private mouse = new THREE.Vector2();
  private rooms: THREE.Group[] = [];
  private sensorSprites: THREE.Sprite[] = [];
  private animationFrameId: number = 0;

  // Estado de visualización
  showWalls = true;
  showSensors = true;
  showLabels = true;
  showHeatmap = false;

  // Panel de información
  showInfoPanel = false;
  selectedRoom: RoomData | null = null;

  // Instrucciones
  showInstructions = false;

  // Leyenda móvil
  showLegendMobile = false;

  // Modales de configuración
  showSpaceConfigModal = false;
  showSensorsModal = false;

  // Datos de edición
  editingSpace: RoomData | null = null;
  editingSensors: Sensor[] = [];

  // Datos de habitaciones
  roomsData: RoomData[] = [
    // LABORATORIOS
    {
      id: 'lab-1a',
      name: 'Laboratorio 1A',
      type: 'lab',
      position: { x: -20, z: 15 },
      size: { width: 14, depth: 12 },
      color: 0x3b82f6,
      mqttTopic: 'building/floor1/lab1a',
      sensors: { temp: 23, humidity: 55, light: 420, noise: 38 },
    },
    {
      id: 'lab-1b',
      name: 'Laboratorio 1B',
      type: 'lab',
      position: { x: 0, z: 15 },
      size: { width: 14, depth: 12 },
      color: 0xef4444,
      error: true,
      mqttTopic: 'building/floor1/lab1b',
      sensors: { temp: 29, humidity: 62, light: 390, noise: null },
    },
    {
      id: 'lab-1c',
      name: 'Laboratorio 1C',
      type: 'lab',
      position: { x: -20, z: -5 },
      size: { width: 14, depth: 12 },
      color: 0x3b82f6,
      mqttTopic: 'building/floor1/lab1c',
      sensors: { temp: 22, humidity: 48, light: 435, noise: 41 },
    },
    {
      id: 'lab-1d',
      name: 'Laboratorio 1D',
      type: 'lab',
      position: { x: 0, z: -5 },
      size: { width: 14, depth: 12 },
      color: 0x3b82f6,
      mqttTopic: 'building/floor1/lab1d',
      sensors: { temp: 21, humidity: 50, light: 410, noise: 36 },
    },

    // ÁREAS DE SERVICIO
    {
      id: 'stairs-1',
      name: 'Escalera',
      type: 'stairs',
      icon: 'stairs',
      position: { x: 22, z: 15 },
      size: { width: 7, depth: 9 },
      color: 0x8b5cf6,
      sensors: { temp: 20, light: 280 },
    },
    {
      id: 'elevator-1',
      name: 'Ascensor',
      type: 'elevator',
      icon: 'elevator',
      position: { x: 32, z: 15 },
      size: { width: 5, depth: 5 },
      color: 0x06b6d4,
      sensors: { temp: 21, light: 320 },
    },
    {
      id: 'bathroom-m',
      name: 'Baño Hombres',
      type: 'bathroom',
      icon: 'male',
      position: { x: 22, z: 0 },
      size: { width: 7, depth: 8 },
      color: 0x64748b,
      sensors: { temp: 19, humidity: 68 },
    },
    {
      id: 'bathroom-f',
      name: 'Baño Mujeres',
      type: 'bathroom',
      icon: 'female',
      position: { x: 32, z: 0 },
      size: { width: 7, depth: 8 },
      color: 0x64748b,
      sensors: { temp: 19, humidity: 65 },
    },
    {
      id: 'storage-1',
      name: 'Almacén',
      type: 'storage',
      icon: 'storage',
      position: { x: 27, z: -12 },
      size: { width: 12, depth: 10 },
      color: 0x78716c,
      sensors: { temp: 18, humidity: 45, light: 180, noise: 28 },
    },

    // ÁREAS COMUNES
    {
      id: 'cafeteria-1',
      name: 'Cafetería',
      type: 'cafeteria',
      icon: 'cafeteria',
      position: { x: -20, z: -22 },
      size: { width: 12, depth: 10 },
      color: 0xf59e0b,
      mqttTopic: 'building/floor1/cafeteria',
      sensors: { temp: 24, humidity: 55, light: 400, noise: 52 },
    },
    {
      id: 'office-1',
      name: 'Oficina Principal',
      type: 'office',
      icon: 'office',
      position: { x: 0, z: -22 },
      size: { width: 10, depth: 8 },
      color: 0x6366f1,
      mqttTopic: 'building/floor1/office',
      sensors: { temp: 22, humidity: 48, light: 380, noise: 35 },
    },
    {
      id: 'meeting-1',
      name: 'Sala de Reuniones',
      type: 'meeting',
      icon: 'meeting',
      position: { x: -35, z: 0 },
      size: { width: 14, depth: 12 },
      color: 0xec4899,
      mqttTopic: 'building/floor1/meeting',
      sensors: { temp: 21, humidity: 50, light: 420, noise: 40 },
    },

    // ESPACIOS EDUCATIVOS
    {
      id: 'teachers-1',
      name: 'Salón de Profesores',
      type: 'teachers',
      icon: 'teachers',
      position: { x: -35, z: -18 },
      size: { width: 14, depth: 10 },
      color: 0x84cc16,
      mqttTopic: 'building/floor1/teachers',
      sensors: { temp: 23, humidity: 52, light: 390, noise: 38 },
    },
    {
      id: 'monitors-1',
      name: 'Oficina de Monitores',
      type: 'monitors',
      icon: 'monitors',
      position: { x: 10, z: -35 },
      size: { width: 12, depth: 10 },
      color: 0x14b8a6,
      mqttTopic: 'building/floor1/monitors',
      sensors: { temp: 22, humidity: 48, light: 410, noise: 42 },
    },
    {
      id: 'altice-1',
      name: 'Salón Altice',
      type: 'altice',
      icon: 'altice',
      position: { x: -10, z: -35 },
      size: { width: 16, depth: 12 },
      color: 0x8b5cf6,
      mqttTopic: 'building/floor1/altice',
      sensors: { temp: 20, humidity: 45, light: 450, noise: 35 },
    },
  ];

  constructor(
    private iconBuilder: ConstructorIconos3dService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private spacesApi: SpacesApiService,
  ) {}

  ngOnInit(): void {
    // Cargar espacios desde la API (opcional)
    // this.loadSpacesFromAPI();
  }

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.createBuilding();
    this.setupEventListeners();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const canvas = this.renderer?.domElement;
    if (canvas) {
      canvas.removeEventListener('click', this.onMouseClick.bind(this));
      canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }

    window.removeEventListener('resize', this.onWindowResize.bind(this));

    this.controls?.dispose();
    this.renderer?.dispose();

    console.log('🧹 Componente destruido y limpiado');
  }

  // ============================================
  // MÉTODOS DE API
  // ============================================

  private loadSpacesFromAPI(): void {
    this.spacesApi.getAllSpaces().subscribe({
      next: (spaces) => {
        // Convertir datos de API a formato interno
        this.roomsData = spaces.map((space) =>
          this.convertSpaceToRoomData(space),
        );
        this.rebuildScene();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al cargar espacios:', err);
      },
    });
  }

  private convertSpaceToRoomData(space: Space): RoomData {
    const sensors: any = {};
    space.sensors.forEach((sensor) => {
      const key = sensor.type;
      sensors[key] = sensor.currentValue;
    });

    return {
      id: space.id,
      name: space.name,
      type: space.type,
      position: space.position,
      size: space.size,
      color: space.color,
      icon: space.icon,
      mqttTopic: space.mqttTopic,
      sensors,
    };
  }

  // ============================================
  // CONFIGURACIÓN DE ESPACIO
  // ============================================

  openSpaceConfig(): void {
    if (!this.selectedRoom) return;

    // Crear copia profunda para editar
    this.editingSpace = JSON.parse(JSON.stringify(this.selectedRoom));
    this.showSpaceConfigModal = true;
    this.cdr.detectChanges();
  }

  closeSpaceConfigModal(): void {
    this.showSpaceConfigModal = false;

    setTimeout(() => {
      this.editingSpace = null;
    }, 0);
  }

  onColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const hexColor = input.value;
    // Convertir #RRGGBB a número hexadecimal
    this.editingSpace!.color = parseInt(hexColor.substring(1), 16);
  }

  saveSpaceConfig(): void {
    if (!this.editingSpace || !this.editingSpace.id) return;

    // Enviar a la API
    const updateDto = {
      name: this.editingSpace.name,
      type: this.editingSpace.type,
      color: this.editingSpace.color,
      icon: this.editingSpace.icon,
      mqttTopic: this.editingSpace.mqttTopic,
    };

    this.spacesApi.updateSpace(this.editingSpace.id, updateDto).subscribe({
      next: (updatedSpace) => {
        console.log('✅ Espacio actualizado:', updatedSpace);

        // Actualizar en roomsData
        const index = this.roomsData.findIndex(
          (r) => r.id === this.editingSpace!.id,
        );
        if (index !== -1) {
          // Mantener posición y tamaño
          const { position, size, sensors } = this.roomsData[index];
          this.roomsData[index] = {
            ...this.editingSpace!,
            position,
            size,
            sensors,
          };

          // Actualizar selectedRoom si está seleccionada
          if (this.selectedRoom?.id === this.editingSpace!.id) {
            this.selectedRoom = this.roomsData[index];
          }
        }

        // Reconstruir la escena 3D
        this.rebuildScene();

        // Cerrar modal
        this.closeSpaceConfigModal();

        // Mostrar notificación de éxito
        alert('✅ Espacio guardado exitosamente');
      },
      error: (err) => {
        console.error('❌ Error al guardar espacio:', err);
        alert('❌ Error al guardar. Intenta de nuevo.');
      },
    });
  }

  // ============================================
  // GESTIÓN DE SENSORES
  // ============================================

  openSensorsConfig(): void {
    if (!this.selectedRoom) return;

    // Crear copia del espacio
    this.editingSpace = JSON.parse(JSON.stringify(this.selectedRoom));

    // Convertir sensores del formato actual a array de objetos Sensor
    this.editingSensors = this.convertSensorsToArray(this.selectedRoom.sensors);

    this.showSensorsModal = true;
    this.cdr.detectChanges();
  }

  closeSensorsModal() {
    this.showSensorsModal = false;

    setTimeout(() => {
      this.editingSensors = [];
    }, 0);
  }

  private convertSensorsToArray(sensorsObj: any): Sensor[] {
    const sensors: Sensor[] = [];
    const sensorTypes: { [key: string]: { name: string; unit: string } } = {
      temp: { name: 'Temperatura', unit: '°C' },
      humidity: { name: 'Humedad', unit: '%' },
      light: { name: 'Luminosidad', unit: 'lux' },
      noise: { name: 'Ruido', unit: 'dB' },
      co2: { name: 'CO2', unit: 'ppm' },
      pressure: { name: 'Presión', unit: 'hPa' },
    };

    Object.keys(sensorsObj).forEach((key) => {
      const typeInfo = sensorTypes[key] || { name: key, unit: '' };
      sensors.push({
        id: `sensor-${Date.now()}-${Math.random()}`,
        type: key as any,
        name: typeInfo.name,
        unit: typeInfo.unit,
        currentValue: sensorsObj[key],
        enabled: true,
        mqttTopic: `${this.editingSpace?.mqttTopic || 'sensors'}/${key}`,
      });
    });

    return sensors;
  }

  addNewSensor(): void {
    const newSensor: Sensor = {
      id: `sensor-${Date.now()}-${Math.random()}`,
      type: 'temp',
      name: 'Nuevo Sensor',
      unit: '°C',
      enabled: true,
      mqttTopic: `${this.editingSpace?.mqttTopic || 'sensors'}/temp`,
    };

    this.editingSensors.push(newSensor);
    this.cdr.detectChanges();
  }

  removeSensor(index: number): void {
    if (confirm('¿Estás seguro de eliminar este sensor?')) {
      this.editingSensors.splice(index, 1);
      this.cdr.detectChanges();
    }
  }

  saveSensorsConfig(): void {
    if (!this.editingSpace || !this.editingSpace.id) return;

    // Aquí deberías enviar cada sensor a la API
    // Por simplicidad, voy a mostrar el enfoque general

    console.log('💾 Guardando sensores:', this.editingSensors);

    // TODO: Implementar guardado en la API
    // Opción 1: Eliminar todos los sensores existentes y crear nuevos
    // Opción 2: Hacer PATCH de cada sensor modificado

    // Por ahora, actualizar localmente
    const sensorsObj: any = {};
    this.editingSensors.forEach((sensor) => {
      sensorsObj[sensor.type] = sensor.currentValue ?? null;
    });

    // Actualizar en roomsData
    const index = this.roomsData.findIndex(
      (r) => r.id === this.editingSpace!.id,
    );
    if (index !== -1) {
      this.roomsData[index].sensors = sensorsObj;

      if (this.selectedRoom?.id === this.editingSpace!.id) {
        this.selectedRoom.sensors = sensorsObj;
      }
    }

    // Cerrar modal
    this.closeSensorsModal();

    alert('✅ Sensores guardados exitosamente (local)');
    this.cdr.detectChanges();
  }

  // Helpers para sensores
  getSensorIcon(type: string): string {
    const icons: { [key: string]: string } = {
      temp: '🌡️',
      humidity: '💧',
      light: '💡',
      noise: '🔊',
      co2: '💨',
      pressure: '📊',
      custom: '⚙️',
    };
    return icons[type] || '📡';
  }

  getSensorColorByType(type: string): string {
    const colors: { [key: string]: string } = {
      temp: '#ef4444',
      humidity: '#3b82f6',
      light: '#fbbf24',
      noise: '#8b5cf6',
      co2: '#10b981',
      pressure: '#ec4899',
      custom: '#64748b',
    };
    return colors[type] || '#64748b';
  }

  // ============================================
  // THREE.JS SETUP
  // ============================================

  private initThreeJS(): void {
    const container = this.canvasContainer.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1e3c72);
    this.scene.fog = new THREE.Fog(0x1e3c72, 50, 200);

    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(40, 40, 40);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 20;
    this.controls.maxDistance = 100;
    this.controls.maxPolarAngle = Math.PI / 2;

    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Line = { threshold: 0.5 };
    this.raycaster.params.Points = { threshold: 0.5 };

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(30, 50, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0x7c3aed, 0.3);
    directionalLight2.position.set(-20, 30, -20);
    this.scene.add(directionalLight2);

    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const gridHelper = new THREE.GridHelper(100, 50, 0x475569, 0x334155);
    gridHelper.position.y = 0;
    this.scene.add(gridHelper);
  }

  private createBuilding(): void {
    this.roomsData.forEach((roomData, index) => {
      this.createRoom(roomData, index);
    });
  }

  private createRoom(data: RoomData, index: number): void {
    const group = new THREE.Group();
    const height = 6;
    const { width, depth } = data.size;
    const { x, z } = data.position;

    group.name = `room-${index}`;

    const floorGeometry = new THREE.BoxGeometry(width, 0.2, depth);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.7,
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    floorMesh.userData['isClickable'] = true;
    group.add(floorMesh);

    const walls: THREE.Mesh[] = [];

    if (!data.showFloorOnly) {
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.3,
        roughness: 0.5,
        metalness: 0.1,
      });

      const wallFront = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 0.3),
        wallMaterial,
      );
      wallFront.position.set(0, height / 2, depth / 2);
      wallFront.castShadow = true;
      wallFront.userData['isClickable'] = true;
      group.add(wallFront);
      walls.push(wallFront);

      const wallBack = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 0.3),
        wallMaterial,
      );
      wallBack.position.set(0, height / 2, -depth / 2);
      wallBack.castShadow = true;
      wallBack.userData['isClickable'] = true;
      group.add(wallBack);
      walls.push(wallBack);

      const wallLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, height, depth),
        wallMaterial,
      );
      wallLeft.position.set(-width / 2, height / 2, 0);
      wallLeft.castShadow = true;
      wallLeft.userData['isClickable'] = true;
      group.add(wallLeft);
      walls.push(wallLeft);

      const wallRight = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, height, depth),
        wallMaterial,
      );
      wallRight.position.set(width / 2, height / 2, 0);
      wallRight.castShadow = true;
      wallRight.userData['isClickable'] = true;
      group.add(wallRight);
      walls.push(wallRight);

      const edgesGeometry = new THREE.EdgesGeometry(
        new THREE.BoxGeometry(width, height, depth),
      );
      const edgesMaterial = new THREE.LineBasicMaterial({
        color: data.error ? 0xef4444 : 0x1e293b,
        linewidth: 2,
      });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      edges.position.y = height / 2;
      group.add(edges);
    }

    if (data.icon) {
      const iconGroup = this.iconBuilder.create3DIcon(data.icon, data.color);
      if (iconGroup) {
        iconGroup.position.y = 1;
        iconGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.userData['isClickable'] = true;
          }
        });
        group.add(iconGroup);
      }
    }

    if (data.error) {
      const sprite = this.createErrorSprite(height);
      group.add(sprite);
      this.sensorSprites.push(sprite);
    } else if (!data.showFloorOnly) {
      const sprite = this.createNormalSprite(height);
      group.add(sprite);
    }

    group.position.set(x, 0, z);

    (group as any).userData = {
      ...data,
      walls,
      isRoom: true,
    };

    this.scene.add(group);
    this.rooms.push(group);
  }

  private createErrorSprite(height: number): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 1)');
    gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.5)');
    gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(4, 4, 1);
    sprite.position.y = height + 2;

    (sprite as any).userData = {
      animate: (time: number) => {
        sprite.position.y = height + 2 + Math.sin(time * 2) * 0.5;
        spriteMaterial.opacity = 0.6 + Math.sin(time * 3) * 0.2;
      },
    };

    return sprite;
  }

  private createNormalSprite(height: number): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 1)');
    gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.5)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.6,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 2, 1);
    sprite.position.y = height + 1;

    return sprite;
  }

  private rebuildScene(): void {
    // Limpiar escena actual
    this.rooms.forEach((room) => {
      this.scene.remove(room);
    });
    this.rooms = [];
    this.sensorSprites = [];

    // Recrear edificio
    this.createBuilding();
    this.cdr.detectChanges();
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));

    const canvas = this.renderer.domElement;

    canvas.addEventListener(
      'click',
      (event) => {
        this.ngZone.run(() => {
          this.onMouseClick(event);
        });
      },
      false,
    );

    canvas.addEventListener(
      'mousemove',
      (event) => {
        this.ngZone.run(() => {
          this.onMouseMove(event);
        });
      },
      false,
    );
  }

  private onWindowResize(): void {
    const container = this.canvasContainer.nativeElement;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  private onMouseMove(event: MouseEvent): void {
    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true,
    );

    this.rooms.forEach((room) => {
      const walls = (room as any).userData.walls || [];
      walls.forEach((wall: THREE.Mesh) => {
        if (wall.material instanceof THREE.MeshStandardMaterial) {
          wall.material.opacity = 0.3;
        }
      });
    });

    if (intersects.length > 0) {
      for (const intersect of intersects) {
        let obj: any = intersect.object;

        while (obj) {
          if (obj.userData && obj.userData.isRoom) {
            const walls = obj.userData.walls || [];
            if (walls.length > 0) {
              walls.forEach((wall: THREE.Mesh) => {
                if (wall.material instanceof THREE.MeshStandardMaterial) {
                  wall.material.opacity = 0.6;
                }
              });
            }
            canvas.style.cursor = 'pointer';
            return;
          }
          obj = obj.parent;
        }
      }
    }

    canvas.style.cursor = 'default';
  }

  private onMouseClick(event: MouseEvent): void {
    const canvas = this.renderer.domElement;

    if (!canvas.contains(event.target as Node)) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true,
    );

    if (intersects.length > 0) {
      for (const intersect of intersects) {
        let obj: any = intersect.object;

        while (obj) {
          if (obj.userData && obj.userData.isRoom && obj.userData.name) {
            this.showRoomInfo(obj.userData);
            return;
          }
          obj = obj.parent;
        }
      }
    }
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.001;

    this.sensorSprites.forEach((sprite) => {
      if ((sprite as any).userData.animate) {
        (sprite as any).userData.animate(time);
      }
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  // ============================================
  // MÉTODOS PÚBLICOS PARA CONTROLES
  // ============================================

  setView(view: string): void {
    switch (view) {
      case 'iso':
        this.camera.position.set(40, 40, 40);
        break;
      case 'top':
        this.camera.position.set(0, 80, 0.1);
        break;
      case 'front':
        this.camera.position.set(0, 20, 60);
        break;
      case 'side':
        this.camera.position.set(60, 20, 0);
        break;
    }
    this.camera.lookAt(0, 0, 0);
    this.controls.update();
  }

  toggleWalls(): void {
    this.showWalls = !this.showWalls;
    this.rooms.forEach((room) => {
      const walls = (room as any).userData.walls || [];
      walls.forEach((wall: THREE.Mesh) => {
        wall.visible = this.showWalls;
      });
    });
    this.cdr.detectChanges();
  }

  toggleSensors(): void {
    this.showSensors = !this.showSensors;
    this.sensorSprites.forEach((sprite) => {
      sprite.visible = this.showSensors;
    });
    this.cdr.detectChanges();
  }

  toggleLabels(): void {
    this.showLabels = !this.showLabels;
    this.cdr.detectChanges();
  }

  toggleHeatmap(): void {
    this.showHeatmap = !this.showHeatmap;
    this.cdr.detectChanges();
  }

  resetCamera(): void {
    this.camera.position.set(40, 40, 40);
    this.camera.lookAt(0, 0, 0);
    this.controls.reset();
    this.cdr.detectChanges();
  }

  showRoomInfo(data: RoomData): void {
    this.selectedRoom = data;
    this.showInfoPanel = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  closeInfo(): void {
    this.showInfoPanel = false;

    setTimeout(() => {
      this.selectedRoom = null;
    }, 0);
  }

  toggleInstructions(): void {
    this.showInstructions = !this.showInstructions;
    this.cdr.detectChanges();
  }

  toggleLegendMobile(): void {
    this.showLegendMobile = !this.showLegendMobile;
    this.cdr.detectChanges();
  }

  getSensorKeys(): string[] {
    if (!this.selectedRoom) return [];
    return Object.keys(this.selectedRoom.sensors);
  }
}
