import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class ConstructorIconos3dService {
  constructor() {}

  /**
   * Crea un ícono 3D basado en el tipo especificado
   * @param iconType - Tipo de ícono a crear
   * @param color - Color del ícono en formato hexadecimal
   * @returns THREE.Group con el modelo 3D del ícono
   */
  create3DIcon(iconType: string, color: number): THREE.Group | null {
    const iconGroup = new THREE.Group();
    const iconMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.3,
      metalness: 0.7,
    });

    switch (iconType) {
      case 'stairs':
        return this.createStairs(iconGroup, iconMaterial);
      case 'elevator':
        return this.createElevator(iconGroup, color);
      case 'male':
        return this.createMaleBathroom(iconGroup, iconMaterial);
      case 'female':
        return this.createFemaleBathroom(iconGroup, iconMaterial);
      case 'storage':
        return this.createStorage(iconGroup, iconMaterial);
      case 'reception':
        return this.createReception(iconGroup, iconMaterial);
      case 'cafeteria':
        return this.createCafeteria(iconGroup, iconMaterial);
      case 'office':
        return this.createOffice(iconGroup, iconMaterial);
      case 'meeting':
        return this.createMeetingRoom(iconGroup, iconMaterial);
      case 'teachers':
        return this.createTeachersRoom(iconGroup, iconMaterial);
      case 'monitors':
        return this.createMonitorsOffice(iconGroup, iconMaterial);
      case 'altice':
        return this.createAlticeLab(iconGroup, iconMaterial);
      default:
        return null;
    }
  }

  private createStairs(
    group: THREE.Group,
    material: THREE.Material,
  ): THREE.Group {
    // Escaleras en 3D
    for (let i = 0; i < 5; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(4, 0.3, 1.2), material);
      step.position.set(0, i * 0.5, -i * 0.6);
      step.castShadow = true;
      group.add(step);
    }

    // Barandilla
    const railing = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3, 0.2),
      material,
    );
    railing.position.set(2, 1.5, -1.5);
    group.add(railing);

    return group;
  }

  private createElevator(group: THREE.Group, color: number): THREE.Group {
    // Caja del ascensor
    const elevatorBox = new THREE.Mesh(
      new THREE.BoxGeometry(3, 4, 3),
      new THREE.MeshStandardMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
        roughness: 0.1,
        metalness: 0.9,
      }),
    );
    elevatorBox.position.y = 2;
    group.add(elevatorBox);

    const iconMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.3,
      metalness: 0.7,
    });

    // Puertas
    const doorLeft = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 3.5, 0.1),
      iconMaterial,
    );
    doorLeft.position.set(-0.35, 1.75, 1.5);
    group.add(doorLeft);

    const doorRight = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 3.5, 0.1),
      iconMaterial,
    );
    doorRight.position.set(0.35, 1.75, 1.5);
    group.add(doorRight);

    // Indicador de piso
    const indicator = new THREE.Mesh(
      new THREE.CircleGeometry(0.3, 32),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24 }),
    );
    indicator.position.set(0, 4.2, 1.6);
    indicator.rotation.x = -Math.PI / 2;
    group.add(indicator);

    return group;
  }

  private createMaleBathroom(
    group: THREE.Group,
    material: THREE.Material,
  ): THREE.Group {
    const maleCircle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
      material,
    );
    maleCircle.position.y = 3;
    group.add(maleCircle);

    const maleBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 2, 0.2),
      material,
    );
    maleBody.position.y = 1.5;
    group.add(maleBody);

    return group;
  }

  private createFemaleBathroom(
    group: THREE.Group,
    material: THREE.Material,
  ): THREE.Group {
    const femaleCircle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
      material,
    );
    femaleCircle.position.y = 3;
    group.add(femaleCircle);

    const femaleSkirt = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 4),
      material,
    );
    femaleSkirt.position.y = 1.5;
    group.add(femaleSkirt);

    return group;
  }

  private createStorage(
    group: THREE.Group,
    material: THREE.Material,
  ): THREE.Group {
    // Cajas de almacén
    for (let i = 0; i < 3; i++) {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1.5, 1.5),
        material,
      );
      box.position.set((i - 1) * 1.8, 0.75, 0);
      box.castShadow = true;
      group.add(box);
    }

    return group;
  }

  private createReception(
    group: THREE.Group,
    material: THREE.Material,
  ): THREE.Group {
    // Mostrador
    const counter = new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 2), material);
    counter.position.y = 0.75;
    group.add(counter);

    // Pantalla
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x1e293b }),
    );
    screen.position.set(0, 1.8, 0);
    group.add(screen);

    return group;
  }

  private createCafeteria(
    group: THREE.Group,
    material: THREE.Material,
  ): THREE.Group {
    // Mesa redonda
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 0.2, 32),
      material,
    );
    table.position.y = 1.5;
    group.add(table);

    // Pata de mesa
    const tableLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16),
      material,
    );
    tableLeg.position.y = 0.75;
    group.add(tableLeg);

    // Sillas alrededor (4 sillas)
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const chairDistance = 2.8;

      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.15, 0.8),
        material,
      );
      seat.position.set(
        Math.cos(angle) * chairDistance,
        1.2,
        Math.sin(angle) * chairDistance,
      );
      group.add(seat);

      const backrest = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1, 0.1),
        material,
      );
      backrest.position.set(
        Math.cos(angle) * chairDistance,
        1.7,
        Math.sin(angle) * chairDistance - 0.35,
      );
      backrest.rotation.y = angle;
      group.add(backrest);
    }

    // Taza de café
    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.25, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24 }),
    );
    cup.position.set(0.5, 1.8, 0);
    group.add(cup);

    return group;
  }

  private createOffice(
    group: THREE.Group,
    material: THREE.Material,
  ): THREE.Group {
    // Escritorio
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 2), material);
    desk.position.y = 1.5;
    group.add(desk);

    // Patas del escritorio
    const deskLegPositions = [
      [-1.8, 0.75, -0.8],
      [1.8, 0.75, -0.8],
      [-1.8, 0.75, 0.8],
      [1.8, 0.75, 0.8],
    ];
    deskLegPositions.forEach((pos) => {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 1.5, 0.2),
        material,
      );
      leg.position.set(pos[0], pos[1], pos[2]);
      group.add(leg);
    });

    // Monitor
    const monitorScreen = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.2, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x1e293b }),
    );
    monitorScreen.position.set(0, 2.7, 0);
    group.add(monitorScreen);

    // Pantalla encendida
    const screenLight = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1, 0.05),
      new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        opacity: 0.3,
        transparent: true,
      }),
    );
    screenLight.position.set(0, 2.7, 0.06);
    group.add(screenLight);

    // Teclado
    const keyboard = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.1, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x334155 }),
    );
    keyboard.position.set(0, 1.65, 0.6);
    group.add(keyboard);

    return group;
  }

  private createMeetingRoom(
    group: THREE.Group,
    material: THREE.Material,
  ): THREE.Group {
    // Mesa de reuniones
    const meetingTable = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.2, 3),
      material,
    );
    meetingTable.position.y = 1.5;
    group.add(meetingTable);

    // Proyector
    const projector = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.4, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x334155 }),
    );
    projector.position.set(0, 4.5, 0);
    group.add(projector);

    return group;
  }

  private createTeachersRoom(
    group: THREE.Group,
    material: THREE.Material,
  ): THREE.Group {
    // Mesa central
    const teachersTable = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.2, 2.5),
      material,
    );
    teachersTable.position.y = 1.5;
    group.add(teachersTable);

    // Estantería con libros
    const bookshelf = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 0.8),
      material,
    );
    bookshelf.position.set(3.5, 1.5, 0);
    group.add(bookshelf);

    // Cafetera
    const coffeeMachine = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.8, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b }),
    );
    coffeeMachine.position.set(-3.5, 1.9, 0);
    group.add(coffeeMachine);

    return group;
  }

  private createMonitorsOffice(
    group: THREE.Group,
    material: THREE.Material,
  ): THREE.Group {
    // 3 estaciones de trabajo con doble monitor
    const monitorDesks = [
      { x: -2, z: 0 },
      { x: 0, z: 0 },
      { x: 2, z: 0 },
    ];

    monitorDesks.forEach((deskPos) => {
      // Escritorio
      const desk = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.15, 1.5),
        material,
      );
      desk.position.set(deskPos.x, 1.5, deskPos.z);
      group.add(desk);

      // Doble monitor
      for (let m = 0; m < 2; m++) {
        const monitorScreen = new THREE.Mesh(
          new THREE.BoxGeometry(1, 0.7, 0.08),
          new THREE.MeshStandardMaterial({ color: 0x1e293b }),
        );
        monitorScreen.position.set(deskPos.x + (m - 0.5) * 0.8, 2.4, deskPos.z);
        group.add(monitorScreen);
      }
    });

    return group;
  }

  private createAlticeLab(
    group: THREE.Group,
    material: THREE.Material,
  ): THREE.Group {
    // Pantalla grande principal
    const mainScreen = new THREE.Mesh(
      new THREE.BoxGeometry(6, 3.5, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b }),
    );
    mainScreen.position.set(0, 2.5, -2);
    group.add(mainScreen);

    // Pantalla encendida
    const screenDisplay = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, 3.3, 0.05),
      new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        opacity: 0.6,
        transparent: true,
      }),
    );
    screenDisplay.position.set(0, 2.5, -1.9);
    group.add(screenDisplay);

    // 12 computadoras
    const pcCount = 12;
    for (let i = 0; i < pcCount; i++) {
      const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.5, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x1e293b }),
      );
      const angle = (i / pcCount) * Math.PI * 1.5;
      const radius = 3;
      monitor.position.set(
        Math.cos(angle) * radius,
        2,
        Math.sin(angle) * radius,
      );
      group.add(monitor);
    }

    return group;
  }
}
