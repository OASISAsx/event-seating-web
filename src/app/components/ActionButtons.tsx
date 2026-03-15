type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function ActionButtons({ onEdit, onDelete }: Props) {
  return (
    <div className="flex gap-2">
      <button className="" onClick={onEdit}>
        ✏️
      </button>

      <button className="" onClick={onDelete}>
        🗑
      </button>
    </div>
  );
}
