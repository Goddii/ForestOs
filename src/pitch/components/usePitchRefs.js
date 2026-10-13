/**
 * Pitch character/jar ref helpers.
 *
 * Separated from the component files to satisfy the react(only-export-components)
 * fast-refresh rule. Each factory returns a plain object of `{ current: null }`
 * ref objects that React + GSAP can mutate.
 */

export function useCharacterRefs() {
  const make = () => ({ current: null })
  return {
    group: make(),
    head: make(),
    torso: make(),
    lArm: make(),
    rArm: make(),
    lLeg: make(),
    rLeg: make(),
  }
}

export function useJarRefs() {
  const make = () => ({ current: null })
  return {
    group: make(),
    body: make(),
    lid: make(),
    label: make(),
    qr: make(),
    glow: make(),
  }
}
