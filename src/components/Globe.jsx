import { useEffect, useMemo } from 'react'
import { Viewer, Entity, PolygonGraphics, useCesium } from 'resium'
import {
  Cartesian3,
  Cartesian2,
  Color,
  UrlTemplateImageryProvider,
  PolygonHierarchy,
  HeightReference,
  VerticalOrigin,
  LabelStyle,
  PinBuilder,
  ScreenSpaceEventType,
} from 'cesium'
import { MAU_BLOCK_RING, RECOVERY_PATCHES, BATCH, ERAS, PROOF_FLIGHT } from '../lib/mock'
import { BELT_BLOCKS, BELT_FLIGHT } from '../lib/platformData'
import { createGlobeCamera } from '../lib/globeCamera'

const CLEARED = Color.fromCssColorString('#b5541f') // scorched earth (2015)
const CANOPY = Color.fromCssColorString('#37a04f') // regrown canopy (today)
const AMBER = Color.fromCssColorString('#e8a85c')
const BONE = Color.fromCssColorString('#f3eee3')

function ringToHierarchy(flat) {
  return new PolygonHierarchy(Cartesian3.fromDegreesArray(flat))
}

/**
 * Token-free satellite basemap (Esri World Imagery) and dark scene grading.
 * Also trims the default double-click behaviour. Camera motion is owned by
 * CameraBridge / the enclosing section, not here.
 */
function ViewerSetup({ macroMode, isInteractive }) {
  const { viewer } = useCesium()
  useEffect(() => {
    if (!viewer) return

    const layers = viewer.imageryLayers
    layers.removeAll()
    layers.addImageryProvider(
      new UrlTemplateImageryProvider({
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maximumLevel: macroMode ? 16 : 17,
        credit: 'Imagery © Esri, Maxar, Earthstar Geographics',
      }),
    )

    // Cesium's Viewer is configured imperatively — this is the intended API.
    /* eslint-disable react/immutability -- Cesium scene is an external mutable system */
    const { scene } = viewer
    scene.globe.baseColor = Color.fromCssColorString('#0c1f16')
    scene.backgroundColor = Color.fromCssColorString('#08140e')
    scene.skyAtmosphere.show = true
    scene.fog.enabled = true
    scene.globe.enableLighting = false
    scene.screenSpaceCameraController.minimumZoomDistance = macroMode ? 20000 : 4000
    // Off when embedded in a touch scroller, so a swipe over the map scrolls the page.
    scene.screenSpaceCameraController.enableInputs = isInteractive

    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    )
    /* eslint-enable react/immutability */
  }, [viewer, macroMode, isInteractive])
  return null
}

/**
 * Hands a camera controller up once the viewer exists and frames the resting
 * view. Cancels any pending flight on unmount so routes can swap without
 * overlapping timelines.
 */
function CameraBridge({ reducedMotion, flight, onReady }) {
  const { viewer } = useCesium()
  useEffect(() => {
    if (!viewer) return
    const camera = createGlobeCamera(viewer, { reducedMotion, flight })
    if (reducedMotion) camera.settleAtOverview()
    else camera.settleAtStart()
    onReady?.(camera)
    return () => camera.cancel()
  }, [viewer, reducedMotion, flight, onReady])
  return null
}

const collectionPin = new PinBuilder()
  .fromColor(Color.fromCssColorString('#e8a85c'), 46)
  .toDataURL()

