/**
 * This is needed for multiplayer portals.
 * Instances can Sync actual react code which has to be parsed
 */
import { Controller } from '@/entities/controller'

import JsxParser from 'react-jsx-parser'

import { RigidBody } from '@react-three/rapier'

const _meshStandardMaterial = (props: any) => (
  <meshStandardMaterial {...props} />
)
const _Controller = (props: any) => <Controller {...props} />
const _mesh = (props: any) => <mesh {...props} />
const _boxGeometry = (props: any) => <boxGeometry {...props} />
const _RigidBody = (props: any) => <RigidBody {...props} />

export const Parse = ({ tsx }: { tsx: string }) => {
  return (
    <JsxParser
      allowUnknownElements={true}
      components={{
        Controller: _Controller,
        RigidBody: _RigidBody,
        boxGeometry: _boxGeometry,
        mesh: _mesh,
        meshStandardMaterial: _meshStandardMaterial,
      }}
      jsx={tsx}
      renderInWrapper={false}
    />
  )
}
