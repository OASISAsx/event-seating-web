type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function ActionButtons({ onEdit, onDelete }: Props) {
  return (
    <div className="flex gap-2">
      <button className="btn btn-square btn-sm btn-warning" onClick={onEdit}>
        ✏️
      </button>

      <button className="btn btn-square btn-sm btn-error" onClick={onDelete}>
        🗑
      </button>
    </div>
  );
}
