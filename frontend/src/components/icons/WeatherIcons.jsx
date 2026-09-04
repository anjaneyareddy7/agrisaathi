/**
 * AgriSaathi weather icon set — hand-drawn SVG icons in one consistent
 * duotone style: rounded strokes (currentColor) with soft translucent
 * fills for depth. Designed to sit on gradient sky backgrounds.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 4.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};
const soft = {
  fill: 'currentColor',
  fillOpacity: 0.2,
  stroke: 'none',
};

const CLOUD_PATH = 'M17 45h27a10 10 0 0 0 1-19.9A15 15 0 0 0 16.2 21 10 10 0 0 0 17 45Z';

export function WSun({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="11" fill="currentColor" fillOpacity="0.25" />
      <circle cx="32" cy="32" r="11" {...stroke} />
      {[
        [32, 6, 32, 13], [32, 51, 32, 58], [6, 32, 13, 32], [51, 32, 58, 32],
        [13.6, 13.6, 18.6, 18.6], [45.4, 45.4, 50.4, 50.4],
        [50.4, 13.6, 45.4, 18.6], [18.6, 45.4, 13.6, 50.4],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...stroke} />
      ))}
    </svg>
  );
}

export function WMoon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M40 50A19 19 0 0 1 23 17.5 19 19 0 1 0 40 50Z" {...soft} />
      <path d="M40 50A19 19 0 0 1 23 17.5 19 19 0 1 0 40 50Z" {...stroke} />
      <circle cx="49" cy="15" r="2.5" fill="currentColor" />
      <circle cx="56" cy="24" r="1.8" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

export function WCloud({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d={CLOUD_PATH} {...soft} />
      <path d={CLOUD_PATH} {...stroke} />
    </svg>
  );
}

export function WCloudSun({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="45" cy="17" r="8" fill="currentColor" fillOpacity="0.25" />
      <circle cx="45" cy="17" r="8" {...stroke} strokeWidth={4} />
      <line x1="45" y1="2.5" x2="45" y2="6" {...stroke} strokeWidth={4} />
      <line x1="58" y1="17" x2="61.5" y2="17" {...stroke} strokeWidth={4} />
      <line x1="55.5" y1="6.5" x2="58" y2="4" {...stroke} strokeWidth={4} />
      <path d="M12 50h24a9 9 0 0 0 .8-17.9A13.5 13.5 0 0 0 11.4 30 9 9 0 0 0 12 50Z" {...soft} />
      <path d="M12 50h24a9 9 0 0 0 .8-17.9A13.5 13.5 0 0 0 11.4 30 9 9 0 0 0 12 50Z" {...stroke} />
    </svg>
  );
}

export function WCloudRain({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d={CLOUD_PATH} {...soft} />
      <path d={CLOUD_PATH} {...stroke} />
      <line x1="22" y1="51" x2="19" y2="59" {...stroke} />
      <line x1="32" y1="51" x2="29" y2="59" {...stroke} />
      <line x1="42" y1="51" x2="39" y2="59" {...stroke} />
    </svg>
  );
}

export function WCloudDrizzle({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d={CLOUD_PATH} {...soft} />
      <path d={CLOUD_PATH} {...stroke} />
      <line x1="23" y1="52" x2="21.5" y2="56" {...stroke} />
      <line x1="32" y1="52" x2="30.5" y2="56" {...stroke} />
      <line x1="41" y1="52" x2="39.5" y2="56" {...stroke} />
      <line x1="27.5" y1="59.5" x2="26.5" y2="62" {...stroke} strokeWidth={3.5} />
      <line x1="36.5" y1="59.5" x2="35.5" y2="62" {...stroke} strokeWidth={3.5} />
    </svg>
  );
}

export function WCloudThunder({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d={CLOUD_PATH} {...soft} />
      <path d={CLOUD_PATH} {...stroke} />
      <path d="M33 48h8l-6 7h7L28 64l3.5-9H25l8-7Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WCloudFog({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M17 42h27a10 10 0 0 0 1-19.9A15 15 0 0 0 16.2 18 10 10 0 0 0 17 42Z" {...soft} />
      <path d="M17 42h27a10 10 0 0 0 1-19.9A15 15 0 0 0 16.2 18 10 10 0 0 0 17 42Z" {...stroke} />
      <line x1="18" y1="51" x2="50" y2="51" {...stroke} />
      <line x1="24" y1="59" x2="44" y2="59" {...stroke} />
    </svg>
  );
}

/** Map an OpenWeather-style description to an icon component (internal). */
function weatherIconFor(description) {
  const d = (description || '').toLowerCase();
  if (d.includes('thunder')) return WCloudThunder;
  if (d.includes('heavy rain')) return WCloudRain;
  if (d.includes('moderate rain')) return WCloudRain;
  if (d.includes('light rain')) return WCloudDrizzle;
  if (d.includes('drizzle')) return WCloudDrizzle;
  if (d.includes('mist') || d.includes('haze') || d.includes('fog')) return WCloudFog;
  if (d.includes('overcast')) return WCloud;
  if (d.includes('cloud')) return WCloudSun;
  if (d.includes('clear')) return WSun;
  return WCloudSun;
}

/** Render the matching weather icon element for a description. */
export function weatherIconEl(description, className = 'h-8 w-8') {
  const Icon = weatherIconFor(description);
  return <Icon className={className} />;
}

/* ── Decorative graphics (background ambience) ─────────────── */

export function DecoCloud({ className = 'h-16 w-16', style }) {
  return (
    <svg viewBox="0 0 64 40" className={className} style={style} aria-hidden="true">
      <path
        d="M10 32h38a9 9 0 0 0 1-17.9A13 13 0 0 0 14.6 12 8.5 8.5 0 0 0 10 32Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DecoStar({ className = 'h-4 w-4', style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path
        d="M12 2l1.8 8.2L22 12l-8.2 1.8L12 22l-1.8-8.2L2 12l8.2-1.8L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}
