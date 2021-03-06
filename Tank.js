/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: makcutka250 (https://sketchfab.com/makcutka250)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/models/bb4be3e59cf84ee4b842da57d97cf1ce
title: Stylized Tank
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/tank.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.mesh_0.geometry} material={materials.material_1} />
        <mesh geometry={nodes.mesh_1.geometry} material={materials.material_0} />
      </group>
    </group>
  )
}

useGLTF.preload('/tank.glb')
