// A plane whose relief is derived from the live video itself — vertex
// displacement and fragment shading both sample the video's own luminance,
// so the "terrain" is genuinely built from the real aerial footage rather
// than a fabricated heightmap. Edges fade to transparent so the geometry
// blends into the section instead of reading as a bordered video box.
//
// The luma helper is named `luma01`, not `luminance` — Three.js injects a
// `luminance(const in vec3)` helper from its own shared shader chunks into
// every ShaderMaterial, and redeclaring that name fails to compile.
//
// Raw per-pixel video luminance is noisy frame to frame (compression noise,
// moving foliage/water, camera micro-shake) — displacing geometry straight
// off that raw signal reads as a shimmering "wave" crawling across the
// surface, not stable relief. `blurLuma` box-blurs five taps before either
// shader uses the value, so the shape it drives is the footage's broad
// contours, not its pixel-level noise.

export const VIDEO_TERRAIN_VERTEX = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uDisplacement;
  uniform float uBlurRadius;
  varying vec2 vUv;

  float luma01(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  float blurLuma(vec2 uv, float r) {
    float sum = luma01(texture2D(uMap, uv).rgb);
    sum += luma01(texture2D(uMap, uv + vec2(r, 0.0)).rgb);
    sum += luma01(texture2D(uMap, uv - vec2(r, 0.0)).rgb);
    sum += luma01(texture2D(uMap, uv + vec2(0.0, r)).rgb);
    sum += luma01(texture2D(uMap, uv - vec2(0.0, r)).rgb);
    return sum / 5.0;
  }

  void main() {
    vUv = uv;
    float elevation = blurLuma(uv, uBlurRadius);
    vec3 displaced = position + vec3(0.0, 0.0, elevation * uDisplacement);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`

export const VIDEO_TERRAIN_FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uEdgeSoftness;
  uniform float uShadeMin;
  uniform float uShadeMax;
  uniform float uBlurRadius;
  varying vec2 vUv;

  float luma01(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  float blurLuma(vec2 uv, float r) {
    float sum = luma01(texture2D(uMap, uv).rgb);
    sum += luma01(texture2D(uMap, uv + vec2(r, 0.0)).rgb);
    sum += luma01(texture2D(uMap, uv - vec2(r, 0.0)).rgb);
    sum += luma01(texture2D(uMap, uv + vec2(0.0, r)).rgb);
    sum += luma01(texture2D(uMap, uv - vec2(0.0, r)).rgb);
    return sum / 5.0;
  }

  void main() {
    vec4 texel = texture2D(uMap, vUv);

    // Relief-shade from the *blurred* luminance gradient of the footage — a
    // cheap, screen-space "normal" derived from its broad shape, not an
    // invented lighting rig and not raw per-pixel noise.
    float e = blurLuma(vUv, uBlurRadius);
    float dx = dFdx(e);
    float dy = dFdy(e);
    vec3 normal = normalize(vec3(-dx * 14.0, -dy * 14.0, 0.85));
    vec3 lightDir = normalize(vec3(0.4, 0.55, 0.7));
    float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);
    float shade = mix(uShadeMin, uShadeMax, diffuse);

    vec3 color = texel.rgb * shade;

    // Soft feather near each edge (rounded-rectangle falloff, not a circular
    // vignette) so the plane's bounds dissolve into the section's own
    // background instead of ending in a hard rectangular edge.
    vec2 edgeDist = abs(vUv - 0.5) * 2.0;
    float d = max(edgeDist.x, edgeDist.y);
    float alpha = 1.0 - smoothstep(1.0 - uEdgeSoftness, 1.0, d);

    gl_FragColor = vec4(color, alpha);
  }
`
