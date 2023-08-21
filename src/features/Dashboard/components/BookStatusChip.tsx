type Props = {
  isPublished: boolean;
};

export default function BookStatusChip({isPublished}: Props) {
  return (
    <span
      className="my-1 font-semibold text-[14px] px-3 rounded-full text-white"
      style={{backgroundColor: isPublished ? "#0D77E7" : "#716F71"}}>
      {isPublished ? "공개중" : "비공개"}
    </span>
  );
}
