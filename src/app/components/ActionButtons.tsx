type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function ActionButtons({ onEdit, onDelete }: Props) {
  return (
    <div className="flex gap-2">
      <button className="cursor-pointer" onClick={onEdit}>
        ✏️
      </button>

      <button className="cursor-pointer" onClick={onDelete}>
        🗑
      </button>
    </div>
  );
}