function BatchLayer({ era }) {
  const isToday = era === ERAS.today.key
  const blockHierarchy = useMemo(() => ringToHierarchy(MAU_BLOCK_RING), [])
  const patchHierarchies = useMemo(
    () => RECOVERY_PATCHES.map((p) => ({ id: p.id, hierarchy: ringToHierarchy(p.ring) })),
    [],
  )

  return (
    <>
      <Entity name="South West Mau block">
        <PolygonGraphics
          hierarchy={blockHierarchy}
          material={(isToday ? CANOPY : CLEARED).withAlpha(0.16)}
          outline
          outlineColor={BONE.withAlpha(0.55)}
          height={0}
        />
      </Entity>

      {patchHierarchies.map(({ id, hierarchy }) => (
        <Entity key={id} name={`Retired plot ${id}`}>
          <PolygonGraphics
            hierarchy={hierarchy}
            material={(isToday ? CANOPY : CLEARED).withAlpha(isToday ? 0.5 : 0.68)}
            outline
            outlineColor={BONE.withAlpha(0.3)}
            height={0}
          />
        </Entity>
      ))}
    </>
  )
}

function BeltLayer({ activeId, onFeaturePick }) {
  const hierarchies = useMemo(
    () => BELT_BLOCKS.map((block) => ({ id: block.id, hierarchy: ringToHierarchy(block.ring) })),
    [],
  )
  return hierarchies.map(({ id, hierarchy }) => {
    const active = id === activeId
    return (
      <Entity key={id} id={`block:${id}`} name={id} onClick={() => onFeaturePick?.(id)}>
        <PolygonGraphics
          hierarchy={hierarchy}
          material={(active ? AMBER : CANOPY).withAlpha(active ? 0.28 : 0.16)}
          outline
          outlineColor={(active ? AMBER : BONE).withAlpha(active ? 0.9 : 0.45)}
          height={0}
        />
      </Entity>
    )
  })
}

/**
 * The shared Cesium viewer. `macroMode` swaps the batch recovery mosaic +
 * collection pin for the five belt-block polygons, and the Rift-Valley flight
 * for the belt-orbit flight. Everything else — imagery, grading, camera bridge —
 * is identical.
 */
export default function Globe({
  macroMode = false,
  era,
  activeId = null,
  reducedMotion = false,
  isInteractive = true,
  onCameraReady,
  onFeaturePick,
}) {
  return (
    <Viewer
      full={false}
      className="h-full w-full"
      // Render only when the scene actually changes (camera move, tile load,
      // entity update) instead of every frame — keeps the globe from starving
      // the hero's scroll animation while it sits idle below the fold.
      requestRenderMode
      maximumRenderTimeChange={Infinity}
      baseLayer={false}
      baseLayerPicker={false}
      geocoder={false}
      homeButton={false}
      sceneModePicker={false}
      navigationHelpButton={false}
      animation={false}
      timeline={false}
      fullscreenButton={false}
      infoBox={false}
      selectionIndicator={false}
    >
      <ViewerSetup macroMode={macroMode} isInteractive={isInteractive} />
      <CameraBridge
        reducedMotion={reducedMotion}
        flight={macroMode ? BELT_FLIGHT : PROOF_FLIGHT}
        onReady={onCameraReady}
      />

      {macroMode ? (
        <BeltLayer activeId={activeId} onFeaturePick={onFeaturePick} />
      ) : (
        <>
          <BatchLayer era={era} />
          <Entity
            id="focus:collection-centre"
            name={BATCH.collectionCentre.name}
            onClick={() => onFeaturePick?.('collection-centre')}
            position={Cartesian3.fromDegrees(
              BATCH.collectionCentre.lon,
              BATCH.collectionCentre.lat,
              0,
            )}
            billboard={{
              image: collectionPin,
              verticalOrigin: VerticalOrigin.BOTTOM,
              heightReference: HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }}
            label={{
              text: 'COLLECTION CENTRE',
              font: "600 12px 'Archivo', sans-serif",
              fillColor: BONE,
              style: LabelStyle.FILL,
              showBackground: true,
              backgroundColor: Color.fromCssColorString('#0c1f16').withAlpha(0.9),
              backgroundPadding: new Cartesian2(9, 6),
              pixelOffset: new Cartesian2(0, -54),
              verticalOrigin: VerticalOrigin.BOTTOM,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }}
          />
        </>
      )}
    </Viewer>
  )
}
