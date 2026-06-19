import { useState } from "react";
import type { ProgressPhoto } from "../types";
import { todayIso } from "../utils/date";

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

type PhotoProgressProps = {
  photos: ProgressPhoto[];
  onAdd: (photo: Omit<ProgressPhoto, "id">) => void;
};

export const PhotoProgress = ({ photos, onAdd }: PhotoProgressProps) => {
  const [date, setDate] = useState(todayIso());
  const [front, setFront] = useState("");
  const [side, setSide] = useState("");
  const sorted = [...photos].sort((a, b) => a.date.localeCompare(b.date));
  const start = sorted[0];
  const current = sorted.at(-1);

  const handleFile = async (file: File | undefined, setter: (value: string) => void) => {
    if (!file) return;
    setter(await fileToDataUrl(file));
  };

  return (
    <section className="photo-progress">
      <div className="section-title">
        <h2>Фото-прогресс</h2>
        <p>Опционально. Приложение остается полезным и без фото.</p>
      </div>
      <div className="photo-progress__form">
        <label>
          Дата
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          Фото спереди
          <input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0], setFront)} />
        </label>
        <label>
          Фото сбоку
          <input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0], setSide)} />
        </label>
        <button
          className="button button--secondary"
          onClick={() => {
            if (front || side) {
              onAdd({ date, front, side });
              setFront("");
              setSide("");
            }
          }}
          type="button"
        >
          Сохранить фото
        </button>
      </div>
      <div className="photo-compare">
        {[start, current].map((photo, index) => (
          <article className="photo-tile" key={`${photo?.id ?? index}`}>
            <strong>{index === 0 ? "Старт" : "Сейчас"}</strong>
            {photo?.front || photo?.side ? (
              <div className="photo-tile__images">
                {photo.front && <img src={photo.front} alt="Фото прогресса спереди" />}
                {photo.side && <img src={photo.side} alt="Фото прогресса сбоку" />}
              </div>
            ) : (
              <p>Пока фото не добавлено.</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};
