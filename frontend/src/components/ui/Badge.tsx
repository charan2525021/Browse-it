type Color = 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'purple' | 'cyan'
const map: Record<Color, string> = {
  green:  'tag-green',
  red:    'tag-red',
  yellow: 'tag-orange',
  blue:   'tag-indigo',
  gray:   'tag-gray',
  purple: 'tag-purple',
  cyan:   'tag-cyan',
}
export default function Badge({ label, color = 'gray' }: { label: string; color?: Color }) {
  return <span className={map[color]}>{label}</span>
}