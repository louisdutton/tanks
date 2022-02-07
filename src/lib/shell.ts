import * as THREE from "three";

const SHELL_OFFSET = new THREE.Vector3(0, 1.3, 1.6);
const SHELL_SPEED = 20;

export const spawn = (tank: THREE.Mesh) => {
  const shell = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.2, 0.2, 0.5),
    new THREE.MeshBasicMaterial({ color: 0xffd700 })
  );

  shell.position.copy(tank.position);
  shell.rotation.copy(tank.rotation);
  shell.translateZ(SHELL_OFFSET.z);
  shell.translateY(SHELL_OFFSET.y);

  return shell;
};

export const update = (shells: THREE.Mesh[], delta: number) => {
  shells.forEach((shell) => {
    shell.translateZ(SHELL_SPEED * delta);
  });
};
