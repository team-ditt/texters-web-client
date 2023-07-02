type Props = {
  width?: number;
  height?: number;
};

export default function SizedBox({ width = 0, height = 0 }: Props) {
  return <div style={{ width, height }} />;
}
