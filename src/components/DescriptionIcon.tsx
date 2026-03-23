interface Props {
  borderColor: string;
}

export default function DescriptionIcon({ borderColor }: Props) {
  return (
    <svg
      viewBox="0 0 94 94"
      className="description-icon-svg"
      aria-label="Description available"
      style={{ color: borderColor }}
    >
      <path
        d="M 47,0 A 47,47 0 1 0 94,47 47,47 0 0 0 47,0 Z m -0.64,77.92 a 5.38,5.38 0 1 1 5.38,-5.38 5.39,5.39 0 0 1 -5.38,5.38 z M 52.24,51.8 c 0,0 -0.53,0.19 -0.53,0.5 v 4.27 A 5.355,5.355 0 1 1 41,56.57 V 52.3 A 11.32,11.32 0 0 1 48.81,41.65 7.6,7.6 0 0 0 54,34.19 7.81,7.81 0 0 0 46.31,26.79 7.58,7.58 0 0 0 39.5,31.11 5.3559546,5.3559546 0 0 1 29.85,26.46 18.23,18.23 0 0 1 46.22,16.08 h 0.11 A 18.48,18.48 0 0 1 64.69,33.87 18.25,18.25 0 0 1 52.25,51.79 Z"
        fill="currentColor"
      />
    </svg>
  );
}
