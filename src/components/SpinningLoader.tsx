type Props = {
  size?: number;
  color?: string;
};

export default function SpinningLoader({
  size = 32,
  color = '#ffffff',
}: Props) {
  return (
    <div
      className="spinning-loader inline-block relative"
      style={{
        width: size + 16,
        height: size + 16,
        color,
      }}
    >
      <div
        className="block absolute top-0 start-0 m-2 border-4 border-transparent border-t-current rounded-full"
        style={{ width: size, height: size }}
      />
      <div
        className="block absolute top-0 start-0 m-2 border-4 border-transparent border-t-current rounded-full"
        style={{ width: size, height: size }}
      />
      <div
        className="block absolute top-0 start-0 m-2 border-4 border-transparent border-t-current rounded-full"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
